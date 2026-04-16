require('dotenv').config();
const mongoose = require('mongoose');

console.log('Using MONGO_URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB');
    process.exit(0);
  })
  .catch((err) => {
    console.error('FAIL: Error connecting to MongoDB', err);
    process.exit(1);
  });
