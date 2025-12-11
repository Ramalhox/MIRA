async function loadTemplate(elementId, templatePath) {
    try {
        const response = await fetch(templatePath);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;

        // Configurar eventos específicos após carregar
        if (elementId === 'navbar-container') {
            setupNavbar();
        } else if (elementId === 'sabia-widget-container') {
            // Carregar CSS e JS do Sabiá
            await loadSabiaWidget();
        }

        return true;
    } catch (error) {
        console.error(`Erro ao carregar template ${templatePath}:, error`);
        return false;
    }
}

// Função para carregar o widget Sabiá
async function loadSabiaWidget() {
    try {
        // Carregar CSS do Sabiá
        if (!document.querySelector('link[href*="sabia-widget.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '../components/sabia-widget.css';
            document.head.appendChild(link);
        }

        // Carregar JS do Sabiá
        if (!document.querySelector('script[src*="sabia-widget.js"]')) {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = '../js/sabia-widget.js';

            script.onload = async () => {
                // Importar e inicializar o widget
                const { inicializarSabiaWidget } = await import('../js/sabia-widget.js');
                if (typeof inicializarSabiaWidget === 'function') {
                    inicializarSabiaWidget();
                }
            };

            document.body.appendChild(script);
        } else {
            // Se já estiver carregado, só inicializar
            const { inicializarSabiaWidget } = await import('../js/sabia-widget.js');
            if (typeof inicializarSabiaWidget === 'function') {
                inicializarSabiaWidget();
            }
        }
    } catch (error) {
        console.error('Erro ao carregar widget Sabiá:', error);
    }
}

// Carregar templates na página
document.addEventListener('DOMContentLoaded', async () => {
    // Lista de templates para carregar
    const templates = [
        { id: 'navbar-container', path: '../templates/navbar.html' },
        { id: 'footer-container', path: '../templates/footer.html' }
    ];

    // Verificar se o widget Sabiá deve ser carregado
    if (document.getElementById('sabia-widget-container')) {
        templates.push({
            id: 'sabia-widget-container',
            path: '../templates/sabia-widget.html'
        });
    }

    // Carregar todos os templates em paralelo
    await Promise.all(
        templates.map(template => loadTemplate(template.id, template.path))
    );

    console.log('Todos os templates carregados!');
});

// Configurar navbar após carregar
function setupNavbar() {
    // Destacar a página atual
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-icon').forEach(icon => {
        icon.classList.remove('active');
        const href = icon.getAttribute('href');
        if (href && href.includes(currentPage)) {
            icon.classList.add('active');
        }
    });

    const userAvatarBtn = document.getElementById('user-avatar-btn');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (userAvatarBtn && userDropdown) {

        userDropdown.style.display = 'none';

        // Alternar dropdown ao clicar no avatar
        userAvatarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            // Fechar menu mobile se estiver aberto
            closeMobileMenu();
            
            // Alternar visibilidade do dropdown
            const isVisible = userDropdown.style.display === 'block';
            userDropdown.style.display = isVisible ? 'none' : 'block';
        });

        userDropdown.addEventListener('click', (e) => {
            if (e.target.closest('a') && !e.target.closest('.logout-btn')) {
                setTimeout(() => {
                    userDropdown.style.display = 'none';
                }, 200);
            }
        });
    }

    // busca
    const searchInput = document.querySelector('.search-input');
    const searchIcon = document.querySelector('.search-icon');

    if (searchInput && searchIcon) {
        searchIcon.addEventListener('click', () => {
            if (searchInput.value.trim()) {
                performSearch(searchInput.value);
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && searchInput.value.trim()) {
                performSearch(searchInput.value);
            }
        });
    }

    // menu mobile
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            mobileMenuOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    // busca mobile
    const mobileSearchBtn = document.querySelector('.mobile-search-btn');
    const mobileSearchInput = document.querySelector('.mobile-search-input');

    if (mobileSearchBtn && mobileSearchInput) {
        mobileSearchBtn.addEventListener('click', () => {
            if (mobileSearchInput.value.trim()) {
                performSearch(mobileSearchInput.value);
                closeMobileMenu();
            }
        });

        mobileSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && mobileSearchInput.value.trim()) {
                performSearch(mobileSearchInput.value);
                closeMobileMenu();
            }
        });
    }

    // Configurar logout
    const logoutBtns = document.querySelectorAll('.logout-btn, .mobile-logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Tem certeza que deseja sair?')) {
                // implementar o logout
                alert('Logout realizado!');
                window.location.href = '/index.html';
            }
        });
    });
}

// Fechar menu mobile
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

    if (mobileMenu) {
        mobileMenu.classList.remove('active');
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.style.display = 'none';
    }

    document.body.style.overflow = '';
}

// Carregar templates quando a página carregar
document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        loadTemplate('navbar-container', '../templates/navbar.html'),
        loadTemplate('footer-container', '../templates/footer.html')
    ]);
});

// Fechar dropdowns ao clicar fora
document.addEventListener('click', (e) => {
    const userDropdown = document.querySelector('.user-dropdown');
    const userAvatarBtn = document.querySelector('.user-avatar-btn');

    if (userDropdown && userAvatarBtn &&
        !userDropdown.contains(e.target) &&
        !userAvatarBtn.contains(e.target)) {
        userDropdown.style.display = 'none';
    }
}); 