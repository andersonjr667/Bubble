const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const { validateRegister, validateLogin } = require('../utils/validate');

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const errors = validateRegister(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ errors });
    const { name, email, password, age, bio, gostos, avatarUrl, preference } = req.body;
    if (await User.findOne({ email })) return res.status(409).json({ message: 'Email já cadastrado' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, passwordHash, age, bio, gostos, avatarUrl, preference, firstLogin: false
    });
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });
    res.status(201).json({ token });
  } catch (err) { next(err); }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const errors = validateLogin(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ errors });
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Credenciais inválidas' });
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) { next(err); }
};

// GET /api/auth/me
exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json(user);
  } catch (err) { next(err); }
};
