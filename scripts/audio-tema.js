(function () {
    const root = document.documentElement;
    let musicaAtual = null;
    let musicaPausada = false;
    const pausarMusicaBtn = document.getElementById('pausar-musica');

    // Áudios globais
    let forceTheme, imperialMarch, starWarsTheme;
    const lightSaber = new Audio('sounds/light-saber.mp3');
    lightSaber.volume = 0.15;
    const blaster = new Audio('sounds/blaster.mp3');
    blaster.volume = 0.15;

    function inicializarAudios() {
        if (forceTheme && imperialMarch && starWarsTheme) return;

        forceTheme = new Audio('sounds/force-theme.mp3');
        imperialMarch = new Audio('sounds/imperial-march.mp3');
        starWarsTheme = new Audio('sounds/star-wars-theme.mp3');

        forceTheme.loop = true;
        imperialMarch.loop = true;
        starWarsTheme.loop = true;

        forceTheme.volume = 0.4;
        imperialMarch.volume = 0.4;
        starWarsTheme.volume = 0.4;
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
            criarOverlay(); // cria overlay se navegador bloquear autoplay
        });
    }

    function alternarMusica() {
        if (!musicaAtual) return;

        if (musicaPausada) {
            musicaAtual.play();
            musicaPausada = false;
            pausarMusicaBtn.textContent = 'Pausar Música';
        } else {
            musicaAtual.pause();
            musicaPausada = true;
            pausarMusicaBtn.textContent = 'Tocar Música';

            lightSaber.pause();
            lightSaber.currentTime = 0;
            blaster.pause();
            blaster.currentTime = 0;
        }
    }

    // 🔹 Delegation para sabre de luz (hover em qualquer item-lista existente ou futuro)
    window.ativarSabre = function () {
        document.body.addEventListener('mouseenter', e => {
            const alvo = e.target.closest('.item-lista, .salvar-btn, .cancelar-btn');
            if (!alvo) return;
            if (localStorage.getItem('audioLiberado') === 'true' && !musicaPausada) {
                lightSaber.currentTime = 0;
                lightSaber.play().catch(() => {});
            }
        }, true);

        document.body.addEventListener('mouseleave', e => {
            const alvo = e.target.closest('.item-lista, .salvar-btn, .cancelar-btn');
            if (!alvo) return;
            lightSaber.pause();
            lightSaber.currentTime = 0;
        }, true);
    };

    window.ativarBlaster = function () {
        const botoes = document.querySelectorAll('#pausar-musica, #img-tema, .add-tarefa, .logout-btn, .check-btn, .lightsaber-btn, .open-form');
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
        localStorage.setItem('audioLiberado', 'true');

        const overlay = document.getElementById('audio-overlay');
        if (overlay) overlay.remove();
    }

    function criarOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'audio-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.zIndex = 9999;
        overlay.style.background = 'transparent';
        overlay.style.cursor = 'pointer';
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
    } else {
        criarOverlay();
    }

    // Observa troca de tema
    const observer = new MutationObserver(() => tocarMusica());
    observer.observe(root, { attributes: true, attributeFilter: ['data-tema'] });
})();
