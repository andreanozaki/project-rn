const mysql = require('mysql2');
const dotenv = require('dotenv');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '080808',  // Sua senha do MySQL
    database: 'comments_db'  // Seu banco de dados
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL!');
});

module.exports = connection;
