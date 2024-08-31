const bcrypt = require('bcrypt');


const password = '123123'; // Senha a ser criptografada
const saltRounds = 10; // Número de rounds para a criptografia

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Erro ao gerar hash:', err);
    return;
  }
  console.log('Senha criptografada:', hash);
});
