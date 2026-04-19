

const { pgTable, uuid, integer, boolean, timestamp } = require('drizzle-orm/pg-core');
const { users } = require('./users');

const streaks = pgTable('streaks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  currentStreak: integer('current_streak').default(0),
  longestStreak: integer('longest_streak').default(0),
  lastSessionDate: timestamp('last_session_date'),
  isFrozen: boolean('is_frozen').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

module.exports = { streaks };