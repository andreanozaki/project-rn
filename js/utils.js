// utils.js

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
  
  // Função para calcular o valor total das vendas e formatar para um relatório
  function formatSalesData(sales) {
    const total = sales.reduce((acc, sale) => acc + sale.price * sale.quantity, 0);
    
    const formattedSales = sales.map(sale => ({
      id: sale.id,
      product: sale.product,
      quantity: sale.quantity,
      totalPrice: sale.price * sale.quantity,
      saleDate: sale.sale_date
    }));
  
    return {
      formattedSales,
      total
    };
  }
  
  // Exporta as funções
  module.exports = { activateAnimations, revealElements, formatSalesData };
  