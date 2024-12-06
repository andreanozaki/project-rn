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

const bcrypt = require('bcrypt');
const saltRounds = 10;
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





app.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Gerar o hash da senha
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error('Erro ao gerar hash da senha:', err);
      return res.status(500).json({ message: 'Erro ao gerar hash da senha' });
    }

    // Inserir o usuário no banco de dados com a senha criptografada
    const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
    connection.query(query, [email, hashedPassword], (err) => {
      if (err) {
        console.error('Erro ao registrar usuário:', err);
        return res.status(500).json({ message: 'Erro ao registrar usuário' });
      }
      res.json({ message: 'Usuário registrado com sucesso' });
    });
  });
});










// Rota para adicionar comentário
app.post('/add-comment', (req, res) => {
  const { email, comment, recipe_id } = req.body;

  if (!email || !comment || !recipe_id) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  // Verifica se o comentário já existe
  const checkQuery = 'SELECT * FROM comments WHERE email = ? AND comment = ? AND recipe_id = ?';
  connection.query(checkQuery, [email, comment, recipe_id], (checkErr, results) => {
    if (checkErr) {
      console.error('Erro ao verificar comentário existente:', checkErr);
      return res.status(500).json({ message: 'Erro ao verificar comentário existente.' });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: 'Comentário já foi adicionado anteriormente.' });
    }

    // Adiciona o comentário
    const query = 'INSERT INTO comments (email, comment, recipe_id) VALUES (?, ?, ?)';
    connection.query(query, [email, comment, recipe_id], (err, result) => {
      if (err) {
        console.error('Erro ao adicionar comentário:', err);
        return res.status(500).json({ message: 'Erro ao adicionar comentário.' });
      }

      res.status(201).json({ message: 'Comentário adicionado com sucesso!' });
    });
  });
});



// Rota para carregar comentários
app.get('/comments/:recipe_id', (req, res) => {
  const { recipe_id } = req.params;
  const query = `
      SELECT email, comment, created_at 
      FROM comments 
      WHERE recipe_id = ? 
      ORDER BY created_at ASC
  `;

  connection.query(query, [recipe_id], (err, results) => {
      if (err) {
          console.error('Erro ao carregar comentários:', err);
          return res.status(500).json({ message: 'Erro ao carregar comentários' });
      }
      res.json(results); // Retorna todos os comentários ordenados por `created_at`
  });
});




// Rota para login
// Rota para login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error('Erro ao fazer login:', err);
      return res.status(500).json({ message: 'Erro ao fazer login' });
    }

    if (results.length > 0) {
      const user = results[0];

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error('Erro ao comparar senha:', err);
          return res.status(500).json({ message: 'Erro ao comparar senha' });
        }

        if (result) {
          // Verificar o papel do usuário
          const isChef = user.role === 'admin';
          
          // Enviar a resposta com a mensagem de sucesso e o papel do usuário
          res.json({ message: 'Login bem-sucedido', isChef });
        } else {
          res.status(401).json({ message: 'Senha incorreta' });
        }
      });
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
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

  if (!req.file) {
    return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
  }

  const imagePath = `/img/creation-main/${req.body.page}/${req.file.filename}`;
  const query = 'INSERT INTO images (page, image_path) VALUES (?, ?)';

  connection.query(query, [req.body.page, imagePath], (err) => {
    if (err) {
      console.error('Erro ao inserir no banco de dados:', err);
      return res.status(500).json({ error: 'Erro no banco de dados' });
    }
    res.status(200).json({ message: 'Imagem enviada com sucesso!' });
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

// Rota para upload de receitas completas
app.post('/add-complete-recipe', uploadPreRecipe.single('recipeImage'), (req, res) => {
  const { recipeTitle, recipeDescription, ingredients, preparation, time, level, yield: recipeYield } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'Imagem da receita é obrigatória.' });
  }

  const imagePath = `/img/pre-recipe/${req.file.filename}`;
  const pageName = recipeTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') + '.html';

  const query = `
    INSERT INTO recipe_previews (title, description, image_path, page_link, ingredients, preparation, time, level, yield) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [recipeTitle, recipeDescription, imagePath, `/pages/${pageName}`, ingredients, preparation, time, level, recipeYield],
    (err, results) => {
      if (err) {
        console.error('Erro ao inserir a receita completa no banco de dados:', err);
        return res.status(500).json({ message: 'Erro ao adicionar a receita completa' });
      }

      const recipeId = results.insertId;

// Criação da página completa da receita
const pageContent = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Course"/>


    <link rel="stylesheet" href="/css/style.css">

    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

 
    <script src="js/script.js" defer></script>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script
    type="module"
    src="https://unpkg.com/ionicons@5.4.0/dist/ionicons/ionicons.esm.js"></script>
  <script
    nomodule
    src="https://unpkg.com/ionicons@5.4.0/dist/ionicons/ionicons.js"></script>
  
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Unica+One&display=swap" rel="stylesheet">
<title>Ricardo Nozaki Pastry Chef</title>

</head>

<body>
    <header class="header ">
        <a href="index.html">
            <img class="logo" src="img/base/logo/lo2.png" alt="logo">
        </a>
      
        
     
        <nav class="main-nav">
            <ul class="main-nav-list">
                <li><a class="main-nav-link" href="#aboutme">Chef</a></li>
                <li><a class="main-nav-link" href="#creations">Criações</a></li>
                <li><a class="main-nav-link" href="#recipe">Receitas</a></li>
                <li><a class="main-nav-link nav-cta" href="#ebooks">E-book</a></li>
                <li><a class="main-nav-link" href="pages/contato.html">Contato</a></li>
                <li><a class="main-nav-link" href="login.html">Login</a></li>
                <li><a id="logout-link"  class="main-nav-link" href="#"   style="display: none;">Sair</a></li>


            </ul>
        </nav>
   <!-- Botão de menu hambúrguer para telas menores -->

   <button class="hamburger" aria-label="Menu" aria-expanded="false">
    <ion-icon name="menu-outline" class="icon-menu"></ion-icon>
    <ion-icon name="close-outline" class="icon-close"></ion-icon>

</button>
    </header>
    <div class="recipes">
        <div class="left-side">
            <h2 class="left-side__title">${recipeTitle}</h2>
            <h3 class="left-side__subheading"><ion-icon name="person"></ion-icon> Receita feita por Chef Ricardo Nozaki</h3>
            <img src="${imagePath}" alt="${recipeTitle}" class="left-side__photo">
        </div>
        <div class="right-side">
            <h2 class="right-side__description paragraph">Confira essa deliciosa receita:</h2>
            
            <span class="topic"><strong>Ingredientes:</strong></span>
            <ul class="ingredients">
                ${ingredients.split('\n').map(ing => `<li>${ing}</li>`).join('')}
            </ul>
            <div class="prepare">
                <span class="topic"><strong>Modo de Preparo:</strong></span>
                <p>${preparation.replace(/\n/g, '<br>')}</p>
            </div>
        </div>
    </div>
    <!-- Adicionar o formulário de comentários -->
    <div class="comment-section">
        <h2>Escrever Comentário</h2>
        <form id="commentForm">
            <input type="hidden" id="recipe_id" name="recipe_id" value="${recipeId}">
            <input type="email" id="email" name="email" placeholder="Digite seu email..." required>
            <textarea id="comment" name="comment" rows="4" placeholder="Digite seu comentário..." required></textarea>
            <button type="submit">Enviar Comentário</button>
        </form>
        <!-- Mensagem de sucesso ou erro -->
        <p id="message" class="message"></p>
    </div>
    <!-- Exibir comentários -->
    <div class="comment-list">
        <h3>Comentários:</h3>
        <ul id="comments">
            <!-- Os comentários específicos da receita aparecerão aqui -->
        </ul>
    </div>
    <div class="share-buttons">
        <a href="https://www.instagram.com/share?url=https://yourwebsite.com/receita-${recipeId}.html" target="_blank" class="share-btn instagram">
            <ion-icon name="logo-instagram"></ion-icon> Compartilhar no Instagram
        </a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=https://yourwebsite.com/receita-${recipeId}.html" target="_blank" class="share-btn facebook">
            <ion-icon name="logo-facebook"></ion-icon> Compartilhar no Facebook
        </a>
    </div>

   
    

    <footer class="footer">
        <div class="grid-5cols">
            
            <div class="address-col">
                <p class="footer-heading">Contate-nos</p>
                <a class="footer-link" href="mailto:ricardonozaki@gmail.com">
                    <ion-icon name="mail"></ion-icon> ricardonozaki@gmail.com
                </a>
            </div>
            <div class="address-col">
                <p class="footer-heading">Links Úteis</p>
                <ul>
                    <li><a class="footer-link" href="#recipe">Receitas</a></li>
                    <li><a class="footer-link" href="#ebooks">E-books</a></li>
                </ul>
            </div>
            <div class="social-links">
                <p class="footer-heading">Siga-me:</p>
                <ul class="social-media-footer">
                    <li><a href="https://www.instagram.com/andreahcodes/" target="_blank" class="icon">
                        <ion-icon name="logo-instagram"></ion-icon>
                    </a></li>
                    <li><a href="https://www.linkedin.com/in/andreahcodes/" target="_blank" class="icon">
                        <ion-icon name="logo-facebook"></ion-icon>
                    </a></li>
                </ul>
            </div>
        </div>
        <p class="copyright">
            &copy; 2023 Ricardo Nozaki. Todos os direitos reservados. Site por 
            <a href="https://andreanozaki.com/">AN Sites</a>
        </p>
    </footer>
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
    <div class="recipe__card" data-id="${recipeId}">
        <img src="${imagePath}" alt="${recipeTitle}" class="recipe__image-all flash-effect-2">
        <p class="paragraph title-recipe">${recipeTitle}</p>
        <p class="paragraph">${recipeDescription}</p>
        <a href="/pages/${pageName}" class="btn-main">Ver Receita</a>
        <h3 class="recipe__creator"><ion-icon name="person"></ion-icon> por Ricardo Nozaki</h3>
        <button class="delete-recipe-btn" data-id="${recipeId}">Deletar Receita</button>
    </div>`;
    const allRecipesPath = path.join(__dirname, '../pages/all-recipes.html');

        fs.readFile(allRecipesPath, 'utf8', (err, data) => {
          if (err) {
            console.error('Erro ao ler a página all-recipes.html:', err);
            return res.status(500).json({ message: 'Erro ao ler a página all-recipes.html' });
          }

          const containerTag = '<div id="recipePreviewsContainer"></div>';
          if (data.includes(containerTag)) {
            const updatedContent = data.replace(containerTag, containerTag + previewContent);

            fs.writeFile(allRecipesPath, updatedContent, 'utf8', (err) => {
              if (err) {
                console.error('Erro ao atualizar a página all-recipes.html:', err);
                return res.status(500).json({ message: 'Erro ao atualizar a página com a nova prévia' });
              }

              res.status(200).json({
                success: true,
                link: `/pages/${pageName}`,
                message: 'Receita completa publicada com sucesso!',
              });
            });
          } else {
            console.error('Container de prévias não encontrado na página.');
            return res.status(500).json({ message: 'Container de prévias não encontrado na página.' });
          }
        });
      });
    }
  );
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

  // Buscar receita no banco de dados
  const query = 'SELECT page_link, image_path FROM recipe_previews WHERE preview_id = ?';
  connection.query(query, [recipeId], (err, results) => {
      if (err) {
          console.error('Erro ao buscar receita:', err);
          return res.status(500).json({ success: false, message: 'Erro ao buscar a receita.' });
      }

      if (results.length > 0) {
          const { page_link, image_path } = results[0];
          const pagePath = path.join(__dirname, '../pages', path.basename(page_link));
          const imagePath = path.join(__dirname, '..', image_path);
          const allRecipesPath = path.join(__dirname, '../pages/all-recipes.html');

          // Deletar do banco
          const deleteQuery = 'DELETE FROM recipe_previews WHERE preview_id = ?';
          connection.query(deleteQuery, [recipeId], (deleteErr) => {
              if (deleteErr) {
                  console.error('Erro ao deletar do banco:', deleteErr);
                  return res.status(500).json({ success: false, message: 'Erro ao deletar a receita.' });
              }

              // Deletar página e imagem
              fs.unlink(pagePath, (fsErr) => {
                  if (fsErr && fsErr.code !== 'ENOENT') {
                      console.error('Erro ao deletar página:', fsErr);
                  }
              });

              fs.unlink(imagePath, (imageErr) => {
                  if (imageErr && imageErr.code !== 'ENOENT') {
                      console.error('Erro ao deletar imagem:', imageErr);
                  }
              });

              // Atualizar `all-recipes.html`
              fs.readFile(allRecipesPath, 'utf8', (readErr, fileContent) => {
                  if (readErr) {
                      console.error('Erro ao ler all-recipes.html:', readErr);
                      return res.status(500).json({ success: false, message: 'Erro ao ler a página.' });
                  }

                      // Usar Regex para localizar o card correto no arquivo HTML
                      const recipeDivRegex = new RegExp(
                        `<div class="recipe__card" data-id="${recipeId}"[\\s\\S]*?</div>`,
                        'g'
                    );

                    if (!recipeDivRegex.test(fileContent)) {
                        return res.status(404).json({ success: false, message: 'Receita não encontrada no arquivo.' });
                    }
                  // Substituir a div correspondente pela string vazia
                  const updatedContent = fileContent.replace(recipeDivRegex, '');

                  fs.writeFile(allRecipesPath, updatedContent, 'utf8', (writeErr) => {
                      if (writeErr) {
                          console.error('Erro ao atualizar all-recipes.html:', writeErr);
                          return res.status(500).json({ success: false, message: 'Erro ao atualizar a página.' });
                      }

                      console.log(`Receita ID ${recipeId} deletada com sucesso.`);
                      res.status(200).json({ success: true, message: 'Receita deletada com sucesso!' });
                  });
              });
          });
      } else {
          res.status(404).json({ success: false, message: 'Receita não encontrada.' });
      }
  });
});


            

// Rota para enviar feedback
app.post('/feedback', (req, res) => {
  const { user_email, rating, comment } = req.body;

  // Validar se a avaliação está entre os valores permitidos
  const validRatings = ['sim', 'não', 'parcialmente'];
  if (!validRatings.includes(rating)) {
      return res.status(400).json({ message: 'Avaliação inválida.' });
  }

  const query = 'INSERT INTO feedbacks (user_email, rating, comment) VALUES (?, ?, ?)';
  connection.query(query, [user_email || null, rating, comment || null], (err) => {
      if (err) {
          console.error('Erro ao salvar feedback no banco de dados:', err);
          return res.status(500).json({ message: 'Erro ao salvar feedback.' });
      }
      res.json({ message: 'Feedback enviado com sucesso!' });
  });
});

// Rota para buscar todas as mensagens de contato
app.get('/contact-messages', (req, res) => {
  const query = 'SELECT * FROM contacts ORDER BY created_at DESC';
  connection.query(query, (err, results) => {
      if (err) {
          console.error('Erro ao buscar mensagens:', err);
          return res.status(500).json({ message: 'Erro ao buscar mensagens.' });
      }
      res.json(results);
  });
});

// Rota para buscar todos os feedbacks
app.get('/feedbacks', (req, res) => {
  const query = 'SELECT * FROM feedbacks ORDER BY created_at DESC';
  connection.query(query, (err, results) => {
      if (err) {
          console.error('Erro ao buscar feedbacks:', err);
          return res.status(500).json({ message: 'Erro ao buscar feedbacks.' });
      }
      console.log('Feedbacks encontrados:', results); // Log dos resultados para depuração
      res.json(results);
  });
});











// Rota para registrar usuário com senha criptografada

// Rota para registrar usuário com senha criptografada

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});