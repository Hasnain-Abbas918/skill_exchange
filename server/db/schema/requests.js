const { pgTable, uuid, text, integer, timestamp, pgEnum } = require('drizzle-orm/pg-core');
const { users } = require('./users');
const { bids } = require('./bids');

const requestStatusEnum = pgEnum('request_status', ['pending', 'accepted', 'rejected', 'cancelled']);

const requests = pgTable('requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  senderId: uuid('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  receiverId: uuid('receiver_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  bidId: uuid('bid_id').notNull().references(() => bids.id, { onDelete: 'cascade' }),
  message: text('message'),
  status: requestStatusEnum('status').default('pending'),
  estimatedDays: integer('estimated_days'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

module.exports = { requests, requestStatusEnum };