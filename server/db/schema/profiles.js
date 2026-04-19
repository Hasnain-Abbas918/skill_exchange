const { pgTable, uuid, text, varchar, integer, jsonb, timestamp } = require('drizzle-orm/pg-core');
const { users } = require('./users');

const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  bio: text('bio').default(''),
  skillsOffered: text('skills_offered').array().default([]),
  skillsWanted: text('skills_wanted').array().default([]),
  // availability stored as JSONB: [{day, startTime, endTime}]
  availability: jsonb('availability').default([]),
  location: varchar('location', { length: 255 }).default(''),
  rating: integer('rating').default(0),
  totalSessions: integer('total_sessions').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

module.exports = { profiles };