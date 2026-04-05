const bcrypt = require('bcryptjs');
const db = require('../config/db');
require('dotenv').config();

async function seed() {
  try {
    console.log('--- Starting Admin RBAC Seed ---');

    // 1. Create Roles
    const superAdminRole = await db.query(
      "INSERT INTO roles (name, description) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id",
      ['SuperAdmin', 'All-access system administrator']
    );
    const adminRole = await db.query(
      "INSERT INTO roles (name, description) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id",
      ['Admin', 'Standard administrative access']
    );

    const superAdminRoleId = superAdminRole.rows[0].id;
    const adminRoleId = adminRole.rows[0].id;

    // 2. Create Permissions
    const permissions = [
      { slug: 'approve_coolies', desc: 'Can approve or reject coolie applications' },
      { slug: 'manage_users', desc: 'Can view and moderate passenger accounts' },
      { slug: 'manage_admins', desc: 'Can create and edit other admin accounts' },
      { slug: 'view_reports', desc: 'Can view platform analytics and booking reports' },
      { slug: 'manage_stations', desc: 'Can add or edit railway station data' }
    ];

    for (const p of permissions) {
      const pRes = await db.query(
        "INSERT INTO permissions (slug, description) VALUES ($1, $2) ON CONFLICT (slug) DO UPDATE SET slug=EXCLUDED.slug RETURNING id",
        [p.slug, p.desc]
      );
      
      // Link SuperAdmin to ALL permissions
      await db.query(
        "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [superAdminRoleId, pRes.rows[0].id]
      );

      // Link Admin to some permissions (e.g., approve_coolies, view_reports)
      if (['approve_coolies', 'view_reports'].includes(p.slug)) {
        await db.query(
          "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
          [adminRoleId, pRes.rows[0].id]
        );
      }
    }

    // 3. Create the First SuperAdmin User
    const superEmail = 'admin@cooliebook.in';
    const superPassword = 'SuperAdminPassword123'; // User should change this
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(superPassword, salt);

    await db.query(
      `INSERT INTO admins (username, email, password_hash, role_id, is_superadmin, avatar_url) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       ON CONFLICT (email) DO NOTHING`,
      ['superadmin', superEmail, hash, superAdminRoleId, true, 'https://ui-avatars.com/api/?name=Super+Admin&background=0f172a&color=f97316']
    );

    console.log('✅ Seeding completed successfully!');
    console.log('--- Initial Credentials ---');
    console.log(`Email: ${superEmail}`);
    console.log(`Password: ${superPassword}`);
    console.log('--- Please change these after first login ---');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
