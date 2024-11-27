

document.addEventListener('DOMContentLoaded', function () {


   // Seleciona os elementos do menu
   const hamburger = document.querySelector('.hamburger');
   const mainNav = document.querySelector('.main-nav');
   const menuLinks = document.querySelectorAll('.main-nav-link');
 
   if (hamburger && mainNav) {
     // Alterna a exibição do menu ao clicar no hambúrguer
     hamburger.addEventListener('click', () => {
       const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
 
       // Alterna as classes e o atributo de acessibilidade
       hamburger.classList.toggle('active');
       mainNav.classList.toggle('active');
       hamburger.setAttribute('aria-expanded', !isExpanded);
     });
 
     // Fecha o menu ao clicar em qualquer link
     menuLinks.forEach(link => {
       link.addEventListener('click', () => {
         mainNav.classList.remove('active');
         hamburger.classList.remove('active');
         hamburger.setAttribute('aria-expanded', 'false');
       });
     });
   }

 

 // Controle de Login/Logout
 const loginLink = document.querySelector('.main-nav-link[href="login.html"]');
 const logoutLink = document.getElementById('logout-link');

 function toggleLoginLogout() {
   const loggedInEmail = localStorage.getItem('loggedInEmail');

   if (loggedInEmail) {
     if (loginLink) loginLink.style.display = 'none';
     if (logoutLink) logoutLink.style.display = 'block';
   } else {
     if (loginLink) loginLink.style.display = 'block';
     if (logoutLink) logoutLink.style.display = 'none';
   }
 }

 toggleLoginLogout();

 if (logoutLink) {
   logoutLink.addEventListener('click', function (e) {
     e.preventDefault();
     localStorage.removeItem('loggedInEmail');
     localStorage.removeItem('isChefLoggedIn');
     window.location.reload();
   });
 }




  document.body.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-recipe-btn')) {
        const recipeId = event.target.getAttribute('data-id'); // Verifica o ID da receita

        if (!recipeId) {
            alert('Erro: ID da receita não encontrado.');
            return;
        }

        if (confirm('Tem certeza que deseja deletar esta receita?')) {
            fetch(`http://localhost:3001/delete-recipe/${recipeId}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    const recipeCard = document.querySelector(`.recipe__card[data-id="${recipeId}"]`);
                    if (recipeCard) recipeCard.remove(); // Remove o card
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Erro ao deletar a receita:', error);
                alert('Erro ao deletar a receita. Tente novamente.');
            });
        }
    }
});


  document.querySelectorAll('.delete-recipe-btn').forEach(button => {
    button.addEventListener('click', function () {
        const recipeId = this.getAttribute('data-id'); // Obtém o ID da receita
        const recipeCard = document.querySelector(`.recipe__card[data-id="${recipeId}"]`); // Seleciona a div específica
        if (recipeCard) {
            recipeCard.remove(); // Remove apenas a div correspondente
            console.log(`Receita com ID ${recipeId} foi deletada.`);
        }
    });
});


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
if (commentForm && !commentForm.dataset.listener) {
  commentForm.dataset.listener = true; // Marca que o listener foi adicionado
  commentForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const comment = document.getElementById('comment').value;
    const recipe_id = document.getElementById('recipe_id').value; // Obtém o ID da receita

    fetch('http://localhost:3001/add-comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, comment, recipe_id }),
    })
      .then((response) => response.json())
      .then((data) => {
        loadComments(); // Atualiza os comentários
        document.getElementById('email').value = '';
        document.getElementById('comment').value = '';
        alert(data.message);
      })
      .catch((error) => {
        console.error('Erro ao adicionar comentário:', error);
        alert('Erro ao adicionar comentário. Tente novamente.');
      });
  });
}


// Função para carregar os comentários
function loadComments() {
  const recipe_id = document.getElementById('recipe_id').value; // Obtém o ID da receita
  fetch(`http://localhost:3001/comments/${recipe_id}`)
    .then((response) => response.json())
    .then((data) => {
      const commentsList = document.getElementById('comments');
      commentsList.innerHTML = '';
      data.forEach((comment) => {
        const commentItem = document.createElement('li');
        commentItem.innerHTML = `<strong>${comment.email}:</strong> ${comment.comment}`;
        commentsList.appendChild(commentItem);
      });
    })
    .catch((error) => {
      console.error('Erro ao carregar comentários:', error);
    });
}

// Carregar comentários ao carregar a página
if (document.getElementById('comments')) {
  loadComments();
}

 
  // Controle de exibição dos formulários de vendas, relatórios e upload apenas para o chef
const loginForm = document.getElementById('loginForm');
const salesFormContainer = document.querySelector('.vendas-container');
const reportFormContainer = document.querySelector('.relatorio-container');
const uploadForm = document.querySelector('form[action="http://localhost:3001/upload"]'); // Formulário de upload
const loggedInEmail = localStorage.getItem('loggedInEmail');

// Função para exibir ou ocultar elementos com base no login do chef
function toggleChefFeatures(isChef) {
  const viewFeedbacksButton = document.getElementById('viewFeedbacksButton'); // Seleciona o botão
  const feedbackButton = document.getElementById('openFeedbackForm'); // Seleciona o botão "Deixar Feedback"

  if (isChef) {
      sessionStorage.setItem('isChef', 'true');
      if (salesFormContainer) salesFormContainer.style.display = 'block';
      if (reportFormContainer) reportFormContainer.style.display = 'block';
      if (uploadForm) uploadForm.style.display = 'block'; // Exibe o formulário de upload
      if (viewFeedbacksButton) viewFeedbacksButton.style.display = 'block'; // Exibe o botão para o chef
      if (feedbackButton) feedbackButton.style.display = 'none'; // Oculta o botão "Deixar Feedback"

  } else {
      sessionStorage.removeItem('isChef');
      if (salesFormContainer) salesFormContainer.style.display = 'none';
      if (reportFormContainer) reportFormContainer.style.display = 'none';
      if (uploadForm) uploadForm.style.display = 'none'; // Oculta o formulário de upload
      if (viewFeedbacksButton) viewFeedbacksButton.style.display = 'none'; // Oculta o botão para outros usuários
      if (feedbackButton) feedbackButton.style.display = 'block'; // Exibe o botão "Deixar Feedback"

  }
}

// Verifica se o chef está logado ao carregar a página
const isChefLoggedIn = localStorage.getItem('isChefLoggedIn') === 'true' && loggedInEmail === 'andreaflordoceu@gmail.com';
toggleChefFeatures(isChefLoggedIn);

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
            localStorage.setItem('loggedInEmail', email);

            if (data.message === 'Login bem-sucedido') {
                const isChef = email === 'andreaflordoceu@gmail.com';
                localStorage.setItem('isChefLoggedIn', isChef ? 'true' : 'false');

                // Atualiza a exibição das funcionalidades do chef
                toggleChefFeatures(isChef);

                // Limpa o formulário de login
                loginForm.reset();

                // Redireciona para a página index.html
                window.location.href = 'index.html';
            } else {
                localStorage.removeItem('isChefLoggedIn');
                localStorage.removeItem('loggedInEmail');
                toggleChefFeatures(false);
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
                body: JSON.stringify({ product, price, sale_date })
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

  



// Gerenciamento do banner de cookies
  const cookieBanner = document.getElementById('cookieBanner');
  
  if (cookieBanner) {
    const acceptCookiesButton = document.getElementById('acceptCookies');
    const declineCookiesButton = document.getElementById('declineCookies');

    // Verifica o consentimento armazenado no localStorage
    const userConsent = localStorage.getItem('cookieConsent');

    if (!userConsent) {
      // Exibe o banner apenas se não houver consentimento armazenado
      cookieBanner.style.display = 'flex';
    } else {
      // Oculta o banner se o consentimento já foi dado
      cookieBanner.style.display = 'none';
    }

    // Evento de clique para aceitar os cookies
    acceptCookiesButton.addEventListener('click', function() {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.style.display = 'none';
      activateTracking();
    });

    // Evento de clique para recusar os cookies
    declineCookiesButton.addEventListener('click', function() {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.style.display = 'none';
    });

    // Função que simula a ativação de cookies de rastreamento
    function activateTracking() {
      console.log('Cookies de rastreamento ativados.');
    }

    // Ativa o rastreamento se o consentimento for 'accepted'
    if (userConsent === 'accepted') {
      activateTracking();
    }
  }


function deleteImage(imageId) {
  fetch(`http://localhost:3001/delete-image/${imageId}`, {
      method: 'DELETE'
  })
  .then(response => {
      if (response.ok) {
          alert('Imagem deletada com sucesso.');
          location.reload();
      } else {
          alert('Erro ao deletar a imagem.');
      }
  })
  .catch(error => {
      console.error('Erro:', error);
      alert('Erro ao deletar a imagem.');
  });
}



});//fim Dom
