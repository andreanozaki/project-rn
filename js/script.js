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
  const menuIcon = document.querySelector('ion-icon[name="menu-outline"]');
  const closeIcon = document.querySelector('ion-icon[name="close-outline"]');
  
  // Alterna entre 'nav-open' e 'nav-close' quando o botão é clicado

  


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


  // Gallery lightbox
  if (document.querySelector('.gallery2')) {
      lightGallery(document.querySelector('.gallery2'));
  }
 
    });

   //icons 
   window.addEventListener('DOMContentLoaded', (event) => {
    const socialIcons = document.querySelectorAll('.social-media li');
    
    // Adicione a classe 'active' para ativar a animação
    socialIcons.forEach((icon, index) => {
      setTimeout(() => {
        icon.classList.add('active');
      }, index * 200); // Atraso para cada ícone
    });
  });


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
    const revealPoint = 150; // Ajuste conforme necessário

    if (elementTop < windowHeight - revealPoint) {
      reveal.classList.add('active');
    } else {
      reveal.classList.remove('active'); // Opcional: remove a classe se não estiver visível
    }
  }
}

window.addEventListener('scroll', checkScroll);
window.addEventListener('resize', checkScroll); // Para garantir que a lógica funcione em redimensionamentos
checkScroll(); // Chama a função na inicialização

//login
document.addEventListener('DOMContentLoaded', () => {
    async function login(username, password) {
        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                window.location.href = 'index.html'; // Redireciona para a página principal
            } else {
                const errorText = await response.text();
                alert(`Erro ao fazer login: ${errorText}`);
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
        }
    }

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        login(username, password);
    });
});


// Seleciona apenas a seção do formulário de login para desfocar
const formSection = document.querySelector('.section-form');
const modal = document.getElementById('forgotPasswordModal');

// Abre o modal e aplica o desfoque ao formulário
document.getElementById('forgotPasswordLink').addEventListener('click', function(event) {
    event.preventDefault();
    modal.style.display = 'block'; 
    formSection.classList.add('blur'); // Aplica o desfoque apenas na seção do formulário
});

// Fecha o modal e remove o desfoque
document.querySelector('.close').addEventListener('click', function() {
    modal.style.display = 'none';
    formSection.classList.remove('blur'); // Remove o desfoque
});

// Fecha o modal se clicar fora dele e remove o desfoque
window.addEventListener('click', function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        formSection.classList.remove('blur'); // Remove o desfoque
    }
});
