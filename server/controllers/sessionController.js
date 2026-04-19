const { db } = require('../config/db');
const { sessions, exchanges, streaks, users } = require('../db/schema/index');
const { eq } = require('drizzle-orm');

const MIN_SESSION_SECONDS = 30 * 60; // 30 minutes = 1800 seconds

const startSession = async (req, res) => {
  try {
    const [session] = await db.update(sessions)
      .set({ 
        status: 'in_progress', 
        startedAt: new Date(), 
        updatedAt: new Date() 
      })
      .where(eq(sessions.id, req.params.id))
      .returning();

    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const endSession = async (req, res) => {
  try {
    // Connected duration comes from frontend (in seconds)
    const { connectedDuration } = req.body;

    const now = new Date();
    const isCompleted = connectedDuration >= MIN_SESSION_SECONDS;

    const [session] = await db.update(sessions)
      .set({
        status: isCompleted ? 'completed' : 'incomplete',
        endedAt: now,
        duration: connectedDuration || 0,
        updatedAt: now,
      })
      .where(eq(sessions.id, req.params.id))
      .returning();

    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Update streak only when 30 minutes are completed
    if (isCompleted) {
      const updateStreak = async (userId) => {
        const [streak] = await db.select().from(streaks).where(eq(streaks.userId, userId));
        if (!streak || streak.isFrozen) return;

        const today = new Date().toDateString();
        const lastDate = streak.lastSessionDate 
          ? new Date(streak.lastSessionDate).toDateString() 
          : null;

        if (lastDate !== today) {
          const newStreak = streak.currentStreak + 1;
          await db.update(streaks).set({
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, streak.longestStreak),
            lastSessionDate: new Date(),
            updatedAt: new Date(),
          }).where(eq(streaks.userId, userId));
        }
      };

      const [exchange] = await db.select().from(exchanges).where(eq(exchanges.id, session.exchangeId));
      if (exchange) {
        await updateStreak(exchange.userAId);
        await updateStreak(exchange.userBId);
      }

      return res.json({ 
        message: 'Session completed! Streak updated.', 
        session,
        streakUpdated: true,
      });
    }

    // Less than 30 minutes
    res.json({ 
      message: `Session incomplete. Connected only for ${Math.floor(connectedDuration / 60)} min ${connectedDuration % 60} sec. 30 min required for streak credit.`,
      session,
      streakUpdated: false,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSessionByRoom = async (req, res) => {
  try {
    const [session] = await db.select().from(sessions).where(eq(sessions.roomId, req.params.roomId));
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const [teacher] = await db.select({ id: users.id, name: users.name, avatar: users.avatar })
      .from(users).where(eq(users.id, session.teacherId));
    const [student] = await db.select({ id: users.id, name: users.name, avatar: users.avatar })
      .from(users).where(eq(users.id, session.studentId));

    res.json({ ...session, teacher, student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { startSession, endSession, getSessionByRoom };