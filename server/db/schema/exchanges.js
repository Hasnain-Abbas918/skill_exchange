
const { pgTable, uuid, text, timestamp, pgEnum } = require('drizzle-orm/pg-core');
const { users } = require('./users');
const { bids } = require('./bids');
const { requests } = require('./requests');

const exchangeStatusEnum = pgEnum('exchange_status', ['pending', 'active', 'paused', 'completed', 'cancelled']);

const exchanges = pgTable('exchanges', {
  id: uuid('id').defaultRandom().primaryKey(),
  userAId: uuid('user_a_id').notNull().references(() => users.id),
  userBId: uuid('user_b_id').notNull().references(() => users.id),
  bidId: uuid('bid_id').references(() => bids.id),
  requestId: uuid('request_id').references(() => requests.id),
  status: exchangeStatusEnum('status').default('pending'),

  // Pause fields
  pauseReason: text('pause_reason'),
  pauseRequestedById: uuid('pause_requested_by_id').references(() => users.id),
  pauseApprovedById: uuid('pause_approved_by_id').references(() => users.id),  // ✅ NEW
  pausedAt: timestamp('paused_at'),                                             // ✅ NEW
  resumedAt: timestamp('resumed_at'),                                           // ✅ NEW

  // Cancel fields (mutual agreement)
  cancelReason: text('cancel_reason'),
  cancelRequestedById: uuid('cancel_requested_by_id').references(() => users.id),   // ✅ NEW
  cancelApprovedById: uuid('cancel_approved_by_id').references(() => users.id),     // ✅ NEW
  cancelledAt: timestamp('cancelled_at'),                                            // ✅ NEW

  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

module.exports = { exchanges, exchangeStatusEnum };
