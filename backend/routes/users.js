const router = require('express').Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/userController');

router.get('/', auth, ctrl.list);
router.get('/:id', auth, ctrl.detail);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.remove);

module.exports = router;
