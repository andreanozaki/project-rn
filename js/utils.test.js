// utils.test.js

const { activateAnimations, revealElements } = require('./utils');

describe('Funções de Animação', () => {
  
  test('activateAnimations deve adicionar classes corretas aos elementos', () => {
    // Cria mocks para sectionMainElement, headingMainElement e socialMediaIcons
    const sectionMainElement = { classList: { add: jest.fn() } };
    const headingMainElement = { classList: { add: jest.fn() } };
    const socialMediaIcons = [
      { classList: { add: jest.fn() } },
      { classList: { add: jest.fn() } },
    ];

    // Executa a função activateAnimations
    activateAnimations(sectionMainElement, headingMainElement, socialMediaIcons);

    // Verifica se as classes apropriadas (flash-effect, moveInLeft, e activated) são adicionadas a cada elemento
    expect(sectionMainElement.classList.add).toHaveBeenCalledWith('flash-effect');
    expect(headingMainElement.classList.add).toHaveBeenCalledWith('moveInLeft');
    socialMediaIcons.forEach((icon) => {
      expect(icon.classList.add).toHaveBeenCalledWith('activated');
    });
  });

  test('revealElements deve adicionar ou remover classe "active" com base na posição do elemento', () => {
    // Simula elementos reveals com a função getBoundingClientRect para definir a posição do elemento
    const reveals = [
      { getBoundingClientRect: () => ({ top: 100 }), classList: { add: jest.fn(), remove: jest.fn() } },
      { getBoundingClientRect: () => ({ top: 500 }), classList: { add: jest.fn(), remove: jest.fn() } },
    ];
    const windowHeight = 400; // Define uma altura de janela (windowHeight)

    // Executa a função revealElements
    revealElements(reveals, windowHeight);

    // Verifica se a classe active é adicionada ou removida com base na posição
    expect(reveals[0].classList.add).toHaveBeenCalledWith('active'); // Deve adicionar a classe "active"
    expect(reveals[1].classList.remove).toHaveBeenCalledWith('active'); // Deve remover a classe "active"
  });
});
