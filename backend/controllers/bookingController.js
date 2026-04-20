const db = require('../config/db');

// @desc    Create a new booking
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  const { 
    station, trainNumber, pnrNumber, passengerName, passengerPhone, 
    platform, luggageType, date, time, passengers, notes, coolieId, totalFare 
  } = req.body;
  
  // userId from middleware if logged in, else null for guests
  const userId = req.user ? req.user.id : null;

  try {
    const result = await db.query(
      `INSERT INTO bookings (
        user_id, coolie_id, station, train_number, pnr_number, 
        passenger_name, passenger_phone, platform, luggage_type, 
        date, time, passengers, notes, total_fare
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        userId, coolieId || null, station, trainNumber, pnrNumber || null, 
        passengerName || null, passengerPhone || null, platform, luggageType, 
        date, time, passengers || 1, notes, totalFare
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Booking request sent successfully',
      booking: result.rows[0]
    });
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ success: false, message: 'Server error while creating booking' });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
exports.getUserBookings = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      `SELECT b.*, c.first_name as coolie_first_name, c.last_name as coolie_last_name, c.phone as coolie_phone, c.avatar_url as coolie_avatar
       FROM bookings b
       LEFT JOIN coolies c ON b.coolie_id = c.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );

    res.json({ success: true, bookings: result.rows });
  } catch (err) {
    console.error('Get user bookings error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching bookings' });
  }
};

// @desc    Get coolie's bookings
// @route   GET /api/bookings/coolie-tasks
exports.getCoolieBookings = async (req, res) => {
  const coolieId = req.user.id;

  try {
    const result = await db.query(
      `SELECT b.*, 
              COALESCE(u.name, b.passenger_name) as user_name, 
              COALESCE(u.phone, b.passenger_phone) as user_phone
       FROM bookings b
       LEFT JOIN users u ON b.user_id = u.id
       WHERE b.coolie_id = $1
       ORDER BY b.created_at DESC`,
      [coolieId]
    );

    res.json({ success: true, bookings: result.rows });
  } catch (err) {
    console.error('Get coolie bookings error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching coolie tasks' });
  }
};

// @desc    Update booking status (Accept/Reject/Complete)
// @route   PATCH /api/bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const coolieId = req.user.id;

  try {
    // Ensure the coolie owns this booking
    const check = await db.query('SELECT * FROM bookings WHERE id = $1 AND coolie_id = $2', [id, coolieId]);
    if (check.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this booking' });
    }

    const result = await db.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.json({ success: true, booking: result.rows[0] });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ success: false, message: 'Server error updating status' });
  }
};

// @desc    Rate a booking
// @route   POST /api/bookings/:id/rate
exports.rateBooking = async (req, res) => {
  const { id } = req.params;
  const { rating, feedback } = req.body;
  const userId = req.user.id;

  try {
    // Ensure the booking is completed and belongs to the user
    const check = await db.query('SELECT * FROM bookings WHERE id = $1 AND user_id = $2', [id, userId]);
    if (check.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Unauthorized to rate this booking' });
    }
    if (check.rows[0].status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Only completed bookings can be rated' });
    }

    const result = await db.query(
      'UPDATE bookings SET rating = $1, feedback = $2 WHERE id = $3 RETURNING *',
      [rating, feedback, id]
    );

    res.json({ success: true, booking: result.rows[0] });
  } catch (err) {
    console.error('Rate booking error:', err);
    res.status(500).json({ success: false, message: 'Server error while rating' });
  }
};

// @desc    Get coolie stats for dashboard
// @route   GET /api/bookings/coolie-stats
exports.getCoolieStats = async (req, res) => {
  const coolieId = req.user.id;

  try {
    // 1. Today's Earnings
    const earningsRes = await db.query(
      `SELECT SUM(total_fare) as earnings FROM bookings 
       WHERE coolie_id = $1 AND status = 'completed' 
       AND created_at >= CURRENT_DATE`,
      [coolieId]
    );

    // 2. Average Rating
    const ratingRes = await db.query(
      `SELECT AVG(rating) as avg_rating FROM bookings 
       WHERE coolie_id = $1 AND rating IS NOT NULL`,
      [coolieId]
    );

    // 3. Trips this week
    const weeklyTripsRes = await db.query(
      `SELECT COUNT(*) as trips FROM bookings 
       WHERE coolie_id = $1 AND status = 'completed' 
       AND created_at >= NOW() - INTERVAL '7 days'`,
      [coolieId]
    );

    // 4. Cancellation Rate (Rejected vs Total assigned)
    const cancelRes = await db.query(
      `SELECT 
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
        COUNT(*) as total
       FROM bookings WHERE coolie_id = $1`,
      [coolieId]
    );

    const stats = {
      todayEarnings: parseInt(earningsRes.rows[0].earnings || 0),
      avgRating: parseFloat(ratingRes.rows[0].avg_rating || 0).toFixed(1),
      tripsThisWeek: parseInt(weeklyTripsRes.rows[0].trips || 0),
      cancellationRate: cancelRes.rows[0].total > 0 
        ? Math.round((cancelRes.rows[0].rejected / cancelRes.rows[0].total) * 100) 
        : 0
    };

    res.json({ success: true, stats });
  } catch (err) {
    console.error('Get coolie stats error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching stats' });
  }
};

// @desc    Track booking by PNR and Phone
// @route   POST /api/bookings/track
exports.trackBooking = async (req, res) => {
  const { pnr, phone } = req.body;

  if (!pnr || !phone) {
    return res.status(400).json({ success: false, message: 'PNR and Phone number are required' });
  }

  try {
    const result = await db.query(
      `SELECT b.*, c.first_name as coolie_first_name, c.last_name as coolie_last_name, c.phone as coolie_phone, c.avatar_url as coolie_avatar
       FROM bookings b
       LEFT JOIN coolies c ON b.coolie_id = c.id
       WHERE (b.pnr_number = $1 AND (b.passenger_phone = $2 OR EXISTS (SELECT 1 FROM users u WHERE u.id = b.user_id AND u.phone = $2)))
       ORDER BY b.created_at DESC`,
      [pnr, phone]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No booking found with this PNR and Phone number' });
    }

    res.json({ success: true, bookings: result.rows });
  } catch (err) {
    console.error('Track booking error:', err);
    res.status(500).json({ success: false, message: 'Server error while tracking booking' });
  }
};
