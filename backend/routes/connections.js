const router = require('express').Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/connectionController');

router.post('/', auth, ctrl.create);
router.get('/', auth, ctrl.list);

module.exports = router;
