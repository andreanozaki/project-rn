const express = require('express');
const bodyParser = require('body-parser');

const connection = require('./db'); // Importa a conexão do db.js

const cors = require('cors'); // Importar o pacote CORS
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2'); // Para a conexão do MySQL com os comentários
const nodemailer = require('nodemailer'); // Para enviar e-mails
const PDFDocument = require('pdfkit'); // Para gerar PDF (npm install pdfkit)
const csvWriter = require('csv-writer').createObjectCsvStringifier; // Para gerar CSV (npm install csv-writer)
const multer = require('multer');

const app = express();
const port = 3001;

// Middleware para habilitar CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'PUT']
}));

// Middleware para processar dados enviados no formato application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Para processar JSON enviado no corpo da requisição

// Middleware para servir imagens estáticas
app.use('/img', express.static(path.join(__dirname, '../img')));

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = path.resolve(__dirname, '../img/creation-main', req.body.page);
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Configuração do multer para pré-visualização de receitas
const storagePreRecipe = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = path.resolve(__dirname, '../img/pre-recipe');
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const uploadPreRecipe = multer({ storage: storagePreRecipe });

// Rota para registrar usuário
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
  connection.query(query, [email, password], (err) => {
    if (err) {
      console.error('Erro ao registrar usuário:', err);
      return res.status(500).json({ message: 'Erro ao registrar usuário' });
    }
    res.json({ message: 'Usuário registrado com sucesso' });
  });
});

// Rota para adicionar comentário
app.post('/add-comment', (req, res) => {
  const { email, comment, recipe_id } = req.body;
  const query = 'INSERT INTO comments (email, comment, recipe_id) VALUES (?, ?, ?)';
  connection.query(query, [email, comment, recipe_id], (err) => {
    if (err) {
      console.error('Erro ao adicionar comentário:', err);
      return res.status(500).json({ message: 'Erro ao adicionar comentário' });
    }
    res.json({ message: 'Comentário adicionado com sucesso' });
  });
});

// Rota para carregar comentários
app.get('/comments/:recipe_id', (req, res) => {
  const { recipe_id } = req.params;
  const query = 'SELECT * FROM comments WHERE recipe_id = ?';
  connection.query(query, [recipe_id], (err, results) => {
    if (err) {
      console.error('Erro ao carregar comentários:', err);
      return res.status(500).json({ message: 'Erro ao carregar comentários' });
    }
    res.json(results);
  });
});

// Rota para login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Erro ao fazer login:', err);
      return res.status(500).json({ message: 'Erro ao fazer login' });
    }
    if (results.length > 0) {
      res.json({ message: 'Login bem-sucedido' });
    } else {
      res.status(401).json({ message: 'Usuário não encontrado ou senha incorreta' });
    }
  });
});

// Rota para contato
app.post('/contact', (req, res) => {
  console.log('Dados recebidos:', req.body); // Verifica se os dados estão sendo recebidos
  const { name, email, message } = req.body;

  const query = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
  connection.query(query, [name, email, message], (error, results) => {
      if (error) {
          console.error('Erro ao salvar no banco de dados:', error);
          return res.status(500).send('Erro no servidor');
      }
      console.log('Mensagem salva no banco de dados com sucesso!');
      res.status(200).send('Mensagem enviada com sucesso!');
  });
});

// Rota para redefinição de senha
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  // Verifica se o email existe no banco de dados
  const query = 'SELECT * FROM users WHERE email = ?';
  connection.query(query, [email], (err, results) => {
      if (err) {
          console.error('Erro ao buscar usuário:', err);
          return res.status(500).json({ message: 'Erro ao buscar usuário' });
      }
      
      if (results.length > 0) {
          return res.json({ message: 'Instruções para redefinição de senha enviadas para seu email.' });
      } else {
          return res.status(404).json({ message: 'Email não encontrado.' });
      }
  });
});

// Rota para registrar venda de produtos
app.post('/register-sale', (req, res) => {
  const { product, price, sale_date } = req.body;
  
  const query = 'INSERT INTO sales (product, price, sale_date) VALUES (?, ?, ?)';
  connection.query(query, [product, price, sale_date], (err) => {
    if (err) {
      console.error('Erro ao registrar venda:', err);
      return res.status(500).json({ message: 'Erro ao registrar venda' });
    }
    res.json({ message: 'Venda registrada com sucesso!' });
  });
});

// Rota para visualizar todas as vendas
app.get('/sales', (req, res) => {
  const query = 'SELECT * FROM sales';
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar vendas:', err);
      return res.status(500).json({ message: 'Erro ao buscar vendas' });
    }
    
    res.json(results);
  });
});

// Rota para gerar relatório em PDF
app.get('/generate-report', (req, res) => {
  const { month, year } = req.query;
  const query = month === 'all' 
    ? 'SELECT * FROM sales WHERE YEAR(sale_date) = ? ORDER BY MONTH(sale_date), DAY(sale_date)'
    : 'SELECT * FROM sales WHERE MONTH(sale_date) = ? AND YEAR(sale_date) = ?';

  const params = month === 'all' ? [year] : [month, year];

  connection.query(query, params, (err, results) => {
    if (err) {
      console.error('Erro ao buscar vendas:', err);
      return res.status(500).json({ message: 'Erro ao buscar vendas' });
    }

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc.fontSize(18).text(`Relatório de Vendas - ${month === 'all' ? 'Todos os Meses' : `${month}/${year}`}`, { align: 'center' });
    doc.moveDown();

    const tableTop = doc.y + 20;
    const columnWidths = { id: 50, product: 150, price: 100, saleDate: 100 };
    const startX = 50;
    const tableWidth = Object.values(columnWidths).reduce((a, b) => a + b);

    let yPosition = tableTop + 30;
    let currentMonth = '';
    let totalPrice = 0; // variável para armazenar a soma dos preços

    const drawHeader = () => {
      doc.fontSize(12).text('ID', startX, tableTop, { width: columnWidths.id, align: 'center' });
      doc.text('Produto', startX + columnWidths.id, tableTop, { width: columnWidths.product, align: 'center' });
      doc.text('Preço', startX + columnWidths.id + columnWidths.product, tableTop, { width: columnWidths.price, align: 'center' });
      doc.text('Data da Venda', startX + columnWidths.id + columnWidths.product + columnWidths.price, tableTop, { width: columnWidths.saleDate, align: 'center' });
      doc.moveTo(startX, tableTop + 15).lineTo(startX + tableWidth, tableTop + 15).stroke();
      yPosition = tableTop + 30;
    };

    drawHeader();

    results.forEach((sale) => {
      const saleMonth = new Date(sale.sale_date).getMonth() + 1;
      const formattedDate = new Date(sale.sale_date).toLocaleDateString('pt-BR');

      if (month === 'all' && saleMonth !== currentMonth) {
        if (yPosition > doc.page.height - 100) { 
          doc.addPage(); 
          yPosition = 50;
        }
        yPosition += 10;
        doc.fontSize(14).font('Helvetica-Bold').text(`Mês ${saleMonth}/${year}`, startX, yPosition);
        doc.font('Helvetica');
        currentMonth = saleMonth;
        yPosition += 30;
      }

      const saleData = [
        { text: sale.id.toString(), width: columnWidths.id, align: 'center' },
        { text: sale.product, width: columnWidths.product, align: 'center' },
        { text: `R$ ${parseFloat(sale.price).toFixed(2)}`, width: columnWidths.price, align: 'center' },
        { text: formattedDate, width: columnWidths.saleDate, align: 'center' },
      ];

      saleData.reduce((xPos, cell) => {
        doc.text(cell.text, xPos, yPosition, { width: cell.width, align: cell.align });
        return xPos + cell.width;
      }, startX);

      totalPrice += parseFloat(sale.price);

      yPosition += 20;

      if (yPosition > doc.page.height - 100) {
        doc.addPage();
        yPosition = 50;
        drawHeader();
      }
    });

    yPosition += 20;
    doc.fontSize(12).font('Helvetica-Bold').text(`Total Preço: R$ ${totalPrice.toFixed(2)}`, startX, yPosition, { align: 'right' });

    doc.end();
  });
});

// Rota para upload de imagens
app.post('/upload', upload.single('image'), (req, res) => {
  console.log('Rota /upload chamada');
  console.log('Dados recebidos:', req.body);
  console.log('Arquivo:', req.file);

  const imagePath = `/img/creation-main/${req.body.page}/${req.file.filename}`;
  const query = 'INSERT INTO images (page, image_path) VALUES (?, ?)';
  connection.query(query, [req.body.page, imagePath], (err) => {
    if (err) {
      console.error('Erro ao inserir no banco de dados:', err);
      return res.status(500).send();
    }
    res.status(200).send();
  });
});

// Rota para obter imagens
app.get('/images/:page', (req, res) => {
  const page = req.params.page;
  const imageDir = path.join(__dirname, '../img/creation-main', page);

  fs.readdir(imageDir, (err, files) => {
      if (err) {
          console.error('Erro ao ler a pasta:', err);
          return res.status(500).json({ error: 'Erro ao carregar imagens' });
      }

      const images = files
          .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
          .map(file => ({
              image_path: `/img/creation-main/${page}/${file}`,
              id: file
          }));

      console.log('Imagens retornadas:', images);
      res.json(images);
  });
});

// Rota para deletar imagens
app.delete('/delete-image/:id', (req, res) => {
  console.log('Requisição recebida para deletar imagem com ID:', req.params.id); 
  const imageId = req.params.id;

  const query = 'SELECT image_path FROM images WHERE image_path LIKE ?';
  connection.query(query, [`%${imageId}`], (err, results) => {
      if (err) {
          console.error('Erro ao buscar imagem:', err);
          return res.status(500).json({ message: 'Erro ao buscar imagem' });
      }

      if (results.length > 0) {
          const imagePath = path.join(__dirname, '..', results[0].image_path);

          fs.unlink(imagePath, (err) => {
              if (err) {
                  console.error('Erro ao deletar arquivo:', err);
                  return res.status(500).json({ message: 'Erro ao deletar arquivo' });
              }

              const deleteQuery = 'DELETE FROM images WHERE image_path LIKE ?';
              connection.query(deleteQuery, [`%${imageId}`], (err) => {
                  if (err) {
                      console.error('Erro ao deletar do banco de dados:', err);
                      return res.status(500).json({ message: 'Erro ao deletar do banco de dados' });
                  }

                  res.status(200).json({ message: 'Imagem deletada com sucesso' });
              });
          });
      } else {
          res.status(404).json({ message: 'Imagem não encontrada' });
      }
  });
});


 // Rota para upload de pré-visualização de receitas
  
// Rota para upload de pré-visualização de receitas
app.post('/add-complete-recipe', uploadPreRecipe.single('recipeImage'), (req, res) => {
  const { recipeTitle, recipeDescription, ingredients, preparation } = req.body;
  const imagePath = `/img/pre-recipe/${req.file.filename}`;
  const pageName = recipeTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') + '.html';

  const query = 'INSERT INTO recipe_previews (title, description, image_path, page_link, ingredients, preparation) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [recipeTitle, recipeDescription, imagePath, `/pages/${pageName}`, ingredients, preparation], (err, results) => {
      if (err) {
          console.error('Erro ao inserir a receita completa no banco de dados:', err);
          return res.status(500).json({ message: 'Erro ao adicionar a receita completa' });
      }

      // Criação da página completa da receita
      const pageContent = `
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${recipeTitle}</title>
          <link rel="stylesheet" href="../css/style.css">
      </head>
      <body>
          <header class="header"></header>
          <div class="recipes">
              <div class="left-side">
                  <h2 class="left-side__title">${recipeTitle}</h2>
                  <img src="${imagePath}" alt="${recipeTitle}" class="left-side__photo">
              </div>
              <div class="right-side">
                  <h3>Ingredientes:</h3>
                  <ul class="ingredients">${ingredients.split('\n').map(ing => `<li>${ing}</li>`).join('')}</ul>
                  <h3>Modo de Preparo:</h3>
                  <p>${preparation.replace(/\n/g, '<br>')}</p>
              </div>
                      <button class="delete-recipe-btn" data-id="${results.insertId}">Deletar Receita</button>

          </div>
          <footer class="footer"></footer>
      </body>
      </html>`;

      const filePath = path.join(__dirname, '../pages', pageName);

      fs.writeFile(filePath, pageContent, (err) => {
          if (err) {
              console.error('Erro ao criar a página da receita:', err);
              return res.status(500).json({ message: 'Erro ao criar a página da receita' });
          }

          // Adiciona a prévia à página all-recipes.html
          const previewContent = `
          <div class="recipe__card">
              <img src="${imagePath}" alt="${recipeTitle}" class="recipe__image-all flash-effect-2">
              <p class="paragraph title-recipe">${recipeTitle}</p>
              <p class="paragraph">${recipeDescription}</p>
              <a href="/pages/${pageName}" class="btn-main">Ver Receita</a>
              <h3 class="recipe__creator"><ion-icon name="person"></ion-icon> por Ricardo Nozaki</h3>
              <button class="delete-recipe-btn" data-id="${results.insertId}">Deletar Receita</button>
          </div>`;
          
          const allRecipesPath = path.join(__dirname, '../pages/all-recipes.html');

          fs.readFile(allRecipesPath, 'utf8', (err, data) => {
              if (err) {
                  console.error('Erro ao ler a página all-recipes.html:', err);
                  return res.status(500).json({ message: 'Erro ao ler a página all-recipes.html' });
              }

              // Verifica se a tag de contêiner existe
              const containerTag = '<div id="recipePreviewsContainer"></div>';
              if (data.includes(containerTag)) {
                  // Insere a nova prévia dentro da tag
                  const updatedContent = data.replace(containerTag, containerTag + previewContent);

                  fs.writeFile(allRecipesPath, updatedContent, 'utf8', (err) => {
                      if (err) {
                          console.error('Erro ao atualizar a página all-recipes.html:', err);
                          return res.status(500).json({ message: 'Erro ao atualizar a página com a nova prévia' });
                      }
                      res.status(200).json({ success: true, link: `/pages/${pageName}`, message: 'Receita completa publicada com sucesso!' });
                  });
              } else {
                  console.error('Container de prévias não encontrado na página.');
                  return res.status(500).json({ message: 'Container de prévias não encontrado na página.' });
              }
          });
      });
  });
});





app.get('/get-recipe-previews', (req, res) => {
  const query = 'SELECT preview_id, title, description, image_path, page_link FROM recipe_previews';
  connection.query(query, (err, results) => {
      if (err) {
          console.error('Erro ao buscar receitas:', err);
          return res.status(500).json({ message: 'Erro ao buscar receitas' });
      }
      res.json(results);
  });
});


app.get('/pages/:pageName', (req, res) => {
  const pageName = req.params.pageName;
  res.sendFile(path.join(__dirname, `../pages/${pageName}`));
});

app.delete('/delete-recipe/:id', (req, res) => {
  const recipeId = req.params.id;

  const deleteQuery = 'DELETE FROM recipe_previews WHERE preview_id = ?';

  connection.query(deleteQuery, [recipeId], (err, result) => {
      if (err) {
          console.error('Erro ao executar a query:', err);
          return res.status(500).json({ success: false, message: 'Erro ao deletar a receita.' });
      }

      if (result.affectedRows > 0) {
          console.log(`Receita com preview_id ${recipeId} deletada com sucesso.`);
          res.json({ success: true, message: 'Receita deletada com sucesso.' });
      } else {
          console.warn(`Receita com preview_id ${recipeId} não encontrada.`);
          res.status(404).json({ success: false, message: 'Receita não encontrada.' });
      }
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});