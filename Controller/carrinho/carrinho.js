// import { atualizarStatusCarrinho } from "./../../View/js/carrinho_view.js";
import { criarCarrinho } from "./../../View/js/carrinho.js"
import { pagamento }from"./pagamento.js"
import { copiarLinkPix }from"./pagamento.js"

window.pagamento = pagamento;
window.copiarLinkPix = copiarLinkPix;

document.addEventListener("DOMContentLoaded", () => {
    // atualizarStatusCarrinho();
    criarCarrinho();
})