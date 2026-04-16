const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  source: { type: String, required: true },
  status: { type: String, enum: ['new', 'contacted', 'converted'], default: 'new' },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  tags: [String],
  nextFollowUpDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  activityLog: [{
    actionType: { type: String }, // e.g., 'created', 'status_update', 'note', 'priority_update'
    description: { type: String },
    date: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Lead', leadSchema);
