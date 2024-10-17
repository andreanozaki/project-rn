
const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db'); // Importa a conexão do db.js
const cors = require('cors'); // Importar o pacote CORS

const app = express();
const port = 3001;

// Middleware para habilitar CORS
app.use(cors({
    origin: 'http://127.0.0.1:52817' // Substitua pela porta e origem correta do frontend
  }));
  

// Middleware para processar dados enviados no formato application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Para processar JSON enviado no corpo da requisição

// Rota de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Verificar se os dados foram recebidos corretamente
    console.log(`Tentativa de login com: Username: ${username}, Password: ${password}`);

  // Verificar se o usuário existe no banco de dados
  const query = 'SELECT * FROM users WHERE username = ?';
  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error('Erro ao buscar o usuário:', err);
      return res.status(500).send('Erro no servidor');
    }

    if (results.length === 0) {
      console.log('Usuário não encontrado');
      return res.status(401).send('Usuário não encontrado');
    }

    const user = results[0];

    // Comparar a senha fornecida com a senha armazenada
    if (password === user.password) {
      console.log('Login bem-sucedido');
      res.status(200).send('Login realizado com sucesso!');
    } else {
      console.log('Senha incorreta');
      res.status(401).send('Senha incorreta');
    }
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
