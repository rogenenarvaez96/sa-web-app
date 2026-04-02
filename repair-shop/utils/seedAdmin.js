require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ username: 'admin' });
  if (existing) {
    console.log('Admin already exists.');
    process.exit();
  }

  await User.create({
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  });

  console.log('Admin created — username: admin, password: admin123');
  process.exit();
};

seed();