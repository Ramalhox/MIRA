//-------------------------------------------------
// Seleção das áreas
//-------------------------------------------------

const menuItems = Array.from(document.querySelectorAll("nav li"));

const bannerItems = [
    document.querySelector(".banner h1"),
    document.querySelector(".banner p"),
    ...document.querySelectorAll(".banner .btn")
];

const cardRow = document.querySelector(".grid");
const cards = Array.from(document.querySelectorAll(".grid .card"));


//-------------------------------------------------
// Função para falar texto
//-------------------------------------------------
function speakText(el) {
    const text = el.getAttribute("data-read") || el.innerText || "";
    if (!text) return;

    speechSynthesis.cancel();

    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "pt-BR";
    speechSynthesis.speak(msg);
}


//-------------------------------------------------
// Foco + clique → falar texto
//-------------------------------------------------
document.body.addEventListener("focus", (e) => {
    if (e.target.hasAttribute("data-read")) {
        speakText(e.target);
    }
}, true);

document.body.addEventListener("click", (e) => {
    let el = e.target;
    while (el && el !== document) {
        if (el.hasAttribute && el.hasAttribute("data-read")) {
            speakText(el);
            break;
        }
        el = el.parentNode;
    }
});


//-------------------------------------------------
// Função: focar elemento e rolar carrossel
//-------------------------------------------------
function focusAndScroll(el) {
    if (!el) return;
    el.focus();
    speakText(el);

    // Mantém o card visível no carrossel
    if (cardRow.contains(el)) {
        const rect = el.getBoundingClientRect();
        const parentRect = cardRow.getBoundingClientRect();

        if (rect.left < parentRect.left) {
            cardRow.scrollLeft -= (parentRect.left - rect.left + 20);
        } else if (rect.right > parentRect.right) {
            cardRow.scrollLeft += (rect.right - parentRect.right + 20);
        }
    }
}


//-------------------------------------------------
// NAVEGAÇÃO PRINCIPAL POR SETAS
//-------------------------------------------------
document.addEventListener("keydown", (e) => {
    const focused = document.activeElement;

    //-------------------------------------------------
    // MENU
    //-------------------------------------------------
    if (menuItems.includes(focused)) {
        const i = menuItems.indexOf(focused);

        if (e.key === "ArrowRight") focusAndScroll(menuItems[i + 1]);
        if (e.key === "ArrowLeft") focusAndScroll(menuItems[i - 1]);
        if (e.key === "ArrowDown") focusAndScroll(bannerItems[0]);

        return;
    }

    //-------------------------------------------------
    // BANNER
    //-------------------------------------------------
    if (bannerItems.includes(focused)) {
        const i = bannerItems.indexOf(focused);

        if (e.key === "ArrowRight") focusAndScroll(bannerItems[i + 1]);
        if (e.key === "ArrowLeft") focusAndScroll(bannerItems[i - 1]);
        if (e.key === "ArrowUp") focusAndScroll(menuItems[0]);
        if (e.key === "ArrowDown") focusAndScroll(cards[0]); // desce para a sessão

        return;
    }

    //-------------------------------------------------
    // CARROSSEL (cards em flex)
    //-------------------------------------------------
    if (cards.includes(focused)) {
        const i = cards.indexOf(focused);

        if (e.key === "ArrowRight") focusAndScroll(cards[i + 1]);
        if (e.key === "ArrowLeft") focusAndScroll(cards[i - 1]);

        if (e.key === "ArrowUp") {
            focusAndScroll(bannerItems[bannerItems.length - 1]);
        }

        if (e.key === "ArrowDown") {
            // caso tenha outra seção depois, podemos mudar depois
            speakText(focused);
        }

        return;
    }

});
