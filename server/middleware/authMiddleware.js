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