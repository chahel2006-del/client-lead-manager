const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// POST /api/leads -> Add new lead
router.post('/', async (req, res) => {
  try {
    const { name, email, source, status, priority, tags, note, nextFollowUpDate } = req.body;
    
    // Convert tags if arriving as comma-separated string
    const parsedTags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()).filter(t=>t) : []);

    const lead = new Lead({ 
      name, 
      email, 
      source, 
      status: status || 'new', 
      priority: priority || 'medium',
      tags: parsedTags,
      nextFollowUpDate: nextFollowUpDate ? new Date(nextFollowUpDate) : null,
      activityLog: [{ actionType: 'created', description: 'Lead was securely generated in the system.' }]
    });

    if (note && note.trim() !== '') {
      lead.activityLog.push({ actionType: 'note', description: `Initial Log Note: ${note.trim()}` });
    }
    
    await lead.save();
    console.log('✅ Lead Created:', lead.email);
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/leads -> Get all leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/leads/:id -> Update lead base properties (Edit)
router.put('/:id', async (req, res) => {
  try {
    const oldLead = await Lead.findById(req.params.id);
    if (!oldLead) return res.status(404).json({ message: 'Lead not found' });
    
    const updates = { ...req.body };
    const newLog = [];
    
    // Deep audit state tracking differentials
    if (updates.status && updates.status !== oldLead.status) {
      newLog.push({ actionType: 'status_update', description: `Status progressed from ${oldLead.status.toUpperCase()} to ${updates.status.toUpperCase()}` });
    }
    if (updates.priority && updates.priority !== oldLead.priority) {
      newLog.push({ actionType: 'priority_update', description: `Priority reallocated from ${oldLead.priority.toUpperCase()} to ${updates.priority.toUpperCase()}` });
    }
    
    // Tag Parsing mechanism
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map(t => t.trim()).filter(t=>t);
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id, 
      { $set: updates, $push: { activityLog: { $each: newLog } } }, 
      { new: true, runValidators: true }
    );
    console.log(`✅ Dynamically Updated lead: ${req.params.id}`);
    res.json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST /api/leads/:id/notes -> Add a secure timestamped note specifically into Activity Timeline
router.post('/:id/notes', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') return res.status(400).json({ message: 'Note text required' });

    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    
    lead.activityLog.push({ actionType: 'note', description: `User attached log: ${text}` });
    await lead.save();
    res.json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/leads/:id -> Delete lead
router.delete('/:id', async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
