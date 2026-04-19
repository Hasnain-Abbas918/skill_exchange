# 🔄 SkillSwap – 1-Week Full-Stack Guide
## Stack: Express · React (Vite) · Supabase (PostgreSQL) · Drizzle ORM · Socket.io · WebRTC · Tailwind CSS · JWT

> **Har step tested hai. Har file listed hai. Supabase = database hosting. Drizzle = type-safe ORM.**

---

## 📦 VSCode Extensions — Pehle Install Karo

| Extension | ID |
|---|---|
| ESLint | `dbaeumer.vscode-eslint` |
| Prettier | `esbenp.prettier-vscode` |
| Tailwind CSS IntelliSense | `bradlc.vscode-tailwindcss` |
| REST Client | `humao.rest-client` |
| Thunder Client | `rangav.vscode-thunder-client` |
| DotENV | `mikestead.dotenv` |
| GitLens | `eamodio.gitlens` |
| Auto Rename Tag | `formulahendry.auto-rename-tag` |
| Path IntelliSense | `christian-kohler.path-intellisense` |
| Drizzle ORM | `drizzle-team.drizzle-vscode` |

---

## 🗂️ Complete Folder & File Architecture

```
skillswap/
├── server/
│   ├── config/
│   │   ├── db.js                    # Drizzle + Supabase connection
│   │   ├── email.js                 # Nodemailer config
│   │   └── passport.js              # ✅ NEW: Google OAuth config
│   ├── db/
│   │   ├── schema/
│   │   │   ├── index.js             # Export all schemas
│   │   │   ├── users.js             # users table
│   │   │   ├── profiles.js          # profiles table
│   │   │   ├── bids.js              # bids table
│   │   │   ├── requests.js          # requests table
│   │   │   ├── exchanges.js         # exchanges table (✅ UPDATED: pause/cancel fields)
│   │   │   ├── sessions.js          # sessions table
│   │   │   ├── conversations.js     # conversations + participants
│   │   │   ├── messages.js          # messages table
│   │   │   ├── notifications.js     # notifications table
│   │   │   ├── reports.js           # reports table
│   │   │   ├── streaks.js           # streaks table
│   │   │   ├── reviews.js           # ✅ NEW: reviews table
│   │   │   ├── adminLogs.js         # ✅ NEW: admin logs table
│   │   │   └── logs.js              # logs table
│   │   └── migrate.js               # Run migrations
│   ├── controllers/
│   │   ├── authController.js        # ✅ UPDATED: Google OAuth added
│   │   ├── userController.js
│   │   ├── bidController.js
│   │   ├── requestController.js
│   │   ├── exchangeController.js    # ✅ UPDATED: mutual cancel logic
│   │   ├── sessionController.js
│   │   ├── chatController.js
│   │   ├── reportController.js
│   │   ├── adminController.js
│   │   ├── scheduleController.js
│   │   ├── historyController.js     # ✅ NEW: activity tracking
│   │   ├── reviewController.js      # ✅ NEW: reviews CRUD
│   │   └── settingsController.js    # ✅ NEW: user settings
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   └── errorMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js            # ✅ UPDATED: Google OAuth routes
│   │   ├── userRoutes.js
│   │   ├── bidRoutes.js
│   │   ├── requestRoutes.js
│   │   ├── exchangeRoutes.js        # ✅ UPDATED: mutual cancel routes
│   │   ├── sessionRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── scheduleRoutes.js
│   │   ├── historyRoutes.js         # ✅ NEW
│   │   ├── reviewRoutes.js          # ✅ NEW
│   │   └── settingsRoutes.js        # ✅ NEW
│   ├── socket/
│   │   ├── socketHandler.js
│   │   ├── chatSocket.js
│   │   └── webrtcSocket.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── generateOTP.js
│   │   ├── sendEmail.js
│   │   └── scheduleUtils.js
│   ├── drizzle.config.js            # Drizzle Kit config
│   ├── .env                         # ✅ UPDATED: Google OAuth vars added
│   ├── package.json                 # ✅ UPDATED: passport packages added
│   └── server.js                    # ✅ UPDATED: new routes registered
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx       # ✅ UPDATED: History + Settings links
│   │   │   │   ├── Loader.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── bids/
│   │   │   │   ├── BidCard.jsx
│   │   │   │   └── BidForm.jsx
│   │   │   ├── chat/
│   │   │   │   └── ChatBox.jsx
│   │   │   ├── reviews/
│   │   │   │   └── ReviewCard.jsx   # ✅ NEW
│   │   │   └── session/
│   │   │       └── VideoRoom.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── hooks/
│   │   │   └── useWebRTC.js
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx        # ✅ UPDATED: Google OAuth button
│   │   │   ├── RegisterPage.jsx     # ✅ UPDATED: Google OAuth button
│   │   │   ├── OTPPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx  # ✅ NEW
│   │   │   ├── ResetPasswordPage.jsx   # ✅ NEW
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── BidsPage.jsx
│   │   │   ├── BidDetailsPage.jsx   # ✅ NEW
│   │   │   ├── ExchangesPage.jsx
│   │   │   ├── SchedulePage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   ├── SessionPage.jsx
│   │   │   ├── HistoryPage.jsx      # ✅ NEW: activity tracking
│   │   │   ├── SettingsPage.jsx     # ✅ NEW: user settings
│   │   │   ├── ReportsPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminUsers.jsx
│   │   │       └── AdminReports.jsx
│   │   ├── store/
│   │   │   ├── index.js             # ✅ UPDATED: new slices added
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── bidSlice.js
│   │   │       ├── chatSlice.js
│   │   │       ├── exchangeSlice.js
│   │   │       └── reviewSlice.js   # ✅ NEW
│   │   ├── App.jsx                  # ✅ UPDATED: new routes added
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
└── README.md
```

---

# 📅 DAY 1 – Supabase Setup + Drizzle Schema + Auth

## Step 1.1 – Supabase Project Banana

1. Jao [supabase.com](https://supabase.com) → **New Project** banao
2. Project name: `skillswap`, password set karo, region choose karo
3. **Settings → Database** mein jaake ye URLs copy karo:
   - `URI` (Direct Connection) → `DATABASE_URL` ke liye
   - `URI` (Session Mode pooler) → `DATABASE_URL_POOLER` ke liye (port 5432)
4. **Settings → API** se `Project URL` aur `anon key` copy karo (future use ke liye)

---

## Step 1.2 – Server Initialize Karo

```bash
mkdir skillswap && cd skillswap
mkdir server client
git init

cd server
npm init -y
```

### Server packages install karo:

```bash
npm install express dotenv bcryptjs jsonwebtoken nodemailer cors cookie-parser socket.io uuid drizzle-orm postgres passport passport-google-oauth20

npm install --save-dev nodemon drizzle-kit
```

---

### `server/package.json`

```json
{
  "name": "skillswap-server",
  "version": "1.0.0",
  "type": "commonjs",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "node db/migrate.js",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

---

### `server/.env`

```env
PORT=5000
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
JWT_SECRET=skillswap_super_secret_jwt_key_2024
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# ✅ NEW: Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

> **Gmail App Password kaise banate hain:** Gmail → Settings → Security → 2-Step Verification ON karo → App Passwords → "Mail" select karo → 16-digit password milega

> **Google OAuth Setup:** [console.cloud.google.com](https://console.cloud.google.com) → New Project → Enable "Google+ API" → Credentials → OAuth 2.0 Client ID → Authorized redirect URI: `http://localhost:5000/api/auth/google/callback`

---

## Step 1.3 – Drizzle Config

### `server/drizzle.config.js`

```js
const { defineConfig } = require('drizzle-kit');
require('dotenv').config();

module.exports = defineConfig({
  schema: './db/schema/index.js',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
```

---

## Step 1.4 – Database Connection

### `server/config/db.js`

```js
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const schema = require('../db/schema/index');
require('dotenv').config();

// Connection pool for queries
const queryClient = postgres(process.env.DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

const db = drizzle(queryClient, { schema });

const connectDB = async () => {
  try {
    // Test connection
    await queryClient`SELECT 1`;
    console.log('✅ Supabase PostgreSQL Connected via Drizzle!');
  } catch (error) {
    console.error('❌ DB Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = { db, connectDB };
```

---

## Step 1.5 – Drizzle Schema Files

### `server/db/schema/users.js`

```js
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
```

---

### `server/db/schema/profiles.js`

```js
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
```

---

### `server/db/schema/bids.js`

```js
const { pgTable, uuid, varchar, text, boolean, timestamp, pgEnum } = require('drizzle-orm/pg-core');
const { users } = require('./users');

const skillLevelEnum = pgEnum('skill_level', ['Beginner', 'Intermediate', 'Advanced']);

const bids = pgTable('bids', {
  id: uuid('id').defaultRandom().primaryKey(),
  creatorId: uuid('creator_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  skillOffered: varchar('skill_offered', { length: 255 }).notNull(),
  skillWanted: varchar('skill_wanted', { length: 255 }).notNull(),
  description: text('description').notNull(),
  level: skillLevelEnum('level').default('Beginner'),
  isActive: boolean('is_active').default(true),
  tags: text('tags').array().default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

module.exports = { bids, skillLevelEnum };
```

---

### `server/db/schema/requests.js`

```js
const { pgTable, uuid, text, timestamp, pgEnum } = require('drizzle-orm/pg-core');
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
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

module.exports = { requests, requestStatusEnum };
```

---

### `server/db/schema/exchanges.js`

```js
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
```

---

### `server/db/schema/sessions.js`

```js
const { pgTable, uuid, integer, text, timestamp, pgEnum } = require('drizzle-orm/pg-core');
const { exchanges } = require('./exchanges');
const { users } = require('./users');

const sessionStatusEnum = pgEnum('session_status', ['scheduled', 'in_progress', 'completed', 'missed', 'cancelled']);

const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  exchangeId: uuid('exchange_id').notNull().references(() => exchanges.id, { onDelete: 'cascade' }),
  scheduledAt: timestamp('scheduled_at').notNull(),
  duration: integer('duration').default(120),
  teacherId: uuid('teacher_id').references(() => users.id),
  studentId: uuid('student_id').references(() => users.id),
  status: sessionStatusEnum('status').default('scheduled'),
  roomId: uuid('room_id').notNull().unique(),
  startedAt: timestamp('started_at'),
  endedAt: timestamp('ended_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

module.exports = { sessions, sessionStatusEnum };
```

---

### `server/db/schema/conversations.js`

```js
const { pgTable, uuid, timestamp } = require('drizzle-orm/pg-core');
const { users } = require('./users');
const { exchanges } = require('./exchanges');

const conversations = pgTable('conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  exchangeId: uuid('exchange_id').references(() => exchanges.id),
  lastMessageId: uuid('last_message_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Junction table for conversation participants
const conversationParticipants = pgTable('conversation_participants', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = { conversations, conversationParticipants };
```

---

### `server/db/schema/messages.js`

```js
const { pgTable, uuid, text, boolean, timestamp } = require('drizzle-orm/pg-core');
const { conversations } = require('./conversations');
const { users } = require('./users');

const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  senderId: uuid('sender_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = { messages };
```

---

### `server/db/schema/notifications.js`

```js
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
```

---

### `server/db/schema/reports.js`

```js
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
```

---

### `server/db/schema/streaks.js`

```js
const { pgTable, uuid, integer, boolean, timestamp } = require('drizzle-orm/pg-core');
const { users } = require('./users');

const streaks = pgTable('streaks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  currentStreak: integer('current_streak').default(0),
  longestStreak: integer('longest_streak').default(0),
  lastSessionDate: timestamp('last_session_date'),
  isFrozen: boolean('is_frozen').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

module.exports = { streaks };
```

---

### `server/db/schema/logs.js`

```js
const { pgTable, uuid, text, jsonb, timestamp } = require('drizzle-orm/pg-core');
const { users } = require('./users');

const logs = pgTable('logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  action: text('action').notNull(),
  details: jsonb('details'),
  ip: text('ip'),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = { logs };
```

---

### ✅ NEW: `server/db/schema/reviews.js`

```js
const { pgTable, uuid, integer, text, timestamp, pgEnum } = require('drizzle-orm/pg-core');
const { users } = require('./users');
const { exchanges } = require('./exchanges');
const { sessions } = require('./sessions');

const reviewTypeEnum = pgEnum('review_type', ['session', 'exchange']);

const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  reviewerId: uuid('reviewer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  revieweeId: uuid('reviewee_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  exchangeId: uuid('exchange_id').references(() => exchanges.id, { onDelete: 'set null' }),
  sessionId: uuid('session_id').references(() => sessions.id, { onDelete: 'set null' }),
  type: reviewTypeEnum('type').default('session'),
  rating: integer('rating').notNull(),     // 1-5
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = { reviews, reviewTypeEnum };
```

---

### ✅ NEW: `server/db/schema/adminLogs.js`

```js
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
```

---

### `server/db/schema/index.js`

```js
const { users, userRoleEnum } = require('./users');
const { profiles } = require('./profiles');
const { bids, skillLevelEnum } = require('./bids');
const { requests, requestStatusEnum } = require('./requests');
const { exchanges, exchangeStatusEnum } = require('./exchanges');
const { sessions, sessionStatusEnum } = require('./sessions');
const { conversations, conversationParticipants } = require('./conversations');
const { messages } = require('./messages');
const { notifications, notificationTypeEnum } = require('./notifications');
const { reports, reportTypeEnum, reportStatusEnum } = require('./reports');
const { streaks } = require('./streaks');
const { reviews, reviewTypeEnum } = require('./reviews');       // ✅ NEW
const { adminLogs } = require('./adminLogs');                   // ✅ NEW
const { logs } = require('./logs');

module.exports = {
  users, userRoleEnum,
  profiles,
  bids, skillLevelEnum,
  requests, requestStatusEnum,
  exchanges, exchangeStatusEnum,
  sessions, sessionStatusEnum,
  conversations, conversationParticipants,
  messages,
  notifications, notificationTypeEnum,
  reports, reportTypeEnum, reportStatusEnum,
  streaks,
  reviews, reviewTypeEnum,   // ✅ NEW
  adminLogs,                 // ✅ NEW
  logs,
};
```

---

## Step 1.6 – Migration Run Karo

### `server/db/migrate.js`

```js
const { drizzle } = require('drizzle-orm/postgres-js');
const { migrate } = require('drizzle-orm/postgres-js/migrator');
const postgres = require('postgres');
require('dotenv').config();

const runMigrations = async () => {
  const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(migrationClient);

  console.log('⏳ Running migrations...');
  try {
    await migrate(db, { migrationsFolder: './db/migrations' });
    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
};

runMigrations();
```

### Migration Commands (Terminal mein chalao):

```bash
cd server

# Step 1: SQL migration files generate karo
npm run db:generate

# Step 2: Supabase par migrations apply karo
npm run db:migrate

# Optional: Drizzle Studio se visually dekho
npm run db:studio
```

> ✅ **Test:** Supabase Dashboard → Table Editor → Sare tables dikhne chahiye (users, profiles, bids, etc.)

---

## Step 1.7 – Utilities

### `server/utils/generateToken.js`

```js
const jwt = require('jsonwebtoken');

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

module.exports = generateToken;
```

---

### `server/utils/generateOTP.js`

```js
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

module.exports = generateOTP;
```

---

### `server/config/email.js`

```js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

module.exports = transporter;
```

---

### `server/utils/sendEmail.js`

```js
const transporter = require('../config/email');

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"SkillSwap" <${process.env.EMAIL_USER}>`,
    to, subject, html,
  });
};

module.exports = sendEmail;
```

---

### `server/utils/scheduleUtils.js`

```js
const timeToMinutes = (time) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const minutesToTime = (minutes) => {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

const findOverlapSlots = (availabilityA, availabilityB) => {
  const overlap = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  for (const day of days) {
    const slotsA = availabilityA.filter((s) => s.day === day);
    const slotsB = availabilityB.filter((s) => s.day === day);

    for (const slotA of slotsA) {
      for (const slotB of slotsB) {
        const overlapStart = Math.max(timeToMinutes(slotA.startTime), timeToMinutes(slotB.startTime));
        const overlapEnd = Math.min(timeToMinutes(slotA.endTime), timeToMinutes(slotB.endTime));

        if (overlapEnd - overlapStart >= 120) {
          overlap.push({ day, startTime: minutesToTime(overlapStart), endTime: minutesToTime(overlapEnd) });
        }
      }
    }
  }
  return overlap;
};

module.exports = { findOverlapSlots };
```

---

## Step 1.8 – Middleware

### `server/middleware/authMiddleware.js`

```js
const jwt = require('jsonwebtoken');
const { db } = require('../config/db');
const { users } = require('../db/schema/index');
const { eq } = require('drizzle-orm');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [user] = await db
      .select({ id: users.id, name: users.name, email: users.email, role: users.role, isBanned: users.isBanned, avatar: users.avatar })
      .from(users)
      .where(eq(users.id, decoded.id));

    if (!user) return res.status(401).json({ message: 'User not found' });
    if (user.isBanned) return res.status(403).json({ message: 'Account has been banned' });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

module.exports = { protect };
```

---

### `server/middleware/adminMiddleware.js`

```js
const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403).json({ message: 'Admin access only' });
};

module.exports = { adminOnly };
```

---

### `server/middleware/errorMiddleware.js`

```js
const errorHandler = (err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
```

---

## Step 1.9 – Auth Controller

### `server/controllers/authController.js`

```js
const bcrypt = require('bcryptjs');
const { db } = require('../config/db');
const { users, profiles, streaks } = require('../db/schema/index');
const { eq, and, gt } = require('drizzle-orm');
const generateToken = require('../utils/generateToken');
const generateOTP = require('../utils/generateOTP');
const sendEmail = require('../utils/sendEmail');

// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check existing user
    const [existingUser] = await db.select().from(users).where(eq(users.email, email));
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    // Create user
    const [newUser] = await db.insert(users).values({
      name, email, password: hashedPassword, otp, otpExpire,
    }).returning({ id: users.id, name: users.name, email: users.email });

    // Create empty profile
    await db.insert(profiles).values({ userId: newUser.id });

    // Create streak record
    await db.insert(streaks).values({ userId: newUser.id });

    // Send OTP email
    await sendEmail({
      to: email,
      subject: '🔄 SkillSwap – Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #4F46E5; text-align: center;">Welcome to SkillSwap! 🔄</h2>
          <p style="color: #374151;">Your OTP verification code is:</p>
          <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="letter-spacing: 12px; color: #4F46E5; margin: 0; font-size: 32px;">${otp}</h1>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
        </div>
      `,
    });

    res.status(201).json({ message: 'Registration successful! Check your email for OTP.', userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/auth/verify-otp
const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Already verified' });
    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (user.otpExpire < new Date()) return res.status(400).json({ message: 'OTP expired. Request a new one.' });

    const [updatedUser] = await db.update(users)
      .set({ isVerified: true, otp: null, otpExpire: null })
      .where(eq(users.id, userId))
      .returning({ id: users.id, name: users.name, email: users.email, role: users.role });

    const token = generateToken(updatedUser.id);
    res.json({ message: 'Email verified!', token, user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/auth/resend-otp
const resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    await db.update(users).set({ otp, otpExpire }).where(eq(users.id, userId));

    await sendEmail({
      to: user.email,
      subject: 'SkillSwap – New OTP Code',
      html: `<h2>Your new OTP: <strong style="color:#4F46E5; letter-spacing:4px;">${otp}</strong></h2><p>Expires in 10 minutes.</p>`,
    });

    res.json({ message: 'New OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email first', userId: user.id });
    if (user.isBanned) return res.status(403).json({ message: 'Your account has been banned' });

    const token = generateToken(user.id);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};

// @route POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return res.status(404).json({ message: 'No account with that email' });

    const otp = generateOTP();
    const expire = new Date(Date.now() + 10 * 60 * 1000);

    await db.update(users).set({ resetPasswordToken: otp, resetPasswordExpire: expire }).where(eq(users.id, user.id));

    await sendEmail({
      to: email,
      subject: 'SkillSwap – Password Reset OTP',
      html: `<h2>Password Reset OTP: <strong style="color:#4F46E5;">${otp}</strong></h2><p>Expires in 10 minutes.</p>`,
    });

    res.json({ message: 'Password reset OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const [user] = await db.select().from(users)
      .where(and(eq(users.email, email), eq(users.resetPasswordToken, otp), gt(users.resetPasswordExpire, new Date())));

    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    await db.update(users).set({ password: hashed, resetPasswordToken: null, resetPasswordExpire: null }).where(eq(users.id, user.id));

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, verifyOTP, resendOTP, login, getMe, forgotPassword, resetPassword };
```

---

### ✅ NEW: `server/config/passport.js` – Google OAuth Config

```js
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
          isVerified: true,    // Google se aaya hai, verified hai
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
```

---

### ✅ UPDATED: `server/routes/authRoutes.js` – Google OAuth routes add kiye

```js
const express = require('express');
const router = express.Router();
const { register, verifyOTP, resendOTP, login, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const passport = require('../config/passport');
const generateToken = require('../utils/generateToken');

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// ✅ NEW: Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`, session: false }),
  (req, res) => {
    const token = generateToken(req.user.id);
    // Token URL mein pass karo → client localStorage mein save karega
    res.redirect(`${process.env.CLIENT_URL}/oauth-callback?token=${token}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}&avatar=${encodeURIComponent(req.user.avatar || '')}&role=${req.user.role}`);
  }
);

module.exports = router;
```

---

## Step 1.10 – Main Server

### `server/server.js`

```js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');          // ✅ NEW
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const socketHandler = require('./socket/socketHandler');

dotenv.config();
connectDB();

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'], credentials: true },
});

// Attach io to every request
app.use((req, res, next) => { req.io = io; next(); });

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());                         // ✅ NEW

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/bids', require('./routes/bidRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/exchanges', require('./routes/exchangeRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/schedule', require('./routes/scheduleRoutes'));
app.use('/api/history', require('./routes/historyRoutes'));    // ✅ NEW
app.use('/api/reviews', require('./routes/reviewRoutes'));     // ✅ NEW
app.use('/api/settings', require('./routes/settingsRoutes')); // ✅ NEW

app.get('/api/health', (req, res) => res.json({ status: 'OK', db: 'Supabase + Drizzle' }));

socketHandler(io);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`🚀 SkillSwap Server running on port ${PORT}`));
```

> **✅ Test Day 1:**
> ```bash
> cd server
> npm run db:generate   # Migration files banao
> npm run db:migrate    # Supabase par apply karo
> npm run dev           # Server start karo
> ```
> Thunder Client → `GET http://localhost:5000/api/health` → `{"status":"OK","db":"Supabase + Drizzle"}`

---

# 📅 DAY 2 – Users, Bids, Requests

## Step 2.1 – User Controller

### `server/controllers/userController.js`

```js
const { db } = require('../config/db');
const { users, profiles, streaks } = require('../db/schema/index');
const { eq, or, ilike, sql } = require('drizzle-orm');

// @route GET /api/users/profile
const getMyProfile = async (req, res) => {
  try {
    const [profile] = await db
      .select({
        id: profiles.id,
        bio: profiles.bio,
        skillsOffered: profiles.skillsOffered,
        skillsWanted: profiles.skillsWanted,
        availability: profiles.availability,
        location: profiles.location,
        rating: profiles.rating,
        totalSessions: profiles.totalSessions,
        user: { id: users.id, name: users.name, email: users.email, avatar: users.avatar },
      })
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(eq(profiles.userId, req.user.id));

    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const { bio, skillsOffered, skillsWanted, availability, location } = req.body;

    const [existing] = await db.select({ id: profiles.id }).from(profiles).where(eq(profiles.userId, req.user.id));

    let updatedProfile;
    if (existing) {
      [updatedProfile] = await db.update(profiles)
        .set({ bio, skillsOffered, skillsWanted, availability, location, updatedAt: new Date() })
        .where(eq(profiles.userId, req.user.id))
        .returning();
    } else {
      [updatedProfile] = await db.insert(profiles)
        .values({ userId: req.user.id, bio, skillsOffered, skillsWanted, availability, location })
        .returning();
    }

    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/users/:id/profile
const getUserProfile = async (req, res) => {
  try {
    const [profile] = await db
      .select({
        id: profiles.id,
        bio: profiles.bio,
        skillsOffered: profiles.skillsOffered,
        skillsWanted: profiles.skillsWanted,
        availability: profiles.availability,
        location: profiles.location,
        rating: profiles.rating,
        user: { id: users.id, name: users.name, email: users.email, avatar: users.avatar },
      })
      .from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(eq(profiles.userId, req.params.id));

    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const [streak] = await db.select().from(streaks).where(eq(streaks.userId, req.params.id));
    res.json({ profile, streak });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/users/avatar
const updateAvatar = async (req, res) => {
  try {
    const { avatarUrl } = req.body;
    await db.update(users).set({ avatar: avatarUrl, updatedAt: new Date() }).where(eq(users.id, req.user.id));
    res.json({ message: 'Avatar updated', avatarUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyProfile, updateProfile, getUserProfile, updateAvatar };
```

---

### `server/routes/userRoutes.js`

```js
const express = require('express');
const router = express.Router();
const { getMyProfile, updateProfile, getUserProfile, updateAvatar } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, updateProfile);
router.put('/avatar', protect, updateAvatar);
router.get('/:id/profile', protect, getUserProfile);

module.exports = router;
```

---

## Step 2.2 – Bid Controller

### `server/controllers/bidController.js`

```js
const { db } = require('../config/db');
const { bids, users } = require('../db/schema/index');
const { eq, ne, ilike, or, and, count, desc } = require('drizzle-orm');

// @route POST /api/bids
const createBid = async (req, res) => {
  try {
    const { skillOffered, skillWanted, description, level, tags } = req.body;
    const [bid] = await db.insert(bids)
      .values({ creatorId: req.user.id, skillOffered, skillWanted, description, level, tags })
      .returning();
    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/bids
const getAllBids = async (req, res) => {
  try {
    const { search, level, page = 1, limit = 12 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build conditions
    let conditions = [eq(bids.isActive, true), ne(bids.creatorId, req.user.id)];
    if (level) conditions.push(eq(bids.level, level));

    // Fetch bids with creator info using join
    let query = db
      .select({
        id: bids.id,
        skillOffered: bids.skillOffered,
        skillWanted: bids.skillWanted,
        description: bids.description,
        level: bids.level,
        tags: bids.tags,
        isActive: bids.isActive,
        createdAt: bids.createdAt,
        creator: { id: users.id, name: users.name, avatar: users.avatar },
      })
      .from(bids)
      .innerJoin(users, eq(bids.creatorId, users.id))
      .where(and(...conditions))
      .orderBy(desc(bids.createdAt))
      .limit(parseInt(limit))
      .offset(offset);

    const allBids = await query;

    // Filter by search in app layer (Drizzle doesn't support array contains easily inline)
    const filtered = search
      ? allBids.filter((b) =>
          b.skillOffered.toLowerCase().includes(search.toLowerCase()) ||
          b.skillWanted.toLowerCase().includes(search.toLowerCase()) ||
          b.description.toLowerCase().includes(search.toLowerCase())
        )
      : allBids;

    res.json({ bids: filtered, total: filtered.length, page: parseInt(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/bids/my
const getMyBids = async (req, res) => {
  try {
    const myBids = await db
      .select()
      .from(bids)
      .where(eq(bids.creatorId, req.user.id))
      .orderBy(desc(bids.createdAt));
    res.json(myBids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/bids/:id
const getBidById = async (req, res) => {
  try {
    const [bid] = await db
      .select({
        id: bids.id,
        skillOffered: bids.skillOffered,
        skillWanted: bids.skillWanted,
        description: bids.description,
        level: bids.level,
        tags: bids.tags,
        createdAt: bids.createdAt,
        creator: { id: users.id, name: users.name, avatar: users.avatar, email: users.email },
      })
      .from(bids)
      .innerJoin(users, eq(bids.creatorId, users.id))
      .where(eq(bids.id, req.params.id));

    if (!bid) return res.status(404).json({ message: 'Bid not found' });
    res.json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/bids/:id
const updateBid = async (req, res) => {
  try {
    const [bid] = await db.select().from(bids).where(eq(bids.id, req.params.id));
    if (!bid) return res.status(404).json({ message: 'Bid not found' });
    if (bid.creatorId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const [updated] = await db.update(bids).set({ ...req.body, updatedAt: new Date() }).where(eq(bids.id, req.params.id)).returning();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/bids/:id
const deleteBid = async (req, res) => {
  try {
    const [bid] = await db.select().from(bids).where(eq(bids.id, req.params.id));
    if (!bid) return res.status(404).json({ message: 'Bid not found' });
    if (bid.creatorId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await db.delete(bids).where(eq(bids.id, req.params.id));
    res.json({ message: 'Bid deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBid, getAllBids, getMyBids, getBidById, updateBid, deleteBid };
```

---

### `server/routes/bidRoutes.js`

```js
const express = require('express');
const router = express.Router();
const { createBid, getAllBids, getMyBids, getBidById, updateBid, deleteBid } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAllBids).post(protect, createBid);
router.get('/my', protect, getMyBids);
router.route('/:id').get(protect, getBidById).put(protect, updateBid).delete(protect, deleteBid);

module.exports = router;
```

---

## Step 2.3 – Request Controller

### `server/controllers/requestController.js`

```js
const { db } = require('../config/db');
const { requests, exchanges, conversations, conversationParticipants, notifications, users, bids } = require('../db/schema/index');
const { eq, and, desc } = require('drizzle-orm');

// @route POST /api/requests
const sendRequest = async (req, res) => {
  try {
    const { bidId, receiverId, message } = req.body;

    // Duplicate check
    const [existing] = await db.select().from(requests)
      .where(and(eq(requests.senderId, req.user.id), eq(requests.bidId, bidId), eq(requests.status, 'pending')));
    if (existing) return res.status(400).json({ message: 'You already sent a request for this bid' });

    const [request] = await db.insert(requests)
      .values({ senderId: req.user.id, receiverId, bidId, message })
      .returning();

    // Notification
    await db.insert(notifications).values({
      userId: receiverId,
      type: 'request',
      message: `${req.user.name} sent you a skill exchange request`,
      link: `/requests/${request.id}`,
    });

    req.io.to(receiverId).emit('new_notification', { type: 'request', message: `${req.user.name} sent you a request!` });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/requests/received
const getReceivedRequests = async (req, res) => {
  try {
    const received = await db
      .select({
        id: requests.id, message: requests.message, status: requests.status, createdAt: requests.createdAt,
        sender: { id: users.id, name: users.name, avatar: users.avatar },
        bid: { id: bids.id, skillOffered: bids.skillOffered, skillWanted: bids.skillWanted },
      })
      .from(requests)
      .innerJoin(users, eq(requests.senderId, users.id))
      .innerJoin(bids, eq(requests.bidId, bids.id))
      .where(eq(requests.receiverId, req.user.id))
      .orderBy(desc(requests.createdAt));

    res.json(received);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/requests/sent
const getSentRequests = async (req, res) => {
  try {
    const sent = await db
      .select({
        id: requests.id, message: requests.message, status: requests.status, createdAt: requests.createdAt,
        receiver: { id: users.id, name: users.name, avatar: users.avatar },
        bid: { id: bids.id, skillOffered: bids.skillOffered, skillWanted: bids.skillWanted },
      })
      .from(requests)
      .innerJoin(users, eq(requests.receiverId, users.id))
      .innerJoin(bids, eq(requests.bidId, bids.id))
      .where(eq(requests.senderId, req.user.id))
      .orderBy(desc(requests.createdAt));

    res.json(sent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/requests/:id/accept
const acceptRequest = async (req, res) => {
  try {
    const [request] = await db.select().from(requests).where(eq(requests.id, req.params.id));
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.receiverId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    if (request.status !== 'pending') return res.status(400).json({ message: 'Request already processed' });

    await db.update(requests).set({ status: 'accepted', updatedAt: new Date() }).where(eq(requests.id, request.id));

    // Create exchange
    const [exchange] = await db.insert(exchanges)
      .values({ userAId: request.senderId, userBId: request.receiverId, bidId: request.bidId, requestId: request.id })
      .returning();

    // Create conversation
    const [conv] = await db.insert(conversations)
      .values({ exchangeId: exchange.id })
      .returning();

    // Add participants
    await db.insert(conversationParticipants).values([
      { conversationId: conv.id, userId: request.senderId },
      { conversationId: conv.id, userId: request.receiverId },
    ]);

    // Notify sender
    await db.insert(notifications).values({
      userId: request.senderId,
      type: 'exchange',
      message: 'Your request was accepted! Exchange created.',
      link: `/exchanges/${exchange.id}`,
    });

    req.io.to(request.senderId).emit('new_notification', { type: 'exchange_created', exchangeId: exchange.id });

    res.json({ message: 'Request accepted', exchange });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/requests/:id/reject
const rejectRequest = async (req, res) => {
  try {
    const [request] = await db.select().from(requests).where(eq(requests.id, req.params.id));
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.receiverId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await db.update(requests).set({ status: 'rejected', updatedAt: new Date() }).where(eq(requests.id, request.id));

    await db.insert(notifications).values({
      userId: request.senderId,
      type: 'request',
      message: 'Your exchange request was declined.',
    });

    res.json({ message: 'Request rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendRequest, getReceivedRequests, getSentRequests, acceptRequest, rejectRequest };
```

---

### `server/routes/requestRoutes.js`

```js
const express = require('express');
const router = express.Router();
const { sendRequest, getReceivedRequests, getSentRequests, acceptRequest, rejectRequest } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendRequest);
router.get('/received', protect, getReceivedRequests);
router.get('/sent', protect, getSentRequests);
router.put('/:id/accept', protect, acceptRequest);
router.put('/:id/reject', protect, rejectRequest);

module.exports = router;
```

---

# 📅 DAY 3 – Exchanges, Scheduling & Sessions

## Step 3.1 – Exchange Controller

### `server/controllers/exchangeController.js`

```js
const { db } = require('../config/db');
const { exchanges, users, bids, streaks, notifications } = require('../db/schema/index');
const { eq, or, and } = require('drizzle-orm');

const getMyExchanges = async (req, res) => {
  try {
    const myExchanges = await db
      .select({
        id: exchanges.id, status: exchanges.status, createdAt: exchanges.createdAt,
        pauseReason: exchanges.pauseReason, cancelReason: exchanges.cancelReason,
        userAId: exchanges.userAId, userBId: exchanges.userBId,
        bid: { id: bids.id, skillOffered: bids.skillOffered, skillWanted: bids.skillWanted },
      })
      .from(exchanges)
      .innerJoin(bids, eq(exchanges.bidId, bids.id))
      .where(or(eq(exchanges.userAId, req.user.id), eq(exchanges.userBId, req.user.id)));

    // Fetch user details for each exchange separately
    const enriched = await Promise.all(
      myExchanges.map(async (ex) => {
        const partnerId = ex.userAId === req.user.id ? ex.userBId : ex.userAId;
        const [partner] = await db.select({ id: users.id, name: users.name, avatar: users.avatar }).from(users).where(eq(users.id, partnerId));
        return { ...ex, partner };
      })
    );

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExchangeById = async (req, res) => {
  try {
    const [exchange] = await db.select().from(exchanges).where(eq(exchanges.id, req.params.id));
    if (!exchange) return res.status(404).json({ message: 'Exchange not found' });

    const isParticipant = exchange.userAId === req.user.id || exchange.userBId === req.user.id;
    if (!isParticipant) return res.status(403).json({ message: 'Not authorized' });

    const [userA] = await db.select({ id: users.id, name: users.name, avatar: users.avatar }).from(users).where(eq(users.id, exchange.userAId));
    const [userB] = await db.select({ id: users.id, name: users.name, avatar: users.avatar }).from(users).where(eq(users.id, exchange.userBId));
    const [bid] = await db.select().from(bids).where(eq(bids.id, exchange.bidId));

    res.json({ ...exchange, userA, userB, bid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const requestPause = async (req, res) => {
  try {
    const { reason } = req.body;
    const [exchange] = await db.select().from(exchanges).where(eq(exchanges.id, req.params.id));
    if (!exchange) return res.status(404).json({ message: 'Exchange not found' });

    await db.update(exchanges)
      .set({ pauseRequestedById: req.user.id, pauseReason: reason, updatedAt: new Date() })
      .where(eq(exchanges.id, exchange.id));

    const otherId = exchange.userAId === req.user.id ? exchange.userBId : exchange.userAId;
    await db.insert(notifications).values({
      userId: otherId, type: 'exchange',
      message: `${req.user.name} wants to pause the exchange: ${reason}`,
      link: `/exchanges/${exchange.id}`,
    });

    req.io.to(otherId).emit('new_notification', { type: 'pause_request' });
    res.json({ message: 'Pause request sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const confirmPause = async (req, res) => {
  try {
    const [exchange] = await db.select().from(exchanges).where(eq(exchanges.id, req.params.id));
    if (!exchange?.pauseRequestedById) return res.status(400).json({ message: 'No pause request found' });

    await db.update(exchanges)
      .set({ status: 'paused', pauseApprovedById: req.user.id, pausedAt: new Date(), updatedAt: new Date() })
      .where(eq(exchanges.id, exchange.id));

    // Freeze both streaks
    await db.update(streaks).set({ isFrozen: true, updatedAt: new Date() }).where(eq(streaks.userId, exchange.userAId));
    await db.update(streaks).set({ isFrozen: true, updatedAt: new Date() }).where(eq(streaks.userId, exchange.userBId));

    res.json({ message: 'Exchange paused, streaks frozen' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resumeExchange = async (req, res) => {
  try {
    const [exchange] = await db.select().from(exchanges).where(eq(exchanges.id, req.params.id));
    if (!exchange) return res.status(404).json({ message: 'Not found' });

    await db.update(exchanges)
      .set({ status: 'active', pauseRequestedById: null, pauseApprovedById: null, pauseReason: null, resumedAt: new Date(), updatedAt: new Date() })
      .where(eq(exchanges.id, exchange.id));

    await db.update(streaks).set({ isFrozen: false, updatedAt: new Date() }).where(eq(streaks.userId, exchange.userAId));
    await db.update(streaks).set({ isFrozen: false, updatedAt: new Date() }).where(eq(streaks.userId, exchange.userBId));

    res.json({ message: 'Exchange resumed, streaks unfrozen' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATED: Step 1 – Cancel request bhejo (mutual agreement required)
const requestCancel = async (req, res) => {
  try {
    const { reason } = req.body;
    const [exchange] = await db.select().from(exchanges).where(eq(exchanges.id, req.params.id));
    if (!exchange) return res.status(404).json({ message: 'Exchange not found' });

    const isParticipant = exchange.userAId === req.user.id || exchange.userBId === req.user.id;
    if (!isParticipant) return res.status(403).json({ message: 'Not authorized' });

    await db.update(exchanges)
      .set({ cancelRequestedById: req.user.id, cancelReason: reason, updatedAt: new Date() })
      .where(eq(exchanges.id, exchange.id));

    const otherId = exchange.userAId === req.user.id ? exchange.userBId : exchange.userAId;
    await db.insert(notifications).values({
      userId: otherId, type: 'exchange',
      message: `${req.user.name} wants to cancel the exchange: ${reason}`,
      link: `/exchanges/${exchange.id}`,
    });
    req.io.to(otherId).emit('new_notification', { type: 'cancel_request' });

    res.json({ message: 'Cancel request sent. Other user must approve.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATED: Step 2 – Cancel approve karo (dono ki agreement)
const approveCancel = async (req, res) => {
  try {
    const [exchange] = await db.select().from(exchanges).where(eq(exchanges.id, req.params.id));
    if (!exchange?.cancelRequestedById) return res.status(400).json({ message: 'No cancel request found' });

    const isOtherUser = exchange.cancelRequestedById !== req.user.id &&
      (exchange.userAId === req.user.id || exchange.userBId === req.user.id);
    if (!isOtherUser) return res.status(403).json({ message: 'You cannot approve your own cancel request' });

    await db.update(exchanges)
      .set({ status: 'cancelled', cancelApprovedById: req.user.id, cancelledAt: new Date(), updatedAt: new Date() })
      .where(eq(exchanges.id, exchange.id));

    res.json({ message: 'Exchange cancelled by mutual agreement. No penalties applied.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyExchanges, getExchangeById, requestPause, confirmPause, resumeExchange, requestCancel, approveCancel };
```

---

### `server/routes/exchangeRoutes.js`

```js
const express = require('express');
const router = express.Router();
const { getMyExchanges, getExchangeById, requestPause, confirmPause, resumeExchange, requestCancel, approveCancel } = require('../controllers/exchangeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMyExchanges);
router.get('/:id', protect, getExchangeById);
router.put('/:id/pause-request', protect, requestPause);
router.put('/:id/pause-confirm', protect, confirmPause);
router.put('/:id/resume', protect, resumeExchange);
router.put('/:id/cancel-request', protect, requestCancel);     // ✅ UPDATED: Step 1
router.put('/:id/cancel-approve', protect, approveCancel);     // ✅ NEW: Step 2 (mutual)

module.exports = router;
```

---

## Step 3.2 – Schedule Controller

### `server/controllers/scheduleController.js`

```js
const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/db');
const { exchanges, profiles, sessions, users } = require('../db/schema/index');
const { eq, desc } = require('drizzle-orm');
const { findOverlapSlots } = require('../utils/scheduleUtils');

const getOverlapSlots = async (req, res) => {
  try {
    const [exchange] = await db.select().from(exchanges).where(eq(exchanges.id, req.params.exchangeId));
    if (!exchange) return res.status(404).json({ message: 'Exchange not found' });

    const [profileA] = await db.select({ availability: profiles.availability }).from(profiles).where(eq(profiles.userId, exchange.userAId));
    const [profileB] = await db.select({ availability: profiles.availability }).from(profiles).where(eq(profiles.userId, exchange.userBId));

    if (!profileA || !profileB) return res.status(400).json({ message: 'Both users must set their availability' });

    const slots = findOverlapSlots(profileA.availability || [], profileB.availability || []);
    res.json({ slots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const scheduleSession = async (req, res) => {
  try {
    const { exchangeId, scheduledAt } = req.body;

    const [exchange] = await db.select().from(exchanges).where(eq(exchanges.id, exchangeId));
    if (!exchange) return res.status(404).json({ message: 'Exchange not found' });

    const isParticipant = exchange.userAId === req.user.id || exchange.userBId === req.user.id;
    if (!isParticipant) return res.status(403).json({ message: 'Not authorized' });

    const [session] = await db.insert(sessions)
      .values({
        exchangeId,
        scheduledAt: new Date(scheduledAt),
        teacherId: exchange.userAId,
        studentId: exchange.userBId,
        roomId: uuidv4(),
      })
      .returning();

    // Activate exchange if pending
    if (exchange.status === 'pending') {
      await db.update(exchanges).set({ status: 'active', updatedAt: new Date() }).where(eq(exchanges.id, exchangeId));
    }

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExchangeSessions = async (req, res) => {
  try {
    const exchangeSessions = await db
      .select()
      .from(sessions)
      .where(eq(sessions.exchangeId, req.params.exchangeId))
      .orderBy(sessions.scheduledAt);

    const enriched = await Promise.all(
      exchangeSessions.map(async (s) => {
        const [teacher] = await db.select({ id: users.id, name: users.name, avatar: users.avatar }).from(users).where(eq(users.id, s.teacherId));
        const [student] = await db.select({ id: users.id, name: users.name, avatar: users.avatar }).from(users).where(eq(users.id, s.studentId));
        return { ...s, teacher, student };
      })
    );

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOverlapSlots, scheduleSession, getExchangeSessions };
```

---

### `server/routes/scheduleRoutes.js`

```js
const express = require('express');
const router = express.Router();
const { getOverlapSlots, scheduleSession, getExchangeSessions } = require('../controllers/scheduleController');
const { protect } = require('../middleware/authMiddleware');

router.get('/overlap/:exchangeId', protect, getOverlapSlots);
router.post('/session', protect, scheduleSession);
router.get('/sessions/:exchangeId', protect, getExchangeSessions);

module.exports = router;
```

---

## ✅ NEW: History / Tracking Module

### `server/controllers/historyController.js`

```js
const { db } = require('../config/db');
const { requests, exchanges, sessions, users, bids, logs } = require('../db/schema/index');
const { eq, or, desc, and } = require('drizzle-orm');

// @route GET /api/history/requests
// Sent + received saare requests (pending/accepted/rejected/cancelled)
const getRequestHistory = async (req, res) => {
  try {
    const sent = await db
      .select({
        id: requests.id, message: requests.message, status: requests.status, createdAt: requests.createdAt,
        direction: db.sql`'sent'`,
        other: { id: users.id, name: users.name, avatar: users.avatar },
        bid: { id: bids.id, skillOffered: bids.skillOffered, skillWanted: bids.skillWanted },
      })
      .from(requests)
      .innerJoin(users, eq(requests.receiverId, users.id))
      .innerJoin(bids, eq(requests.bidId, bids.id))
      .where(eq(requests.senderId, req.user.id))
      .orderBy(desc(requests.createdAt));

    const received = await db
      .select({
        id: requests.id, message: requests.message, status: requests.status, createdAt: requests.createdAt,
        direction: db.sql`'received'`,
        other: { id: users.id, name: users.name, avatar: users.avatar },
        bid: { id: bids.id, skillOffered: bids.skillOffered, skillWanted: bids.skillWanted },
      })
      .from(requests)
      .innerJoin(users, eq(requests.senderId, users.id))
      .innerJoin(bids, eq(requests.bidId, bids.id))
      .where(eq(requests.receiverId, req.user.id))
      .orderBy(desc(requests.createdAt));

    res.json({ sent, received });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/history/sessions
// Saare completed/missed sessions
const getSessionHistory = async (req, res) => {
  try {
    const myExchanges = await db
      .select({ id: exchanges.id })
      .from(exchanges)
      .where(or(eq(exchanges.userAId, req.user.id), eq(exchanges.userBId, req.user.id)));

    const exchangeIds = myExchanges.map((e) => e.id);
    if (!exchangeIds.length) return res.json([]);

    const allSessions = [];
    for (const eid of exchangeIds) {
      const s = await db
        .select({
          id: sessions.id, scheduledAt: sessions.scheduledAt, status: sessions.status,
          startedAt: sessions.startedAt, endedAt: sessions.endedAt, duration: sessions.duration,
          roomId: sessions.roomId,
          teacher: { id: users.id, name: users.name, avatar: users.avatar },
        })
        .from(sessions)
        .innerJoin(users, eq(sessions.teacherId, users.id))
        .where(eq(sessions.exchangeId, eid))
        .orderBy(desc(sessions.scheduledAt));
      allSessions.push(...s);
    }

    res.json(allSessions.sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/history/activity
// User ke sare actions ki timeline (logs table se)
const getActivityTimeline = async (req, res) => {
  try {
    const activity = await db
      .select()
      .from(logs)
      .where(eq(logs.userId, req.user.id))
      .orderBy(desc(logs.createdAt))
      .limit(50);

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/history/summary
// Dashboard ke liye quick stats
const getHistorySummary = async (req, res) => {
  try {
    const uid = req.user.id;

    const [sentTotal] = await db
      .select({ count: db.sql`count(*)` })
      .from(requests)
      .where(eq(requests.senderId, uid));

    const [receivedTotal] = await db
      .select({ count: db.sql`count(*)` })
      .from(requests)
      .where(eq(requests.receiverId, uid));

    const [acceptedTotal] = await db
      .select({ count: db.sql`count(*)` })
      .from(requests)
      .where(and(eq(requests.receiverId, uid), eq(requests.status, 'accepted')));

    const myExchanges = await db
      .select({ id: exchanges.id })
      .from(exchanges)
      .where(or(eq(exchanges.userAId, uid), eq(exchanges.userBId, uid)));

    const exchangeIds = myExchanges.map((e) => e.id);
    let completedSessions = 0;
    let missedSessions = 0;

    for (const eid of exchangeIds) {
      const [comp] = await db
        .select({ count: db.sql`count(*)` })
        .from(sessions)
        .where(and(eq(sessions.exchangeId, eid), eq(sessions.status, 'completed')));
      const [miss] = await db
        .select({ count: db.sql`count(*)` })
        .from(sessions)
        .where(and(eq(sessions.exchangeId, eid), eq(sessions.status, 'missed')));
      completedSessions += Number(comp?.count || 0);
      missedSessions += Number(miss?.count || 0);
    }

    res.json({
      requestsSent: Number(sentTotal?.count || 0),
      requestsReceived: Number(receivedTotal?.count || 0),
      requestsAccepted: Number(acceptedTotal?.count || 0),
      activeExchanges: myExchanges.length,
      completedSessions,
      missedSessions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRequestHistory, getSessionHistory, getActivityTimeline, getHistorySummary };
```

---

### ✅ NEW: `server/routes/historyRoutes.js`

```js
const express = require('express');
const router = express.Router();
const { getRequestHistory, getSessionHistory, getActivityTimeline, getHistorySummary } = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/requests', protect, getRequestHistory);
router.get('/sessions', protect, getSessionHistory);
router.get('/activity', protect, getActivityTimeline);
router.get('/summary', protect, getHistorySummary);

module.exports = router;
```

---

## ✅ NEW: Reviews Module

### `server/controllers/reviewController.js`

```js
const { db } = require('../config/db');
const { reviews, users, profiles, exchanges } = require('../db/schema/index');
const { eq, and, avg, desc } = require('drizzle-orm');

// @route POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { revieweeId, exchangeId, sessionId, rating, comment, type } = req.body;

    if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' });

    // Duplicate check
    const [existing] = await db.select().from(reviews)
      .where(and(eq(reviews.reviewerId, req.user.id), eq(reviews.exchangeId, exchangeId)));
    if (existing) return res.status(400).json({ message: 'You already reviewed this exchange' });

    const [review] = await db.insert(reviews)
      .values({ reviewerId: req.user.id, revieweeId, exchangeId, sessionId, rating, comment, type: type || 'session' })
      .returning();

    // Update reviewee's average rating in profiles
    const userReviews = await db.select({ rating: reviews.rating }).from(reviews).where(eq(reviews.revieweeId, revieweeId));
    const avgRating = Math.round(userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length);
    await db.update(profiles).set({ rating: avgRating, updatedAt: new Date() }).where(eq(profiles.userId, revieweeId));

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/reviews/user/:userId
const getUserReviews = async (req, res) => {
  try {
    const userReviews = await db
      .select({
        id: reviews.id, rating: reviews.rating, comment: reviews.comment,
        type: reviews.type, createdAt: reviews.createdAt,
        reviewer: { id: users.id, name: users.name, avatar: users.avatar },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.reviewerId, users.id))
      .where(eq(reviews.revieweeId, req.params.userId))
      .orderBy(desc(reviews.createdAt));

    const avg = userReviews.length
      ? (userReviews.reduce((s, r) => s + r.rating, 0) / userReviews.length).toFixed(1)
      : 0;

    res.json({ reviews: userReviews, averageRating: parseFloat(avg), total: userReviews.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/reviews/exchange/:exchangeId
const getExchangeReviews = async (req, res) => {
  try {
    const exchangeReviews = await db
      .select({
        id: reviews.id, rating: reviews.rating, comment: reviews.comment, createdAt: reviews.createdAt,
        reviewer: { id: users.id, name: users.name, avatar: users.avatar },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.reviewerId, users.id))
      .where(eq(reviews.exchangeId, req.params.exchangeId))
      .orderBy(desc(reviews.createdAt));

    res.json(exchangeReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, req.params.id));
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.reviewerId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await db.delete(reviews).where(eq(reviews.id, req.params.id));
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getUserReviews, getExchangeReviews, deleteReview };
```

---

### ✅ NEW: `server/routes/reviewRoutes.js`

```js
const express = require('express');
const router = express.Router();
const { createReview, getUserReviews, getExchangeReviews, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/user/:userId', protect, getUserReviews);
router.get('/exchange/:exchangeId', protect, getExchangeReviews);
router.delete('/:id', protect, deleteReview);

module.exports = router;
```

---

## ✅ NEW: Settings Module

### `server/controllers/settingsController.js`

```js
const bcrypt = require('bcryptjs');
const { db } = require('../config/db');
const { users } = require('../db/schema/index');
const { eq } = require('drizzle-orm');

// @route GET /api/settings
const getSettings = async (req, res) => {
  try {
    const [user] = await db
      .select({ id: users.id, name: users.name, email: users.email, avatar: users.avatar, createdAt: users.createdAt })
      .from(users)
      .where(eq(users.id, req.user.id));
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/settings/name
const updateName = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Name cannot be empty' });

    const [updated] = await db.update(users)
      .set({ name: name.trim(), updatedAt: new Date() })
      .where(eq(users.id, req.user.id))
      .returning({ id: users.id, name: users.name, email: users.email });

    res.json({ message: 'Name updated', user: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/settings/password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' });

    const [user] = await db.select().from(users).where(eq(users.id, req.user.id));
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Google OAuth users ke liye password change allowed nahi
    if (user.password === 'GOOGLE_OAUTH_NO_PASSWORD') {
      return res.status(400).json({ message: 'Google accounts cannot change password here. Use Google account settings.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    await db.update(users).set({ password: hashed, updatedAt: new Date() }).where(eq(users.id, req.user.id));
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/settings/account
const deleteAccount = async (req, res) => {
  try {
    await db.delete(users).where(eq(users.id, req.user.id));
    res.json({ message: 'Account deleted permanently' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSettings, updateName, changePassword, deleteAccount };
```

---

### ✅ NEW: `server/routes/settingsRoutes.js`

```js
const express = require('express');
const router = express.Router();
const { getSettings, updateName, changePassword, deleteAccount } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getSettings);
router.put('/name', protect, updateName);
router.put('/password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

module.exports = router;
```

---

## Step 3.3 – Session Controller

### `server/controllers/sessionController.js`

```js
const { db } = require('../config/db');
const { sessions, exchanges, streaks, users } = require('../db/schema/index');
const { eq } = require('drizzle-orm');

const startSession = async (req, res) => {
  try {
    const [session] = await db.update(sessions)
      .set({ status: 'in_progress', startedAt: new Date(), updatedAt: new Date() })
      .where(eq(sessions.id, req.params.id))
      .returning();
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const endSession = async (req, res) => {
  try {
    const [session] = await db.update(sessions)
      .set({ status: 'completed', endedAt: new Date(), updatedAt: new Date() })
      .where(eq(sessions.id, req.params.id))
      .returning();

    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Update streaks
    const updateStreak = async (userId) => {
      const [streak] = await db.select().from(streaks).where(eq(streaks.userId, userId));
      if (!streak || streak.isFrozen) return;

      const today = new Date().toDateString();
      const lastDate = streak.lastSessionDate ? new Date(streak.lastSessionDate).toDateString() : null;

      if (lastDate !== today) {
        const newStreak = streak.currentStreak + 1;
        await db.update(streaks).set({
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, streak.longestStreak),
          lastSessionDate: new Date(),
          updatedAt: new Date(),
        }).where(eq(streaks.userId, userId));
      }
    };

    const [exchange] = await db.select().from(exchanges).where(eq(exchanges.id, session.exchangeId));
    if (exchange) {
      await updateStreak(exchange.userAId);
      await updateStreak(exchange.userBId);
    }

    res.json({ message: 'Session completed, streaks updated', session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSessionByRoom = async (req, res) => {
  try {
    const [session] = await db.select().from(sessions).where(eq(sessions.roomId, req.params.roomId));
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const [teacher] = await db.select({ id: users.id, name: users.name, avatar: users.avatar }).from(users).where(eq(users.id, session.teacherId));
    const [student] = await db.select({ id: users.id, name: users.name, avatar: users.avatar }).from(users).where(eq(users.id, session.studentId));

    res.json({ ...session, teacher, student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { startSession, endSession, getSessionByRoom };
```

---

### `server/routes/sessionRoutes.js`

```js
const express = require('express');
const router = express.Router();
const { startSession, endSession, getSessionByRoom } = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

router.put('/:id/start', protect, startSession);
router.put('/:id/end', protect, endSession);
router.get('/room/:roomId', protect, getSessionByRoom);

module.exports = router;
```

---

# 📅 DAY 4 – Chat System (Socket.io + Drizzle)

## Step 4.1 – Chat Controller

### `server/controllers/chatController.js`

```js
const { db } = require('../config/db');
const { conversations, conversationParticipants, messages, users } = require('../db/schema/index');
const { eq, desc, and } = require('drizzle-orm');

// @route GET /api/chat/conversations
const getConversations = async (req, res) => {
  try {
    // Get all conversations this user is part of
    const myConvParticipants = await db
      .select({ conversationId: conversationParticipants.conversationId })
      .from(conversationParticipants)
      .where(eq(conversationParticipants.userId, req.user.id));

    const convIds = myConvParticipants.map((p) => p.conversationId);
    if (convIds.length === 0) return res.json([]);

    // For each conversation, get details
    const result = await Promise.all(
      convIds.map(async (convId) => {
        const [conv] = await db.select().from(conversations).where(eq(conversations.id, convId));

        // Get all participants
        const participants = await db
          .select({ userId: conversationParticipants.userId })
          .from(conversationParticipants)
          .where(eq(conversationParticipants.conversationId, convId));

        const participantDetails = await Promise.all(
          participants.map(async (p) => {
            const [user] = await db.select({ id: users.id, name: users.name, avatar: users.avatar }).from(users).where(eq(users.id, p.userId));
            return user;
          })
        );

        // Get last message
        const [lastMsg] = await db
          .select({ id: messages.id, content: messages.content, createdAt: messages.createdAt })
          .from(messages)
          .where(eq(messages.conversationId, convId))
          .orderBy(desc(messages.createdAt))
          .limit(1);

        return { ...conv, participants: participantDetails, lastMessage: lastMsg };
      })
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/chat/:conversationId/messages
const getMessages = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const msgs = await db
      .select({
        id: messages.id, content: messages.content, isRead: messages.isRead, createdAt: messages.createdAt,
        sender: { id: users.id, name: users.name, avatar: users.avatar },
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.conversationId, req.params.conversationId))
      .orderBy(messages.createdAt)
      .limit(parseInt(limit))
      .offset(offset);

    res.json(msgs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/chat/:conversationId/messages
const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const convId = req.params.conversationId;

    // Verify participant
    const [participant] = await db.select().from(conversationParticipants)
      .where(and(eq(conversationParticipants.conversationId, convId), eq(conversationParticipants.userId, req.user.id)));

    if (!participant) return res.status(403).json({ message: 'Not a participant in this conversation' });

    const [msg] = await db.insert(messages)
      .values({ conversationId: convId, senderId: req.user.id, content })
      .returning();

    // Update conversation updatedAt
    await db.update(conversations).set({ updatedAt: new Date(), lastMessageId: msg.id }).where(eq(conversations.id, convId));

    // Get full message with sender info
    const [fullMsg] = await db
      .select({
        id: messages.id, content: messages.content, isRead: messages.isRead, createdAt: messages.createdAt,
        sender: { id: users.id, name: users.name, avatar: users.avatar },
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.id, msg.id));

    // Emit to all other participants
    const allParticipants = await db.select().from(conversationParticipants).where(eq(conversationParticipants.conversationId, convId));
    allParticipants.forEach((p) => {
      if (p.userId !== req.user.id) {
        req.io.to(p.userId).emit('new_message', { conversationId: convId, message: fullMsg });
      }
    });

    res.status(201).json(fullMsg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/chat/:conversationId/read
const markAsRead = async (req, res) => {
  try {
    // Mark all messages from others as read
    await db.update(messages)
      .set({ isRead: true })
      .where(and(eq(messages.conversationId, req.params.conversationId)));
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getConversations, getMessages, sendMessage, markAsRead };
```

---

### `server/routes/chatRoutes.js`

```js
const express = require('express');
const router = express.Router();
const { getConversations, getMessages, sendMessage, markAsRead } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/conversations', protect, getConversations);
router.get('/:conversationId/messages', protect, getMessages);
router.post('/:conversationId/messages', protect, sendMessage);
router.put('/:conversationId/read', protect, markAsRead);

module.exports = router;
```

---

## Step 4.2 – Socket Handlers

### `server/socket/socketHandler.js`

```js
const jwt = require('jsonwebtoken');
const { db } = require('../config/db');
const { users } = require('../db/schema/index');
const { eq } = require('drizzle-orm');
const chatSocket = require('./chatSocket');
const webrtcSocket = require('./webrtcSocket');

const socketHandler = (io) => {
  // Auth middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication error: No token'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const [user] = await db
        .select({ id: users.id, name: users.name, role: users.role })
        .from(users)
        .where(eq(users.id, decoded.id));
      if (!user) return next(new Error('User not found'));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Token invalid'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    socket.join(userId); // Personal room for notifications

    console.log(`🔌 Connected: ${socket.user.name}`);
    socket.broadcast.emit('user_online', { userId });

    chatSocket(io, socket);
    webrtcSocket(io, socket);

    socket.on('disconnect', () => {
      socket.broadcast.emit('user_offline', { userId });
      console.log(`🔌 Disconnected: ${socket.user.name}`);
    });
  });
};

module.exports = socketHandler;
```

---

### `server/socket/chatSocket.js`

```js
const chatSocket = (io, socket) => {
  socket.on('join_conversation', ({ conversationId }) => {
    socket.join(`conv_${conversationId}`);
  });

  socket.on('leave_conversation', ({ conversationId }) => {
    socket.leave(`conv_${conversationId}`);
  });

  socket.on('typing_start', ({ conversationId }) => {
    socket.to(`conv_${conversationId}`).emit('user_typing', {
      userId: socket.user.id,
      name: socket.user.name,
    });
  });

  socket.on('typing_stop', ({ conversationId }) => {
    socket.to(`conv_${conversationId}`).emit('user_stop_typing', {
      userId: socket.user.id,
    });
  });
};

module.exports = chatSocket;
```

---

### `server/socket/webrtcSocket.js`

```js
const webrtcSocket = (io, socket) => {
  socket.on('join_room', ({ roomId }) => {
    socket.join(`room_${roomId}`);
    socket.to(`room_${roomId}`).emit('user_joined', { userId: socket.user.id, name: socket.user.name });
  });

  socket.on('offer', ({ roomId, offer }) => {
    socket.to(`room_${roomId}`).emit('offer', { offer, fromId: socket.user.id });
  });

  socket.on('answer', ({ roomId, answer }) => {
    socket.to(`room_${roomId}`).emit('answer', { answer, fromId: socket.user.id });
  });

  socket.on('ice_candidate', ({ roomId, candidate }) => {
    socket.to(`room_${roomId}`).emit('ice_candidate', { candidate, fromId: socket.user.id });
  });

  socket.on('screen_share', ({ roomId, isSharing }) => {
    socket.to(`room_${roomId}`).emit('peer_screen_share', { userId: socket.user.id, isSharing });
  });

  socket.on('leave_room', ({ roomId }) => {
    socket.leave(`room_${roomId}`);
    socket.to(`room_${roomId}`).emit('user_left', { userId: socket.user.id });
  });
};

module.exports = webrtcSocket;
```

---

# 📅 DAY 5 – Reports & Admin Panel

## Step 5.1 – Report Controller

### `server/controllers/reportController.js`

```js
const { db } = require('../config/db');
const { reports, users } = require('../db/schema/index');
const { eq, desc } = require('drizzle-orm');

const createReport = async (req, res) => {
  try {
    const { reportedId, exchangeId, type, description } = req.body;
    const [report] = await db.insert(reports)
      .values({ reporterId: req.user.id, reportedId, exchangeId, type, description })
      .returning();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyReports = async (req, res) => {
  try {
    const myReports = await db
      .select({
        id: reports.id, type: reports.type, description: reports.description, status: reports.status, createdAt: reports.createdAt,
        reported: { id: users.id, name: users.name },
      })
      .from(reports)
      .innerJoin(users, eq(reports.reportedId, users.id))
      .where(eq(reports.reporterId, req.user.id))
      .orderBy(desc(reports.createdAt));

    res.json(myReports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReport, getMyReports };
```

---

### `server/routes/reportRoutes.js`

```js
const express = require('express');
const router = express.Router();
const { createReport, getMyReports } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReport);
router.get('/my', protect, getMyReports);

module.exports = router;
```

---

## Step 5.2 – Admin Controller

### `server/controllers/adminController.js`

```js
const { db } = require('../config/db');
const { users, reports, exchanges, bids, logs } = require('../db/schema/index');
const { eq, ilike, or, count, desc } = require('drizzle-orm');
const { sql } = require('drizzle-orm');

const getAllUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let allUsers = await db
      .select({ id: users.id, name: users.name, email: users.email, role: users.role, isBanned: users.isBanned, isVerified: users.isVerified, createdAt: users.createdAt })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(parseInt(limit))
      .offset(offset);

    if (search) {
      allUsers = allUsers.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    const [{ total }] = await db.select({ total: count() }).from(users);
    res.json({ users: allUsers, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const banUser = async (req, res) => {
  try {
    const [user] = await db.update(users)
      .set({ isBanned: true, updatedAt: new Date() })
      .where(eq(users.id, req.params.id))
      .returning({ id: users.id, name: users.name, email: users.email, isBanned: users.isBanned });

    await db.insert(logs).values({
      userId: req.user.id,
      action: 'BAN_USER',
      details: { bannedUserId: req.params.id },
    });

    res.json({ message: 'User banned', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unbanUser = async (req, res) => {
  try {
    const [user] = await db.update(users)
      .set({ isBanned: false, updatedAt: new Date() })
      .where(eq(users.id, req.params.id))
      .returning({ id: users.id, name: users.name, email: users.email, isBanned: users.isBanned });

    res.json({ message: 'User unbanned', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllReports = async (req, res) => {
  try {
    const allReports = await db
      .select({
        id: reports.id, type: reports.type, description: reports.description,
        status: reports.status, adminNote: reports.adminNote, penaltyApplied: reports.penaltyApplied, createdAt: reports.createdAt,
        reporterId: reports.reporterId, reportedId: reports.reportedId,
      })
      .from(reports)
      .orderBy(desc(reports.createdAt));

    const enriched = await Promise.all(
      allReports.map(async (r) => {
        const [reporter] = await db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(eq(users.id, r.reporterId));
        const [reported] = await db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(eq(users.id, r.reportedId));
        return { ...r, reporter, reported };
      })
    );

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resolveReport = async (req, res) => {
  try {
    const { status, adminNote, applyPenalty } = req.body;

    const [report] = await db.update(reports)
      .set({ status, adminNote, penaltyApplied: !!applyPenalty })
      .where(eq(reports.id, req.params.id))
      .returning();

    if (applyPenalty && report) {
      await db.update(users).set({ isBanned: true, updatedAt: new Date() }).where(eq(users.id, report.reportedId));
      await db.insert(logs).values({
        userId: req.user.id,
        action: 'REPORT_PENALTY_BAN',
        details: { reportId: report.id, bannedUser: report.reportedId },
      });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const [usersCount] = await db.select({ total: count() }).from(users);
    const [exchangesCount] = await db.select({ total: count() }).from(exchanges);
    const [bidsCount] = await db.select({ total: count() }).from(bids);
    const [pendingReports] = await db.select({ total: count() }).from(reports).where(eq(reports.status, 'pending'));

    res.json({
      totalUsers: usersCount.total,
      totalExchanges: exchangesCount.total,
      totalBids: bidsCount.total,
      pendingReports: pendingReports.total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, banUser, unbanUser, getAllReports, resolveReport, getStats };
```

---

### `server/routes/adminRoutes.js`

```js
const express = require('express');
const router = express.Router();
const { getAllUsers, banUser, unbanUser, getAllReports, resolveReport, getStats } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/ban', banUser);
router.put('/users/:id/unban', unbanUser);
router.get('/reports', getAllReports);
router.put('/reports/:id/resolve', resolveReport);

module.exports = router;
```

---

# 📅 DAY 6 – React Frontend (Vite + Tailwind + Redux)

## Step 6.1 – Client Setup

```bash
cd ../client
npm create vite@latest . -- --template react
npm install
npm install axios react-router-dom @reduxjs/toolkit react-redux socket.io-client react-hot-toast lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

### `client/tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#4F46E5',
        'brand-dark': '#4338CA',
        'brand-light': '#EEF2FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

---

### `client/src/index.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-slate-50 text-gray-900 font-sans antialiased;
  }
}

@layer components {
  .btn-primary {
    @apply bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-all duration-200 font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed;
  }
  .btn-secondary {
    @apply bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm;
  }
  .btn-danger {
    @apply bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 font-medium text-sm;
  }
  .card {
    @apply bg-white rounded-2xl shadow-sm border border-gray-100 p-6;
  }
  .input-field {
    @apply w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all duration-200 bg-white;
  }
  .badge {
    @apply inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full;
  }
}
```

---

### `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

### `client/src/api/axios.js`

```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ss_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ss_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
```

---

## Step 6.2 – Redux Store

### `client/src/store/index.js`

```js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bidReducer from './slices/bidSlice';
import chatReducer from './slices/chatSlice';
import exchangeReducer from './slices/exchangeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bids: bidReducer,
    chat: chatReducer,
    exchanges: exchangeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
```

---

### `client/src/store/slices/authSlice.js`

```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/verify-otp', data);
    localStorage.setItem('ss_token', res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Invalid OTP');
  }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data);
    localStorage.setItem('ss_token', res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('ss_token'),
    loading: false,
    error: null,
    registrationUserId: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('ss_token');
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { state.loading = false; state.registrationUserId = action.payload.userId; })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.token = action.payload.token; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(verifyOTP.fulfilled, (state, action) => { state.user = action.payload.user; state.token = action.payload.token; })
      .addCase(fetchMe.fulfilled, (state, action) => { state.user = action.payload; })
      .addCase(fetchMe.rejected, (state) => { state.user = null; state.token = null; localStorage.removeItem('ss_token'); });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
```

---

### `client/src/store/slices/bidSlice.js`

```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchBids = createAsyncThunk('bids/fetchAll', async (params = {}) => {
  const res = await api.get('/bids', { params });
  return res.data;
});

export const createBid = createAsyncThunk('bids/create', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/bids', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteBid = createAsyncThunk('bids/delete', async (id) => {
  await api.delete(`/bids/${id}`);
  return id;
});

const bidSlice = createSlice({
  name: 'bids',
  initialState: { bids: [], total: 0, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBids.pending, (state) => { state.loading = true; })
      .addCase(fetchBids.fulfilled, (state, action) => { state.loading = false; state.bids = action.payload.bids; state.total = action.payload.total; })
      .addCase(fetchBids.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(createBid.fulfilled, (state, action) => { state.bids.unshift(action.payload); state.total += 1; })
      .addCase(deleteBid.fulfilled, (state, action) => { state.bids = state.bids.filter((b) => b.id !== action.payload); });
  },
});

export default bidSlice.reducer;
```

---

### `client/src/store/slices/chatSlice.js`

```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchConversations = createAsyncThunk('chat/fetchConversations', async () => {
  const res = await api.get('/chat/conversations');
  return res.data;
});

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async (conversationId) => {
  const res = await api.get(`/chat/${conversationId}/messages`);
  return { conversationId, messages: res.data };
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: { conversations: [], messages: {}, activeConversation: null, loading: false },
  reducers: {
    setActiveConversation: (state, action) => { state.activeConversation = action.payload; },
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) state.messages[conversationId] = [];
      const exists = state.messages[conversationId].find((m) => m.id === message.id);
      if (!exists) state.messages[conversationId].push(message);
    },
    updateConversationLastMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (conv) conv.lastMessage = message;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.fulfilled, (state, action) => { state.conversations = action.payload; })
      .addCase(fetchMessages.fulfilled, (state, action) => { state.messages[action.payload.conversationId] = action.payload.messages; });
  },
});

export const { setActiveConversation, addMessage, updateConversationLastMessage } = chatSlice.actions;
export default chatSlice.reducer;
```

---

### `client/src/store/slices/exchangeSlice.js`

```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchExchanges = createAsyncThunk('exchanges/fetchAll', async () => {
  const res = await api.get('/exchanges');
  return res.data;
});

const exchangeSlice = createSlice({
  name: 'exchanges',
  initialState: { exchanges: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchanges.pending, (state) => { state.loading = true; })
      .addCase(fetchExchanges.fulfilled, (state, action) => { state.loading = false; state.exchanges = action.payload; })
      .addCase(fetchExchanges.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  },
});

export default exchangeSlice.reducer;
```

---

## Step 6.3 – Context Providers

### `client/src/context/AuthContext.jsx`

```jsx
import { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe, logout } from '../store/slices/authSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, token, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchMe());
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, logout: () => dispatch(logout()) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

---

### `client/src/context/SocketContext.jsx`

```jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from '../store/slices/chatSlice';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) return;

    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
    });

    newSocket.on('connect', () => console.log('🔌 Socket connected:', newSocket.id));
    newSocket.on('connect_error', (err) => console.error('Socket error:', err.message));

    newSocket.on('new_message', ({ conversationId, message }) => {
      dispatch(addMessage({ conversationId, message }));
    });

    newSocket.on('new_notification', ({ type, message: msg }) => {
      const icons = { request: '📬', exchange: '🤝', session: '📹', message: '💬' };
      toast(`${icons[type] || '🔔'} ${msg || `New ${type} notification`}`, { duration: 4000 });
    });

    newSocket.on('user_online', ({ userId }) => console.log('Online:', userId));

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [token, dispatch]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
```

---

## Step 6.4 – Common Components

### `client/src/components/common/ProtectedRoute.jsx`

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-brand font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
};

export default ProtectedRoute;
```

---

### `client/src/components/common/Navbar.jsx`

```jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, BookOpen, RefreshCw, MessageSquare, User, LogOut, ShieldCheck, Clock, Settings } from 'lucide-react'; // ✅ UPDATED

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/bids', icon: BookOpen, label: 'Bids' },
    { to: '/exchanges', icon: RefreshCw, label: 'Exchanges' },
    { to: '/chat', icon: MessageSquare, label: 'Chat' },
    { to: '/history', icon: Clock, label: 'History' },       // ✅ NEW
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
          <span className="font-bold text-gray-900 text-lg">SkillSwap</span>
        </Link>

        {user && (
          <div className="flex items-center gap-1">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(to) ? 'bg-brand-light text-brand' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} />
                <span className="hidden md:inline">{label}</span>
              </Link>
            ))}

            {user.role === 'admin' && (
              <Link to="/admin" className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/admin') ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:text-red-500'}`}>
                <ShieldCheck size={16} />
                <span className="hidden md:inline">Admin</span>
              </Link>
            )}

            <div className="w-px h-5 bg-gray-200 mx-1" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <Link to="/settings" className="p-2 text-gray-400 hover:text-brand hover:bg-brand-light rounded-lg transition-all" title="Settings">
                <Settings size={16} />
              </Link>
              <button onClick={() => { logout(); navigate('/login'); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
```

---

### `client/src/components/common/Loader.jsx`

```jsx
const Loader = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className={`${sizes[size]} border-4 border-brand/20 border-t-brand rounded-full animate-spin`} />
      {text && <p className="text-gray-400 text-sm">{text}</p>}
    </div>
  );
};

export default Loader;
```

---

# 📅 DAY 7 – All Pages + WebRTC + App Router

## Step 7.1 – WebRTC Hook

### `client/src/hooks/useWebRTC.js`

```js
import { useEffect, useRef, useState, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

const useWebRTC = (roomId) => {
  const { socket } = useSocket();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected');

  const createPeer = useCallback(() => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = ({ candidate }) => {
      if (candidate) socket?.emit('ice_candidate', { roomId, candidate });
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.onconnectionstatechange = () => {
      setConnectionState(pc.connectionState);
      setIsConnected(pc.connectionState === 'connected');
    };

    return pc;
  }, [socket, roomId]);

  const startCall = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const pc = createPeer();
      peerConnectionRef.current = pc;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      socket?.emit('join_room', { roomId });
    } catch (err) {
      console.error('Media error:', err);
      alert('Camera/mic access required. Please allow and retry.');
    }
  }, [createPeer, socket, roomId]);

  const toggleMute = useCallback(() => {
    const tracks = localStreamRef.current?.getAudioTracks();
    tracks?.forEach((t) => (t.enabled = !t.enabled));
    setIsMuted((p) => !p);
  }, []);

  const toggleVideo = useCallback(() => {
    const tracks = localStreamRef.current?.getVideoTracks();
    tracks?.forEach((t) => (t.enabled = !t.enabled));
    setIsVideoOff((p) => !p);
  }, []);

  const shareScreen = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const screenTrack = screenStream.getVideoTracks()[0];
      const sender = peerConnectionRef.current?.getSenders().find((s) => s.track?.kind === 'video');
      if (sender) await sender.replaceTrack(screenTrack);
      if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
      setIsScreenSharing(true);
      socket?.emit('screen_share', { roomId, isSharing: true });

      screenTrack.onended = async () => {
        const camTrack = localStreamRef.current?.getVideoTracks()[0];
        if (sender && camTrack) await sender.replaceTrack(camTrack);
        if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
        setIsScreenSharing(false);
        socket?.emit('screen_share', { roomId, isSharing: false });
      };
    } catch (err) {
      console.error('Screen share error:', err);
    }
  }, [socket, roomId]);

  const endCall = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    peerConnectionRef.current?.close();
    socket?.emit('leave_room', { roomId });
    setIsConnected(false);
    setConnectionState('disconnected');
  }, [socket, roomId]);

  useEffect(() => {
    if (!socket) return;

    const handleUserJoined = async () => {
      if (!peerConnectionRef.current) return;
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket.emit('offer', { roomId, offer });
    };

    const handleOffer = async ({ offer }) => {
      if (!peerConnectionRef.current) return;
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit('answer', { roomId, answer });
    };

    const handleAnswer = async ({ answer }) => {
      await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleICE = async ({ candidate }) => {
      try {
        await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
      } catch {}
    };

    const handleUserLeft = () => {
      setIsConnected(false);
      setConnectionState('disconnected');
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    };

    socket.on('user_joined', handleUserJoined);
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice_candidate', handleICE);
    socket.on('user_left', handleUserLeft);

    return () => {
      socket.off('user_joined', handleUserJoined);
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice_candidate', handleICE);
      socket.off('user_left', handleUserLeft);
    };
  }, [socket, roomId]);

  return { localVideoRef, remoteVideoRef, isConnected, isMuted, isVideoOff, isScreenSharing, connectionState, startCall, toggleMute, toggleVideo, shareScreen, endCall };
};

export default useWebRTC;
```

---

## Step 7.2 – All Pages

### `client/src/pages/LandingPage.jsx`

```jsx
import { Link } from 'react-router-dom';
import { ArrowRight, Video, MessageSquare, Zap } from 'lucide-react';

const LandingPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-slate-50">
    <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-bold">S</div>
        <span className="font-bold text-xl">SkillSwap</span>
      </div>
      <div className="flex gap-3">
        <Link to="/login" className="btn-secondary">Sign In</Link>
        <Link to="/register" className="btn-primary">Get Started</Link>
      </div>
    </nav>

    <div className="max-w-4xl mx-auto text-center px-6 py-24">
      <div className="inline-flex items-center gap-2 bg-brand-light text-brand px-4 py-2 rounded-full text-sm font-medium mb-6">
        <Zap size={14} />
        Powered by Supabase + Drizzle
      </div>
      <h1 className="text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
        Exchange Skills,<br />
        <span className="text-brand">Grow Together</span>
      </h1>
      <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
        Post what you know. Find what you want. Learn from real people in live 1-on-1 video sessions.
      </p>
      <Link to="/register" className="inline-flex items-center gap-2 bg-brand text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-brand-dark transition-all duration-200 shadow-lg shadow-brand/25">
        Start Exchanging Skills
        <ArrowRight size={20} />
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
        {[
          { icon: MessageSquare, title: 'Post a Bid', desc: 'List what you offer and what you want. Let others find you.' },
          { icon: Zap, title: 'Match & Connect', desc: 'Send requests, accept exchanges, and start chatting in real-time.' },
          { icon: Video, title: 'Live Sessions', desc: 'Teach each other via face-to-face WebRTC video sessions.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card text-center hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center mx-auto mb-4">
              <Icon size={22} className="text-brand" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default LandingPage;
```

---

### `client/src/pages/RegisterPage.jsx`

```jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) {
      toast.success('OTP sent to your email!');
      navigate('/verify-otp', { state: { userId: result.payload.userId, email: form.email } });
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-bold">S</div>
            <span className="font-bold text-xl text-gray-900">SkillSwap</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Join thousands of skill exchangers</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Your full name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" placeholder="Min. 6 characters" required />
            </div>
            {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating account...</span>
              ) : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account? <Link to="/login" className="text-brand font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
```

---

### `client/src/pages/OTPPage.jsx`

```jsx
import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { verifyOTP } from '../store/slices/authSlice';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Mail } from 'lucide-react';

const OTPPage = () => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const userId = state?.userId;
  const email = state?.email;

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const newDigits = [...digits];
    newDigits[idx] = val;
    setDigits(newDigits);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otp = digits.join('');
    if (otp.length !== 6) return toast.error('Enter all 6 digits');
    setLoading(true);
    const result = await dispatch(verifyOTP({ userId, otp }));
    setLoading(false);
    if (verifyOTP.fulfilled.match(result)) {
      toast.success('Email verified! Welcome to SkillSwap 🎉');
      navigate('/dashboard');
    } else {
      toast.error(result.payload || 'Invalid OTP');
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      await api.post('/auth/resend-otp', { userId });
      toast.success('New OTP sent to your email!');
    } catch {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light to-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="card text-center">
          <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="text-brand" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-500 text-sm mb-6">
            We sent a 6-digit code to<br /><span className="font-medium text-gray-700">{email || 'your email'}</span>
          </p>

          <div className="flex gap-2 justify-center mb-6">
            {digits.map((d, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
              />
            ))}
          </div>

          <button onClick={handleVerify} disabled={loading || digits.some((d) => !d)} className="btn-primary w-full py-3 text-base mb-4">
            {loading ? (
              <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Verifying...</span>
            ) : 'Verify Email'}
          </button>

          <button onClick={handleResend} className="text-brand text-sm hover:underline">
            Didn't receive it? Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
```

---

### `client/src/pages/LoginPage.jsx`

```jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-bold">S</div>
            <span className="font-bold text-xl text-gray-900">SkillSwap</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to continue learning</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="you@example.com" required />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-brand text-xs hover:underline">Forgot password?</Link>
              </div>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" placeholder="Your password" required />
            </div>
            {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</span>
              ) : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account? <Link to="/register" className="text-brand font-medium hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
```

---

### ✅ NEW: `client/src/pages/ForgotPasswordPage.jsx`

```jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Password reset OTP sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-bold">S</div>
            <span className="font-bold text-xl text-gray-900">SkillSwap</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your email to receive a reset OTP</p>
        </div>

        <div className="card">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="text-green-500" size={28} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">OTP Sent!</h2>
              <p className="text-gray-500 text-sm mb-6">
                Check your email at <strong>{email}</strong>. Then reset your password.
              </p>
              <Link to="/reset-password" className="btn-primary w-full block text-center py-3">
                Go to Reset Password
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="input-field" placeholder="you@example.com" required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...
                  </span>
                ) : 'Send Reset OTP'}
              </button>
            </form>
          )}
          <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-brand mt-4">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
```

---

### ✅ NEW: `client/src/pages/ResetPasswordPage.jsx`

```jsx
import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { KeyRound } from 'lucide-react';

const ResetPasswordPage = () => {
  const [form, setForm] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword)
      return toast.error('Passwords do not match');
    if (form.newPassword.length < 6)
      return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email: form.email, otp: form.otp, newPassword: form.newPassword,
      });
      toast.success('Password reset successfully! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Check your OTP.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white font-bold">S</div>
            <span className="font-bold text-xl text-gray-900">SkillSwap</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-500 text-sm mt-1">Enter the OTP from your email</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">OTP Code</label>
              <input type="text" value={form.otp} onChange={(e) => setForm({ ...form, otp: e.target.value })}
                className="input-field" placeholder="6-digit OTP" maxLength={6} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
              <input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="input-field" placeholder="Min. 6 characters" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
              <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="input-field" placeholder="Repeat new password" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Resetting...
                </span>
              ) : 'Reset Password'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            <Link to="/login" className="text-brand hover:underline">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
```

---

### ✅ NEW: `client/src/pages/OAuthCallbackPage.jsx`

> Google OAuth ke baad is page par redirect hoga — token URL mein hota hai, store karta hai

```jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';

const OAuthCallbackPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = params.get('token');
    const name = params.get('name');
    const email = params.get('email');
    const avatar = params.get('avatar');
    const role = params.get('role');

    if (token) {
      dispatch(setCredentials({ token, user: { name, email, avatar, role } }));
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login?error=oauth_failed', { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-brand font-medium">Signing you in with Google...</p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
```

---

### `client/src/pages/DashboardPage.jsx`

```jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { BookOpen, RefreshCw, MessageSquare, User, Flame, TrendingUp } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ exchanges: 0, streak: 0, sessions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [exRes, profileRes] = await Promise.all([
          api.get('/exchanges'),
          user ? api.get(`/users/${user.id}/profile`) : Promise.resolve({ data: {} }),
        ]);
        setStats({
          exchanges: exRes.data.length,
          streak: profileRes.data.streak?.currentStreak || 0,
          sessions: profileRes.data.profile?.totalSessions || 0,
        });
      } catch {}
      setLoading(false);
    };
    if (user) load();
  }, [user]);

  const quickLinks = [
    { to: '/bids', icon: BookOpen, label: 'Browse Bids', desc: 'Find skill offers that match what you want', color: 'bg-blue-50 text-blue-600' },
    { to: '/exchanges', icon: RefreshCw, label: 'My Exchanges', desc: 'Manage your active and upcoming exchanges', color: 'bg-green-50 text-green-600' },
    { to: '/chat', icon: MessageSquare, label: 'Messages', desc: 'Chat with your exchange partners', color: 'bg-purple-50 text-purple-600' },
    { to: '/profile', icon: User, label: 'My Profile', desc: 'Update your skills and availability', color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Good day, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 mt-1">Here's your skill exchange overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center">
            <RefreshCw size={22} className="text-brand" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{loading ? '—' : stats.exchanges}</div>
            <div className="text-gray-500 text-sm">Active Exchanges</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
            <Flame size={22} className="text-orange-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{loading ? '—' : stats.streak}</div>
            <div className="text-gray-500 text-sm">Day Streak 🔥</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <TrendingUp size={22} className="text-green-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{loading ? '—' : stats.sessions}</div>
            <div className="text-gray-500 text-sm">Total Sessions</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickLinks.map(({ to, icon: Icon, label, desc, color }) => (
          <Link key={to} to={to} className="card hover:shadow-md transition-all duration-200 group flex items-start gap-4">
            <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <Icon size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-brand transition-colors">{label}</h3>
              <p className="text-gray-500 text-sm mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
```

---

### `client/src/pages/ProfilePage.jsx`

```jsx
import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Save, Plus, X } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ProfilePage = () => {
  const [form, setForm] = useState({ bio: '', skillsOffered: '', skillsWanted: '', location: '' });
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api.get('/users/profile').then(({ data }) => {
      setForm({
        bio: data.bio || '',
        skillsOffered: (data.skillsOffered || []).join(', '),
        skillsWanted: (data.skillsWanted || []).join(', '),
        location: data.location || '',
      });
      setAvailability(data.availability || []);
    }).finally(() => setFetching(false));
  }, []);

  const toggleDay = (day) => {
    const exists = availability.find((a) => a.day === day);
    setAvailability(exists
      ? availability.filter((a) => a.day !== day)
      : [...availability, { day, startTime: '09:00', endTime: '17:00' }]
    );
  };

  const updateSlotTime = (day, field, value) => {
    setAvailability(availability.map((a) => a.day === day ? { ...a, [field]: value } : a));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/profile', {
        ...form,
        skillsOffered: form.skillsOffered.split(',').map((s) => s.trim()).filter(Boolean),
        skillsWanted: form.skillsWanted.split(',').map((s) => s.trim()).filter(Boolean),
        availability,
      });
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    }
    setLoading(false);
  };

  if (fetching) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-900">Basic Info</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input-field" rows={3} placeholder="Tell others about yourself..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" placeholder="City, Country" />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-900">Skills</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Skills I Offer <span className="text-gray-400">(comma-separated)</span></label>
            <input type="text" value={form.skillsOffered} onChange={(e) => setForm({ ...form, skillsOffered: e.target.value })} className="input-field" placeholder="JavaScript, Piano, Spanish cooking..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Skills I Want <span className="text-gray-400">(comma-separated)</span></label>
            <input type="text" value={form.skillsWanted} onChange={(e) => setForm({ ...form, skillsWanted: e.target.value })} className="input-field" placeholder="Python, Guitar, French..." />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-900">Weekly Availability</h2>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => {
              const selected = availability.some((a) => a.day === day);
              return (
                <button key={day} type="button" onClick={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selected ? 'bg-brand text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {day}
                </button>
              );
            })}
          </div>
          {availability.map((slot) => (
            <div key={slot.day} className="flex items-center gap-3 bg-brand-light rounded-xl px-4 py-3">
              <span className="text-sm font-semibold text-brand w-10">{slot.day}</span>
              <input type="time" value={slot.startTime} onChange={(e) => updateSlotTime(slot.day, 'startTime', e.target.value)} className="border border-brand/30 rounded-lg px-2 py-1 text-sm bg-white" />
              <span className="text-gray-400 text-sm">to</span>
              <input type="time" value={slot.endTime} onChange={(e) => updateSlotTime(slot.day, 'endTime', e.target.value)} className="border border-brand/30 rounded-lg px-2 py-1 text-sm bg-white" />
              <button type="button" onClick={() => toggleDay(slot.day)} className="ml-auto text-gray-400 hover:text-red-500"><X size={16} /></button>
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
          {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</> : <><Save size={18} /> Save Profile</>}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
```

---

### `client/src/pages/BidsPage.jsx`

```jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBids, createBid } from '../store/slices/bidSlice';
import { Search, Plus, X, ArrowLeftRight } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';

const levelColors = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700',
};

const BidCard = ({ bid, onRequest }) => (
  <div className="card hover:shadow-md transition-all duration-200 flex flex-col">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center font-bold text-sm shrink-0">
        {bid.creator?.name?.[0]?.toUpperCase() || '?'}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-gray-900 truncate">{bid.creator?.name}</p>
        <span className={`badge ${levelColors[bid.level]}`}>{bid.level}</span>
      </div>
    </div>

    <div className="flex items-center gap-2 mb-3 flex-wrap">
      <span className="badge bg-blue-50 text-blue-700">📤 {bid.skillOffered}</span>
      <ArrowLeftRight size={14} className="text-gray-400 shrink-0" />
      <span className="badge bg-purple-50 text-purple-700">📥 {bid.skillWanted}</span>
    </div>

    <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4 line-clamp-3">{bid.description}</p>

    {bid.tags?.length > 0 && (
      <div className="flex flex-wrap gap-1 mb-4">
        {bid.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">#{tag}</span>
        ))}
      </div>
    )}

    <button onClick={() => onRequest(bid)} className="btn-primary w-full text-center">
      Send Request
    </button>
  </div>
);

const BidsPage = () => {
  const dispatch = useDispatch();
  const { bids, total, loading } = useSelector((state) => state.bids);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ skillOffered: '', skillWanted: '', description: '', level: 'Beginner', tags: '' });
  const [requestTarget, setRequestTarget] = useState(null);
  const [requestMsg, setRequestMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchBids({ search, level: levelFilter }));
  }, [search, levelFilter, dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await dispatch(createBid({
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    }));
    setSubmitting(false);
    if (createBid.fulfilled.match(result)) {
      toast.success('Bid posted successfully!');
      setShowCreate(false);
      setForm({ skillOffered: '', skillWanted: '', description: '', level: 'Beginner', tags: '' });
    } else {
      toast.error(result.payload || 'Failed to create bid');
    }
  };

  const handleSendRequest = async () => {
    if (!requestTarget) return;
    setSubmitting(true);
    try {
      await api.post('/requests', { bidId: requestTarget.id, receiverId: requestTarget.creator?.id, message: requestMsg });
      toast.success('Request sent!');
      setRequestTarget(null);
      setRequestMsg('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skill Bids</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} bids available</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Post a Bid
        </button>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by skill..." className="input-field pl-9" />
        </div>
        <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="input-field w-44">
          <option value="">All Levels</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>

      {loading ? <Loader text="Loading bids..." /> : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bids.map((bid) => <BidCard key={bid.id} bid={bid} onRequest={setRequestTarget} />)}
          </div>
          {bids.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No bids found</p>
              <p className="text-gray-400 text-sm mt-1">Try a different search or post your own bid!</p>
            </div>
          )}
        </>
      )}

      {/* Create Bid Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Post a Bid</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <input type="text" placeholder="Skill you offer (e.g. JavaScript)" value={form.skillOffered} onChange={(e) => setForm({ ...form, skillOffered: e.target.value })} className="input-field" required />
              <input type="text" placeholder="Skill you want (e.g. Guitar)" value={form.skillWanted} onChange={(e) => setForm({ ...form, skillWanted: e.target.value })} className="input-field" required />
              <textarea placeholder="Describe the exchange..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={3} required />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="input-field">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
                <input type="text" placeholder="Tags (comma-separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input-field" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? 'Posting...' : 'Post Bid'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Request Modal */}
      {requestTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Send Exchange Request</h2>
              <button onClick={() => setRequestTarget(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="bg-brand-light rounded-xl p-3 mb-4">
              <p className="text-sm text-gray-600">Requesting exchange with <strong>{requestTarget.creator?.name}</strong></p>
              <div className="flex items-center gap-2 mt-1 text-sm">
                <span className="badge bg-blue-100 text-blue-700">{requestTarget.skillOffered}</span>
                <ArrowLeftRight size={12} className="text-gray-400" />
                <span className="badge bg-purple-100 text-purple-700">{requestTarget.skillWanted}</span>
              </div>
            </div>
            <textarea placeholder="Add a message (optional)..." value={requestMsg} onChange={(e) => setRequestMsg(e.target.value)} className="input-field mb-4" rows={3} />
            <div className="flex gap-2">
              <button onClick={() => setRequestTarget(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSendRequest} disabled={submitting} className="btn-primary flex-1">
                {submitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidsPage;
```

---

### `client/src/pages/ExchangesPage.jsx`

```jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExchanges } from '../store/slices/exchangeSlice';
import { Link } from 'react-router-dom';
import Loader from '../components/common/Loader';
import api from '../api/axios';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  active: 'bg-green-100 text-green-700',
  paused: 'bg-blue-100 text-blue-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
};

const ExchangesPage = () => {
  const dispatch = useDispatch();
  const { exchanges, loading } = useSelector((state) => state.exchanges);

  useEffect(() => { dispatch(fetchExchanges()); }, [dispatch]);

  const handleAcceptRequest = async (requestId) => {
    try {
      await api.put(`/requests/${requestId}/accept`);
      toast.success('Request accepted! Exchange created.');
      dispatch(fetchExchanges());
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Exchanges</h1>
        <Link to="/bids" className="btn-secondary text-sm">+ Browse Bids</Link>
      </div>

      {loading ? <Loader text="Loading exchanges..." /> : (
        <div className="space-y-3">
          {exchanges.map((ex) => (
            <div key={ex.id} className="card flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-brand text-white flex items-center justify-center font-bold shrink-0">
                  {ex.partner?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{ex.partner?.name}</p>
                  <p className="text-sm text-gray-500 truncate">{ex.bid?.skillOffered} ↔ {ex.bid?.skillWanted}</p>
                  <p className="text-xs text-gray-400">{new Date(ex.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`badge ${statusColors[ex.status] || 'bg-gray-100 text-gray-600'}`}>{ex.status}</span>
                <Link to={`/exchanges/${ex.id}`} className="btn-secondary text-xs">View →</Link>
              </div>
            </div>
          ))}
          {exchanges.length === 0 && (
            <div className="card text-center py-16">
              <p className="text-gray-400 text-lg">No exchanges yet</p>
              <p className="text-gray-400 text-sm mt-1">Browse bids and send a request to get started!</p>
              <Link to="/bids" className="btn-primary inline-block mt-4 text-sm">Browse Bids</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExchangesPage;
```

---

### `client/src/pages/ChatPage.jsx`

```jsx
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations, fetchMessages, setActiveConversation, addMessage } from '../store/slices/chatSlice';
import { useSocket } from '../context/SocketContext';
import api from '../api/axios';
import { Send, MessageSquare } from 'lucide-react';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { conversations, messages, activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const { socket } = useSocket();
  const [input, setInput] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const typingRef = useRef(null);

  useEffect(() => { dispatch(fetchConversations()); }, [dispatch]);

  useEffect(() => {
    if (!activeConversation) return;
    dispatch(fetchMessages(activeConversation));
    socket?.emit('join_conversation', { conversationId: activeConversation });
    api.put(`/chat/${activeConversation}/read`);
  }, [activeConversation, socket, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConversation]);

  useEffect(() => {
    if (!socket) return;
    socket.on('user_typing', ({ name }) => setTypingUsers((p) => p.includes(name) ? p : [...p, name]));
    socket.on('user_stop_typing', ({ userId }) => setTypingUsers((p) => p.filter((_, i) => i !== 0)));
    return () => { socket.off('user_typing'); socket.off('user_stop_typing'); };
  }, [socket]);

  const handleSend = async () => {
    if (!input.trim() || !activeConversation || sending) return;
    const msg = input.trim();
    setInput('');
    setSending(true);
    try {
      const { data } = await api.post(`/chat/${activeConversation}/messages`, { content: msg });
      dispatch(addMessage({ conversationId: activeConversation, message: data }));
      socket?.emit('typing_stop', { conversationId: activeConversation });
    } catch {
      setInput(msg);
    }
    setSending(false);
  };

  const handleTyping = (val) => {
    setInput(val);
    socket?.emit('typing_start', { conversationId: activeConversation });
    clearTimeout(typingRef.current);
    typingRef.current = setTimeout(() => socket?.emit('typing_stop', { conversationId: activeConversation }), 1500);
  };

  const activeMessages = messages[activeConversation] || [];
  const activeConvData = conversations.find((c) => c.id === activeConversation);
  const partner = activeConvData?.participants?.find((p) => p.id !== user?.id);

  return (
    <div className="max-w-5xl mx-auto p-4 h-[calc(100vh-72px)] flex gap-4">
      {/* Conversation Sidebar */}
      <div className="w-72 bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 flex items-center gap-2"><MessageSquare size={18} className="text-brand" /> Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 && (
            <p className="text-center text-gray-400 text-sm p-6">No conversations yet.<br />Start an exchange to chat!</p>
          )}
          {conversations.map((conv) => {
            const other = conv.participants?.find((p) => p.id !== user?.id);
            const isActive = activeConversation === conv.id;
            return (
              <div key={conv.id} onClick={() => dispatch(setActiveConversation(conv.id))}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 ${isActive ? 'bg-brand-light border-r-2 border-brand' : ''}`}>
                <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {other?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0">
                  <p className={`font-medium truncate text-sm ${isActive ? 'text-brand' : 'text-gray-900'}`}>{other?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-400 truncate">{conv.lastMessage?.content || 'No messages yet'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      {activeConversation ? (
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center font-bold text-sm">
              {partner?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{partner?.name}</p>
              {typingUsers.length > 0 && <p className="text-xs text-brand italic">typing...</p>}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeMessages.map((msg) => {
              const isMe = msg.sender?.id === user?.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {!isMe && (
                    <div className="w-7 h-7 rounded-lg bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold mr-2 shrink-0 mt-1">
                      {msg.sender?.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-brand text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-100 flex gap-2">
            <input
              value={input}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Type a message..."
              className="input-field flex-1"
            />
            <button onClick={handleSend} disabled={!input.trim() || sending} className="btn-primary px-4 aspect-square rounded-xl">
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <MessageSquare size={28} className="text-gray-400" />
          </div>
          <p className="font-semibold text-gray-500">Select a conversation</p>
          <p className="text-gray-400 text-sm mt-1">Choose from the left to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
```

---

### `client/src/pages/SessionPage.jsx`

```jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useWebRTC from '../hooks/useWebRTC';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, Wifi, WifiOff } from 'lucide-react';

const SessionPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const {
    localVideoRef, remoteVideoRef, isConnected, isMuted, isVideoOff,
    isScreenSharing, connectionState, startCall, toggleMute, toggleVideo, shareScreen, endCall,
  } = useWebRTC(roomId);

  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await api.get(`/sessions/room/${roomId}`);
        setSession(data);
        setSessionId(data.id);
        await api.put(`/sessions/${data.id}/start`);
        await startCall();
      } catch {
        toast.error('Session not found');
        navigate('/exchanges');
      }
    };
    init();
    return () => endCall();
  }, [roomId]);

  const handleEnd = async () => {
    endCall();
    if (sessionId) {
      await api.put(`/sessions/${sessionId}/end`).catch(() => {});
    }
    toast.success('Session ended!');
    navigate('/exchanges');
  };

  const connectionColors = {
    connected: 'text-green-400', connecting: 'text-yellow-400', disconnected: 'text-red-400',
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="px-6 py-3 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center text-white text-xs font-bold">S</div>
          <span className="text-white font-medium text-sm">SkillSwap Session</span>
        </div>
        <div className={`flex items-center gap-1.5 text-xs ${connectionColors[connectionState] || 'text-gray-400'}`}>
          {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span className="capitalize">{connectionState}</span>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
        {/* Remote Video */}
        <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          {!isConnected && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-gray-400 text-sm">Waiting for partner to join...</p>
            </div>
          )}
          <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm">
            {session?.teacher?.name || 'Partner'}
          </div>
        </div>

        {/* Local Video */}
        <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
          {isVideoOff && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <VideoOff size={32} className="text-gray-500" />
            </div>
          )}
          <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm">
            You {isVideoOff ? '(Camera Off)' : ''} {isMuted ? '(Muted)' : ''}
          </div>
          {isScreenSharing && (
            <div className="absolute top-3 right-3 bg-brand text-white text-xs px-2 py-1 rounded-lg">Sharing Screen</div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="py-5 flex justify-center items-center gap-3 border-t border-gray-800">
        <button onClick={toggleMute}
          className={`p-4 rounded-2xl transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
          title={isMuted ? 'Unmute' : 'Mute'}>
          {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
        </button>

        <button onClick={toggleVideo}
          className={`p-4 rounded-2xl transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
          title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}>
          {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
        </button>

        <button onClick={shareScreen}
          className={`p-4 rounded-2xl transition-all ${isScreenSharing ? 'bg-brand text-white' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
          title="Share Screen">
          <Monitor size={22} />
        </button>

        <div className="w-px h-10 bg-gray-700" />

        <button onClick={handleEnd} className="px-6 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all flex items-center gap-2 font-medium">
          <PhoneOff size={20} /> End Session
        </button>
      </div>
    </div>
  );
};

export default SessionPage;
```

---

### `client/src/pages/ReportsPage.jsx`

```jsx
import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Flag } from 'lucide-react';

const statusColors = { pending: 'bg-yellow-100 text-yellow-700', resolved: 'bg-green-100 text-green-700', dismissed: 'bg-gray-100 text-gray-600' };

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({ reportedId: '', type: 'no_show', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { api.get('/reports/my').then(({ data }) => setReports(data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/reports', form);
      toast.success('Report submitted successfully');
      setForm({ reportedId: '', type: 'no_show', description: '' });
      const { data } = await api.get('/reports/my');
      setReports(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <div className="card mb-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Flag size={18} className="text-red-500" /> File a Report</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">User ID to Report</label>
            <input type="text" value={form.reportedId} onChange={(e) => setForm({ ...form, reportedId: e.target.value })} className="input-field" placeholder="Paste the User ID" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Report Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
              <option value="no_show">No Show</option>
              <option value="misconduct">Misconduct</option>
              <option value="technical">Technical Issue</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={4} placeholder="Describe the issue in detail..." required />
          </div>
          <button type="submit" disabled={submitting} className="btn-danger w-full py-3">
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>

      <h2 className="font-semibold text-gray-900 mb-4">My Reports</h2>
      <div className="space-y-3">
        {reports.map((r) => (
          <div key={r.id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-gray-900">Against: {r.reported?.name}</p>
                <p className="text-sm text-gray-500 capitalize mt-0.5">{r.type.replace('_', ' ')}</p>
                <p className="text-sm text-gray-600 mt-2">{r.description}</p>
              </div>
              <span className={`badge ${statusColors[r.status] || 'bg-gray-100 text-gray-600'}`}>{r.status}</span>
            </div>
          </div>
        ))}
        {reports.length === 0 && <p className="text-center text-gray-400 py-8">No reports filed yet</p>}
      </div>
    </div>
  );
};

export default ReportsPage;
```

---

### ✅ NEW: `client/src/pages/BidDetailsPage.jsx`

```jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Star, Send, Layers } from 'lucide-react';
import Loader from '../components/common/Loader';

const BidDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [bid, setBid] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [bidRes, reviewRes] = await Promise.all([
          api.get(`/bids/${id}`),
          api.get(`/reviews/user/${bid?.creator?.id || ''}`).catch(() => ({ data: { reviews: [] } })),
        ]);
        setBid(bidRes.data);
        if (bidRes.data?.creator?.id) {
          const rr = await api.get(`/reviews/user/${bidRes.data.creator.id}`).catch(() => ({ data: { reviews: [], averageRating: 0 } }));
          setReviews(rr.data);
        }
      } catch {
        toast.error('Bid not found');
        navigate('/bids');
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const sendRequest = async () => {
    if (!message.trim()) return toast.error('Please write a message');
    setSending(true);
    try {
      await api.post('/requests', { bidId: bid.id, receiverId: bid.creator.id, message });
      toast.success('Request sent!');
      navigate('/bids');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    }
    setSending(false);
  };

  if (loading) return <div className="p-6"><Loader text="Loading bid details..." /></div>;
  if (!bid) return null;

  const isOwner = user?.id === bid.creator?.id;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button onClick={() => navigate('/bids')} className="flex items-center gap-1.5 text-gray-500 hover:text-brand text-sm mb-6">
        <ArrowLeft size={16} /> Back to Bids
      </button>

      <div className="card mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="badge-blue">{bid.skillOffered}</span>
              <span className="text-gray-400 text-sm">↔</span>
              <span className="badge-green">{bid.skillWanted}</span>
              <span className="badge">{bid.level}</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{bid.description}</p>
          </div>
          {bid.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {bid.tags.map((t) => <span key={t} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">{t}</span>)}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold">
            {bid.creator?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{bid.creator?.name}</p>
            <p className="text-xs text-gray-400">{bid.creator?.email}</p>
          </div>
          {reviews.averageRating > 0 && (
            <div className="ml-auto flex items-center gap-1 text-amber-500">
              <Star size={14} fill="currentColor" />
              <span className="text-sm font-medium">{reviews.averageRating}</span>
              <span className="text-xs text-gray-400">({reviews.total})</span>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {reviews.reviews?.length > 0 && (
        <div className="card mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Star size={16} className="text-amber-400" /> Reviews</h3>
          <div className="space-y-3">
            {reviews.reviews.slice(0, 3).map((r) => (
              <div key={r.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                  {r.reviewer?.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-800">{r.reviewer?.name}</span>
                    <div className="flex">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={12} className={s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Send Request */}
      {!isOwner && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Send size={16} className="text-brand" /> Send Exchange Request</h3>
          <textarea
            value={message} onChange={(e) => setMessage(e.target.value)}
            className="input-field resize-none" rows={4}
            placeholder="Introduce yourself and explain why you want this exchange..."
          />
          <button onClick={sendRequest} disabled={sending} className="btn-primary mt-3 w-full py-3">
            {sending ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      )}
      {isOwner && (
        <div className="card bg-blue-50 border border-blue-100 text-center py-4">
          <Layers size={24} className="text-brand mx-auto mb-2" />
          <p className="text-sm text-brand font-medium">This is your own bid</p>
        </div>
      )}
    </div>
  );
};

export default BidDetailsPage;
```

---

### ✅ NEW: `client/src/pages/HistoryPage.jsx`

```jsx
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Clock, Send, Inbox, Video, Activity, CheckCircle, XCircle } from 'lucide-react';
import Loader from '../components/common/Loader';

const tabs = ['Summary', 'Requests', 'Sessions', 'Activity'];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600',
  completed: 'bg-blue-100 text-blue-700',
  missed: 'bg-red-100 text-red-700',
};

const HistoryPage = () => {
  const [tab, setTab] = useState('Summary');
  const [summary, setSummary] = useState(null);
  const [requests, setRequests] = useState({ sent: [], received: [] });
  const [sessions, setSessions] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async (t) => {
    setLoading(true);
    try {
      if (t === 'Summary' && !summary) {
        const r = await api.get('/history/summary');
        setSummary(r.data);
      } else if (t === 'Requests' && !requests.sent.length && !requests.received.length) {
        const r = await api.get('/history/requests');
        setRequests(r.data);
      } else if (t === 'Sessions' && !sessions.length) {
        const r = await api.get('/history/sessions');
        setSessions(r.data);
      } else if (t === 'Activity' && !activity.length) {
        const r = await api.get('/history/activity');
        setActivity(r.data);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(tab); }, [tab]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Clock size={24} className="text-brand" /> History & Tracking
      </h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-white text-brand shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {loading && <Loader />}

      {/* Summary */}
      {tab === 'Summary' && summary && !loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Requests Sent', value: summary.requestsSent, icon: Send, color: 'text-blue-500 bg-blue-50' },
            { label: 'Requests Received', value: summary.requestsReceived, icon: Inbox, color: 'text-purple-500 bg-purple-50' },
            { label: 'Accepted', value: summary.requestsAccepted, icon: CheckCircle, color: 'text-green-500 bg-green-50' },
            { label: 'Active Exchanges', value: summary.activeExchanges, icon: Activity, color: 'text-brand bg-brand-light' },
            { label: 'Sessions Done', value: summary.completedSessions, icon: Video, color: 'text-teal-500 bg-teal-50' },
            { label: 'Missed Sessions', value: summary.missedSessions, icon: XCircle, color: 'text-red-500 bg-red-50' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Requests */}
      {tab === 'Requests' && !loading && (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Send size={16} /> Sent Requests ({requests.sent.length})</h3>
            <div className="space-y-2">
              {requests.sent.length === 0 && <p className="text-gray-400 text-sm">No sent requests yet.</p>}
              {requests.sent.map((r) => (
                <div key={r.id} className="card flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">To: {r.other?.name}</p>
                    <p className="text-xs text-gray-500">{r.bid?.skillOffered} ↔ {r.bid?.skillWanted}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`badge text-xs ${statusColors[r.status]}`}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Inbox size={16} /> Received Requests ({requests.received.length})</h3>
            <div className="space-y-2">
              {requests.received.length === 0 && <p className="text-gray-400 text-sm">No received requests yet.</p>}
              {requests.received.map((r) => (
                <div key={r.id} className="card flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">From: {r.other?.name}</p>
                    <p className="text-xs text-gray-500">{r.bid?.skillOffered} ↔ {r.bid?.skillWanted}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`badge text-xs ${statusColors[r.status]}`}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sessions */}
      {tab === 'Sessions' && !loading && (
        <div className="space-y-3">
          {sessions.length === 0 && <p className="text-gray-400 text-sm">No session history yet.</p>}
          {sessions.map((s) => (
            <div key={s.id} className="card flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-800">{s.teacher?.name} (Teacher)</p>
                <p className="text-xs text-gray-500">Scheduled: {new Date(s.scheduledAt).toLocaleString()}</p>
                {s.endedAt && <p className="text-xs text-gray-400">Ended: {new Date(s.endedAt).toLocaleString()}</p>}
              </div>
              <span className={`badge text-xs ${statusColors[s.status]}`}>{s.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Activity */}
      {tab === 'Activity' && !loading && (
        <div className="space-y-2">
          {activity.length === 0 && <p className="text-gray-400 text-sm">No activity recorded yet.</p>}
          {activity.map((a) => (
            <div key={a.id} className="flex items-start gap-3 py-2 border-b border-gray-50">
              <div className="w-2 h-2 bg-brand rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700">{a.action}</p>
                <p className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
```

---

### ✅ NEW: `client/src/pages/SettingsPage.jsx`

```jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Settings, User, Lock, Trash2, AlertTriangle } from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loadingName, setLoadingName] = useState(false);
  const [loadingPwd, setLoadingPwd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const updateName = async (e) => {
    e.preventDefault();
    setLoadingName(true);
    try {
      await api.put('/settings/name', { name });
      toast.success('Name updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update name');
    }
    setLoadingName(false);
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword)
      return toast.error('New passwords do not match');
    setLoadingPwd(true);
    try {
      await api.put('/settings/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
    setLoadingPwd(false);
  };

  const deleteAccount = async () => {
    try {
      await api.delete('/settings/account');
      dispatch(logout());
      navigate('/');
      toast.success('Account deleted');
    } catch {
      toast.error('Failed to delete account');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Settings size={24} className="text-brand" /> Settings
      </h1>

      {/* Update Name */}
      <div className="card mb-6">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><User size={16} /> Update Name</h2>
        <form onSubmit={updateName} className="flex gap-3">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="input-field flex-1" placeholder="Your name" required />
          <button type="submit" disabled={loadingName} className="btn-primary px-6">
            {loadingName ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="card mb-6">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Lock size={16} /> Change Password</h2>
        {user?.googleId ? (
          <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
            Google account se login ho — password Google account settings se change karo.
          </p>
        ) : (
          <form onSubmit={changePassword} className="space-y-3">
            <input type="password" value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              className="input-field" placeholder="Current password" required />
            <input type="password" value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="input-field" placeholder="New password (min. 6 chars)" required />
            <input type="password" value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              className="input-field" placeholder="Confirm new password" required />
            <button type="submit" disabled={loadingPwd} className="btn-primary w-full py-2.5">
              {loadingPwd ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        )}
      </div>

      {/* Danger Zone */}
      <div className="card border border-red-100">
        <h2 className="font-semibold text-red-600 mb-4 flex items-center gap-2"><AlertTriangle size={16} /> Danger Zone</h2>
        {!showDelete ? (
          <button onClick={() => setShowDelete(true)} className="btn-danger flex items-center gap-2 text-sm">
            <Trash2 size={14} /> Delete My Account
          </button>
        ) : (
          <div className="bg-red-50 rounded-xl p-4">
            <p className="text-sm text-red-700 mb-4 font-medium">
              ⚠️ Are you sure? This action is permanent and cannot be undone. All your data will be deleted.
            </p>
            <div className="flex gap-3">
              <button onClick={deleteAccount} className="btn-danger text-sm">Yes, Delete Account</button>
              <button onClick={() => setShowDelete(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
```

---

### `client/src/pages/SchedulePage.jsx`

```jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Calendar, Clock } from 'lucide-react';

const SchedulePage = () => {
  const { exchangeId } = useParams();
  const [slots, setSlots] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/schedule/overlap/${exchangeId}`).then(({ data }) => setSlots(data.slots || []));
    api.get(`/schedule/sessions/${exchangeId}`).then(({ data }) => setSessions(data));
  }, [exchangeId]);

  const scheduleSession = async (scheduledAt) => {
    setLoading(true);
    try {
      await api.post('/schedule/session', { exchangeId, scheduledAt });
      toast.success('Session scheduled!');
      const { data } = await api.get(`/schedule/sessions/${exchangeId}`);
      setSessions(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule');
    }
    setLoading(false);
  };

  const handleCustomSchedule = () => {
    if (!customDate || !customTime) return toast.error('Select date and time');
    const scheduledAt = new Date(`${customDate}T${customTime}`).toISOString();
    scheduleSession(scheduledAt);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Schedule a Session</h1>

      {slots.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Clock size={18} className="text-brand" /> Overlapping Availability Slots</h2>
          <div className="space-y-2">
            {slots.map((slot, idx) => (
              <div key={idx} className="flex items-center justify-between bg-brand-light rounded-xl p-3">
                <div>
                  <span className="font-medium text-brand">{slot.day}</span>
                  <span className="text-gray-600 text-sm ml-3">{slot.startTime} – {slot.endTime}</span>
                </div>
                <button
                  onClick={() => {
                    const next = new Date();
                    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                    const targetDay = days.indexOf(slot.day);
                    while (next.getDay() !== targetDay) next.setDate(next.getDate() + 1);
                    const [h, m] = slot.startTime.split(':');
                    next.setHours(h, m, 0);
                    scheduleSession(next.toISOString());
                  }}
                  disabled={loading}
                  className="btn-primary text-xs">
                  Schedule
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card mb-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Calendar size={18} className="text-brand" /> Custom Date & Time</h2>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
            <input type="date" value={customDate} onChange={(e) => setCustomDate(e.target.value)} className="input-field" min={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Time</label>
            <input type="time" value={customTime} onChange={(e) => setCustomTime(e.target.value)} className="input-field" />
          </div>
          <button onClick={handleCustomSchedule} disabled={loading} className="btn-primary">Schedule</button>
        </div>
      </div>

      {sessions.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Scheduled Sessions</h2>
          <div className="space-y-3">
            {sessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <div>
                  <p className="font-medium text-sm">{new Date(s.scheduledAt).toLocaleString()}</p>
                  <p className="text-xs text-gray-500 capitalize">Status: {s.status}</p>
                </div>
                {s.status === 'scheduled' && (
                  <a href={`/session/${s.roomId}`} className="btn-primary text-xs">Join</a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
```

---

### `client/src/pages/admin/AdminDashboard.jsx`

```jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Users, RefreshCw, BookOpen, Flag } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data)).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500 bg-blue-50' },
    { label: 'Exchanges', value: stats.totalExchanges, icon: RefreshCw, color: 'text-green-500 bg-green-50' },
    { label: 'Total Bids', value: stats.totalBids, icon: BookOpen, color: 'text-purple-500 bg-purple-50' },
    { label: 'Pending Reports', value: stats.pendingReports, icon: Flag, color: 'text-red-500 bg-red-50' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Platform overview and moderation</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{loading ? '—' : value}</div>
              <div className="text-gray-500 text-xs">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/admin/users" className="card hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users size={20} className="text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-brand transition-colors">Manage Users</h3>
              <p className="text-gray-400 text-sm">View, search, ban or unban users</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/reports" className="card hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flag size={20} className="text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-brand transition-colors">Review Reports</h3>
              <p className="text-gray-400 text-sm">Handle misconduct and violations</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
```

---

### `client/src/pages/admin/AdminUsers.jsx`

```jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Search, ShieldOff, ShieldCheck } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/admin/users', { params: { search } });
    setUsers(data.users || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => { load(); }, [search]);

  const handleBan = async (id) => {
    await api.put(`/admin/users/${id}/ban`);
    toast.success('User banned');
    load();
  };

  const handleUnban = async (id) => {
    await api.put(`/admin/users/${id}/unban`);
    toast.success('User unbanned');
    load();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Users <span className="text-gray-400 text-base font-normal">({total})</span></h1>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="input-field pl-9" />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${u.isBanned ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{u.isBanned ? 'Banned' : 'Active'}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {u.role !== 'admin' && (
                      u.isBanned
                        ? <button onClick={() => handleUnban(u.id)} className="text-green-600 hover:text-green-700 flex items-center gap-1 text-xs font-medium"><ShieldCheck size={14} /> Unban</button>
                        : <button onClick={() => handleBan(u.id)} className="text-red-500 hover:text-red-600 flex items-center gap-1 text-xs font-medium"><ShieldOff size={14} /> Ban</button>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && users.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
```

---

### `client/src/pages/admin/AdminReports.jsx`

```jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/admin/reports');
    setReports(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const resolve = async (id, status, applyPenalty = false) => {
    await api.put(`/admin/reports/${id}/resolve`, { status, adminNote: 'Reviewed by admin', applyPenalty });
    toast.success(`Report ${status}${applyPenalty ? ' — User banned' : ''}`);
    load();
  };

  const typeColors = { no_show: 'bg-orange-100 text-orange-700', misconduct: 'bg-red-100 text-red-700', technical: 'bg-blue-100 text-blue-700' };
  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', resolved: 'bg-green-100 text-green-700', dismissed: 'bg-gray-100 text-gray-600' };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Review Reports</h1>
      {loading ? <p className="text-center text-gray-400 py-12">Loading...</p> : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div key={r.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`badge ${typeColors[r.type]}`}>{r.type.replace('_', ' ')}</span>
                    <span className={`badge ${statusColors[r.status]}`}>{r.status}</span>
                    {r.penaltyApplied && <span className="badge bg-red-100 text-red-700">⚠ Penalty Applied</span>}
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    <span className="text-brand">{r.reporter?.name}</span> reported <span className="text-red-600">{r.reported?.name}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-2">{r.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleString()}</p>
                </div>
              </div>
              {r.status === 'pending' && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button onClick={() => resolve(r.id, 'dismissed')} className="btn-secondary text-xs">Dismiss</button>
                  <button onClick={() => resolve(r.id, 'resolved')} className="btn-primary text-xs">Resolve</button>
                  <button onClick={() => resolve(r.id, 'resolved', true)} className="btn-danger text-xs">Resolve + Ban User</button>
                </div>
              )}
              {r.adminNote && r.status !== 'pending' && (
                <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">Admin note: {r.adminNote}</p>
              )}
            </div>
          ))}
          {reports.length === 0 && <div className="card text-center py-12 text-gray-400">No reports to review 🎉</div>}
        </div>
      )}
    </div>
  );
};

export default AdminReports;
```

---

## Step 7.3 – Main App Router

### `client/src/App.jsx`

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OTPPage from './pages/OTPPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';     // ✅ NEW
import ResetPasswordPage from './pages/ResetPasswordPage';       // ✅ NEW
import OAuthCallbackPage from './pages/OAuthCallbackPage';       // ✅ NEW
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import BidsPage from './pages/BidsPage';
import BidDetailsPage from './pages/BidDetailsPage';             // ✅ NEW
import ExchangesPage from './pages/ExchangesPage';
import SchedulePage from './pages/SchedulePage';
import ChatPage from './pages/ChatPage';
import SessionPage from './pages/SessionPage';
import HistoryPage from './pages/HistoryPage';                   // ✅ NEW
import SettingsPage from './pages/SettingsPage';                 // ✅ NEW
import ReportsPage from './pages/ReportsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReports from './pages/admin/AdminReports';

const Layout = ({ children }) => (
  <div className="min-h-screen bg-slate-50">
    <Navbar />
    <main>{children}</main>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: { borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
              }}
            />
            <Routes>
              {/* Public */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-otp" element={<OTPPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />    {/* ✅ NEW */}
              <Route path="/reset-password" element={<ResetPasswordPage />} />      {/* ✅ NEW */}
              <Route path="/oauth-callback" element={<OAuthCallbackPage />} />      {/* ✅ NEW */}

              {/* Protected User */}
              <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} />
              <Route path="/bids" element={<ProtectedRoute><Layout><BidsPage /></Layout></ProtectedRoute>} />
              <Route path="/bids/:id" element={<ProtectedRoute><Layout><BidDetailsPage /></Layout></ProtectedRoute>} />  {/* ✅ NEW */}
              <Route path="/exchanges" element={<ProtectedRoute><Layout><ExchangesPage /></Layout></ProtectedRoute>} />
              <Route path="/exchanges/:exchangeId/schedule" element={<ProtectedRoute><Layout><SchedulePage /></Layout></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><Layout><ChatPage /></Layout></ProtectedRoute>} />
              <Route path="/session/:roomId" element={<ProtectedRoute><SessionPage /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><Layout><HistoryPage /></Layout></ProtectedRoute>} />      {/* ✅ NEW */}
              <Route path="/settings" element={<ProtectedRoute><Layout><SettingsPage /></Layout></ProtectedRoute>} />    {/* ✅ NEW */}
              <Route path="/reports" element={<ProtectedRoute><Layout><ReportsPage /></Layout></ProtectedRoute>} />

              {/* Admin */}
              <Route path="/admin" element={<ProtectedRoute adminOnly><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute adminOnly><Layout><AdminUsers /></Layout></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute adminOnly><Layout><AdminReports /></Layout></ProtectedRoute>} />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
```

---

### `client/src/main.jsx`

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

---

# 🚀 Final – Sab Kuch Ek Saath Chalao

## Terminal Commands (3 alag terminals mein)

```bash
# Terminal 1 – Backend
cd skillswap/server
npm run db:generate   # Drizzle migration files banao
npm run db:migrate    # Supabase par tables create karo
npm run dev           # Server start

# Terminal 2 – Frontend
cd skillswap/client
npm run dev           # React app start

# Optional: Drizzle Studio (visual DB browser)
cd skillswap/server
npm run db:studio     # https://local.drizzle.studio kholega
```

---

## ✅ Complete Test Checklist

| Feature | Test karo | Expected |
|---|---|---|
| DB Migration | `npm run db:migrate` | All 15 tables Supabase mein dikh rahe hain |
| Register | Form bharo | OTP email milti hai |
| OTP Verify | 6-digit code daalo | JWT token milta hai, dashboard par redirect |
| Login | Email + password | Token set, dashboard load |
| **Google OAuth** | "Sign in with Google" | Google popup khulta hai, token milta hai |
| **Forgot Password** | /forgot-password | OTP email milti hai |
| **Reset Password** | OTP + new password | Password change hota hai |
| Create Bid | Bids page → Post | Bid list mein dikhti hai |
| **Bid Details** | Bid card → click | /bids/:id page khulta hai, reviews dikhte hain |
| Send Request | Bid details page | Request DB mein save hoti hai |
| Accept Request | Receiver login karo | Exchange auto-create hoti hai |
| Chat | Chat page open karo | Real-time messages kaam karte hain |
| Schedule | Exchange detail → Schedule | Overlap slots dikhte hain |
| Video Call | Session roomId par jao | Camera/mic kaam karta hai |
| Streak | Session end karo | Streak counter increment hota hai |
| **Pause Exchange** | Request + Approve | Status = paused, streaks frozen |
| **Resume Exchange** | Resume button | Status = active, streaks unfrozen |
| **Cancel Exchange** | Request + Approve (dono) | Mutual agreement se cancel, no penalty |
| **Leave Review** | Session complete → review | Rating profile mein update hoti hai |
| **History Page** | /history | Summary, requests, sessions, activity dikhte hain |
| **Settings Page** | /settings | Name update, password change kaam karta hai |
| Admin Stats | Admin login karo | Counts sahi dikhte hain |
| Ban User | Admin → Users → Ban | Banned user login nahi kar sakta |

---

## 🗄️ Supabase Dashboard se Verify Karo

1. [app.supabase.com](https://app.supabase.com) → Apna project
2. **Table Editor** → Ye tables dikhni chahiye:
   - `users`, `profiles`, `bids`, `requests`, `exchanges`
   - `sessions`, `conversations`, `conversation_participants`
   - `messages`, `notifications`, `reports`, `streaks`
   - `reviews`, `admin_logs`, `logs`    ← **✅ 15 tables total**
3. **SQL Editor** → Test query:
   ```sql
   SELECT COUNT(*) FROM users;
   SELECT * FROM bids LIMIT 5;
   ```

---

## 🔧 Common Issues & Fixes

| Issue | Fix |
|---|---|
| `DATABASE_URL` error | Supabase → Settings → Database → Connection string copy karo |
| Migration fail | `supabase.com` par project "Active" hai check karo |
| CORS error | `CLIENT_URL` server `.env` mein sahi hai check karo |
| OTP nahi aata | Gmail → App Password use karo (normal password nahi chalega) |
| Socket connect nahi | Token `socket.handshake.auth` mein sahi pass ho raha hai check karo |
| WebRTC no video | Browser ne camera permission di hai? |
| Drizzle type errors | `npm run db:generate` dobara chalao agar schema change karo |
| **Google OAuth fail** | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, callback URL sahi hain check karo |
| **Google OAuth redirect mismatch** | Google Console mein `http://localhost:5000/api/auth/google/callback` add karo |
| **Cancel exchange fail** | Dono users ki approval chahiye — sirf requestor approve nahi kar sakta |

---

## 🚀 Production Deployment

### Backend → Railway

```bash
# railway.app par deploy karo
# Environment variables set karo:
DATABASE_URL=<supabase-connection-string>
JWT_SECRET=<your-secret>
EMAIL_USER=<gmail>
EMAIL_PASS=<app-password>
CLIENT_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_CALLBACK_URL=https://your-railway-app.railway.app/api/auth/google/callback
```

### Frontend → Vercel

```bash
# vercel.app par deploy karo
# Environment variables:
VITE_API_URL=https://your-railway-app.railway.app/api
VITE_SOCKET_URL=https://your-railway-app.railway.app
```

> 🎉 **Mubarak ho! SkillSwap ab Supabase + Drizzle ORM ke saath complete hai!**
