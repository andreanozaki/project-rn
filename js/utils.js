// utils.js
//receber parâmetros em vez de buscar diretamente no DOM:
// Função para animações na página principal
function activateAnimations(sectionMainElement, headingMainElement, socialMediaIcons) {
    if (sectionMainElement) {
      sectionMainElement.classList.add('flash-effect');
    }
    if (headingMainElement) {
      headingMainElement.classList.add('moveInLeft');
    }
    socialMediaIcons.forEach((icon) => {
      icon.classList.add('activated');
    });
  }
  
  // Função para revelar elementos com scroll
  function revealElements(reveals, windowHeight) {
    reveals.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const revealPoint = 150;
  
      if (elementTop < windowHeight - revealPoint) {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }
    });
  }
  
  module.exports = { activateAnimations, revealElements };
  