const User = require('../models/User');
const { overlapCount } = require('../utils/overlap');
const { validateRegister } = require('../utils/validate');
const bcrypt = require('bcrypt');

// GET /api/users
exports.list = async (req, res, next) => {
  try {
    const { q, gosto, page = 1, limit = 20, mode = 'parecidos' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    let filter = {};
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (gosto) filter.gostos = gosto;
    const users = await User.find(filter).select('-passwordHash');
    // Ordenação por overlap de gostos
    let sorted = users;
    if (req.user && users.length) {
      const me = await User.findById(req.user.id);
      if (!me) return res.status(401).json({ message: 'Usuário autenticado não encontrado. Faça login novamente.' });
      sorted = users.map(u => ({
        ...u.toObject(),
        overlap: overlapCount(me.gostos, u.gostos)
      }));
      if (mode === 'parecidos') {
        sorted.sort((a, b) => b.overlap - a.overlap);
      } else if (mode === 'explorar') {
        sorted.sort((a, b) => a.overlap - b.overlap);
      }
    }
    const paginated = sorted.slice(skip, skip + parseInt(limit));
    res.json({ users: paginated, total: sorted.length });
  } catch (err) {
    console.error('Erro em GET /api/users:', err);
    next({ status: 500, message: 'Erro ao buscar usuários', errors: err.message });
  }
};

// GET /api/users/:id
exports.detail = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) { next(err); }
};

// PUT /api/users/:id
exports.update = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) return res.status(403).json({ message: 'Acesso negado' });
    const { name, age, bio, gostos, avatarUrl, preference } = req.body;
    const update = { name, age, bio, gostos, avatarUrl, preference };
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-passwordHash');
    res.json(user);
  } catch (err) { next(err); }
};

// DELETE /api/users/:id
exports.remove = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) return res.status(403).json({ message: 'Acesso negado' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Conta deletada' });
  } catch (err) { next(err); }
};
