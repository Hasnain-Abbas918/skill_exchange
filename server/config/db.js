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