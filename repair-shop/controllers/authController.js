const User = require('../models/User');

// GET /auth/login
exports.getLogin = (req, res) => {
  if (req.session.user) return res.redirect('/jobs');
  res.render('login', { error: null });
};

// POST /auth/login
exports.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, isActive: true });

    if (!user || !(await user.comparePassword(password))) {
      return res.render('login', { error: 'Invalid username or password.' });
    }

    req.session.user = {
      id:       user._id,
      username: user.username,
      role:     user.role
    };

    res.redirect('/jobs');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Something went wrong. Please try again.' });
  }
};

// POST /auth/logout
exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/auth/login'));
};