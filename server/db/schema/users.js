const { pgTable, uuid, varchar, boolean, timestamp, text, pgEnum } = require('drizzle-orm/pg-core');

const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: userRoleEnum('role').default('user'),
  isVerified: boolean('is_verified').default(false),
  isBanned: boolean('is_banned').default(false),
  otp: varchar('otp', { length: 6 }),
  otpExpire: timestamp('otp_expire'),
  resetPasswordToken: varchar('reset_password_token', { length: 6 }),
  resetPasswordExpire: timestamp('reset_password_expire'),
  googleId: varchar('google_id', { length: 255 }),
  avatar: text('avatar').default(''),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

module.exports = { users, userRoleEnum };