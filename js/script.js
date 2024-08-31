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
      headingSubElement.classList.add('moveInRight');

      socialMediaIcons.forEach(function(icon) {
          icon.classList.add('activated');
      });
  }

  logoElement.addEventListener('click', function(event) {
      event.preventDefault();
      activateAnimations();
  });

  // Atualiza a imagem principal ao clicar nas miniaturas dos e-books
  function updateMainImage(imageSrc) {
      var mainImage = document.querySelector('.ebook-photo');
      mainImage.src = imageSrc;
  }

  var thumbnails = document.querySelectorAll('.ebook-mini');
  thumbnails.forEach(function(thumbnail) {
      thumbnail.addEventListener('click', function(event) {
          event.preventDefault();
          updateMainImage(thumbnail.src);
      });
  });

  // Mobile navigation
  const btnNavEl = document.querySelector(".btn-mobile-nav");
  const headerEl = document.querySelector(".header");

  btnNavEl.addEventListener("click", function () {
      headerEl.classList.toggle("nav-open");
  });

  // Sticky navigation
  const sectionMainE = document.querySelector(".section-main");
  const obs = new IntersectionObserver(function (entries) {
      const ent = entries[0];
      if (ent.isIntersecting === false) {
          document.body.classList.add("sticky");
      } else {
          document.body.classList.remove("sticky");
      }
  }, {
      root: null,
      threshold: 0,
      rootMargin: "-80px",
  });

  obs.observe(sectionMainE);

  // Gallery lightbox
  if (document.querySelector('.gallery2')) {
      lightGallery(document.querySelector('.gallery2'));
  }
 
    });

    document.addEventListener('DOMContentLoaded', () => {
      // Função de cadastro
      const form = document.getElementById('registerForm');
    
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
    
        // Verifica se as senhas coincidem
        if (password !== confirmPassword) {
          alert('As senhas não coincidem');
          return;
        }
    
        try {
          const response = await fetch('/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
          });
    
          if (response.ok) {
            alert('Cadastro realizado com sucesso');
            window.location.href = 'login.html';
          } else {
            const errorText = await response.text();
            alert(`Erro ao cadastrar: ${errorText}`);
          }
        } catch (error) {
          console.error('Erro ao fazer cadastro:', error);
          alert('Erro ao fazer cadastro');
        }
      });
    
      // Verifica se o usuário é o chef
      fetch('/api/user')
        .then(response => response.json())
        .then(data => {
          if (data.role === 'chef') {
            document.getElementById('gerenciamento-receitas').style.display = 'block';
          }
        })
        .catch(error => {
          console.error('Erro ao verificar o usuário:', error);
        });
    
      // Verifica o link de navegação para a página de login
      document.addEventListener('click', function(event) {
        if (event.target.matches('.main-nav-link[href="login.html"]')) {
          window.location.href = 'login.html';
        }
      });
    });
    
    // Função para login
    const login = async (username, password) => {
      try {
        const response = await fetch('http://localhost:3001/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
    
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token); // Armazena o token
          window.location.href = '/main'; // Redireciona para a página principal
        } else {
          console.error('Erro ao fazer login:', await response.text());
        }
      } catch (error) {
        console.error('Erro:', error);
      }
    };
    
    // Função para adicionar comentário
    const addComment = async (recipeId, comment) => {
      const token = localStorage.getItem('token'); // Obtém o token armazenado
    
      try {
        const response = await fetch('http://localhost:3001/add-comment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ recipeId, comment }),
        });
    
        if (response.ok) {
          console.log('Comentário adicionado com sucesso!');
          // Atualizar a interface ou notificar o usuário
        } else {
          console.error('Erro ao adicionar comentário:', await response.text());
        }
      } catch (error) {
        console.error('Erro:', error);
      }
    };
    
    // Submissão de comentário
    document.getElementById('commentForm').addEventListener('submit', async (event) => {
      event.preventDefault(); // Evita o envio padrão do formulário
    
      const comment = document.getElementById('comment').value;
    
      try {
        const response = await fetch('http://localhost:3001/add-comment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ recipeId: 1, comment })
        });
    
        if (response.ok) {
          alert('Comentário adicionado com sucesso!');
          document.getElementById('comment').value = ''; // Limpa o campo de comentário
        } else {
          alert('Erro ao adicionar comentário.');
        }
      } catch (error) {
        console.error('Erro:', error);
      }
    });
    