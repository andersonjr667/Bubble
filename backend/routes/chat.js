const router = require('express').Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/chatController');

router.get('/', auth, ctrl.listConversations); // Lista conversas do usuário
router.get('/:id', auth, ctrl.getMessages); // Mensagens de uma conversa
router.post('/:id', auth, ctrl.sendMessage); // Envia mensagem para uma conversa

module.exports = router;
