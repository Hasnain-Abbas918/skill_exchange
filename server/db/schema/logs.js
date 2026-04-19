const { pgTable, uuid, text, jsonb, timestamp } = require('drizzle-orm/pg-core');
const { users } = require('./users');

const logs = pgTable('logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  action: text('action').notNull(),
  details: jsonb('details'),
  ip: text('ip'),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = { logs };