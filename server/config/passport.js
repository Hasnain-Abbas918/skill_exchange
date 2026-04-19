const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { db } = require('./db');
const { users, profiles, streaks } = require('../db/schema/index');
const { eq } = require('drizzle-orm');
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const avatar = profile.photos[0]?.value || '';

        // Check existing user
        let [user] = await db.select().from(users).where(eq(users.email, email));

        if (user) {
          // Update googleId if not set
          if (!user.googleId) {
            await db.update(users).set({ googleId: profile.id, avatar }).where(eq(users.id, user.id));
          }
          return done(null, user);
        }

        // Create new user
        const [newUser] = await db.insert(users).values({
          name: profile.displayName,
          email,
          password: 'GOOGLE_OAUTH_NO_PASSWORD',
          googleId: profile.id,
          avatar,
          isVerified: true,    // Google-auth users are already verified
        }).returning();

        // Create profile & streak
        await db.insert(profiles).values({ userId: newUser.id });
        await db.insert(streaks).values({ userId: newUser.id });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;