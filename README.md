# Website de Gastronomia para Vendas de E-books

Um website voltado para chefs e entusiastas da gastronomia, com foco na venda de e-books e na apresentação de receitas. O projeto oferece uma plataforma moderna e interativa para gerenciamento de conteúdo, visualização de receitas e compra de e-books.


## 📋 Descrição

Este projeto foi desenvolvido para atender às necessidades de profissionais da gastronomia que desejam expandir sua presença online. A plataforma permite o gerenciamento de receitas, vendas de e-books e interação com o público por meio de comentários e galerias de fotos, oferecendo uma experiência completa para usuários e administradores.


---

## ⚙️ Funcionalidades

- 📚 **Venda de E-books:** Redirecionamento para uma plataforma de pagamento para compra de e-books.
- 🖼️ **Galeria de Fotos:** Upload e gerenciamento de imagens de criações gastronômicas.
- 💬 **Comentários:** Usuários podem comentar em receitas (com nome e e-mail).
- 📊 **Relatórios:** Geração de relatórios de vendas por mês e ano, com a soma total das vendas realizadas no período selecionado. Os relatórios podem ser exportados em formato PDF.
- 🖥️ **Responsividade:** Compatível com diferentes dispositivos (desktop e mobile).
- 🔒 **Segurança de Dados:** Implementação de boas práticas de proteção de dados, alinhadas à LGPD.
- 📝 **Registro de Vendas:** Permite ao chef registrar manualmente vendas realizadas, especificando o produto/serviço, data e valor. As vendas podem ser usadas para gerar relatórios detalhados.
- 🛒 **Gerenciamento de Produtos:** Permite ao chef adicionar, editar e excluir produtos (como e-books), incluindo nome, descrição, preço e imagem. 
---

## 🛠️ Tecnologias Utilizadas

### **Frontend:**
- ![HTML](https://img.shields.io/badge/-HTML5-E34F26?logo=html5&logoColor=white) **HTML**
- ![CSS](https://img.shields.io/badge/-CSS3-1572B6?logo=css3&logoColor=white) **CSS**
- ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black) **JavaScript**
- ![SCSS](https://img.shields.io/badge/-SCSS-CC6699?logo=sass&logoColor=white) **SCSS**

### **Backend:**
- ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) **Node.js**
- ![Express.js](https://img.shields.io/badge/-Express.js-000000?logo=express&logoColor=white) **Express.js**

### **Banco de Dados:**
- ![MySQL](https://img.shields.io/badge/-MySQL-4479A1?logo=mysql&logoColor=white) **MySQL**

### **Ferramentas e Bibliotecas:**
- ![Jest](https://img.shields.io/badge/-Jest-C21325?logo=jest&logoColor=white) **Jest** (para testes unitários)
- ![Multer](https://img.shields.io/badge/-Multer-339933?logo=nodedotjs&logoColor=white) **Multer** (para upload de imagens)
- ![PDFKit](https://img.shields.io/badge/-PDFKit-FF5722?logo=adobe&logoColor=white) **PDFKit** (para relatórios em PDF)

---

## 🚀 Como Executar o Projeto

### 1. Pré-requisitos
- ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) **Node.js** (v16 ou superior)
- ![MySQL](https://img.shields.io/badge/-MySQL-4479A1?logo=mysql&logoColor=white) **MySQL** (configurado localmente ou em um servidor remoto)

### 2. Configuração do Projeto
1. Clone o repositório:
   ```bash
   git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
   cd NOME_DO_REPOSITORIO
### 2. Configuração do Projeto

1. **Instale as dependências**:  
   Use o comando abaixo para instalar as dependências necessárias:
   ```bash
   npm install
### 3. Configuração do Projeto

1. **Crie o arquivo `.env`**  
   Na raiz do projeto, crie um arquivo chamado `.env` com as seguintes informações de configuração:
   ```env
   DB_HOST=localhost
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=comments_db
   PORT=3001
   Inoicie o Servidor  com npm start


Após iniciar, acesse o website em: http://localhost:3001