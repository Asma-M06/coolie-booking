const fs = require('fs');
const path = require('path');
const db = require('../config/db');
require('dotenv').config();

async function migrate() {
  try {
    console.log('--- Applying Database Migration ---');
    const sqlPath = path.join(__dirname, '../database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the full SQL schema
    await db.query(sql);

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

migrate();
