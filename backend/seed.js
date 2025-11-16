// Script para popular o banco com usuários fictícios
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
let mongoURI = process.env.MONGODB_URI;
try {
  mongoURI = require('./config').mongoURI || mongoURI;
} catch {}

const gostosList = [
  'música', 'cinema', 'esportes', 'leitura', 'tecnologia', 'viagens', 'arte', 'games', 'culinária', 'natureza', 'moda', 'fotografia'
];

const nomes = [
  'Ana', 'Bruno', 'Carla', 'Diego', 'Eduarda', 'Felipe', 'Gabriela', 'Henrique', 'Isabela', 'João', 'Larissa', 'Marcos'
];

const bios = [
  'Amo conhecer pessoas novas!',
  'Apaixonado por música e viagens.',
  'Cinéfila e leitora nas horas vagas.',
  'Esportista e gamer.',
  'Curioso por tecnologia e arte.',
  'Fotógrafo amador e amante da natureza.'
];

function randomFrom(arr, n) {
  const copy = [...arr];
  const out = [];
  while (out.length < n && copy.length) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

async function seed() {
  if (!mongoURI) {
    console.error('MONGODB_URI não definida. Configure no .env ou config.js');
    process.exit(1);
  }
  try {
    await mongoose.connect(mongoURI);
    await User.deleteMany();
    const users = [];
    for (let i = 0; i < 12; i++) {
      const gostos = randomFrom(gostosList, Math.floor(Math.random() * 6) + 3);
      const user = new User({
        name: nomes[i],
        email: `user${i + 1}@bubble.com`,
        passwordHash: await require('bcryptjs').hash('senha1234', 10),
        age: 18 + Math.floor(Math.random() * 15),
        bio: bios[i % bios.length],
        avatarUrl: `assets/avatars/avatar${(i % 6) + 1}.png`, // compatível com frontend
        gostos,
        preference: Math.random() > 0.5 ? 'parecidos' : 'explorar',
        firstLogin: false
      });
      users.push(user);
    }
    await User.insertMany(users);
    console.log('Usuários fictícios criados!');
    process.exit();
  } catch (err) {
    console.error('Erro ao rodar seed:', err);
    process.exit(1);
  }
}

seed();
