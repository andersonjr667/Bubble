const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  age: { type: Number, required: true },
  bio: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  gostos: [{ type: String, required: true }],
  preference: { type: String, enum: ['parecidos', 'explorar'], default: 'parecidos' },
  firstLogin: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
