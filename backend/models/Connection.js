const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'connected', 'rejected'], default: 'pending' },
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model('Connection', connectionSchema);
