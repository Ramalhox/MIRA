// ====================================
//          1. Interações do Player
// ====================================
document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.querySelector('.play-button');
    const videoPlaceholder = document.querySelector('.video-placeholder');
    const progressBar = document.querySelector('.progress-bar');
    const timelineBar = document.querySelector('.timeline-bar');
    const currentTimeSpan = document.querySelector('.current-time');
    let isPlaying = false;
    let progressInterval;
    let totalSeconds = 7370; // 02:02:50 em segundos
    let currentSeconds = 5130; // 01:25:30 em segundos

    // Função para formatar segundos em HH:MM:SS
    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        const timeParts = [h, m, s];
        // Formata para 00:00:00 se houver horas
        return timeParts.map(p => p.toString().padStart(2, '0')).join(':');
    }

    // Atualiza a barra de progresso e o tempo
    function updateProgress() {
        if (!isPlaying) return;

        currentSeconds += 1; // Simula avanço de 1 segundo
        if (currentSeconds > totalSeconds) {
            currentSeconds = totalSeconds;
            stopPlayback();
        }

        const percentage = (currentSeconds / totalSeconds) * 100;
        progressBar.style.width = `${percentage}%`;

        // Atualiza a posição do thumb (bola de progresso)
        const thumb = document.querySelector('.thumb');
        thumb.style.left = `${percentage}%`;

        // Atualiza o tempo atual
        currentTimeSpan.textContent = formatTime(currentSeconds);
    }

    // Inicia a simulação de reprodução
    function startPlayback() {
        if (isPlaying) return;
        isPlaying = true;

        // Altera o ícone do botão (simulando que o play foi clicado)
        // O play button desapareceria ou mudaria para pause
        playButton.style.display = 'none';

        // Inicia o intervalo de atualização a cada segundo
        progressInterval = setInterval(updateProgress, 1000);
    }

    // Para a simulação de reprodução
    function stopPlayback() {
        isPlaying = false;
        clearInterval(progressInterval);
        // Em um player real, o botão de play reapareceria ou mudaria para pause se ainda estivesse visível
    }

    // Ação principal do botão de play
    playButton.addEventListener('click', (e) => {
        e.preventDefault();
        startPlayback();
        // Em um player real, o vídeo seria carregado e iniciado aqui
        console.log('Iniciando reprodução de Bacurau...');
    });

    // Interação de clique na barra de progresso (busca/seek)
    timelineBar.addEventListener('click', (e) => {
        const rect = timelineBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newPercentage = (clickX / rect.width);

        currentSeconds = Math.round(newPercentage * totalSeconds);

        // Atualiza visualmente o progresso imediatamente
        progressBar.style.width = `${newPercentage * 100}%`;

        // Atualiza o tempo atual
        currentTimeSpan.textContent = formatTime(currentSeconds);

        console.log(`Buscando para ${formatTime(currentSeconds)}`);

        // Garante que a reprodução continua se já estava iniciada
        if (isPlaying) {
            // Reinicia o intervalo para evitar desfasamento
            clearInterval(progressInterval);
            progressInterval = setInterval(updateProgress, 1000);
        } else {
            // Inicia se estava parado e clicou na barra
            startPlayback();
        }
    });

    // Define os tempos iniciais
    currentTimeSpan.textContent = formatTime(currentSeconds);
    document.querySelector('.total-time').textContent = formatTime(totalSeconds);

    // Configura a largura inicial da barra de progresso
    progressBar.style.width = `${(currentSeconds / totalSeconds) * 100}%`;
    document.querySelector('.thumb').style.left = `${(currentSeconds / totalSeconds) * 100}%`;
});


// ====================================
//          2. Interações de Clique
// ====================================

// Adiciona feedback visual de clique (simulação de modal/tooltip)
document.addEventListener('click', (e) => {
    // Seletor para botões interativos
    const interactiveButtons = e.target.closest('.publish-button, .feedback-button, .add-to-list-button, .like-button');
    const reportButton = e.target.closest('.report-issue');

    if (interactiveButtons) {
        // Remove qualquer tooltip anterior
        document.querySelectorAll('.tooltip-feedback').forEach(t => t.remove());

        const isPublish = interactiveButtons.classList.contains('publish-button');
        const isFeedback = interactiveButtons.classList.contains('feedback-button');
        const isAddToList = interactiveButtons.classList.contains('add-to-list-button');
        const isLike = interactiveButtons.classList.contains('like-button');

        let message = '';
        let target = interactiveButtons;

        if (isPublish) {
            const commentInput = document.querySelector('.comment-input');
            if (commentInput.value.trim() === '') {
                message = 'Escreva um comentário antes de publicar.';
            } else {
                message = 'Comentário publicado!';
                commentInput.value = ''; // Limpa o input
            }
        } else if (isFeedback) {
            message = 'Obrigado pelo seu feedback! Redirecionando...';
        } else if (isAddToList) {
            message = 'Filme adicionado à sua lista!';
        } else if (isLike) {
            // Simula o toggle de like
            const currentLikes = parseInt(target.textContent.trim()) || 0;
            const newLikes = target.classList.toggle('liked') ? currentLikes + 1 : currentLikes - 1;
            target.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z" fill="currentColor"/></svg> ${newLikes}`;
            message = target.classList.contains('liked') ? 'Você curtiu!' : 'Curtida removida.';
        }

        if (message) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip-feedback';
            tooltip.textContent = message;

            // Estilos dinâmicos do tooltip (para evitar criar CSSs complexos para algo simples)
            tooltip.style.cssText = `
                position: absolute;
                background-color: #4CAF50; /* Cor de sucesso */
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 0.9rem;
                z-index: 1000;
                top: ${target.getBoundingClientRect().top - 40}px;
                left: ${target.getBoundingClientRect().left}px;
                transition: opacity 0.3s ease-out;
            `;

            document.body.appendChild(tooltip);

            // Remove o tooltip após 2 segundos
            setTimeout(() => {
                tooltip.style.opacity = '0';
                setTimeout(() => tooltip.remove(), 300);
            }, 2000);
        }
    }

    if (reportButton) {
        // Remove qualquer tooltip anterior
        document.querySelectorAll('.tooltip-feedback').forEach(t => t.remove());

        const message = 'Reportando... Redirecionando para o formulário de problema.';
        const target = reportButton;

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip-feedback';
        tooltip.textContent = message;

        // Estilos dinâmicos do tooltip
        tooltip.style.cssText = `
            position: absolute;
            background-color: #f44336; /* Cor de erro/alerta */
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 0.9rem;
            z-index: 1000;
            top: ${target.getBoundingClientRect().top - 40}px;
            left: ${target.getBoundingClientRect().left}px;
            transition: opacity 0.3s ease-out;
        `;

        document.body.appendChild(tooltip);

        // Remove o tooltip após 2 segundos
        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => tooltip.remove(), 300);
        }, 2000);
    }
});

// ====================================
//          3. Acessibilidade
// ====================================

// Permite acionar botões usando Enter/Espaço no teclado
document.querySelectorAll('[role="button"]').forEach(button => {
    button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            button.click();
        }
    });
});