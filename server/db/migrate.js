const { drizzle } = require('drizzle-orm/postgres-js');
const { migrate } = require('drizzle-orm/postgres-js/migrator');
const postgres = require('postgres');
require('dotenv').config();
 
const ALREADY_EXISTS_CODES = new Set(['42710', '42P07']);
 
const isExistingSchemaError = (error) => {
  const code = error?.cause?.code ?? error?.code;
  return ALREADY_EXISTS_CODES.has(code);
};
 
const runMigrations = async () => {
  const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(migrationClient);
 
    console.log('⏳ Running migrations...');
  try {
    await migrate(db, { migrationsFolder: './db/migrations' });
        console.log('✅ Migrations completed successfully!');
  } catch (error) {
        if (isExistingSchemaError(error)) {
      console.warn('⚠️ Schema objects already exist. Skipping migration for existing database.');
      return;
    }
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
};
 
runMigrations();