const { db } = require('../config/db');
const { conversations, conversationParticipants, messages, users } = require('../db/schema/index');
const { eq, desc, and } = require('drizzle-orm');

// @route GET /api/chat/conversations
const getConversations = async (req, res) => {
  try {
    // Get all conversations this user is part of
    const myConvParticipants = await db
      .select({ conversationId: conversationParticipants.conversationId })
      .from(conversationParticipants)
      .where(eq(conversationParticipants.userId, req.user.id));

    const convIds = myConvParticipants.map((p) => p.conversationId);
    if (convIds.length === 0) return res.json([]);

    // For each conversation, get details
    const result = await Promise.all(
      convIds.map(async (convId) => {
        const [conv] = await db.select().from(conversations).where(eq(conversations.id, convId));

        // Get all participants
        const participants = await db
          .select({ userId: conversationParticipants.userId })
          .from(conversationParticipants)
          .where(eq(conversationParticipants.conversationId, convId));

        const participantDetails = await Promise.all(
          participants.map(async (p) => {
            const [user] = await db.select({ id: users.id, name: users.name, avatar: users.avatar }).from(users).where(eq(users.id, p.userId));
            return user;
          })
        );

        // Get last message
        const [lastMsg] = await db
          .select({ id: messages.id, content: messages.content, createdAt: messages.createdAt })
          .from(messages)
          .where(eq(messages.conversationId, convId))
          .orderBy(desc(messages.createdAt))
          .limit(1);

        return { ...conv, participants: participantDetails, lastMessage: lastMsg };
      })
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/chat/:conversationId/messages
const getMessages = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const msgs = await db
      .select({
        id: messages.id, content: messages.content, isRead: messages.isRead, createdAt: messages.createdAt,
        sender: { id: users.id, name: users.name, avatar: users.avatar },
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.conversationId, req.params.conversationId))
      .orderBy(messages.createdAt)
      .limit(parseInt(limit))
      .offset(offset);

    res.json(msgs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/chat/:conversationId/messages
const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const convId = req.params.conversationId;

    // Verify participant
    const [participant] = await db.select().from(conversationParticipants)
      .where(and(eq(conversationParticipants.conversationId, convId), eq(conversationParticipants.userId, req.user.id)));

    if (!participant) return res.status(403).json({ message: 'Not a participant in this conversation' });

    const [msg] = await db.insert(messages)
      .values({ conversationId: convId, senderId: req.user.id, content })
      .returning();

    // Update conversation updatedAt
    await db.update(conversations).set({ updatedAt: new Date(), lastMessageId: msg.id }).where(eq(conversations.id, convId));

    // Get full message with sender info
    const [fullMsg] = await db
      .select({
        id: messages.id, content: messages.content, isRead: messages.isRead, createdAt: messages.createdAt,
        sender: { id: users.id, name: users.name, avatar: users.avatar },
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.id, msg.id));

    // Emit to all other participants
    const allParticipants = await db.select().from(conversationParticipants).where(eq(conversationParticipants.conversationId, convId));
    allParticipants.forEach((p) => {
      if (p.userId !== req.user.id) {
        req.io.to(p.userId).emit('new_message', { conversationId: convId, message: fullMsg });
      }
    });

    res.status(201).json(fullMsg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/chat/:conversationId/read
const markAsRead = async (req, res) => {
  try {
    // Mark all messages from others as read
    await db.update(messages)
      .set({ isRead: true })
      .where(and(eq(messages.conversationId, req.params.conversationId)));
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getConversations, getMessages, sendMessage, markAsRead };