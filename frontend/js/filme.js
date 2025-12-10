// MIRA - Funcionalidades Interativas
document.addEventListener('DOMContentLoaded', function() {
    
    // =============================================
    // 1. HEADER SCROLL EFFECT
    // =============================================
    const header = document.querySelector('.main-header');
    
    if (header) {
        function handleScroll() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Executar uma vez ao carregar
    }
    
    // =============================================
    // 2. SLIDER INDICATORS
    // =============================================
    const featuredItems = document.querySelectorAll('.featured-item');
    
    if (featuredItems.length > 0) {
        // Criar container de indicadores
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'slider-indicators';
        
        // Criar indicadores para cada item
        featuredItems.forEach((item, index) => {
            const indicator = document.createElement('div');
            indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
            indicator.dataset.index = index;
            
            // Adicionar evento de clique
            indicator.addEventListener('click', function() {
                const itemIndex = parseInt(this.dataset.index);
                navigateToSlide(itemIndex);
            });
            
            indicatorsContainer.appendChild(indicator);
        });
        
        // Adicionar indicadores após o slider
        const featuredSlider = document.querySelector('.featured-slider');
        if (featuredSlider) {
            featuredSlider.after(indicatorsContainer);
        }
        
        // Navegação entre slides
        let currentSlide = 0;
        
        function navigateToSlide(index) {
            currentSlide = index;
            
            // Atualizar indicadores
            document.querySelectorAll('.indicator').forEach((ind, i) => {
                ind.classList.toggle('active', i === index);
            });
            
            // Destacar o card correspondente
            featuredItems.forEach((item, i) => {
                if (i === index) {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1.02)';
                } else {
                    item.style.opacity = '0.9';
                    item.style.transform = 'scale(0.98)';
                }
            });
            
            // Scroll suave para o item
            featuredItems[index].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
        
        // Autoplay do slider
        let slideInterval;
        
        function startSlider() {
            slideInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % featuredItems.length;
                navigateToSlide(currentSlide);
            }, 5000);
        }
        
        function stopSlider() {
            clearInterval(slideInterval);
        }
        
        // Iniciar autoplay
        startSlider();
        
        // Pausar no hover
        featuredSlider.addEventListener('mouseenter', stopSlider);
        featuredSlider.addEventListener('mouseleave', startSlider);
    }
    
    // =============================================
    // 3. EFEITOS NAS CARDS DE FILMES
    // =============================================
    const movieCards = document.querySelectorAll('.movie-card');
    
    movieCards.forEach(card => {
        // Elevar card no hover
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
        
        // Click para ver detalhes
        const detailsBtn = card.querySelector('.btn-details');
        if (detailsBtn) {
            detailsBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const movieTitle = card.querySelector('.movie-title').textContent;
                showMovieDetails(movieTitle);
            });
        }
        
        // Click na card inteira
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.btn-details')) {
                const movieTitle = this.querySelector('.movie-title').textContent;
                showMovieDetails(movieTitle);
            }
        });
    });
    
    // =============================================
    // 4. BADGE DE TRENDING
    // =============================================
    function addTrendingBadges() {
        const trendingMovies = document.querySelectorAll('.movie-card:nth-child(-n+3)');
        
        trendingMovies.forEach((movie, index) => {
            const badge = document.createElement('div');
            badge.className = 'trending-badge';
            
            // Diferentes textos para os top 3
            const badgeTexts = ['#1 TRENDING', '#2 TRENDING', '#3 TRENDING'];
            badge.textContent = badgeTexts[index] || 'TRENDING';
            
            movie.appendChild(badge);
        });
    }
    
    // Chamar a função
    addTrendingBadges();
    
    // =============================================
    // 5. EFEITOS NA BUSCA
    // =============================================
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.boxShadow = '0 0 0 2px rgba(255, 87, 34, 0.3)';
        });
        
        searchInput.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
            this.parentElement.style.boxShadow = 'none';
        });
        
        // Busca em tempo real
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm.length > 1) {
                filterMovies(searchTerm);
            } else {
                showAllMovies();
            }
        });
    }
    
    // =============================================
    // 6. BOTÕES DE AÇÃO
    // =============================================
    // Botão Assistir
    const watchBtn = document.querySelector('.btn-primary-feature');
    if (watchBtn) {
        watchBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const movieTitle = document.querySelector('.featured-item.big .featured-title')?.textContent || 'Filme em Destaque';
            playMovie(movieTitle);
        });
    }
    
    // Botão Adicionar à Lista
    const addToListBtn = document.querySelector('.btn-secondary-feature');
    if (addToListBtn) {
        addToListBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMyList(this);
        });
    }
    
    // =============================================
    // 7. FUNÇÕES AUXILIARES
    // =============================================
    function toggleMyList(button) {
        const icon = button.querySelector('i');
        const isAdded = icon.classList.contains('fa-check');
        
        if (!isAdded) {
            // Adicionar
            icon.classList.remove('fa-plus');
            icon.classList.add('fa-check');
            button.innerHTML = '<i class="fas fa-check"></i> Adicionado';
            button.style.background = 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)';
            button.style.borderColor = '#2e7d32';
            
            // Notificação
            showNotification('Filme adicionado à sua lista!');
        } else {
            // Remover
            icon.classList.remove('fa-check');
            icon.classList.add('fa-plus');
            button.innerHTML = '<i class="fas fa-plus"></i> Minha Lista';
            button.style.background = '';
            button.style.borderColor = '';
            
            // Notificação
            showNotification('Filme removido da sua lista.');
        }
    }
    
    function playMovie(title) {
        // Criar modal de player
        const modal = document.createElement('div');
        modal.className = 'player-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div class="player-content" style="
                background: var(--bg-card);
                padding: 20px;
                border-radius: 12px;
                max-width: 800px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="color: var(--text-white); margin: 0;">Reproduzindo: ${title}</h3>
                    <button class="close-modal" style="
                        background: transparent;
                        border: none;
                        color: var(--text-gray);
                        font-size: 24px;
                        cursor: pointer;
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                    ">&times;</button>
                </div>
                <div style="
                    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
                    height: 300px;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    margin: 20px 0;
                    border: 2px dashed var(--border-color);
                ">
                    <div style="font-size: 60px; color: var(--primary-color); margin-bottom: 20px;">
                        <i class="fas fa-play-circle"></i>
                    </div>
                    <p style="color: var(--text-gray);">Player de vídeo seria exibido aqui</p>
                </div>
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-top: 20px;
                    padding: 15px;
                    background: rgba(0,0,0,0.3);
                    border-radius: 8px;
                ">
                    <button class="player-btn" style="
                        background: var(--primary-color);
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    ">
                        <i class="fas fa-play"></i> Play
                    </button>
                    <div style="flex: 1; height: 6px; background: var(--border-color); border-radius: 3px; overflow: hidden;">
                        <div style="width: 30%; height: 100%; background: var(--primary-color); border-radius: 3px;"></div>
                    </div>
                    <span style="color: var(--text-gray); font-size: 14px; min-width: 100px;">0:00 / 2:15:00</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Fechar modal
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        });
        
        // Fechar ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => modal.remove(), 300);
            }
        });
        
        // Fechar com ESC
        function handleEsc(e) {
            if (e.key === 'Escape') {
                modal.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    if (modal.parentNode) modal.remove();
                    document.removeEventListener('keydown', handleEsc);
                }, 300);
            }
        }
        
        document.addEventListener('keydown', handleEsc);
        
        // Adicionar animação CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // Remover estilo quando modal for removido
        modal.addEventListener('animationend', function(e) {
            if (e.animationName === 'fadeOut') {
                style.remove();
            }
        });
    }
    
    function showMovieDetails(title) {
        // Criar modal simples
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            padding: 20px;
            animation: fadeIn 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="
                background: var(--bg-card);
                padding: 30px;
                border-radius: 12px;
                max-width: 600px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: var(--text-white); margin: 0;">${title}</h2>
                    <button class="close-modal" style="
                        background: transparent;
                        border: none;
                        color: var(--text-gray);
                        font-size: 24px;
                        cursor: pointer;
                    ">&times;</button>
                </div>
                <div style="margin-bottom: 20px;">
                    <img src="https://via.placeholder.com/300x450/333/666?text=${encodeURIComponent(title)}" 
                         alt="${title}" 
                         style="width: 100%; border-radius: 8px; margin-bottom: 20px;">
                    
                    <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                        <span style="background: var(--primary-color); color: white; padding: 4px 10px; border-radius: 4px;">2024</span>
                        <span style="background: rgba(255, 87, 34, 0.1); color: var(--text-gray); padding: 4px 10px; border-radius: 4px;">2h 15min</span>
                        <span style="background: rgba(255, 87, 34, 0.1); color: var(--text-gray); padding: 4px 10px; border-radius: 4px;">⭐ 9.1/10</span>
                    </div>
                    
                    <div style="color: var(--text-light); line-height: 1.6;">
                        <h4 style="color: var(--text-white); margin-bottom: 10px;">Sinopse</h4>
                        <p>Uma história emocionante sobre ${title.toLowerCase()}. Neste filme incrível, acompanhamos a jornada de personagens cativantes em um mundo cheio de desafios e descobertas.</p>
                        
                        <h4 style="color: var(--text-white); margin: 20px 0 10px 0;">Elenco Principal</h4>
                        <p>Ator Principal, Atriz Principal, Ator Coadjuvante, Atriz Coadjuvante</p>
                        
                        <h4 style="color: var(--text-white); margin: 20px 0 10px 0;">Diretor</h4>
                        <p>Diretor Famoso</p>
                    </div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button style="
                        background: var(--primary-color);
                        color: white;
                        border: none;
                        padding: 12px 20px;
                        border-radius: 6px;
                        cursor: pointer;
                        flex: 1;
                        font-weight: 600;
                    ">
                        <i class="fas fa-play"></i> Assistir Agora
                    </button>
                    <button style="
                        background: transparent;
                        color: var(--primary-color);
                        border: 1px solid var(--primary-color);
                        padding: 12px 20px;
                        border-radius: 6px;
                        cursor: pointer;
                        flex: 1;
                        font-weight: 600;
                    ">
                        <i class="fas fa-plus"></i> Minha Lista
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Fechar modal
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        });
        
        // Fechar ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => modal.remove(), 300);
            }
        });
        
        // Fechar com ESC
        function handleEsc(e) {
            if (e.key === 'Escape') {
                modal.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    if (modal.parentNode) modal.remove();
                    document.removeEventListener('keydown', handleEsc);
                }, 300);
            }
        }
        
        document.addEventListener('keydown', handleEsc);
    }
    
    function filterMovies(searchTerm) {
        const movieCards = document.querySelectorAll('.movie-card');
        let found = false;
        
        movieCards.forEach(card => {
            const title = card.querySelector('.movie-title')?.textContent.toLowerCase() || '';
            const meta = card.querySelector('.movie-meta')?.textContent.toLowerCase() || '';
            
            if (title.includes(searchTerm) || meta.includes(searchTerm)) {
                card.style.display = 'block';
                found = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Mostrar mensagem se não encontrou
        showSearchFeedback(found, searchTerm);
    }
    
    function showAllMovies() {
        const movieCards = document.querySelectorAll('.movie-card');
        movieCards.forEach(card => {
            card.style.display = 'block';
        });
        
        // Remover feedback anterior
        const existingFeedback = document.querySelector('.search-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
    }
    
    function showSearchFeedback(found, term) {
        // Remover feedback anterior
        const existingFeedback = document.querySelector('.search-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        if (!found && term.trim() !== '') {
            const feedback = document.createElement('div');
            feedback.className = 'search-feedback';
            feedback.style.cssText = `
                background: var(--bg-card);
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                text-align: center;
                border-left: 4px solid var(--primary-color);
            `;
            
            feedback.innerHTML = `
                <p style="color: var(--text-white); margin-bottom: 10px;">
                    Nenhum filme encontrado para "<strong style="color: var(--primary-color);">${term}</strong>"
                </p>
                <button class="clear-search" style="
                    background: transparent;
                    color: var(--primary-color);
                    border: 1px solid var(--primary-color);
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 10px;
                ">
                    Limpar busca
                </button>
            `;
            
            const movieGrid = document.querySelector('.movie-grid');
            if (movieGrid) {
                movieGrid.before(feedback);
            } else {
                const container = document.querySelector('.container');
                if (container) {
                    container.appendChild(feedback);
                }
            }
            
            // Botão limpar busca
            feedback.querySelector('.clear-search').addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = '';
                }
                showAllMovies();
                feedback.remove();
            });
        }
    }
    
    function showNotification(message) {
        // Remover notificação anterior
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Criar notificação
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 3000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        notification.textContent = message;
        
        // Adicionar animação CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
                style.remove();
            }, 300);
        }, 3000);
    }
    
    // =============================================
    // 8. MENU MOBILE RESPONSIVO
    // =============================================
    function initMobileMenu() {
        if (window.innerWidth <= 768) {
            const nav = document.querySelector('.main-nav');
            const navLinks = document.querySelector('.main-nav-links');
            
            if (nav && navLinks && !document.querySelector('.mobile-menu-toggle')) {
                // Criar botão do menu
                const menuToggle = document.createElement('button');
                menuToggle.className = 'mobile-menu-toggle';
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                menuToggle.style.cssText = `
                    background: transparent;
                    border: none;
                    color: var(--text-white);
                    font-size: 24px;
                    cursor: pointer;
                    display: none;
                `;
                
                // Inserir botão após o logo
                const logo = document.querySelector('.logo');
                if (logo) {
                    logo.parentNode.insertBefore(menuToggle, logo.nextSibling);
                }
                
                // Mostrar botão apenas em mobile
                if (window.innerWidth <= 768) {
                    menuToggle.style.display = 'block';
                    
                    // Esconder menu inicialmente
                    nav.style.display = 'none';
                    
                    // Adicionar evento de clique
                    menuToggle.addEventListener('click', function() {
                        if (nav.style.display === 'none' || nav.style.display === '') {
                            nav.style.display = 'block';
                            nav.style.position = 'absolute';
                            nav.style.top = '70px';
                            nav.style.left = '0';
                            nav.style.width = '100%';
                            nav.style.background = 'var(--bg-dark)';
                            nav.style.padding = '20px';
                            nav.style.zIndex = '1000';
                            nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
                        } else {
                            nav.style.display = 'none';
                            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                        }
                    });
                    
                    // Fechar menu ao clicar em um link
                    navLinks.querySelectorAll('a').forEach(link => {
                        link.addEventListener('click', () => {
                            nav.style.display = 'none';
                            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                        });
                    });
                }
                
                // Revalidar ao redimensionar
                window.addEventListener('resize', function() {
                    if (window.innerWidth > 768) {
                        nav.style.display = '';
                        menuToggle.style.display = 'none';
                    } else {
                        menuToggle.style.display = 'block';
                        nav.style.display = 'none';
                        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                });
            }
        }
    }
    
    // Inicializar menu mobile
    initMobileMenu();
    
    // =============================================
    // 9. INICIALIZAÇÃO FINAL
    // =============================================
    console.log('MIRA Films - Carregado com sucesso!');
    
    // Adicionar classe de carregamento completo
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});