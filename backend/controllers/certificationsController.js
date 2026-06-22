const Certification = require('../models/Certification');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/certifications (public)
const getCertifications = asyncHandler(async (req, res) => {
  const certifications = await Certification.findAll();
  res.json({ success: true, data: certifications });
});

// POST /api/certifications (admin)
const createCertification = asyncHandler(async (req, res) => {
  const { title, issuer, duration, certificateImage, pdfDocument } = req.body;
  if (!title) throw new ApiError(400, 'title is required.');
  const cert = await Certification.create({ title, issuer, duration, certificateImage, pdfDocument });
  res.status(201).json({ success: true, data: cert });
});

// PUT /api/certifications/:id (admin)
const updateCertification = asyncHandler(async (req, res) => {
  const existing = await Certification.findById(req.params.id);
  if (!existing) throw new ApiError(404, 'Certification not found.');
  const { title, issuer, duration, certificateImage, pdfDocument } = req.body;
  const cert = await Certification.update(req.params.id, { title, issuer, duration, certificateImage, pdfDocument });
  res.json({ success: true, data: cert });
});

// DELETE /api/certifications/:id (admin)
const deleteCertification = asyncHandler(async (req, res) => {
  const existing = await Certification.findById(req.params.id);
  if (!existing) throw new ApiError(404, 'Certification not found.');
  await Certification.softDelete(req.params.id);
  res.json({ success: true, message: 'Certification deleted.' });
});

module.exports = { getCertifications, createCertification, updateCertification, deleteCertification };
