const { pgTable, uuid, text, boolean, timestamp, pgEnum } = require('drizzle-orm/pg-core');
const { users } = require('./users');
const { exchanges } = require('./exchanges');

const reportTypeEnum = pgEnum('report_type', ['no_show', 'misconduct', 'technical']);
const reportStatusEnum = pgEnum('report_status', ['pending', 'reviewed', 'resolved', 'dismissed']);

const reports = pgTable('reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  reporterId: uuid('reporter_id').notNull().references(() => users.id),
  reportedId: uuid('reported_id').notNull().references(() => users.id),
  exchangeId: uuid('exchange_id').references(() => exchanges.id),
  type: reportTypeEnum('type').notNull(),
  description: text('description').notNull(),
  status: reportStatusEnum('status').default('pending'),
  adminNote: text('admin_note'),
  penaltyApplied: boolean('penalty_applied').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = { reports, reportTypeEnum, reportStatusEnum };