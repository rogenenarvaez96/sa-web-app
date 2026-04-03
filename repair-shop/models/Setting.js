const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  shopName: { type: String, default: 'Repair Shop' },
  shopSlogan: { type: String, default: 'Your trusted gadget repair center' }
});

module.exports = mongoose.model('Setting', settingSchema);