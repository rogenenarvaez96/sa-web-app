const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  action:      { type: String, required: true },
  performedBy: { type: String, default: 'Unassigned' },
  performedAt: { type: Date, default: Date.now }
}, { _id: false });

const repairSchema = new mongoose.Schema({
  description: { type: String, required: true },
  addedBy:     { type: String, default: 'Unassigned' },
  addedAt:     { type: Date, default: Date.now }
}, { _id: false });

const partSchema = new mongoose.Schema({
  partName: { type: String, required: true },
  addedBy:  { type: String, default: 'Unassigned' },
  addedAt:  { type: Date, default: Date.now }
}, { _id: false });

const jobSchema = new mongoose.Schema({
  // Document Info
  saNumber:   { type: String, unique: true },
  branch:     { type: String, required: true },

  // Customer Info
  customer: {
    name:  { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' }
  },

  // Device Info
  device: {
    type:         { type: String, required: true },
    brand:        { type: String, required: true },
    model:        { type: String, required: true },
    serialNumber: { type: String, default: '' },
    color:        { type: String, default: '' },
    accessories:  { type: String, default: '' }
  },

  // Initial Assessment
  techFindings: { type: String, default: '' },

  // Work Done
  repairsDone: [repairSchema],

  // Parts Used
  partsUsed: [partSchema],

  // Job Status
  status:       { type: String, enum: ['pending', 'done', 'rto'], default: 'pending' },
  totalPrice:   { type: Number, default: 0 },
  attendingTech:{ type: String, default: 'Unassigned' },

  // Inline History
  history: [historySchema]

}, { timestamps: true }); // adds createdAt and updatedAt automatically

module.exports = mongoose.model('Job', jobSchema);
