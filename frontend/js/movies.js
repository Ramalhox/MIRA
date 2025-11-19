async function carregarFilmeDestaque() {
    const heroContainer = document.getElementById('heroDestaque');
    try {
        const res = await fetch('../test.json');
        
        if (!res.ok) {
            throw new Error(`Erro ao buscar o catálogo para destaque: ${res.status}`);
        }

        const data = await res.json();
      
        const filmeDestaque = data[0]; 

        if (!filmeDestaque) {
            console.warn("Nenhum filme encontrado no catálogo para ser destaque.");
            return;
        }

        const { title, overview, poster } = filmeDestaque; 
        
        const fundo_url = poster;

        heroContainer.style.backgroundImage = `url('${fundo_url}')`;

        const destaqueHTML = `
            <div class="hero-content">
                <h1 class="hero-title">${title}</h1>
                <p class="hero-description">${overview}</p>
                <div class="hero-actions">
                    <button class="btn-primary"><i class="fas fa-play"></i> Assistir</button>
                    <button class="btn-secondary"><i class="fas fa-plus"></i></button>
                </div>
            </div>
        `;

        heroContainer.innerHTML = destaqueHTML;

    } catch (error) {
        console.error('Erro ao processar filme em destaque:', error);
        heroContainer.innerHTML = '<p class="error-message">Não foi possível carregar o filme em destaque.</p>';
    }
}


async function carregarCatalogo() {
    try {
        const res = await fetch('../test.json');
        const data = await res.json();

        const container = document.querySelector('.filmes-container');

        data.forEach(filme => {
            const { title, overview, poster } = filme;

            const card = document.createElement('div');
            card.className = 'card';

            card.innerHTML = `
                <img src="${poster}" alt="${title}">
                <div class="card-content">
                    <h3 class="card-title">${title}</h3>
                </div>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error(`Erro ao carregar Json ${error}`);
    }
}

carregarFilmeDestaque();
carregarCatalogo();