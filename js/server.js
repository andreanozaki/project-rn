
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

// Middleware para processar dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '080808',
    database: 'clientes'
});

// Testar a conexão com o banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL!');
});

// Rota para lidar com o envio do formulário
app.post('/contact', (req, res) => {
    const { nome, email, mensagem } = req.body;  // 'mensagem' deve ser usado, não 'message'

    // Validação simples
    if (!nome || !email || !mensagem) {
        return res.status(400).send('Todos os campos são obrigatórios!');
    }

    // Inserir dados no banco de dados
    const query = 'INSERT INTO contacts (nome, email, mensagem) VALUES (?, ?, ?)';
    connection.query(query, [nome, email, mensagem], (err, result) => {  // Certifique-se de usar 'mensagem'
        if (err) {
            console.error('Erro ao salvar os dados:', err);
            return res.status(500).send('Erro no servidor');
        }
        res.status(200).send('Dados enviados com sucesso!');
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
