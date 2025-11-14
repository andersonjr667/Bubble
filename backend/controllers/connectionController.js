const Connection = require('../models/Connection');
const User = require('../models/User');

// POST /api/connections
exports.create = async (req, res, next) => {
  try {
    const { to } = req.body;
    const from = req.user.id;
    if (from === to) return res.status(400).json({ message: 'Não pode conectar consigo mesmo' });
    // Verifica se já existe conexão reversa pendente
    const reverse = await Connection.findOne({ from: to, to: from, status: 'pending' });
    if (reverse) {
      await Connection.updateOne({ _id: reverse._id }, { status: 'connected' });
      await Connection.create({ from, to, status: 'connected' });
      return res.json({ status: 'connected' });
    }
    // Cria nova conexão pendente
    const exists = await Connection.findOne({ from, to });
    if (exists) return res.status(409).json({ message: 'Já existe conexão' });
    await Connection.create({ from, to, status: 'pending' });
    res.json({ status: 'pending' });
  } catch (err) { next(err); }
};

// GET /api/connections
exports.list = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const connections = await Connection.find({ $or: [ { from: userId }, { to: userId } ] })
      .populate('from', 'name avatarUrl')
      .populate('to', 'name avatarUrl');
    res.json(connections);
  } catch (err) { next(err); }
};
