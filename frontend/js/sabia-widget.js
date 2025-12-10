// --- GERAR OU RECUPERAR SESSION ID ---
let sessionId = localStorage.getItem("sabia_session_id");

if (!sessionId) {
    try {
        sessionId = "sess-" + crypto.randomUUID();
    } catch {
        sessionId = "sess-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    }
    localStorage.setItem("sabia_session_id", sessionId);
}

// --- ENVIO PARA N8N ---
async function enviarMensagem(msg) {
    try {
        const resposta = await fetch("https://rafaelramalhomaciel.app.n8n.cloud/webhook/sabia", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pergunta: msg, sessionId })
        });

        if (!resposta.ok)
            throw new Error(`Erro ${ resposta.status }`);

        return await resposta.text();
    } catch {
        return "Desculpe, ocorreu um erro ao processar sua mensagem.";
    }
}

// --- INSERIR MENSAGENS ---
function adicionarMensagemDigitando(texto, tipo) {
    const welcomeMessage = document.querySelector(".welcome-message");
    if (welcomeMessage) welcomeMessage.remove();

    const chat = document.getElementById("sabia-chat");
    const msgDiv = document.createElement("div");
    msgDiv.className = `msg ${ tipo }`;
    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;

    let i = 0;
    function type() {
        msgDiv.textContent = texto.slice(0, i++);
        chat.scrollTop = chat.scrollHeight;
        if (i <= texto.length) setTimeout(type, 14);
    }
    type();
}

function adicionarMensagem(texto, tipo) {
    const welcomeMessage = document.querySelector(".welcome-message");
    if (welcomeMessage) welcomeMessage.remove();

    const chat = document.getElementById("sabia-chat");
    const msgDiv = document.createElement("div");
    msgDiv.className = `msg ${ tipo }`;
    msgDiv.textContent = texto;
    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;
}

function mostrarDigitando(show) {
    const typingIndicator = document.getElementById("typing-indicator");
    const chat = document.getElementById("sabia-chat");

    typingIndicator.classList.toggle("active", show);
    chat.scrollTop = chat.scrollHeight;
}

// --- ENVIAR ---
async function enviar() {
    const input = document.getElementById("sabia-msg");
    const sendBtn = document.getElementById("sabia-send");
    const texto = input.value.trim();

    if (!texto) return input.focus();

    if (texto.length > 500) {
        adicionarMensagem("Sua mensagem é muito longa. Máximo 500 caracteres.", "sabia");
        input.value = "";
        return;
    }

    input.disabled = true;
    sendBtn.disabled = true;

    adicionarMensagem(texto, "user");
    input.value = "";

    mostrarDigitando(true);

    const resposta = await enviarMensagem(texto);

    mostrarDigitando(false);
    adicionarMensagemDigitando(resposta, "sabia");

    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
}

// --- MINIMIZAR E FECHAR ---
function toggleMinimizar() {
    const widget = document.getElementById("sabia-widget-container");
    const minimizeBtn = document.getElementById("minimize-btn");
    const input = document.getElementById("sabia-msg");

    widget.classList.toggle("minimized");
    minimizeBtn.textContent = widget.classList.contains("minimized") ? "+" : "−";

    if (!widget.classList.contains("minimized")) {
        setTimeout(() => input.focus(), 100);
    }
}

function fecharWidget() {
    const widget = document.getElementById("sabia-widget-container");
    widget.style.display = "none";

    setTimeout(() => {
        if (confirm("Widget fechado. Deseja reabrir?")) {
            reabrirWidget();
        } else {
            reabrirWidget();
        }
    }, 100);
}

function reabrirWidget() {
    const widget = document.getElementById("sabia-widget-container");
    const minimizeBtn = document.getElementById("minimize-btn");
    const input = document.getElementById("sabia-msg");

    widget.style.display = "flex";
    widget.classList.remove("minimized");
    minimizeBtn.textContent = "−";
    input.focus();
}

// --- INICIALIZAR WIDGET ---
export function inicializarSabiaWidget() {
    // Verificar se os elementos existem
    if (!document.getElementById("sabia-widget-container")) {
        console.error("Container do Sabiá não encontrado!");
        return;
    }

    const sendBtn = document.getElementById("sabia-send");
    const input = document.getElementById("sabia-msg");
    const minimizeBtn = document.getElementById("minimize-btn");
    const closeBtn = document.getElementById("close-btn");
    const bubble = document.getElementById("sabia-bubble");
    const header = document.getElementById("sabia-header");
    const chat = document.getElementById("sabia-chat");

    // Configurar eventos
    sendBtn.addEventListener("click", enviar);
    input.addEventListener("keydown", e => e.key === "Enter" && enviar());
    minimizeBtn.addEventListener("click", toggleMinimizar);
    closeBtn.addEventListener("click", fecharWidget);

    bubble.addEventListener("click", () => {
        const widget = document.getElementById("sabia-widget-container");
        const minimizeBtn = document.getElementById("minimize-btn");
        const input = document.getElementById("sabia-msg");

        widget.classList.remove("minimized");
        minimizeBtn.textContent = "−";
        input.focus();
    });

    header.addEventListener("click", e => {
        if (e.target === e.currentTarget || e.target.tagName === "SPAN") {
            toggleMinimizar();
        }
    });

    input.focus();

    // Mensagem inicial após 1.5 segundos
    setTimeout(() => {
        if (chat.querySelectorAll(".msg").length === 0) {
            adicionarMensagem("Olá! Sou o Sabiá. Como posso ajudar?", "sabia");
        }
    }, 1500);

    console.log("Widget Sabiá inicializado com sucesso!");
}