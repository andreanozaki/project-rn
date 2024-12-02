document.addEventListener('DOMContentLoaded', function() {
    const userConsent = localStorage.getItem('cookieConsent');
    
    // Adiciona o banner de cookies ao DOM apenas se o consentimento não estiver definido
    if (!userConsent) {
        const cookieBannerHTML = `
            <div class="cookie-banner" id="cookieBanner">
                <div>
                    <p>Valorizamos sua privacidade <br>
                        Utilizamos cookies para aprimorar sua experiência de navegação
                        e analisar nosso tráfego. Ao clicar em “Aceitar todos”, você 
                        concorda com nosso uso de cookies. <a href="politica_privacidade.html" class="link-pp">Política de Privacidade</a>.
                    </p>
                </div>
                <div class="btn-cookies">
                    <button id="declineCookies" class="btn-main">Recusar</button>
                    <button id="acceptCookies" class="btn-main">Aceitar</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', cookieBannerHTML);
        
        const cookieBanner = document.getElementById('cookieBanner');
        const acceptCookiesButton = document.getElementById('acceptCookies');
        const declineCookiesButton = document.getElementById('declineCookies');
        
        // Eventos de clique para aceitar ou recusar cookies
        acceptCookiesButton.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.style.display = 'none';
            activateTracking();
        });

        declineCookiesButton.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.style.display = 'none';
        });
    }

    function activateTracking() {
        console.log('Cookies de rastreamento ativados.');
    }

    // Verifica se o consentimento é 'accepted' para ativar o rastreamento
    if (userConsent === 'accepted') {
        activateTracking();
    }
    //localStorage.removeItem('cookieConsent');

});
