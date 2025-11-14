module.exports = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor',
    errors: err.errors || undefined
  });
};
