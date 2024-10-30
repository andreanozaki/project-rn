// db.test.js
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
