const { db } = require('../config/db');
const { users, profiles, streaks } = require('../db/schema/index');
const { eq } = require('drizzle-orm');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
 
// Multer config - save files in uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/avatars';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.user.id}_${Date.now()}${ext}`);
  },
});
 
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
};
 
// Fix: use const for CommonJS export style
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
 
// @route GET /api/users/profile
const getMyProfile = async (req, res) => {
  try {
    const result = await db
      .select({
        id: profiles.id,
        bio: profiles.bio,
        skillsOffered: profiles.skillsOffered,
        skillsWanted: profiles.skillsWanted,
        availability: profiles.availability,
        location: profiles.location,
        rating: profiles.rating,
        totalSessions: profiles.totalSessions,
        updatedAt: profiles.updatedAt,
        avatar: users.avatar,
      })
      .from(profiles)
      .leftJoin(users, eq(profiles.userId, users.id))
      .where(eq(profiles.userId, req.user.id));
 
    if (!result || result.length === 0) {
      const [newProfile] = await db
        .insert(profiles)
        .values({ userId: req.user.id })
        .returning();
      return res.json({
        ...newProfile,
        user: { id: req.user.id, name: req.user.name, email: req.user.email, avatar: req.user.avatar },
      });
    }
 
    res.json({
      ...result[0],
      user: { id: req.user.id, name: req.user.name, email: req.user.email, avatar: req.user.avatar },
    });
  } catch (error) {
    console.error('getMyProfile error:', error);
    res.status(500).json({ message: error.message });
  }
};
 
// @route PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const { bio, skillsOffered, skillsWanted, availability, location } = req.body;
 
    const normalizeArray = (val) => {
      if (Array.isArray(val)) return val.filter(Boolean);
      if (typeof val === 'string') return val.split(',').map((s) => s.trim()).filter(Boolean);
      return [];
    };
 
    const updateData = {
      bio: bio || '',
      skillsOffered: normalizeArray(skillsOffered),
      skillsWanted: normalizeArray(skillsWanted),
      availability: typeof availability === 'string' ? JSON.parse(availability) : (availability || []),
      location: location || '',
      updatedAt: new Date(),
    };
 
    const existing = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.userId, req.user.id));
 
    let updatedProfile;
    if (existing && existing.length > 0) {
      const [p] = await db
        .update(profiles)
        .set(updateData)
        .where(eq(profiles.userId, req.user.id))
        .returning();
      updatedProfile = p;
    } else {
      const [p] = await db
        .insert(profiles)
        .values({ userId: req.user.id, ...updateData })
        .returning();
      updatedProfile = p;
    }
 
    res.json({
      ...updatedProfile,
      user: { id: req.user.id, name: req.user.name, email: req.user.email, avatar: req.user.avatar },
    });
  } catch (error) {
    console.error('updateProfile error:', error.message);
    res.status(500).json({ message: `Profile update failed: ${error.message}` });
  }
};
 
// @route GET /api/users/:id/profile
const getUserProfile = async (req, res) => {
  try {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, req.params.id));
 
    const [userInfo] = await db
      .select({ id: users.id, name: users.name, email: users.email, avatar: users.avatar })
      .from(users)
      .where(eq(users.id, req.params.id));
 
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
 
    const [streak] = await db.select().from(streaks).where(eq(streaks.userId, req.params.id));
    res.json({ profile: { ...profile, user: userInfo }, streak });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
// @route POST /api/users/avatar - file upload
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file was uploaded' });
 
    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;
 
    await db
      .update(users)
      .set({ avatar: avatarUrl, updatedAt: new Date() })
      .where(eq(users.id, req.user.id));
 
    res.json({ message: 'Avatar uploaded successfully!', avatarUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
module.exports = { getMyProfile, updateProfile, getUserProfile, uploadAvatar, upload };