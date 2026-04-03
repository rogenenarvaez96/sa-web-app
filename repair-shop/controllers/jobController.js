const Job = require('../models/Job');
const generateSANumber = require('../utils/saNumber');

// GET /jobs - Dashboard
exports.getDashboard = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.render('dashboard', { jobs, currentStatus: status || 'all' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// GET /jobs/new - Show create job form
exports.getCreateForm = (req, res) => {
  res.render('job-create');
};

// POST /jobs - Save new job
exports.createJob = async (req, res) => {
  try {
    const {
      branch,
      customerName, customerPhone, customerEmail,
      deviceType, deviceBrand, deviceModel, deviceSerial, deviceColor, deviceAccessories,
      techFindings,
      attendingTech
    } = req.body;

    let job;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        const saNumber = await generateSANumber();

        job = new Job({
          saNumber,
          branch,
          customer: {
            name:  customerName,
            phone: customerPhone,
            email: customerEmail || ''
          },
          device: {
            type:         deviceType,
            brand:        deviceBrand,
            model:        deviceModel,
            serialNumber: deviceSerial || '',
            color:        deviceColor || '',
            accessories:  deviceAccessories || ''
          },
          techFindings,
          attendingTech: req.session.user.username,
          history: [
            {
              action:      'Job created',
              performedBy: req.session.user.username,
              performedAt: new Date()
            }
          ]
        });

        await job.save();
        break; // success — exit the loop

      } catch (saveErr) {
        if (saveErr.code === 11000) {
          // Duplicate SA number — retry
          attempts++;
          if (attempts >= maxAttempts) {
            throw new Error('Could not generate a unique SA number. Please try again.');
          }
        } else {
          throw saveErr; // different error — don't retry
        }
      }
    }

    res.redirect(`/jobs/${job._id}`);

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message || 'Server Error');
  }
};

// GET /jobs/:id - Job Details
exports.getJobDetails = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).send('Job not found');
    res.render('job-details', { job });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// POST /jobs/:id/repair - Append a repair
exports.addRepair = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).send('Job not found');
    if (job.status === 'done' || job.status === 'rto') {
      return res.redirect(`/jobs/${job._id}`);
    }

const { description } = req.body;
const performedBy = req.session.user.username;

job.repairsDone.push({
  description,
  addedBy: performedBy,
  addedAt: new Date()
});

job.history.push({
  action:      `Repair added: ${description}`,
  performedBy: performedBy,
  performedAt: new Date()
});

    await job.save();
    res.redirect(`/jobs/${job._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// POST /jobs/:id/part - Append a part
exports.addPart = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).send('Job not found');
    if (job.status === 'done' || job.status === 'rto') {
      return res.redirect(`/jobs/${job._id}`);
    }

const { partName } = req.body;
const performedBy = req.session.user.username;

job.partsUsed.push({
  partName,
  addedBy: performedBy,
  addedAt: new Date()
});

job.history.push({
  action:      `Part added: ${partName}`,
  performedBy: performedBy,
  performedAt: new Date()
});

    await job.save();
    res.redirect(`/jobs/${job._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// POST /jobs/:id/status - Update status, price, technician
exports.updateStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).send('Job not found');
    if (job.status === 'done' || job.status === 'rto') {
      return res.redirect(`/jobs/${job._id}`);
    }

const { status, totalPrice } = req.body;
const performedBy = req.session.user.username;
const oldStatus = job.status;

job.status        = status     || job.status;
job.totalPrice    = totalPrice || job.totalPrice;
job.attendingTech = performedBy;

job.history.push({
  action:      `Status changed from ${oldStatus} to ${job.status}. Price: ₱${job.totalPrice}. Tech: ${job.attendingTech}`,
  performedBy: performedBy,
  performedAt: new Date()
});

    await job.save();
    res.redirect(`/jobs/${job._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// GET /jobs/:id/print - Print view
exports.getPrintView = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).send('Job not found');
    if (job.status !== 'done' && job.status !== 'rto') {
      return res.redirect(`/jobs/${job._id}`);
    }
    res.render('job-print', { job });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// DELETE /jobs/:id
exports.deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.redirect('/jobs');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};