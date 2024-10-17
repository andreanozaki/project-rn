
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

  // Seu restante do código (para animações, navegação, etc.) continua normalmente aqui.
  // Exemplo do código de animação, navegação mobile, etc.

  // login
  
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

  // Modal
  const formSection = document.querySelector('.section-form');
  const modal = document.getElementById('forgotPasswordModal');
  const modalOverlay = document.getElementById('modalOverlay');

  if (formSection && modal && modalOverlay) {
    document.getElementById('forgotPasswordLink').addEventListener('click', function(event) {
        event.preventDefault();
        modal.style.display = 'block'; 
        modalOverlay.style.display = 'block';
        formSection.classList.add('blur');
    });

    document.querySelector('.close').addEventListener('click', function() {
        modal.style.display = 'none';
        modalOverlay.style.display = 'none';
        formSection.classList.remove('blur');
    });

    modalOverlay.addEventListener('click', function() {
        modal.style.display = 'none';
        modalOverlay.style.display = 'none';
        formSection.classList.remove('blur');
    });
  }

  const createAccountButton = document.getElementById("createAccountButton");
  if (createAccountButton) {
    createAccountButton.addEventListener("click", function() {
        window.location.href = "register.html";
    });
  }
});
});