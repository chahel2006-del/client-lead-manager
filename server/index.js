require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const leadsRoutes = require('./routes/leads');

const app = express();

app.use(cors());
app.use(express.json());

// Mount the API Routes
app.use('/api/leads', leadsRoutes);

// Connect natively to Local MongoDB or Atlas based on Process Environment
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mini_crm';
mongoose.connect(mongoURI)
  .then(() => console.log(`✅ Connected to MongoDB Database at ${mongoURI}`))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
