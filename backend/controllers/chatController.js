const Connection = require('../models/Connection');
const User = require('../models/User');
const Message = require('../models/Message');

// GET /api/chat/ - lista conversas do usuário
exports.listConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // Busca conexões "connected" do usuário
    const connections = await Connection.find({
      $or: [ { from: userId }, { to: userId } ],
      status: 'connected'
    }).populate('from to', 'name avatarUrl');
    res.json(connections);
  } catch (err) { next(err); }
};

// GET /api/chat/:id - lista mensagens de uma conversa
exports.getMessages = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const otherId = req.params.id;
    // Busca mensagens entre userId e otherId
    const messages = await Message.find({
      $or: [
        { from: userId, to: otherId },
        { from: otherId, to: userId }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) { next(err); }
};

// POST /api/chat/:id - envia mensagem
exports.sendMessage = async (req, res, next) => {
  try {
    const from = req.user.id;
    const to = req.params.id;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Mensagem vazia' });
    const msg = await Message.create({ from, to, text });
    res.status(201).json(msg);
  } catch (err) { next(err); }
};
