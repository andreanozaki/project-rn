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
const flagsElement = document.getElementById("flags");

  const changeLanguage = async (language)=> {
   const requestJson = await fetch (`.languages/${language}.json`);
   const texts = await requestJson.json();

  console.log(texts);
  };

  flagsElement.addEventListener("click", (e) => {
    changeLanguage(e.target.parentElement.dataset.language);
  });




