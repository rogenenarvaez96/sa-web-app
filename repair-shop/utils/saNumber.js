const Job = require('../models/Job');

const generateSANumber = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `SA-${currentYear}-`;

  // Find the latest job for the current year
  const lastJob = await Job.findOne(
    { saNumber: { $regex: `^${prefix}` } },
    { saNumber: 1 },
    { sort: { saNumber: -1 } }
  );

  let nextSequence = 1;

  if (lastJob) {
    // Extract the number part e.g. "SA-2026-0042" → 42
    const lastNumber = parseInt(lastJob.saNumber.split('-')[2], 10);
    nextSequence = lastNumber + 1;
  }

  // Pad to 4 digits e.g. 1 → "0001"
  const padded = String(nextSequence).padStart(4, '0');

  return `${prefix}${padded}`;
};

module.exports = generateSANumber;