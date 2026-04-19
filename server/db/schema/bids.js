const {
  pgTable, uuid, varchar, text, boolean, timestamp, pgEnum,
} = require('drizzle-orm/pg-core');
const { sql } = require('drizzle-orm');
const { users } = require('./users');

const skillLevelEnum = pgEnum('skill_level', ['Beginner', 'Intermediate', 'Advanced']);

const bids = pgTable('bids', {
  id: uuid('id').defaultRandom().primaryKey(),
  creatorId: uuid('creator_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  skillOffered: varchar('skill_offered', { length: 255 }).notNull(),
  skillWanted: varchar('skill_wanted', { length: 255 }).notNull(),
  description: text('description').notNull(),
  level: skillLevelEnum('level').default('Beginner'),
  isActive: boolean('is_active').default(true),
  // ✅ FIX: Array default SQL expression
  tags: text('tags').array().default(sql`'{}'::text[]`),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

module.exports = { bids, skillLevelEnum };