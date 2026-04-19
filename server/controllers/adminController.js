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