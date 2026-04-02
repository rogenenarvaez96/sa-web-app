const User = require('../models/User');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

// GET /admin
exports.getDashboard = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.render('admin/dashboard', { users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// GET /admin/users/new
exports.getAddUser = (req, res) => {
  res.render('admin/add-user', { error: null, success: null });
};

// POST /admin/users
exports.addUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const existing = await User.findOne({ username });
    if (existing) {
      return res.render('admin/add-user', {
        error: 'Username already exists.',
        success: null
      });
    }
    await User.create({ username, password, role });
    res.render('admin/add-user', {
      error: null,
      success: `User "${username}" created successfully.`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// GET /admin/users/:id/reset
exports.getResetPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.render('admin/reset-password', { user, error: null, success: null });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// POST /admin/users/:id/reset
exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');

    const { newPassword } = req.body;
    user.password = newPassword;
    await user.save();

    res.render('admin/reset-password', {
      user,
      error: null,
      success: 'Password reset successfully.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// POST /admin/users/:id/toggle
exports.toggleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    user.isActive = !user.isActive;
    await user.save();
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// POST /admin/logo
exports.uploadLogo = (req, res) => {
  try {
    if (!req.file) return res.redirect('/admin');
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};