const RESULTS_ELEMENT = document.getElementById('apiResults'); 

function displayStatus(message, isSuccess = true) {
    const statusText = `[${isSuccess ? 'SUCESSO' : 'ERRO'}] ${new Date().toLocaleTimeString()}: ${message}`;
    console.log(statusText);
    
    if (RESULTS_ELEMENT) {
        const p = document.createElement('p');
        p.textContent = statusText;
        p.style.color = isSuccess ? 'green' : 'red';
        RESULTS_ELEMENT.prepend(p);
    }
}


async function registerUser(email, password, name, role, cnpj) {
    const data = { email, password, name, role, cnpj: cnpj || null };

    try {
        const responseBody = await apiCall('/auth/register', 'POST', data, false);
        
        const token = responseBody.token;
        localStorage.setItem('authToken', token);
        displayStatus(`Registro bem-sucedido. Redirecionando para o Catálogo...`);
                
        window.location.href = 'pages/catalog.html'; // não é para redirecionar
        
        return token; 

    } catch (error) {
        displayStatus(`Falha no registro: ${error.message}`, false);
        return null;
    }
}

/**
 * Envia credenciais de login e lida com o token/redirecionamento.
 */
async function loginUser(email, password) {
    const data = { email, password };

    try {
        const responseBody = await apiCall('/auth/login', 'POST', data, false);

        const token = responseBody.token;
        localStorage.setItem('authToken', token);
        displayStatus(`Login efetuado com sucesso. Redirecionando para o Catálogo...`);
        
        window.location.href = 'pages/catalog.html'; 
        
        return token; 

    } catch (error) {
        displayStatus(`Falha no login: ${error.message}`, false);
        return null;
    }
}