// db.test.js
//Este arquivo de teste usa a conexão configurada no ambiente de
// teste para verificar se a conexão com o banco de dados ocorre sem erros.
//Testes de conexão: db.test.js se conecta ao banco usando a configuração .env.test.

const connection = require('./db');

test('Conexão com o banco de dados deve ser bem-sucedida', (done) => {
  connection.connect((err) => {
    expect(err).toBeNull(); // Verifica se não houve erro
    done(); // Finaliza o teste assíncrono
  });
});

// Fecha a conexão após todos os testes
afterAll(() => {
  connection.end();
});
