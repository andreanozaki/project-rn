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
  const menuIcon = document.querySelector('ion-icon[name="menu-outline"]');
  const closeIcon = document.querySelector('ion-icon[name="close-outline"]');
  
  // Alterna entre 'nav-open' e 'nav-close' quando o botão é clicado
  btnNavEl.addEventListener("click", function () {
      headerEl.classList.toggle("nav-open");
  
      // Alterna ícones de abrir e fechar
      menuIcon.style.display = headerEl.classList.contains("nav-open") ? "none" : "block";
      closeIcon.style.display = headerEl.classList.contains("nav-open") ? "block" : "none";
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

   