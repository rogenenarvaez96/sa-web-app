// Must be logged in
exports.requireLogin = (req, res, next) => {
  if (!req.session.user) return res.redirect('/auth/login');
  next();
};

// Must have a specific role
exports.requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.session.user) return res.redirect('/auth/login');
    if (!roles.includes(req.session.user.role)) {
      return res.redirect('/auth/login');
    }
    next();
  };
};