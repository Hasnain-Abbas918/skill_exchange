const { pgTable, uuid, text, boolean, timestamp, pgEnum } = require('drizzle-orm/pg-core');
const { users } = require('./users');

const notificationTypeEnum = pgEnum('notification_type', ['request', 'exchange', 'session', 'message', 'report', 'system']);

const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: notificationTypeEnum('type'),
  message: text('message').notNull(),
  link: text('link'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = { notifications, notificationTypeEnum };