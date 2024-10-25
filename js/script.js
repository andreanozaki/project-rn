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
  revealElements();
  
  // Ativar animações quando a página é carregada
  activateAnimations();

  // Função para manipular os links na página forgotpass.html
  if (window.location.pathname.includes('forgotpass.html')) {
    const navItems = document.querySelectorAll('.main-nav-list li');
    navItems.forEach((item, index) => {
      if (index !== navItems.length - 1) {
        item.style.display = 'none';
      }
    });
  }

  // Função para registro de usuário
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
  
      const email = document.querySelector('input[name="email"]').value;
      const password = document.querySelector('input[name="password"]').value;
  
      fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao registrar');
        }
        return response.json();
      })
      .then(data => {
        alert(data.message);
        document.querySelector('input[name="email"]').value = '';
        document.querySelector('input[name="password"]').value = '';
      })
      .catch(error => {
        console.error('Erro ao registrar usuário:', error);
        alert('Erro ao registrar usuário. Tente novamente.');
      });
    });
  }

  // Função para envio de comentário
  const commentForm = document.getElementById('commentForm');
  if (commentForm) {
    commentForm.addEventListener('submit', function(e) {
      e.preventDefault();
  
      const email = document.getElementById('email').value;
      const comment = document.getElementById('comment').value;
      const recipe_id = 1; // ID da receita
  
      fetch('http://localhost:3001/add-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, comment, recipe_id })
      })
      .then(response => response.json())
      .then(data => {
        loadComments();
        document.getElementById('email').value = '';
        document.getElementById('comment').value = '';
        alert(data.message);
      })
      .catch(error => {
        console.error('Erro ao adicionar comentário:', error);
        alert('Erro ao adicionar comentário. Tente novamente.');
      });
    });
  }

  // Função para carregar os comentários
  function loadComments() {
    const recipe_id = 1;
    fetch(`http://localhost:3001/comments/${recipe_id}`)
      .then(response => response.json())
      .then(data => {
        const commentsList = document.getElementById('comments');
        commentsList.innerHTML = '';
        data.forEach(comment => {
          const commentItem = document.createElement('li');
          commentItem.innerHTML = `<strong>${comment.email}:</strong> ${comment.comment}`;
          commentsList.appendChild(commentItem);
        });
      })
      .catch(error => {
        console.error('Erro ao carregar comentários:', error);
      });
  }

  // Carregar comentários ao carregar a página
  if (document.getElementById('comments')) {
    loadComments();
  }

  // Função para gerar relatório
  const reportForm = document.getElementById('reportForm');
  if (reportForm) {
    reportForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const month = document.getElementById('month').value;
      const year = document.getElementById('year').value;

      fetch(`http://localhost:3001/report?month=${month}&year=${year}`)
        .then(response => response.blob())
        .then(blob => {
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = `relatorio-vendas-${month}-${year}.pdf`;
          link.click();
        })
        .catch(error => {
          console.error('Erro ao gerar relatório:', error);
        });
    });
  }

  // Função para login de usuário
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
  
      const email = document.querySelector('input[name="email"]').value;
      const password = document.querySelector('input[name="password"]').value;
  
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

  // Função para envio de e-mail de redefinição de senha
  const forgotPassForm = document.getElementById('forgotPassForm');
  if (forgotPassForm) {
    forgotPassForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const email = document.querySelector('input[name="email"]').value;

      fetch('http://localhost:3001/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message); // Exibe a mensagem de sucesso
        document.querySelector('input[name="email"]').value = '';  // Limpa o campo de e-mail
      })
      .catch(error => {
        console.error('Erro ao enviar e-mail de redefinição de senha:', error);
      });
    });
  }
});
