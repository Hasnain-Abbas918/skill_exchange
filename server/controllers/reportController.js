const { db } = require('../config/db');
const { reports, users } = require('../db/schema/index');
const { eq, desc } = require('drizzle-orm');
 
const createReport = async (req, res) => {
  try {
    const { reportedId, exchangeId, sessionId, type, description } = req.body;
 
    // reportedId validation
    if (!reportedId || reportedId.trim() === '') {
      return res.status(400).json({ message: 'Reported user ID is required. Select an exchange or provide an ID manually.' });
    }
 
    if (reportedId === req.user.id) {
      return res.status(400).json({ message: 'You cannot report yourself' });
    }
 
    // Check whether the reported user exists
    const [reportedUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, reportedId));
 
    if (!reportedUser) {
      return res.status(404).json({ message: 'Reported user not found' });
    }
 
    const [report] = await db
      .insert(reports)
      .values({
        reporterId:  req.user.id,
        reportedId:  reportedId.trim(),
        exchangeId:  exchangeId  || null,   // empty string -> null
        type,
        description: description.trim(),
      })
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
        id:          reports.id,
        type:        reports.type,
        description: reports.description,
        status:      reports.status,
        adminNote:   reports.adminNote,
        penaltyApplied: reports.penaltyApplied,
        createdAt:   reports.createdAt,
        reported:    { id: users.id, name: users.name },
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
 