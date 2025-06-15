// import { atualizarStatusCarrinho } from "./../../View/js/carrinho_view.js";
import { criarCarrinho } from "./../../View/js/carrinho.js"
import { pagamento }from"./pagamento.js"

window.pagamento = pagamento;

document.addEventListener("DOMContentLoaded", () => {
    // atualizarStatusCarrinho();
    criarCarrinho();
})