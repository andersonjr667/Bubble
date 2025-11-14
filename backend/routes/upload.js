const router = require('express').Router();
const auth = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const ctrl = require('../controllers/uploadController');

router.post('/avatar', auth, upload.single('avatar'), ctrl.uploadAvatar);

module.exports = router;
