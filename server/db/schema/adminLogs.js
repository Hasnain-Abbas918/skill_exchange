const { pgTable, uuid, text, jsonb, timestamp } = require('drizzle-orm/pg-core');
const { users } = require('./users');

const adminLogs = pgTable('admin_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  adminId: uuid('admin_id').notNull().references(() => users.id),
  targetUserId: uuid('target_user_id').references(() => users.id),
  action: text('action').notNull(),   // 'ban_user', 'unban_user', 'resolve_report', etc.
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = { adminLogs };