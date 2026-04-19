const { pgTable, uuid, timestamp } = require('drizzle-orm/pg-core');
const { users } = require('./users');
const { exchanges } = require('./exchanges');

const conversations = pgTable('conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  exchangeId: uuid('exchange_id').references(() => exchanges.id),
  lastMessageId: uuid('last_message_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Junction table for conversation participants
const conversationParticipants = pgTable('conversation_participants', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = { conversations, conversationParticipants };