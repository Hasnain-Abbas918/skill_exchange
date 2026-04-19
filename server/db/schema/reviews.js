const { pgTable, uuid, integer, text, timestamp, pgEnum } = require('drizzle-orm/pg-core');
const { users } = require('./users');
const { exchanges } = require('./exchanges');
const { sessions } = require('./sessions');

const reviewTypeEnum = pgEnum('review_type', ['session', 'exchange']);

const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  reviewerId: uuid('reviewer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  revieweeId: uuid('reviewee_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  exchangeId: uuid('exchange_id')
    .references(() => exchanges.id, { onDelete: 'set null' }),
  sessionId: uuid('session_id')
    .references(() => sessions.id, { onDelete: 'set null' }),
  type: reviewTypeEnum('type').default('session'),
  rating: integer('rating').notNull(),  // 1 to 5
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = { reviews, reviewTypeEnum };