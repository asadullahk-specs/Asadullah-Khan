const Message = require('../models/Message');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/messages (public) — contact form submission
const submitMessage = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;
  if (!firstName || !lastName || !email || !message) {
    throw new ApiError(400, 'firstName, lastName, email and message are required.');
  }
  const saved = await Message.create({ firstName, lastName, email, phone, message });
  res.status(201).json({ success: true, data: saved, message: 'Thanks! Your message has been sent.' });
});

// GET /api/messages (admin)
const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.findAll();
  const unreadCount = await Message.unreadCount();
  res.json({ success: true, data: messages, unreadCount });
});

// GET /api/messages/:id (admin)
const getMessage = asyncHandler(async (req, res) => {
  const msg = await Message.findById(req.params.id);
  if (!msg) throw new ApiError(404, 'Message not found.');
  res.json({ success: true, data: msg });
});

// PATCH /api/messages/:id/read (admin) — body: { isRead: boolean }
const markRead = asyncHandler(async (req, res) => {
  const existing = await Message.findById(req.params.id);
  if (!existing) throw new ApiError(404, 'Message not found.');
  const isRead = req.body.isRead !== undefined ? !!req.body.isRead : true;
  const msg = await Message.setRead(req.params.id, isRead);
  res.json({ success: true, data: msg });
});

// DELETE /api/messages/:id (admin)
const deleteMessage = asyncHandler(async (req, res) => {
  const existing = await Message.findById(req.params.id);
  if (!existing) throw new ApiError(404, 'Message not found.');
  await Message.softDelete(req.params.id);
  res.json({ success: true, message: 'Message deleted.' });
});

module.exports = { submitMessage, getMessages, getMessage, markRead, deleteMessage };
