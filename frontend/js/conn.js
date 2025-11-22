const API_BASE_URL = 'http://localhost:8080/api';

async function apiCall(endpoint, method = 'GET', data = null, requireAuth = false) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
    };

    if (requireAuth) {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Usuário não autenticado. Token ausente.');
        }
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method: method,
        headers: headers,
        body: data ? JSON.stringify(data) : null,
    };

    try {
        const response = await fetch(url, config);
        const responseBody = await response.json();
        
        if (!response.ok) {
            throw new Error(responseBody.message || `Erro ${response.status} na API.`);
        }
        
        return responseBody;
    } catch (error) {
        // Propaga o erro
        throw error;
    }
}