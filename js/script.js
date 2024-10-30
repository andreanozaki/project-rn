document.addEventListener('DOMContentLoaded', function () {

  // Função para animações na página principal
  function activateAnimations() {
    const sectionMainElement = document.querySelector('.section-main');
    const headingMainElement = document.querySelector('.heading-primary--main');
    const socialMediaIcons = document.querySelectorAll('.social-media li');
  
    if (sectionMainElement) {
      sectionMainElement.classList.add('flash-effect');
    }
    if (headingMainElement) {
      headingMainElement.classList.add('moveInLeft');
    }
    socialMediaIcons.forEach(function (icon) {
      icon.classList.add('activated');
    });
  }

  // Função para revelar elementos com scroll
  function revealElements() {
    const reveals = document.querySelectorAll('.reveal, .reveal-from-right');
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

  // Eventos de scroll e resize para revelar elementos
  window.addEventListener('scroll', revealElements);
  window.addEventListener('resize', revealElements);
  revealElements();

  // Ativar animações quando a página é carregada
  activateAnimations();

  // Função para manipular os links na página forgotpass.html
  if (window.location.pathname.includes('forgotpass.html')) {
    const navItems = document.querySelectorAll('.main-nav-list li');
    navItems.forEach((item, index) => {
      if (index !== navItems.length - 1) {
        item.style.display = 'none';
      }
    });
  }

  // Função para registro de usuário
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.querySelector('input[name="email"]').value;
      const password = document.querySelector('input[name="password"]').value;

      fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao registrar');
        }
        return response.json();
      })
      .then(data => {
        alert(data.message);
        document.querySelector('input[name="email"]').value = '';
        document.querySelector('input[name="password"]').value = '';
      })
      .catch(error => {
        console.error('Erro ao registrar usuário:', error);
        alert('Erro ao registrar usuário. Tente novamente.');
      });
    });
  }

  // Função para envio de comentário
  const commentForm = document.getElementById('commentForm');
  if (commentForm) {
    commentForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const comment = document.getElementById('comment').value;
      const recipe_id = 1; // ID da receita

      fetch('http://localhost:3001/add-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, comment, recipe_id })
      })
      .then(response => response.json())
      .then(data => {
        loadComments();
        document.getElementById('email').value = '';
        document.getElementById('comment').value = '';
        alert(data.message);
      })
      .catch(error => {
        console.error('Erro ao adicionar comentário:', error);
        alert('Erro ao adicionar comentário. Tente novamente.');
      });
    });
  }

  // Função para carregar os comentários
  function loadComments() {
    const recipe_id = 1;
    fetch(`http://localhost:3001/comments/${recipe_id}`)
      .then(response => response.json())
      .then(data => {
        const commentsList = document.getElementById('comments');
        commentsList.innerHTML = '';
        data.forEach(comment => {
          const commentItem = document.createElement('li');
          commentItem.innerHTML = `<strong>${comment.email}:</strong> ${comment.comment}`;
          commentsList.appendChild(commentItem);
        });
      })
      .catch(error => {
        console.error('Erro ao carregar comentários:', error);
      });
  }

  // Carregar comentários ao carregar a página
  if (document.getElementById('comments')) {
    loadComments();
  }

  // Função para login de usuário
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.querySelector('input[name="email"]').value;
      const password = document.querySelector('input[name="password"]').value;

      fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          alert('Usuário não encontrado ou senha incorreta.');
          throw new Error('Usuário não encontrado ou senha incorreta.');
        } else {
          throw new Error('Erro no servidor.');
        }
      })
      .then(data => {
        alert(data.message);  // Exibe mensagem de sucesso
      })
      .catch(error => {
        console.error('Erro ao fazer login:', error);
      });
    });
  }


  // Função para registrar venda de produtos
  // Função para registro de venda de produtos
const salesForm = document.getElementById('salesForm');
let isSubmitting = false; // Controla a duplicação

if (salesForm) {
  salesForm.addEventListener('submit', async function (e) {
    e.preventDefault(); // Impede o envio padrão do formulário

    if (isSubmitting) return; // Evita novo envio se já estiver processando
    isSubmitting = true; // Define a flag como ativa para evitar novos envios

    const product = document.getElementById('product').value;
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    const sale_date = document.getElementById('sale_date').value;

    try {
      const response = await fetch('http://localhost:3001/register-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, price, quantity, sale_date })
      });

      if (!response.ok) throw new Error('Erro ao registrar venda');
      const data = await response.json();
      alert(data.message); // Exibe mensagem de sucesso
      salesForm.reset(); // Limpa o formulário
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      alert('Erro ao registrar venda. Tente novamente.');
    } finally {
      isSubmitting = false; // Libera a flag para permitir novos envios
    }
  });
}

//envio de form e geracao de PDF
 // Seleciona o formulário de relatório
 const reportForm = document.getElementById('reportForm');

 if (reportForm) {
     reportForm.addEventListener('submit', function (e) {
         e.preventDefault(); // Evita o envio padrão do formulário

         // Captura o mês e o ano selecionados
         const month = document.getElementById('month').value;
         const year = document.getElementById('year').value;

         // Envia uma solicitação GET para gerar o relatório
         fetch(`http://localhost:3001/generate-report?month=${month}&year=${year}`, {
             method: 'GET',
         })
         .then(response => {
             if (response.ok) {
                 return response.blob(); // Obtém o PDF como blob
             }
             throw new Error('Erro ao gerar o relatório');
         })
         .then(blob => {
             // Cria um link para o arquivo PDF e faz o download
             const url = window.URL.createObjectURL(blob);
             const a = document.createElement('a');
             a.href = url;
             a.download = `Relatorio_Vendas_${month}_${year}.pdf`;
             a.click();
             window.URL.revokeObjectURL(url);
         })
         .catch(error => {
             console.error('Erro:', error);
             alert('Erro ao gerar o relatório. Tente novamente.');
         });
     });
 }
//gerenciar a exibição do banner e armazenar a escolha do usuário no localStorage:
const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookiesButton = document.getElementById('acceptCookies');
    const declineCookiesButton = document.getElementById('declineCookies');

    // Verifica se já há consentimento armazenado e só exibe o banner se não houver
    const userConsent = localStorage.getItem('cookieConsent');
    if (!userConsent) {
        cookieBanner.style.display = 'flex'; // Exibe o banner se o consentimento ainda não foi dado
    } else {
        cookieBanner.style.display = 'none'; // Oculta o banner se o consentimento já estiver armazenado
    }

    acceptCookiesButton.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.style.display = 'none';
        activateTracking(); // Ativa rastreamento, se necessário
    });

    declineCookiesButton.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.style.display = 'none';
    });

    // Função para ativar Google Analytics ou outras ferramentas de rastreamento
    function activateTracking() {
        console.log('Cookies de rastreamento ativados.');
    }

    // Ativa o rastreamento automaticamente se o consentimento for 'accepted'
    if (userConsent === 'accepted') {
        activateTracking();
    }

    
}); // Este é o fechamento final do `DOMContentLoaded`
