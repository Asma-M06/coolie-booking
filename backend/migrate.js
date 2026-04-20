const db = require('./config/db');

async function migrate() {
  try {
    console.log('Starting migration...');
    await db.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS pnr_number VARCHAR(100),
      ADD COLUMN IF NOT EXISTS passenger_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS passenger_phone VARCHAR(50),
      ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      ADD COLUMN IF NOT EXISTS feedback TEXT;
    `);
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
