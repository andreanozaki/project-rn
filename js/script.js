document.addEventListener('DOMContentLoaded', function() {
    var logoElement = document.getElementById('logo');
    var sectionMainElement = document.querySelector('.section-main');
  
    logoElement.addEventListener('click', function() {
      sectionMainElement.classList.add('flash-effect');
  
      // Remova a classe após a animação terminar para permitir que ela seja reiniciada
      setTimeout(function() {
        sectionMainElement.classList.remove('flash-effect');
      }, 1000); // Tempo igual à duração da animação (1 segundo)
    });
  });
  
  $(document).ready(function() {
    // Seleciona os elementos com a classe .social-media
    var socialMediaIcons = $(".social-media li");
  
    // Define a animação para mover os ícones de baixo para cima
    socialMediaIcons.each(function(index) {
      var icon = $(this);
      setTimeout(function() {
        icon.animate({ opacity: 1, top: 0 }, 1000);
      }, index * 200); // Atrasa cada ícone por 200ms
    });
  });
  
  document.addEventListener('DOMContentLoaded', function() {
  var logoElement = document.getElementById('logo');
  var sectionMainElement = document.querySelector('.section-main');
  var headingMainElement = document.querySelector('.heading-primary--main');
  var headingSubElement = document.querySelector('.heading-primary--sub');
  var socialMediaIcons = document.querySelectorAll('.social-media li');

  // Função para ativar as animações
  function activateAnimations() {
    sectionMainElement.classList.add('flash-effect');
    headingMainElement.classList.add('moveInLeft');
    headingSubElement.classList.add('moveInRight');

    // Adicione a classe de ativação aos ícones
    socialMediaIcons.forEach(function(icon) {
      icon.classList.add('activated');
    });
  }

  // Quando o logo é clicado, ative as animações
  logoElement.addEventListener('click', function(event) {
    event.preventDefault();
    activateAnimations();
  });
});
//loading-text

function countAndHide() {
  let count = 20;
  const loadingText = document.querySelector('.loading-text');

  // Configura o intervalo para incrementar a contagem em 2 segundos
  const interval = setInterval(function () {
      loadingText.textContent = `${count}%`;
      count+=20;

      // Quando atingir 100%, limpa o intervalo e esconde a div
      if (count > 120) {
          clearInterval(interval);
          loadingText.style.display = 'none';
      }
  }, 75); 
}

// Chama a função após a página ser totalmente
window.onload = countAndHide;


//rolagem pag


 


//miniaturas ebook abrir na foto principal

function updateMainImage(imageSrc) {
  var mainImage = document.querySelector('.ebook-photo');
  mainImage.src = imageSrc;
}

document.addEventListener('DOMContentLoaded', function () {
  var thumbnails = document.querySelectorAll('.ebook-mini');
  thumbnails.forEach(function (thumbnail) {
      thumbnail.addEventListener('click', function (event) {
          event.preventDefault();
          updateMainImage(thumbnail.src);
      });
  });
});
//animacap scroll
///////////////////////////////////////////////////////////
// Make mobile navigation work

const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");

btnNavEl.addEventListener("click", function () {
  headerEl.classList.toggle("nav-open");
});

///////////////////////////////////////////////////////////
// Smooth scrolling animation

//fix bav
///////////////////////////////////////////////////////////
// Sticky navigation

const sectionHeroEl = document.querySelector(".section-main");

const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];
    console.log(ent);
    ``;

    if (ent.isIntersecting === false) {
      document.body.classList.add("sticky");
    }

    if (ent.isIntersecting === true) {
      document.body.classList.remove("sticky");
    }
  },
  {
    // In the viewport
    root: null,
    threshold: 0,
    rootMargin: "-80px",
  }
);
obs.observe(sectionHeroEl);