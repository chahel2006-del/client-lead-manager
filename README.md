# Client Lead Manager (CLM)

A professional, full-stack CRM system for managing sales pipelines, tracking lead activities, and visualizing conversion analytics.

## 🚀 Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Recharts, Lucide Icons, Sonner Notifications, Framer Motion.
- **Backend**: Node.js, Express.
- **Database**: MongoDB.
- **Styling**: Modern Light-Mode UI with Glassmorphism and Responsive Layouts.

## 📦 Features

- **Dynamic Pipeline**: Real-time lead tracking with status and priority management.
- **Analytics Dashboard**: Visual breakdown of Lead Velocity, Pipeline Storage, and Priority Distribution.
- **Sticky Induction**: Persistent 'Create Lead' interface for rapid data entry.
- **Activity Logs**: Detailed audit trails for every lead interaction.
- **Smart Search**: High-performance filtering across the entire registry.
- **Stability Focused**: Implemented React Error Boundaries and robust data null-checks.

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (Running locally on `mongodb://127.0.0.1:27017/mini_crm`)

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 4. Seed Data (Optional)
To populate the database with realistic leads:
```bash
cd server
node seed.js
```

## 🌐 Deployment Ready
- **Frontend**: Optimized for Vercel/Netlify.
- **Backend**: Configured for Render/Railway/Heroku.

## 🛡️ License
MIT
