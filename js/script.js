
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
const loginForm = document.getElementById('loginForm');
const salesFormContainer = document.querySelector('.vendas-container');
const reportFormContainer = document.querySelector('.relatorio-container');
const loggedInEmail = localStorage.getItem('loggedInEmail');

if (localStorage.getItem('isChefLoggedIn') === 'true') {
    if (loggedInEmail === 'andreaflordoceu@gmail.com') {
      sessionStorage.setItem('isChef', 'true');

        salesFormContainer.style.display = 'block';
        reportFormContainer.style.display = 'block';
    } else {
        salesFormContainer.style.display = 'none';
        reportFormContainer.style.display = 'none';
    }
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
          localStorage.setItem('loggedInEmail', email);

          if (data.message === 'Login bem-sucedido') {
              localStorage.setItem('isChefLoggedIn', email === 'andreaflordoceu@gmail.com' ? 'true' : 'false');
              
              // Limpa o formulário de login
              loginForm.reset();
              
              // Redireciona para a página index.html
              window.location.href = 'index.html';
          } else {
              localStorage.removeItem('isChefLoggedIn');
              localStorage.removeItem('loggedInEmail');
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

  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');
  const loginLink = document.querySelector('.main-nav-link[href="login.html"]');
  const logoutLink = document.getElementById('logout-link');
  
  // Função para alternar entre Login e Sair com base no estado de login
  function toggleLoginLogout() {
      const loggedInEmail = localStorage.getItem('loggedInEmail'); // Verifica se há um usuário logado
  
      if (loggedInEmail) {
          // Se qualquer usuário estiver logado, esconde o botão Login e mostra o botão Sair
          if (loginLink) loginLink.style.display = 'none';
          if (logoutLink) logoutLink.style.display = 'block';
      } else {
          // Se ninguém estiver logado, mostra o botão Login e esconde o botão Sair
          if (loginLink) loginLink.style.display = 'block';
          if (logoutLink) logoutLink.style.display = 'none';
      }
  }
  
  // Chama a função ao carregar a página para definir o estado inicial
  toggleLoginLogout();

  
  // Evento para deslogar o usuário ao clicar no botão Sair
  if (logoutLink) {
      logoutLink.addEventListener('click', function (e) {
          e.preventDefault();
          localStorage.removeItem('loggedInEmail'); // Remove o email do usuário logado
          window.location.reload(); // Recarrega a página para atualizar o estado
      });
  }
  



// Função de logout para remover a sessão do cookie
function logout() {
  sessionStorage.removeItem('cookieSession');
  console.log('Usuário desconectado, a sessão foi reiniciada.');
}

// Evento para deslogar o usuário ao clicar no botão Sair
logoutLink.addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('isChefLoggedIn'); // Remove o estado de login
    window.location.reload(); // Recarrega a página para atualizar o estado
});



// Gerenciamento do banner de cookies
document.addEventListener('DOMContentLoaded', function() {
  const cookieBanner = document.getElementById('cookieBanner');
  
  if (cookieBanner) {
    const acceptCookiesButton = document.getElementById('acceptCookies');
    const declineCookiesButton = document.getElementById('declineCookies');

    // Verifica o consentimento armazenado no localStorage
    const userConsent = localStorage.getItem('cookieConsent');
    console.log('Valor do consentimento do usuário:', userConsent); // Para depuração

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
});


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


combinedRecipeForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const formDataPreview = new FormData();
  formDataPreview.append('recipeImage', document.getElementById('recipeImage').files[0]);
  formDataPreview.append('recipeTitle', document.getElementById('recipeTitle').value);
  formDataPreview.append('recipeDescription', document.getElementById('recipeDescription').value);

  fetch('http://localhost:3001/add-recipe-preview', {
      method: 'POST',
      body: formDataPreview
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          alert(data.message);

          const formDataComplete = new FormData();
          formDataComplete.append('recipeId', data.recipeId);
          formDataComplete.append('ingredients', document.getElementById('ingredients').value);
          formDataComplete.append('preparation', document.getElementById('preparation').value);

          return fetch('http://localhost:3001/complete-recipe', {
              method: 'POST',
              body: formDataComplete
          });
      } else {
          throw new Error('Erro ao criar a prévia da receita.');
      }
  })
  .then(response => response.json())
  .then(data => {
      alert(data.message);
      window.location.reload();
  })
  .catch(error => {
      console.error('Erro:', error);
      alert('Erro ao adicionar a receita. Tente novamente.');
  });
});



document.addEventListener('DOMContentLoaded', () => {
  const feedbackButton = document.getElementById('openFeedbackForm');
  const feedbackModal = document.getElementById('feedbackModal');
  const closeModalButton = document.querySelector('.close-modal');
  const feedbackForm = document.getElementById('feedbackForm');

  // Abrir o modal ao clicar no botão de feedback
  feedbackButton.addEventListener('click', () => {
      feedbackModal.classList.remove('hidden');
      feedbackModal.style.display = 'flex';
  });

  // Fechar o modal ao clicar no botão de fechar
  closeModalButton.addEventListener('click', () => {
      feedbackModal.style.display = 'none';
  });

  // Fechar o modal ao clicar fora do conteúdo do modal
  window.addEventListener('click', (event) => {
      if (event.target === feedbackModal) {
          feedbackModal.style.display = 'none';
      }
  });

  // Enviar o feedback
  feedbackForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const rating = document.getElementById('rating').value;
      const comment = document.getElementById('comment').value;

      if (!rating) {
          alert('Por favor, selecione uma avaliação.');
          return;
      }

      fetch('http://localhost:3001/feedback', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rating, comment }),
      })
          .then((response) => {
              if (!response.ok) {
                  throw new Error('Erro ao enviar feedback.');
              }
              return response.json();
          })
          .then((data) => {
              alert(data.message);
              feedbackForm.reset();
              feedbackModal.style.display = 'none';
          })
          .catch((error) => {
              console.error('Erro ao enviar feedback:', error);
              alert('Erro ao enviar feedback. Tente novamente.');
          });
  });
});



});//fim Dom



//clique p deletar receita
  document.body.addEventListener('click', (event) => {
      if (event.target.classList.contains('delete-recipe-btn')) {
          const recipeId = event.target.getAttribute('data-id');

          if (confirm('Tem certeza que deseja deletar esta receita?')) {
              fetch(`http://localhost:3001/delete-recipe/${recipeId}`, {
                  method: 'DELETE'
              })
              .then(response => response.json())
              .then(data => {
                  if (data.success) {
                      alert('Receita deletada com sucesso!');
                      // Remove o card ou redireciona
                      event.target.closest('.recipe__card')?.remove();
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

