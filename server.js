const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Correção para 'jsonwebtoken'
const mysql = require('mysql');
const app = express();
const PORT = process.env.PORT || 3001;

// Chave secreta para JWT
const SECRET_KEY = 'seu_segredo_super_secreto';

// Configuração do banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'seu_usuario',
  password: 'sua_senha',
  database: 'seu_banco_de_dados'
});

connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    process.exit(1);
  }
  console.log('Conectado ao banco de dados.');
});

// Middleware para parsear JSON
app.use(bodyParser.json());

// Middleware para autenticação
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).send('Token não fornecido.');
  }

  const token = authHeader.split(' ')[1]; // Pega o token após "Bearer "

  if (!token) {
    return res.status(401).send('Token não fornecido.');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Adiciona o usuário decodificado ao objeto da solicitação
    next();
  } catch (error) {
    res.status(401).send('Token inválido.');
  }
};

// Endpoint para login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  connection.query(query, [username], async (err, results) => {
    if (err) {
      return res.status(500).send('Erro no servidor.');
    }

    if (results.length > 0) {
      const user = results[0];

      // Verifica a senha usando bcrypt
      try {
        const match = await bcrypt.compare(password, user.password);

        if (match) {
          // Cria o token JWT
          const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
          res.json({ token });
        } else {
          // Credenciais inválidas
          res.status(401).send('Credenciais inválidas');
        }
      } catch (err) {
        res.status(500).send('Erro no servidor.');
      }
    } else {
      // Credenciais inválidas
      res.status(401).send('Credenciais inválidas');
    }
  });
});

// Endpoint para registro
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    connection.query(query, [username, email, hashedPassword], (err) => {
      if (err) {
        return res.status(500).send('Erro ao registrar o usuário.');
      }
      res.status(201).send('Usuário registrado com sucesso.');
    });
  } catch (err) {
    res.status(500).send('Erro no servidor.');
  }
});

// Endpoint para adicionar comentários
app.post('/add-comment', authenticate, (req, res) => {
  const { recipeId, comment } = req.body;

  if (!recipeId || !comment) {
    return res.status(400).send('ID da receita e comentário são obrigatórios.');
  }

  // Verifica se o usuário está autenticado
  if (!req.user) {
    return res.status(401).send('Usuário não autenticado.');
  }

  const insertQuery = 'INSERT INTO comments (recipe_id, user_id, comment) VALUES (?, ?, ?)';
  connection.query(insertQuery, [recipeId, req.user.id, comment], (err) => {
    if (err) {
      return res.status(500).send('Erro ao adicionar comentário.');
    }
    res.status(201).send('Comentário adicionado com sucesso.');
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
