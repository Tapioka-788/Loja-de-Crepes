let pagamentoSect = document.getElementById("pagamento");
let comprovante = document.getElementById("comprovante");

let sectionCart = document.getElementById('sectionCart');

// ✅ Detecta mudança no input e valida se é PDF
const inputComprovante = document.getElementById("inputComprovante");
const labelComprovante = document.getElementById("labelInputComprovante");

inputComprovante.addEventListener("change", function () {
    const arquivo = inputComprovante.files[0];

    if (!arquivo) {
        console.log("Nenhum arquivo selecionado.");
        return;
    }

    if (arquivo.type === "application/pdf") {
        console.log("PDF selecionado com sucesso:", arquivo.name);
        labelComprovante.textContent = "Comprovante: " + arquivo.name;
    } else {
        alert("⚠️ Apenas arquivos PDF são aceitos!");
        inputComprovante.value = "";
        labelComprovante.textContent = "Selecionar Comprovante";
    }
});

export function pagamento(numeroTela) {
    if (numeroTela == 0) {
        pagamentoSect.style.left = '-' + numeroTela + '00vw'
        console.log("Abriu a tela de pagamento")
    } else if (numeroTela == 1) {
        pagamentoSect.style.left = '-' + numeroTela + '00vw'
        console.log("Fechou a tela de pagamento")
    } else if (numeroTela == 2) {
        comprovante.style.left = '-' + 0 + '00vw'
        console.log("Abriu a tela de comprovante")
    } else if (numeroTela == 3) {
        comprovante.style.left = '-' + 1 + '00vw'
        console.log("Fechou a tela de comprovante")
    } else if (numeroTela == 4) {
        comprovante.style.left = '-100vw';
        console.log("Fechou a tela de comprovante e salvou no bd");

        const bdProprio = JSON.parse(localStorage.getItem('bdProprio')) || [];
        const usuarioLogado = bdProprio.length > 0 ? bdProprio[0].nome : null;

        if (!usuarioLogado) {
            console.error("Nenhum usuário logado encontrado.");
            return;
        }

        import("./../../Controller/services/produtos_S.js").then(async ({ pegarPedidos, pegarCartoes }) => {
            const carrinhos = await pegarPedidos();
            const produtos = await pegarCartoes();

            const carrinhosUsuario = carrinhos.filter(c => c.usuario.nomeUx === usuarioLogado);

            const produtosDoCarrinho = carrinhosUsuario.map(c => {
                const produto = produtos.find(p => p.id === c.produtoId);
                return produto ? {
                    nome: produto.nome,
                    preco: parseFloat(produto.preco)
                } : null;
            }).filter(p => p !== null);

            const total = produtosDoCarrinho.reduce((acc, p) => acc + p.preco, 0);

            const arquivo = inputComprovante.files[0];

            if (!arquivo || arquivo.type !== "application/pdf") {
                alert("⚠️ Por favor, selecione um arquivo PDF válido como comprovante.");
                return;
            }

            const leitor = new FileReader();
            leitor.onload = async function () {
                const base64 = leitor.result;

                const produtosFormatados = produtosDoCarrinho.map(p => ({
                    produto: p.nome,
                    valor: p.preco.toFixed(2)
                }));

                try {
                    const response = await fetch("https://back-end-crepes.vercel.app/comprovantes", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            nomeUx: usuarioLogado,
                            comprovante: base64,
                            produtos: produtosFormatados
                        })
                    });

                    const data = await response.json();

                    if (data.mensagem?.includes("sucesso")) {
                        alert("✅ Compra concluída e comprovante enviado!");

                        for (const item of carrinhosUsuario) {
                            await fetch("https://back-end-crepes.vercel.app/usuarios", {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    usuarioNome: usuarioLogado,
                                    produtoId: item.produtoId
                                })
                            });
                        }

                        console.log("Carrinho do usuário foi limpo.");

                        import("./../../View/js/carrinho_view.js").then(({ criarCarrinho }) => {
                            criarCarrinho();
                        });

                        setTimeout(() => {
                            location.reload();
                        }, 2000);

                    } else {
                        alert("❌ Houve um problema ao salvar seu comprovante.");
                        console.error(data);
                    }
                } catch (err) {
                    console.error("Erro ao enviar comprovante:", err);
                    alert("❌ Erro ao enviar comprovante.");
                }
            };
            leitor.readAsDataURL(arquivo);
        });
    }
}

export function copiarLinkPix() {
    const linkPix = "https://seu-link-do-pix.com";

    navigator.clipboard.writeText(linkPix)
        .then(() => {
            alert("Link copiado para a área de transferência!");
        })
        .catch(err => {
            console.error("Erro ao copiar o link:", err);
        });
}
