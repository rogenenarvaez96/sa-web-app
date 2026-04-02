const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { requireLogin, requireRole } = require('../middleware/authGuard');

router.get('/',            requireLogin, jobController.getDashboard);
router.get('/new',         requireLogin, requireRole('admin', 'technician'), jobController.getCreateForm);
router.post('/',           requireLogin, requireRole('admin', 'technician'), jobController.createJob);
router.get('/:id/print',   requireLogin, jobController.getPrintView);
router.get('/:id',         requireLogin, jobController.getJobDetails);
router.post('/:id/repair', requireLogin, requireRole('admin', 'technician'), jobController.addRepair);
router.post('/:id/part',   requireLogin, requireRole('admin', 'technician'), jobController.addPart);
router.post('/:id/status', requireLogin, requireRole('admin', 'technician'), jobController.updateStatus);
router.delete('/:id',      requireLogin, requireRole('admin'), jobController.deleteJob);

module.exports = router;