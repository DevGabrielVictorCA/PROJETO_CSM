// scripts/tema.js
(function() {
    const temaSalvo = localStorage.getItem('tema');
    const root = document.documentElement;
    const temaBtn = document.getElementById('tema-btn'); // botão opcional
    const imgIndicador = document.getElementById('img-indicador'); // opcional
    const imgTema = document.getElementById('img-tema'); // opcional

    function aplicarTema(tema) {
        root.setAttribute('data-tema', tema);
        localStorage.setItem('tema', tema);

        // Atualiza imagens se existirem
        if (imgIndicador) imgIndicador.src = tema === 'dark' ? 'images/imperio-icon.png' : 'images/jedi-icon.png';
        if (imgTema) imgTema.src = tema === 'dark' ? 'images/vader-icon.png' : 'images/yoda-icon.png';

        // Atualiza botão se existir
        if (temaBtn) {
            if (tema === 'dark') temaBtn.classList.add('tema-ativado');
            else temaBtn.classList.remove('tema-ativado');
        }
    }

    // Aplica tema inicial
    if (temaSalvo) aplicarTema(temaSalvo);
    else aplicarTema(matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    // Ativa alternância apenas se houver botão
    if (temaBtn) {
        temaBtn.addEventListener('click', () => {
            const temaAtual = root.getAttribute('data-tema');
            aplicarTema(temaAtual === 'light' ? 'dark' : 'light');
        });
    }
})();
