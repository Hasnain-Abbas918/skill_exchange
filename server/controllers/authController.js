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

    const [existingUser] = await db.select().from(users).where(eq(users.email, email));
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    const [newUser] = await db.insert(users).values({
      name, email, password: hashedPassword, otp, otpExpire,
    }).returning({ id: users.id, name: users.name, email: users.email });

    await db.insert(profiles).values({ userId: newUser.id });
    await db.insert(streaks).values({ userId: newUser.id });

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
      .returning({
        id: users.id, name: users.name,
        email: users.email, role: users.role, avatar: users.avatar,
      });

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
      user: {
        id: user.id, name: user.name,
        email: user.email, role: user.role,
        avatar: user.avatar, // ✅ avatar include
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/auth/me  ✅ FIXED — avatar include
const getMe = async (req, res) => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        avatar: users.avatar,
      })
      .from(users)
      .where(eq(users.id, req.user.id));

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return res.status(404).json({ message: 'No account with that email' });

    const otp = generateOTP();
    const expire = new Date(Date.now() + 10 * 60 * 1000);

    await db.update(users)
      .set({ resetPasswordToken: otp, resetPasswordExpire: expire })
      .where(eq(users.id, user.id));

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
      .where(and(
        eq(users.email, email),
        eq(users.resetPasswordToken, otp),
        gt(users.resetPasswordExpire, new Date())
      ));

    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    await db.update(users)
      .set({ password: hashed, resetPasswordToken: null, resetPasswordExpire: null })
      .where(eq(users.id, user.id));

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, verifyOTP, resendOTP, login, getMe, forgotPassword, resetPassword };