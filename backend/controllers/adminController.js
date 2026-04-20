const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    // 2. Check admin exists
    const result = await db.query(
      `SELECT a.*, r.name as role_name 
       FROM admins a 
       LEFT JOIN roles r ON a.role_id = r.id 
       WHERE a.email = $1`, 
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid administrative credentials.' });
    }

    const admin = result.rows[0];

    if (!admin.is_active) {
      return res.status(403).json({ message: 'This administrative account has been deactivated.' });
    }

    // 3. Verify password
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid administrative credentials.' });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { id: admin.id, role: admin.role_name, isSuperAdmin: admin.is_superadmin, type: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    // 5. Set Cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 12 * 60 * 60 * 1000 // 12 hours
    });

    res.json({
      message: 'Admin login successful',
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role_name,
        isSuperAdmin: admin.is_superadmin,
        avatar: admin.avatar_url
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login.' });
  }
};

exports.getAdminProfile = async (req, res) => {
  res.json({ admin: req.admin });
};

exports.logoutAdmin = (req, res) => {
  res.clearCookie('admin_token');
  res.json({ message: 'Admin logged out successfully' });
};

// --- Coolie Management ---

exports.getPendingCoolieRequests = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, first_name, last_name, email, phone, city, aadhar_number, aadhar_image, avatar_url, registered_at 
       FROM coolies 
       WHERE is_approved = false 
       ORDER BY registered_at ASC`
    );
    res.json({ requests: result.rows });
  } catch (error) {
    console.error('Error fetching pending coolies:', error);
    res.status(500).json({ message: 'Error fetching applications.' });
  }
};

exports.updateCoolieStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { approve } = req.body; // boolean

    if (approve) {
      await db.query('UPDATE coolies SET is_approved = true WHERE id = $1', [id]);
      res.json({ message: 'Coolie application approved successfully.' });
    } else {
      // For now, rejection just deletes or marks as rejected. Let's delete for simplicity or add a status column.
      // Given your request for "admin will approve", let's just delete for rejected ones.
      await db.query('DELETE FROM coolies WHERE id = $1', [id]);
      res.json({ message: 'Coolie application rejected and removed.' });
    }
  } catch (error) {
    console.error('Error updating coolie status:', error);
    res.status(500).json({ message: 'Error processing application.' });
  }
};

exports.deleteCoolie = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Check if coolie exists
    const checkRes = await db.query('SELECT id FROM coolies WHERE id = $1', [id]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ message: 'Partner not found.' });
    }

    // 2. Handle dependencies (bookings)
    // We remove associated bookings first to avoid foreign key constraint violations
    await db.query('DELETE FROM bookings WHERE coolie_id = $1', [id]);

    // 3. Delete coolie
    await db.query('DELETE FROM coolies WHERE id = $1', [id]);

    res.json({ success: true, message: 'Partner and associated bookings removed successfully.' });
  } catch (error) {
    console.error('Error deleting coolie:', error);
    res.status(500).json({ message: 'Error removing partner from database.' });
  }
};

exports.getAllCoolies = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, first_name, last_name, email, phone, city, aadhar_number, aadhar_image, avatar_url, is_approved, registered_at 
       FROM coolies 
       ORDER BY registered_at DESC`
    );
    res.json({ coolies: result.rows });
  } catch (error) {
    console.error('Error fetching all coolies:', error);
    res.status(500).json({ message: 'Error fetching coolie registry.' });
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const adminId = req.admin.id;

    if (!username || !email) {
      return res.status(400).json({ message: 'Username and email are required.' });
    }

    const result = await db.query(
      'UPDATE admins SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email',
      [username, email, adminId]
    );

    res.json({ success: true, message: 'Profile updated successfully', admin: result.rows[0] });
  } catch (error) {
    console.error('Admin profile update error:', error);
    if (error.code === '23505') {
       return res.status(400).json({ message: 'Email or username already in use.' });
    }
    res.status(500).json({ message: 'Server error updating profile.' });
  }
};

exports.updateAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new passwords are required.' });
    }

    // 1. Get current password hash
    const adminRes = await db.query('SELECT password_hash FROM admins WHERE id = $1', [adminId]);
    const isMatch = await bcrypt.compare(currentPassword, adminRes.rows[0].password_hash);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password.' });
    }

    // 2. Hash new password
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    // 3. Update
    await db.query('UPDATE admins SET password_hash = $1 WHERE id = $2', [newHash, adminId]);

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Admin password update error:', error);
    res.status(500).json({ message: 'Server error changing password.' });
  }
};

exports.getAdminDashboardStats = async (req, res) => {
  try {
    const cooliesRes = await db.query('SELECT count(*) FROM coolies WHERE is_approved = true');
    const passengersRes = await db.query('SELECT count(*) FROM users');
    const pendingRes = await db.query('SELECT count(*) FROM coolies WHERE is_approved = false');
    const revenueRes = await db.query("SELECT sum(total_fare) FROM bookings WHERE status = 'completed'");

    res.json({
      success: true,
      stats: {
        totalCoolies: parseInt(cooliesRes.rows[0].count),
        totalPassengers: parseInt(passengersRes.rows[0].count),
        pendingApprovals: parseInt(pendingRes.rows[0].count),
        totalRevenue: parseFloat(revenueRes.rows[0].sum || 0)
      }
    });
  } catch (error) {
    console.error('Admin dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard analytics.' });
  }
};
