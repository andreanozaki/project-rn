
document.addEventListener('DOMContentLoaded', function() {
  // Adiciona a animação ao clicar no logo
  var logoElement = document.getElementById('logo');
  var sectionMainElement = document.querySelector('.section-main');
  var headingMainElement = document.querySelector('.heading-primary--main');
  var headingSubElement = document.querySelector('.heading-primary--sub');
  var socialMediaIcons = document.querySelectorAll('.social-media li');

  function activateAnimations() {
      sectionMainElement.classList.add('flash-effect');
      headingMainElement.classList.add('moveInLeft');
    
      

      socialMediaIcons.forEach(function(icon) {
          icon.classList.add('activated');
      });
  }

  



  //mobile nav work


  // Gallery lightbox
  if (document.querySelector('.gallery2')) {
      lightGallery(document.querySelector('.gallery2'));
  }

  // Função para revelar elementos
  function revealElements() {
    const reveals = document.querySelectorAll('.reveal');
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
  
  window.addEventListener('scroll', revealElements);
  
  const reveals = document.querySelectorAll('.reveal, .reveal-from-right'); // Selecione ambas as classes

  function checkScroll() {
    for (const reveal of reveals) {
      const windowHeight = window.innerHeight;
      const elementTop = reveal.getBoundingClientRect().top;
      const revealPoint = 150;

      if (elementTop < windowHeight - revealPoint) {
        reveal.classList.add('active');
      } else {
        reveal.classList.remove('active');
      }
    }
  }

  window.addEventListener('scroll', checkScroll);
  window.addEventListener('resize', checkScroll);
  checkScroll();


//LOGIN
  document.addEventListener('DOMContentLoaded', function() {
    // Verifique se a página é a página de login
    if (window.location.pathname.includes('login.html')) {
      const loginForm = document.getElementById('loginForm');

      if (loginForm) {
          loginForm.addEventListener('submit', (e) => {
              e.preventDefault();
              const username = document.getElementById('username').value;
              const password = document.getElementById('password').value;
              login(username, password);
          });
      } else {
          console.error('Elemento loginForm não encontrado');
      }
    }

 
    

    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            login(username, password);
        });
    } else {
        console.error('Elemento loginForm não encontrado');
    }
  });
});



document.addEventListener('DOMContentLoaded', function () {
  // Verifica se estamos na página forgotpass.html
  if (window.location.pathname.includes('forgotpass.html')) {
    const navItems = document.querySelectorAll('.main-nav-list li');
    
    // Esconde todos os links, exceto o último (que é o link de Login)
    navItems.forEach((item, index) => {
      if (index !== navItems.length - 1) {
        item.style.display = 'none';
      }
    });
  }
});

/// Função para enviar um comentário
document.getElementById('commentForm').addEventListener('submit', function(e) {
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


/// Função para carregar os comentários e exibi-los
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
      message.textContent = 'Erro ao carregar comentários.';
      message.style.color = "red";
    });
}

// Chama a função para carregar os comentários ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
  loadComments();
});
