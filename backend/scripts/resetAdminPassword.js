const bcrypt = require('bcryptjs');
const db = require('../config/db');
require('dotenv').config();

async function resetPassword() {
  const email = 'admin@cooliebook.in';
  const newPassword = 'NewAdminPassword123'; // <--- Change this if you want

  try {
    console.log(`--- Resetting Password for ${email} ---`);

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    const result = await db.query(
      'UPDATE admins SET password_hash = $1 WHERE email = $2 RETURNING id',
      [hash, email]
    );

    if (result.rowCount === 0) {
      console.log('❌ Admin not found. Did you run seedAdmin.js first?');
    } else {
      console.log('✅ Password updated successfully!');
      console.log('--- New Credentials ---');
      console.log(`Email: ${email}`);
      console.log(`Password: ${newPassword}`);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Reset failed:', err);
    process.exit(1);
  }
}

resetPassword();
