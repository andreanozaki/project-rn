document.addEventListener('DOMContentLoaded', function() {
  
  // Função para animações na página principal
  function activateAnimations() {
    const sectionMainElement = document.querySelector('.section-main');
    const headingMainElement = document.querySelector('.heading-primary--main');
    const socialMediaIcons = document.querySelectorAll('.social-media li');
  
    if (sectionMainElement) {
      sectionMainElement.classList.add('flash-effect');
    }
    if (headingMainElement) {
      headingMainElement.classList.add('moveInLeft');
    }
    socialMediaIcons.forEach(function(icon) {
      icon.classList.add('activated');
    });
  }
  
  // Função para revelar elementos com scroll
  function revealElements() {
    const reveals = document.querySelectorAll('.reveal, .reveal-from-right');
    reveals.forEach((element) => {
      const windowHeight = window.innerHeight;
      const elementTop = element.getBoundingClientRect().top;
      const revealPoint = 150;
  
      if (elementTop < windowHeight - revealPoint) {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }
    });
  }
  
  // Eventos de scroll e resize para revelar elementos
  window.addEventListener('scroll', revealElements);
  window.addEventListener('resize', revealElements);
  revealElements(); // Chama imediatamente ao carregar a página

  // Ativar animações quando a página é carregada
  activateAnimations();
  
  // Gallery lightbox
  if (document.querySelector('.gallery2')) {
    lightGallery(document.querySelector('.gallery2'));
  }

  // Função para registro de usuário e envio de dados para o servidor
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      // Captura os valores do formulário
      const email = document.querySelector('input[name="email"]').value;
      const password = document.querySelector('input[name="password"]').value;
  
      // Envia os dados para o servidor via POST
      fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      .then(response => response.json())
      .then(data => {
        // Exibir mensagem de sucesso
        const message = document.createElement('p');
        message.textContent = data.message;
        message.style.color = 'green';
        document.querySelector('.contact').appendChild(message);
  
        // Limpar os campos do formulário
        document.querySelector('input[name="email"]').value = '';
        document.querySelector('input[name="password"]').value = '';
      })
      .catch(error => {
        console.error('Erro ao registrar usuário:', error);
        const message = document.createElement('p');
        message.textContent = 'Erro ao criar conta. Tente novamente.';
        message.style.color = 'red';
        document.querySelector('.contact').appendChild(message);
      });
    });
  }

  // Função para manipular os links na página forgotpass.html
  if (window.location.pathname.includes('forgotpass.html')) {
    const navItems = document.querySelectorAll('.main-nav-list li');
    
    // Esconde todos os links, exceto o último (que é o link de Login)
    navItems.forEach((item, index) => {
      if (index !== navItems.length - 1) {
        item.style.display = 'none';
      }
    });
  }

  // Função para enviar um comentário
  const commentForm = document.getElementById('commentForm');
  if (commentForm) {
    commentForm.addEventListener('submit', function(e) {
      e.preventDefault();
  
      // Captura os valores do formulário
      const email = document.getElementById('email').value;
      const comment = document.getElementById('comment').value;
      const recipe_id = 1;  // Defina o ID da receita correspondente
  
      // Envia os dados para o servidor via POST
      fetch('http://localhost:3001/add-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, comment, recipe_id })
      })
      .then(response => response.json())
      .then(data => {
        // Após enviar o comentário, recarregar os comentários
        loadComments();
  
        // Limpar os campos do formulário
        document.getElementById('email').value = '';
        document.getElementById('comment').value = '';
  
        // Exibir mensagem de sucesso
        const message = document.getElementById('message');
        message.textContent = data.message;
        message.style.color = "green";
      })
      .catch(error => {
        console.error('Erro ao adicionar comentário:', error);
        const message = document.getElementById('message');
        message.textContent = "Erro ao adicionar comentário. Tente novamente.";
        message.style.color = "red";
      });
    });
  }

  // Função para carregar os comentários e exibi-los
  function loadComments() {
    const recipe_id = 1;  // Substitua com o ID correto da receita
    
    fetch(`http://localhost:3001/comments/${recipe_id}`)
      .then(response => response.json())
      .then(data => {
        const commentsList = document.getElementById('comments');
        commentsList.innerHTML = ''; // Limpa a lista antes de adicionar novos comentários
        data.forEach(comment => {
          const commentItem = document.createElement('li');
          commentItem.innerHTML = `<strong>${comment.email}:</strong> ${comment.comment}`;
          commentsList.appendChild(commentItem);
        });
      })
      .catch(error => {
        console.error('Erro ao carregar comentários:', error);
        const message = document.getElementById('message');
        if (message) {
          message.textContent = 'Erro ao carregar comentários.';
          message.style.color = "red";
        }
      });
  }

  // Carregar comentários ao carregar a página, garantindo que o elemento exista
  if (document.getElementById('comments')) {
    loadComments();
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Captura os valores do formulário
      const email = document.querySelector('input[name="email"]').value;
      const password = document.querySelector('input[name="password"]').value;

      // Verifica se os campos foram preenchidos
      if (!email || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
      }

      // Envia os dados para o servidor via POST
      fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          alert('Usuário não encontrado ou senha incorreta.');
          throw new Error('Usuário não encontrado ou senha incorreta.');
        } else {
          throw new Error('Erro no servidor.');
        }
      })
      .then(data => {
        alert(data.message);  // Exibe mensagem de sucesso
      })
      .catch(error => {
        console.error('Erro ao fazer login:', error);
      });
    });
  }
});
