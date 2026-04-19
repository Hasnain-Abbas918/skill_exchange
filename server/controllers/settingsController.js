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

    // Password change is not allowed for Google OAuth users
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