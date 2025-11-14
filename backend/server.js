const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { port, mongoURI } = require('./config');
const errorHandler = require('./middlewares/errorHandler');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  handler: (req, res) => {
    res.status(429).json({ message: 'Muitas tentativas. Tente novamente em alguns minutos.' });
  }
});
app.use('/api/auth', authLimiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/connections', require('./routes/connections'));
app.use('/api/chat', require('./routes/chat'));

// Servir frontend (SPA) via Express
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/cadastro.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});
app.get('/conhecer', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/conhecer.html'));
});
app.get('/perfil', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/perfil.html'));
});
app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/chat.html'));
});

// Servindo a pasta de assets (imagens de avatar) como estática no Express
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// Welcome message
app.get('/', (req, res) => {
  res.send('Bubble API rodando!');
});

// Error handler
app.use(errorHandler);

// MongoDB connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
