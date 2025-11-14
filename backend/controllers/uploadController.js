const cloudinary = require('../utils/cloudinary');

// POST /api/upload/avatar
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Arquivo não enviado' });
    // Validação de tipo e tamanho
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'Tipo de arquivo inválido' });
    }
    if (req.file.size > 2 * 1024 * 1024) {
      return res.status(400).json({ message: 'Arquivo muito grande (máx 2MB)' });
    }
    const result = await cloudinary.uploader.upload_stream({
      folder: 'bubble/avatars',
      resource_type: 'image',
    }, (error, result) => {
      if (error) return next(error);
      res.json({ url: result.secure_url });
    }).end(req.file.buffer);
  } catch (err) { next(err); }
};
