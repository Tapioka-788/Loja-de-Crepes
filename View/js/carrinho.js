import { pegarCartoes } from "./../../Controller/services/produtos_S.js";
import { pegarPedidos } from "./../../Controller/services/produtos_S.js";
import { removerDoCarrinho } from "../../Controller/services/produtos_S.js";

export async function criarCarrinho() {
    const sectionCartoes = document.getElementById("showCarrinho");
    const sectionProduts = document.getElementById("sectionCart");
    const statusCarrinho = document.getElementById("statusCarrinho");

    sectionCartoes.innerHTML = "";

    const carrinhos = await pegarPedidos();
    const produtos = await pegarCartoes();

    console.log("pegou os pedidos e produtos");

    // Verifica se os dados retornaram corretamente
    console.log("Carrinhos:", carrinhos);
    console.log("Produtos:", produtos);

    if (!Array.isArray(carrinhos)) {
        console.error("Erro: 'carrinhos' não é um array válido:", carrinhos);
        return;
    }

    // Obtendo o nome do usuário logado
    const bdProprio = JSON.parse(localStorage.getItem('bdProprio')) || [];
    const usuarioLogado = bdProprio.length > 0 ? bdProprio[0].nome : null;

    if (!usuarioLogado) {
        console.error("Nenhum usuário logado encontrado.");
        return;
    }

    // Filtrando os pedidos apenas do usuário logado
    const carrinhosUsuario = carrinhos.filter(carrinho => carrinho.usuario.nomeUx === usuarioLogado);

    // Atualizando o status do carrinho
    if (carrinhosUsuario.length === 0) {
        statusCarrinho.textContent = "Seu carrinho está vazio.";
    } else if (carrinhosUsuario.length === 1) {
        statusCarrinho.textContent = "Você tem um produto no seu carrinho.";
    } else {
        statusCarrinho.textContent = `Você tem ${carrinhosUsuario.length} itens em seu carrinho.`;
    }

    // Criando os cartões e somando os valores
    let total = 0;

    for (const carrinho of carrinhosUsuario) {
        const produto = produtos.find(p => p.id === carrinho.produtoId);

        if (!produto) {
            console.warn("Produto não encontrado para carrinho:", carrinho);
            continue;
        }

        // Criando o cartão do produto
        const cartao = document.createElement("div");
        cartao.classList.add("cartao");

        // Criando nome e descrição
        const nomeDesc = document.createElement("div");
        nomeDesc.id = "nomeDesc";

        const titulo = document.createElement("h1");
        titulo.textContent = produto.nome;
        titulo.id = "titulo";

        const descricao = document.createElement("p");
        descricao.textContent = produto.descricao;

        nomeDesc.appendChild(titulo);
        nomeDesc.appendChild(descricao);

        // Criando imagem e botão
        const imgBtn = document.createElement("div");
        imgBtn.id = "imgBtn";

        const imgCartao = document.createElement("div");
        imgCartao.id = "imgCartao";

        const img = document.createElement("img");
        img.id = "foto";
        img.src = "./../../Model/" + produto.imgSrc;
        img.alt = produto.nome;

        imgCartao.appendChild(img);

        const botao = document.createElement("button");
        botao.id = "delCarrinho";
        botao.addEventListener("click", () => removerDoCarrinho(produto));

        const ibotao = document.createElement("i");
        ibotao.id = "ibotao";
        ibotao.classList = "fa-solid fa-xmark"

        botao.appendChild(ibotao);

        imgBtn.appendChild(imgCartao);
        imgBtn.appendChild(botao);

        // Adicionando tudo ao cartão
        cartao.appendChild(nomeDesc);
        cartao.appendChild(imgBtn);

        // Adicionando o cartão à seção
        sectionCartoes.appendChild(cartao);

        console.log("Produto adicionado ao carrinho:", produto.nome);

        // Somando o valor
        const precoNumerico = parseFloat(produto.preco);
        if (!isNaN(precoNumerico)) {
            console.log(`Somando R$ ${precoNumerico} do produto: ${produto.nome}`);
            total += precoNumerico;
        } else {
            console.warn(`Preço inválido para produto: ${produto.nome} -> "${produto.preco}"`);
        }
    }

    console.log("Total final calculado:", total);

    sectionProduts.style.height = "90vh";

    const valorTotalElement = document.getElementById("valor");
    valorTotalElement.textContent = `Seus produtos deram: R$ ${total.toFixed(2).replace('.', ',')}`;
}
