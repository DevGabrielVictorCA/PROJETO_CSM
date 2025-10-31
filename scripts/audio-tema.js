(function () {
    const root = document.documentElement;
    let musicaAtual = null;
    let musicaPausada = false;
    const pausarMusicaBtn = document.getElementById('pausar-musica');

    // Áudios globais
    let forceTheme, imperialMarch, starWarsTheme;
    const lightSaber = new Audio('sounds/lightsaber.mp3');
    lightSaber.volume = 0.1;
    const blaster = new Audio('sounds/blaster.mp3');
    blaster.volume = 0.1;
    const laser = new Audio('sounds/laser.mp3');
    laser.volume = 0.8;

    function inicializarAudios() {
        if (forceTheme && imperialMarch && starWarsTheme) return;

        forceTheme = new Audio('sounds/force-theme.mp3');
        imperialMarch = new Audio('sounds/imperial-march.mp3');
        starWarsTheme = new Audio('sounds/star-wars-theme.mp3');

        forceTheme.loop = true;
        imperialMarch.loop = true;
        starWarsTheme.loop = true;

        forceTheme.volume = 0.2;
        imperialMarch.volume = 0.2;
        starWarsTheme.volume = 0.2;
    }

    function tocarMusica() {
        if (musicaPausada) return;
        inicializarAudios();

        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            forceTheme.pause();
            imperialMarch.pause();
            musicaAtual = starWarsTheme;
        } else {
            starWarsTheme.pause();
            forceTheme.pause();
            imperialMarch.pause();
            const tema = root.getAttribute('data-tema') || 'light';
            musicaAtual = tema === 'dark' ? imperialMarch : forceTheme;
        }

        musicaAtual.currentTime = 0;
        musicaAtual.play().catch(err => {
            console.warn('🎧 Som bloqueado:', err);
            criarOverlay(); 
        });
    }

    function alternarMusica() {
        if (!musicaAtual) return;

        if (musicaPausada) {
            musicaAtual.play();
            musicaPausada = false;
            pausarMusicaBtn.className = 'fa-solid fa-volume-low';        
        } else {
            musicaAtual.pause();
            musicaPausada = true;
            pausarMusicaBtn.className = 'fa-solid fa-volume-xmark'; 

            lightSaber.pause();
            lightSaber.currentTime = 0;
            blaster.pause();
            blaster.currentTime = 0;
        }
    }

    window.ativarSabre = function () {
        document.body.addEventListener('mouseenter', e => {
            const alvo = e.target.closest('.item-lista, .salvar-btn, .cancelar-btn, .enviar-email');
            if (!alvo) return;
            if (localStorage.getItem('audioLiberado') === 'true' && !musicaPausada) {
                lightSaber.currentTime = 0;
                lightSaber.play().catch(() => {});
            }
        }, true);

        document.body.addEventListener('mouseleave', e => {
            const alvo = e.target.closest('.item-lista, .salvar-btn, .cancelar-btn, .enviar-email');
            if (!alvo) return;
            lightSaber.pause();
            lightSaber.currentTime = 0;
        }, true);
    };

    window.ativarLaser = function () {
        document.body.addEventListener('mouseenter', e => {
            const alvo = e.target.closest('#pausar-musica, #img-tema, .add-tarefa, .login-btn, .logout-btn, .check-btn, .open-form, .close-form, .close-register, .entrar, .creator-card, a');
            if (!alvo) return;
            if (localStorage.getItem('audioLiberado') === 'true' && !musicaPausada) {
                laser.currentTime = 0;
                laser.play().catch(() => {});
            }
        }, true);

        document.body.addEventListener('mouseleave', e => {
            const alvo = e.target.closest('#pausar-musica, #img-tema, .add-tarefa, .login-btn, .logout-btn, .check-btn, .open-form, .close-form, .close-register, .entrar, .creator-card, a');
            if (!alvo) return;
            lightSaber.pause();
            lightSaber.currentTime = 0;
        }, true);
    };

    window.ativarBlaster = function () {
        const botoes = document.querySelectorAll('#pausar-musica, #img-tema, .add-tarefa, .login-btn, .logout-btn, .check-btn, .open-form, .close-form, .close-register, .entrar, a');
        botoes.forEach(btn => {
            btn.addEventListener('click', () => {
                if (localStorage.getItem('audioLiberado') === 'true' && !musicaPausada) {
                    blaster.currentTime = 0;
                    blaster.play().catch(() => {});
                }
            });
        });
    };

    function liberarAudio() {
        inicializarAudios();
        tocarMusica();
        window.ativarSabre();
        window.ativarBlaster();
        window.ativarLaser()
        localStorage.setItem('audioLiberado', 'true');

        const overlay = document.getElementById('audio-overlay');
        if (overlay) overlay.remove();
    }

    function criarOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'audio-overlay';

        // Define a classe conforme a página
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            overlay.className = 'overlay-visivel';
            overlay.textContent = 'Clique na tela para ativar o áudio 🔊';
        } else {
            overlay.className = 'overlay-invisivel';
        }

        overlay.addEventListener('click', liberarAudio);
        document.body.appendChild(overlay);
    }


    if (pausarMusicaBtn) {
        pausarMusicaBtn.addEventListener('click', alternarMusica);
    }

    // Inicialização
    if (localStorage.getItem('audioLiberado') === 'true') {
        inicializarAudios();
        tocarMusica();
        window.ativarSabre();
        window.ativarBlaster();
        window.ativarLaser()
    } else {
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            criarOverlay();
        }
    }

    const observer = new MutationObserver(() => tocarMusica());
    observer.observe(root, { attributes: true, attributeFilter: ['data-tema'] });
})();
