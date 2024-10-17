const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db'); // Importa a conexão do db.js
const cors = require('cors'); // Importar o pacote CORS
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

// Middleware para habilitar CORS
const cors = require('cors');

app.use(cors({
    origin: 'http://127.0.0.1:8080', // Origem correta do frontend
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

// Rota para o login
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
    return res.status(200).json({ message: 'Login realizado com sucesso!' }); // Sucesso como JSON
  } else {
    console.log('Senha incorreta');
    return res.status(401).json({ message: 'Senha incorreta' }); // Retorna erro como JSON
  }
});
});

// Rota para criar uma nova receita (disponível apenas para o chef)
app.post('/create-recipe', upload.single('image'), (req, res) => {
  const { title, description, time, level, yield: yieldAmount, ingredients, preparation } = req.body;
  const imagePath = `../recipes-assets/img/${req.file.filename}`;
  
  // Formatação dos ingredientes e preparo para HTML
  const ingredientsList = ingredients.split('\n').map(item => `<li class="paragraph">${item}</li>`).join('');
  const preparationList = preparation.split('\n').map(item => `<p class="paragraph">${item}</p>`).join('');

  // Template HTML para a nova receita
  const recipeHtml = `
  <!DOCTYPE html>
  <html lang="pt-br">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - Receita de ${description}</title>
      <link rel="stylesheet" href="../css/style.css">
  </head>
  <body>
    <div class="recipes">
        <div class="left-side">
            <h2 class="left-side__title">${title}</h2>
            <h3 class="left-side__subheading"><ion-icon name="person"></ion-icon> Receita feita por Chef Ricardo Nozaki</h3>
            <img src="${imagePath}" alt="${title}" class="left-side__photo">
        </div>

        <div class="right-side">
            <h2 class="right-side__description paragraph">${description}</h2>
            <div class="status-recipe">
                <div class="time">
                    <span class="icon-recipe"> TEMPO</span><br>
                    <span> <ion-icon name="time" class="icon-recipe"></ion-icon> ${time}</span>
                </div>
                <div class="nivel">
                    <span class="icon-recipe"> NÍVEL</span><br>
                    <span><ion-icon name="trending-up" class="icon-recipe"></ion-icon> ${level}</span>
                </div>
                <div class="rendimento">
                    <span class="icon-recipe"> RENDIMENTO</span><br>
                    <span><ion-icon name="cafe" class="icon-recipe"></ion-icon> ${yieldAmount}</span>
                </div>
            </div>

            <span class="topic"><strong>Ingredientes:</strong></span>
            <ul class="ingredients">${ingredientsList}</ul>

            <div class="prepare">
                <span class="topic"><strong>Modo de Preparo:</strong></span>
                ${preparationList}
            </div>
        </div>
    </div>
  </body>
  </html>
  `;

  // Salvar o HTML da receita na pasta recipes-assets/pages/
  const filePath = path.join(__dirname, 'recipes-assets/pages', `${title.toLowerCase().replace(/\s+/g, '-')}.html`);
  fs.writeFile(filePath, recipeHtml, (err) => {
    if (err) {
      return res.status(500).send('Erro ao criar a receita.');
    }
    res.redirect(`/recipes-assets/pages/${title.toLowerCase().replace(/\s+/g, '-')}.html`);
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
