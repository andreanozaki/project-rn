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

   //icons 
   window.addEventListener('DOMContentLoaded', (event) => {
    const socialIcons = document.querySelectorAll('.social-media li');
    
    // Adicione a classe 'active' para ativar a animação
    socialIcons.forEach((icon, index) => {
      setTimeout(() => {
        icon.classList.add('active');
      }, index * 200); // Atraso para cada ícone
    });
  });


  function revealElements() {
    const reveals = document.querySelectorAll('.reveal');
  
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
  
  window.addEventListener('scroll', revealElements);
  

  const reveals = document.querySelectorAll('.reveal, .reveal-from-right'); // Selecione ambas as classes

function checkScroll() {
  for (const reveal of reveals) {
    const windowHeight = window.innerHeight;
    const elementTop = reveal.getBoundingClientRect().top;
    const revealPoint = 150; // Ajuste conforme necessário

    if (elementTop < windowHeight - revealPoint) {
      reveal.classList.add('active');
    } else {
      reveal.classList.remove('active'); // Opcional: remove a classe se não estiver visível
    }
  }
}

window.addEventListener('scroll', checkScroll);
window.addEventListener('resize', checkScroll); // Para garantir que a lógica funcione em redimensionamentos
checkScroll(); // Chama a função na inicialização

app.post('/contact', (req, res) => {
    console.log(req.body); // Verifique o que está sendo recebido
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send('Todos os campos são obrigatórios!');
    }

    // Insira os dados no banco de dados (lógica não mostrada aqui)
    // ...

    res.send('Dados inseridos com sucesso!');
});


    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Obtendo os dados do formulário
        const formData = new FormData(this);

        // Enviando os dados via fetch
        fetch('http://localhost:3001/contact', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                // Se a resposta for bem-sucedida, exibir a mensagem
                document.getElementById('responseMessage').innerText = 'Mensagem enviada!';
                document.getElementById('responseMessage').style.display = 'block';
                this.reset(); // Opcional: Limpa o formulário após o envio
            } else {
                throw new Error('Erro ao enviar a mensagem.');
            }
        })
        .catch(error => {
            // Tratar erros
            document.getElementById('responseMessage').innerText = 'Erro ao enviar a mensagem. Tente novamente.';
            document.getElementById('responseMessage').style.display = 'block';
        });
    });
