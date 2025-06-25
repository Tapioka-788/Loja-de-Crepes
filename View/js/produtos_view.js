import { pegarCartoes } from "./../../Controller/services/produtos_S.js";
import { adicionarAoCarrinho } from "./../../Controller/login.js"

export async function criarCartoes() {
    const sectionCartoes = document.getElementById("sectionCartoes");
    const sectionProduts = document.getElementById("sectionProduts");

    const produtos = await pegarCartoes()
    console.log(produtos)

    for (let i = 0; i < produtos.length; i++) {

        // Criando o cartão
        const cartao = document.createElement("div");
        cartao.classList.add("cartao");

        // Criando nome e descrição
        const nomeDesc = document.createElement("div");
        nomeDesc.id = "nomeDesc";

        const titulo = document.createElement("h1");
        titulo.id = "titulo";
        titulo.textContent = produtos[i].nome;

        const descricao = document.createElement("p");
        descricao.id = "descricao";
        descricao.textContent = produtos[i].descricao;

        nomeDesc.appendChild(titulo);
        nomeDesc.appendChild(descricao);

        // Criando imagem e botão
        const imgBtn = document.createElement("div");
        imgBtn.id = "imgBtn";

        const imgCartao = document.createElement("div");
        imgCartao.id = "imgCartao";

        const img = document.createElement("img");
        img.id = "foto";
        img.src = "./../../Model/" + produtos[i].imgSrc;
        img.alt = produtos[i].nome;

        imgCartao.appendChild(img);

        const botao = document.createElement("button");
        botao.id = "addCarrinho";
        botao.textContent = "";
        botao.addEventListener("click", () => adicionarAoCarrinho(produtos[i]));

        const ibotao = document.createElement("i");
        ibotao.id = "ibotao";
        ibotao.classList = "fa-solid fa-cart-shopping"

        botao.appendChild(ibotao);

        imgBtn.appendChild(imgCartao);
        imgBtn.appendChild(botao);

        // Adicionando tudo ao cartão
        cartao.appendChild(nomeDesc);
        cartao.appendChild(imgBtn);

        // Adicionando o cartão à seção
        sectionCartoes.appendChild(cartao);

        sectionProduts.style.height = "90vh"

        if (i >= 6 && (i - 6) % 3 === 0) {
            const alturaAtual = parseInt(window.getComputedStyle(sectionProduts).height);
            sectionProduts.style.height = `${alturaAtual + 30}vh`;
        }
    }
}