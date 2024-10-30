const express = require('express');
const bodyParser = require('body-parser');

const connection = require('./db'); // Importa a conexão do db.js

const cors = require('cors'); // Importar o pacote CORS
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2'); // Para a conexão do MySQL com os comentários
const nodemailer = require('nodemailer'); // Para enviar e-mails
const PDFDocument = require('pdfkit'); // Para gerar PDF (npm install pdfkit)
const csvWriter = require('csv-writer').createObjectCsvStringifier; // Para gerar CSV (npm install csv-writer)

const app = express();
const port = 3001;

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

// Rota para registrar usuário
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
  db.query(query, [email, password], (err) => {
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
  db.query(query, [email, comment, recipe_id], (err) => {
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



// Rota para registrar venda de produtos
app.post('/register-sale', (req, res) => {
  const { product, price, quantity, sale_date } = req.body;
  
  const query = 'INSERT INTO sales (product, price, quantity, sale_date) VALUES (?, ?, ?, ?)';
  connection.query(query, [product, price, quantity, sale_date], (err) => {
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
    
    console.log('Vendas registradas:');
    results.forEach((sale) => {
      console.log(`ID: ${sale.id}, Produto: ${sale.product}, Quantidade: ${sale.quantity}, Preço: R$${sale.price}, Data da Venda: ${sale.sale_date}`);
    });

    res.json(results);
  });
});


//rota relatorio pdf
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
    const columnWidths = { id: 50, product: 150, quantity: 80, price: 100, saleDate: 100 };
    const startX = 50;
    const tableWidth = Object.values(columnWidths).reduce((a, b) => a + b);

    let yPosition = tableTop + 30;
    let currentMonth = '';

    // Cabeçalho da tabela
    const drawHeader = () => {
      doc.fontSize(12).text('ID', startX, tableTop, { width: columnWidths.id, align: 'center' });
      doc.text('Produto', startX + columnWidths.id, tableTop, { width: columnWidths.product, align: 'center' });
      doc.text('Quantidade', startX + columnWidths.id + columnWidths.product, tableTop, { width: columnWidths.quantity, align: 'center' });
      doc.text('Preço', startX + columnWidths.id + columnWidths.product + columnWidths.quantity, tableTop, { width: columnWidths.price, align: 'center' });
      doc.text('Data da Venda', startX + columnWidths.id + columnWidths.product + columnWidths.quantity + columnWidths.price, tableTop, { width: columnWidths.saleDate, align: 'center' });
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
        doc.fontSize(14).text(`Mês ${saleMonth}/${year}`, startX, yPosition);
        currentMonth = saleMonth;
        yPosition += 30;
      }

      const saleData = [
        { text: sale.id.toString(), width: columnWidths.id, align: 'center' },
        { text: sale.product, width: columnWidths.product, align: 'center' },
        { text: sale.quantity.toString(), width: columnWidths.quantity, align: 'center' },
        { text: `R$ ${parseFloat(sale.price).toFixed(2)}`, width: columnWidths.price, align: 'center' },
        { text: formattedDate, width: columnWidths.saleDate, align: 'center' },
      ];
    
      saleData.reduce((xPos, cell) => {
        doc.text(cell.text, xPos, yPosition, { width: cell.width, align: cell.align });
        return xPos + cell.width;
      }, startX);

      yPosition += 20;

      if (yPosition > doc.page.height - 100) {
        doc.addPage();
        yPosition = 50;
        drawHeader(); // Redesenha o cabeçalho na nova página
      }
    });

    doc.end();
  });
});


// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});