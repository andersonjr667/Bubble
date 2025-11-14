// Validação manual de campos para registro e login
function validateRegister(data) {
  const errors = {};
  if (!data.name || data.name.length < 2) errors.name = 'Nome obrigatório';
  if (!data.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) errors.email = 'Email inválido';
  if (!data.password || data.password.length < 8) errors.password = 'Senha deve ter pelo menos 8 caracteres';
  if (data.password !== data.confirmPassword) errors.confirmPassword = 'Senhas não conferem';
  if (!data.age || isNaN(data.age) || data.age < 13) errors.age = 'Idade inválida';
  if (!Array.isArray(data.gostos) || data.gostos.length < 3 || data.gostos.length > 8) errors.gostos = 'Selecione de 3 a 8 gostos';
  return errors;
}

function validateLogin(data) {
  const errors = {};
  if (!data.email) errors.email = 'Email obrigatório';
  if (!data.password) errors.password = 'Senha obrigatória';
  return errors;
}

module.exports = { validateRegister, validateLogin };
