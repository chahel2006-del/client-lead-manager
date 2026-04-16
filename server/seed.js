const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  source: String,
  status: { type: String, enum: ['new', 'contacted', 'converted'], default: 'new' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  tags: [String],
  nextFollowUpDate: Date,
  activityLog: [{
    date: { type: Date, default: Date.now },
    description: String
  }],
  createdAt: { type: Date, default: Date.now }
});

const Lead = mongoose.model('Lead', leadSchema);

const MONGO_URI = 'mongodb://127.0.0.1:27017/mini_crm';

const dummyLeads = [
  { name: "Rahul Sharma", email: "rahul@gmail.com", source: "Website", priority: "high", status: "new", nextFollowUpDate: "2026-04-20" },
  { name: "Priya Patel", email: "priya.p@outlook.com", source: "LinkedIn", priority: "medium", status: "contacted", nextFollowUpDate: "2026-04-15" },
  { name: "Amit Kumar", email: "amit.k@gmail.com", source: "Referral", priority: "low", status: "converted", nextFollowUpDate: "2026-05-01" },
  { name: "Sneha Reddy", email: "sneha.reddy@tech.com", source: "Direct", priority: "high", status: "new", nextFollowUpDate: "2026-04-14" },
  { name: "Vikram Singh", email: "vikram@yahoo.co.in", source: "Website", priority: "medium", status: "contacted", nextFollowUpDate: "2026-04-17" },
  { name: "Anjali Gupta", email: "gupta.anjali@gmail.com", source: "Cold Call", priority: "low", status: "new", nextFollowUpDate: "2026-04-25" },
  { name: "Rohan Mehra", email: "rohan.m@gmail.com", source: "LinkedIn", priority: "high", status: "contacted", nextFollowUpDate: "2026-04-16" },
  { name: "Deepa Nair", email: "deepa.nair@corp.com", source: "Referral", priority: "medium", status: "new", nextFollowUpDate: "2026-04-22" },
  { name: "Suresh Menon", email: "s.menon@mail.com", source: "Direct", priority: "low", status: "contacted", nextFollowUpDate: "2026-04-18" },
  { name: "Kavita Rao", email: "kavita.rao@gmail.com", source: "Website", priority: "high", status: "converted", nextFollowUpDate: "2026-05-10" },
  { name: "Abhishek Das", email: "abhi.das@gmail.com", source: "LinkedIn", priority: "medium", status: "new", nextFollowUpDate: "2026-04-10" },
  { name: "Meera Iyer", email: "meera.iyer@tech.com", source: "Direct", priority: "low", status: "new", nextFollowUpDate: "2026-04-19" },
  { name: "Rajesh Varma", email: "rajesh.v@gmail.com", source: "Referral", priority: "high", status: "contacted", nextFollowUpDate: "2026-04-12" },
  { name: "Shweta Joshi", email: "shweta.j@outlook.com", source: "Website", priority: "medium", status: "new", nextFollowUpDate: "2026-04-30" },
  { name: "Nitin Saxena", email: "nitin.s@gmail.com", source: "Cold Call", priority: "low", status: "contacted", nextFollowUpDate: "2026-04-13" },
  { name: "Arjun Kapoor", email: "arjun.k@gmail.com", source: "LinkedIn", priority: "high", status: "new", nextFollowUpDate: "2026-04-21" },
  { name: "Ishani Bose", email: "ishani.b@corp.com", source: "Direct", priority: "medium", status: "converted", nextFollowUpDate: "2026-05-15" },
  { name: "Manish Tiwari", email: "manish.t@gmail.com", source: "Referral", priority: "low", status: "new", nextFollowUpDate: "2026-04-28" },
  { name: "Divya Sharma", email: "divya@yahoo.co.in", source: "Website", priority: "high", status: "contacted", nextFollowUpDate: "2026-04-11" },
  { name: "Prateek Jain", email: "prateek.j@gmail.com", source: "LinkedIn", priority: "medium", status: "new", nextFollowUpDate: "2026-04-23" },
  { name: "Ritu Goel", email: "ritu.goel@tech.com", source: "Direct", priority: "low", status: "contacted", nextFollowUpDate: "2026-04-17" },
  { name: "Sumanth Reddy", email: "sumanth.r@gmail.com", source: "Referral", priority: "high", status: "new", nextFollowUpDate: "2026-04-20" },
  { name: "Aarti Mishra", email: "aarti.m@gmail.com", source: "Website", priority: "medium", status: "contacted", nextFollowUpDate: "2026-04-14" },
  { name: "Tushar Gupta", email: "tushar.g@gmail.com", source: "Cold Call", priority: "low", status: "new", nextFollowUpDate: "2026-04-26" },
  { name: "Sanya Malhotra", email: "sanya.m@gmail.com", source: "LinkedIn", priority: "high", status: "converted", nextFollowUpDate: "2026-05-05" },
  { name: "Varun Dhawan", email: "varun.d@corp.com", source: "Direct", priority: "medium", status: "new", nextFollowUpDate: "2026-04-19" },
  { name: "Neha Kakkar", email: "neha.k@gmail.com", source: "Referral", priority: "low", status: "contacted", nextFollowUpDate: "2026-04-15" },
  { name: "Kartik Aaryan", email: "kartik@yahoo.co.in", source: "Website", priority: "high", status: "new", nextFollowUpDate: "2026-04-22" },
  { name: "Sara Ali Khan", email: "sara.a@gmail.com", source: "LinkedIn", priority: "medium", status: "contacted", nextFollowUpDate: "2026-04-18" },
  { name: "Ranbir Kapoor", email: "ranbir.k@tech.com", source: "Direct", priority: "low", status: "new", nextFollowUpDate: "2026-04-24" }
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB for seeding...');
  
  await Lead.deleteMany({});
  console.log('Cleared existing leads.');

  const leadsWithLogs = dummyLeads.map(lead => ({
    ...lead,
    activityLog: [{ date: new Date(), description: "System generated lead during induction protocol." }],
    tags: ["enterprise", "active", lead.source.toLowerCase()],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)) // Random date in last 10 days
  }));

  await Lead.insertMany(leadsWithLogs);
  console.log(`Successfully seeded ${leadsWithLogs.length} leads.`);
  
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}

seed().catch(err => console.error(err));
