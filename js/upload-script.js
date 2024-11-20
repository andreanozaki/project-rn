document.addEventListener('DOMContentLoaded', () => {
    const isChef = sessionStorage.getItem('isChef') === 'true';
    console.log('isChef:', isChef);

    if (isChef) {
        document.querySelector('form[action="http://localhost:3001/upload"]').style.display = 'block';
    }

    // Obtém o nome da página atual (sem a extensão .html)
    let pageName = window.location.pathname.split('/').pop().replace('.html', '');
    console.log('Página carregada:', pageName);

    const pageToFolderMap = {
        'crea-cakes': 'creation-cake',
        'crea-chocolat': 'creation-chocolat',
        'crea-dessert': 'creation-desserts',
        'crea-events': 'creation-events',
        'crea-tartles': 'creation-tartles',
        'crea-simple': 'creation-simple'
    };

    const folderName = pageToFolderMap[pageName] || pageName;

    // Faz a solicitação fetch para a pasta correspondente
    fetch(`http://localhost:3001/images/${folderName}`)
        .then(response => response.json())
        .then(data => {
            console.log('Imagens carregadas:', data);
            const gallery = document.querySelector('.section-creations__gallery');
            if (gallery) {
                // Captura os caminhos das imagens já inseridas manualmente
                const manualImages = Array.from(gallery.querySelectorAll('img')).map(img => img.src);

                data.forEach(image => {
                    const imagePath = `${window.location.origin}${image.image_path}`;

                    // Verifica se a imagem já foi inserida manualmente
                    if (!manualImages.includes(imagePath)) {
                        const figureElement = document.createElement('figure');
                        figureElement.classList.add('gallery-item');

                        const imgElement = document.createElement('img');
                        imgElement.src = image.image_path;
                        imgElement.alt = 'Imagem carregada';
                        imgElement.classList.add('gallery-item-img');

                        figureElement.appendChild(imgElement);

                        if (isChef) {
                            const deleteButton = document.createElement('button');
                            deleteButton.textContent = 'Deletar';
                            deleteButton.classList.add('delete-button');
                            deleteButton.onclick = (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                console.log('ID da imagem para exclusão:', image.id);
                                deleteImage(image.id);
                            };

                            figureElement.appendChild(deleteButton);
                        }

                        const linkElement = document.createElement('a');
                        linkElement.href = image.image_path;
                        linkElement.classList.add('gallery-link', 'no-background');
                        linkElement.setAttribute('data-lightbox', 'models');
                        linkElement.appendChild(figureElement);

                        gallery.appendChild(linkElement);
                    }
                });
            }
        })
        .catch(error => console.error('Erro ao carregar imagens:', error));
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
