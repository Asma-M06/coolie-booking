# 🚂 CoolieBook: Premium Railway Assistance

**CoolieBook** is a state-of-the-art digital platform designed to modernize railway assistance services in India. By bridging the gap between passengers and verified coolies through an elegant, glassmorphism-inspired interface, we ensure that every journey begins and ends with comfort and transparency.

---

## 🌟 Key Features

### 👤 For Passengers
- **Smart Booking**: Instant coolie reservation with precise train and platform details.
- **Fare Transparency**: Pre-calculated booking costs based on luggage and distance.
- **Verified Partners**: Full visibility into coolie profiles, including ratings and verified Aadhar status.
- **Real-time Availability**: Filter and find partners who are currently available at your station.
- **Feedback Loop**: Post-trip rating and feedback system to ensure premium service standards.

### 💼 For Coolie Partners
- **Analytics Dashboard**: Real-time tracking of daily earnings, average ratings, and weekly performance.
- **Task Management**: Seamless acceptance and completion flow for assigned bookings.
- **Digital Identity**: Professional profile hosting verified credentials and performance badges.
- **Availability Toggle**: Automatic "Busy" status during active trips to manage work-life balance.

### 🛡️ Command Center (Admin)
- **Aggregated Analytics**: High-level network metrics including total revenue, partner growth, and user volume.
- **Onboarding Queue**: Secure administrative workflow for verifying and approving new partner applications.
- **Account Security**: Dedicated settings for administrative profile and credential management.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only Cookies
- **UI/UX**: Custom Vanilla CSS (Premium Glassmorphism Design System)

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Asma-M06/coolie-booking.git
cd coolie-booking
```

### 2. Configuration & Environment
Create a `.env` file in the `backend/` directory:
```env
PORT=5005
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

### 3. Database Initialization
Ensure PostgreSQL is running, then execute the schema and initial migration:
```bash
cd backend
psql $DATABASE_URL -f database.sql
node migrate.js
```

### 4. Install Dependencies & Launch
**Backend:**
```bash
cd backend
npm install
node index.js
```

**Frontend:**
```bash
cd ../
npm install
npm run dev
```

---

## 📂 Project Structure

```text
├── backend/
│   ├── config/          # Database & Server configuration
│   ├── controllers/     # Business logic for Auth, Bookings, Admins
│   ├── routes/          # API endpoint definitions
│   ├── middleware/      # Auth & Security middlewares
│   ├── database.sql     # Core PostgreSQL schema
│   └── index.js         # Entry point
├── src/
│   ├── components/      # Reusable UI & Layout components
│   ├── pages/           # Main application views (Passenger, Coolie, Admin)
│   ├── store/           # Global state management (Zustand)
│   ├── config/          # Frontend environment config
│   └── App.jsx          # Root component & Routing
└── README.md
```

---

## 🔐 Administrative Access
To access the restricted Command Center:
 Navigate to `/login` and click **"Access Admin Portal"**.
---

### 🇮🇳 Built for Indian Railways
*Transforming the platform experience, one booking at a time.*
