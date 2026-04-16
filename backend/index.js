const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allowed origins (local + deployed frontend)
const allowedOrigins = [
  'http://localhost:5173',
  'https://coolie-booking.vercel.app'
];

// ✅ CORS setup (dynamic)
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps / Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ✅ IMPORTANT: serve uploads correctly
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/coolies', require('./routes/coolie'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/bookings', require('./routes/bookings'));

// Health check
app.get('/', (req, res) => {
  res.send('CoolieBook API is running...');
});

//db test 
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});