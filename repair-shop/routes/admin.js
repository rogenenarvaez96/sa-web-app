const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireLogin, requireRole } = require('../middleware/authGuard');
const multer = require('multer');
const path = require('path');

// Multer config for logo upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/logo/'),
  filename:    (req, file, cb) => cb(null, 'logo' + path.extname(file.originalname))
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|svg|gif/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  }
});

router.use(requireLogin, requireRole('admin'));

router.get('/',                     adminController.getDashboard);
router.get('/users/new',            adminController.getAddUser);
router.post('/users',               adminController.addUser);
router.get('/users/:id/reset',      adminController.getResetPassword);
router.post('/users/:id/reset',     adminController.resetPassword);
router.post('/users/:id/toggle',    adminController.toggleUser);
router.post('/logo',                upload.single('logo'), adminController.uploadLogo);

module.exports = router;