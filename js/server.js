
const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db'); // Importa a conexão do db.js
const cors = require('cors'); // Importar o pacote CORS
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2'); // Para a conexão do MySQL com os comentários

const app = express();
const port = 3001;

// Middleware para habilitar CORS
// Middleware para habilitar CORS
app.use(cors({
  origin: '*'  // Permite qualquer origem
}));


// Middleware para processar dados enviados no formato application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Para processar JSON enviado no corpo da requisição

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'recipes-assets/img'); // Pasta onde as imagens serão salvas
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nome único para a imagem
  }
});
const upload = multer({ storage });

// Conexão com o banco de dados MySQL para os comentários
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '080808',  // Substitua pela sua senha do MySQL
    database: 'comments_db'  // O banco de dados que você criou no MySQL
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL!');
});

// Rota para adicionar um novo comentário
app.post('/add-comment', (req, res) => {
  const { email, comment, recipe_id } = req.body;

  // Verificar se os dados estão sendo recebidos corretamente
  console.log(`Comentário recebido: Email: ${email}, Comentário: ${comment}, Receita ID: ${recipe_id}`);

  const sql = 'INSERT INTO comments (email, comment, recipe_id) VALUES (?, ?, ?)';
  db.query(sql, [email, comment, recipe_id], (err, result) => {
      if (err) {
          console.error('Erro ao adicionar comentário:', err);
          res.status(500).send({ message: 'Erro ao adicionar comentário' });
          return;
      }
      res.send({ message: 'Comentário adicionado com sucesso!' });
  });
});

// Rota para obter todos os comentários de uma receita
app.get('/comments/:recipe_id', (req, res) => {
  const recipe_id = req.params.recipe_id;
  
  // Verifique se o recipe_id foi recebido corretamente
  console.log(`Recebendo comentários para receita ID: ${recipe_id}`);
  
  const sql = 'SELECT * FROM comments WHERE recipe_id = ?';
  db.query(sql, [recipe_id], (err, results) => {
    if (err) {
      console.error('Erro ao recuperar comentários:', err);
      res.status(500).send({ message: 'Erro ao recuperar comentários' });
      return;
    }
    res.send(results);  // Retorna os comentários para o frontend
  });
});

//login
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Verifica se os dados foram recebidos corretamente
  if (!email || !password) {
    return res.status(400).send('Por favor, preencha todos os campos.');
  }

  // Verifica se o usuário existe no banco de dados
  const query = 'SELECT * FROM users WHERE email = ?';
  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário no BD:', err);
      return res.status(500).send('Erro no servidor');
    }
    if (results.length === 0) {
      return res.status(401).send('Usuário não encontrado');
    }

    const user = results[0];

    // Comparar a senha fornecida com a senha armazenada
    if (password === user.password) {
      return res.status(200).json({ message: 'Login realizado com sucesso!' });
    } else {
      return res.status(401).json({ message: 'Senha incorreta' });
    }
  });
});


// Unificado - Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
