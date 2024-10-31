
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

  // Função de redefinição de senha
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const email = document.querySelector('input[name="email"]').value;

      fetch('http://localhost:3001/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        forgotPasswordForm.reset();
      })
      .catch(error => {
        console.error('Erro ao redefinir senha:', error);
        alert('Erro ao tentar redefinir senha. Tente novamente.');
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
      const recipe_id = 1;

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

  // Controle de exibição dos formulários de vendas e relatórios apenas para o chef
   // Controle de exibição dos formulários de vendas e relatórios apenas para o chef
   const loginForm = document.getElementById('loginForm');
    const salesFormContainer = document.querySelector('.vendas-container');
    const reportFormContainer = document.querySelector('.relatorio-container');

    // Verifica se o chef está logado ao carregar a página
    if (localStorage.getItem('isChefLoggedIn') === 'true') {
        salesFormContainer.style.display = 'block';
        reportFormContainer.style.display = 'block';
    }

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
                alert(data.message);
                if (email === 'andreaflordoceu@gmail.com' && password === 'deia0101') {
                    localStorage.setItem('isChefLoggedIn', 'true');
                    salesFormContainer.style.display = 'block';
                    reportFormContainer.style.display = 'block';
                    window.location.href = 'index.html';
                } else {
                    localStorage.removeItem('isChefLoggedIn');
                }
            })
            .catch(error => {
                console.error('Erro ao fazer login:', error);
            });
        });
      }

  // Função para registro de venda de produtos
  const salesForm = document.getElementById('salesForm');
  let isSubmitting = false;

  if (salesForm) {
    salesForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (isSubmitting) return;

      isSubmitting = true;
      const product = document.getElementById('product').value;
      const price = parseFloat(document.getElementById('price').value);
      const sale_date = document.getElementById('sale_date').value;

      try {
        const response = await fetch('http://localhost:3001/register-sale', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product, price, quantity, sale_date })
        });

        if (!response.ok) throw new Error('Erro ao registrar venda');
        const data = await response.json();
        alert(data.message);
        salesForm.reset();
      } catch (error) {
        console.error('Erro ao registrar venda:', error);
        alert('Erro ao registrar venda. Tente novamente.');
      } finally {
        isSubmitting = false;
      }
    });
  }

  // Envio de formulário e geração de PDF
  const reportForm = document.getElementById('reportForm');

  if (reportForm) {
    reportForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const month = document.getElementById('month').value;
      const year = document.getElementById('year').value;

      fetch(`http://localhost:3001/generate-report?month=${month}&year=${year}`, {
        method: 'GET',
      })
      .then(response => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error('Erro ao gerar o relatório');
      })
      .then(blob => {
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

  //hambr
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');

  if (hamburger && mainNav) {
      hamburger.addEventListener('click', function () {
          mainNav.classList.toggle('active');
          hamburger.classList.toggle('active'); // Adiciona a classe para alternar os ícones
          const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
          hamburger.setAttribute('aria-expanded', !isExpanded);
      });
  }
  // Gerenciamento do banner de cookies
  const cookieBanner = document.getElementById('cookieBanner');
  if (cookieBanner) {
    const acceptCookiesButton = document.getElementById('acceptCookies');
    const declineCookiesButton = document.getElementById('declineCookies');

    const userConsent = localStorage.getItem('cookieConsent');
    if (!userConsent) {
      cookieBanner.style.display = 'flex';
    }

    acceptCookiesButton.addEventListener('click', function() {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.style.display = 'none';
      activateTracking();
    });

    declineCookiesButton.addEventListener('click', function() {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.style.display = 'none';
    });

    function activateTracking() {
      console.log('Cookies de rastreamento ativados.');
    }

    if (userConsent === 'accepted') {
      activateTracking();
    }
  }
});
