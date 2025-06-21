let pagamentoSect = document.getElementById("pagamento");
let comprovante = document.getElementById("comprovante");

let sectionCart = document.getElementById('sectionCart')

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

        // 1. Resgatar carrinho do usuário logado
        const bdProprio = JSON.parse(localStorage.getItem('bdProprio')) || [];
        const usuarioLogado = bdProprio.length > 0 ? bdProprio[0].nome : null;

        if (!usuarioLogado) {
            console.error("Nenhum usuário logado encontrado.");
            return;
        }

        // 2. Resgatar pedidos e produtos
        import("./../../Controller/services/produtos_S.js").then(async ({ pegarPedidos, pegarCartoes }) => {
            const carrinhos = await pegarPedidos();
            const produtos = await pegarCartoes();

            // 3. Filtrar carrinho do usuário
            const carrinhosUsuario = carrinhos.filter(c => c.usuario.nomeUx === usuarioLogado);

            // 4. Mapear os produtos do carrinho
            const produtosDoCarrinho = carrinhosUsuario.map(c => {
                const produto = produtos.find(p => p.id === c.produtoId);
                return produto ? {
                    nome: produto.nome,
                    preco: parseFloat(produto.preco)
                } : null;
            }).filter(p => p !== null);

            const total = produtosDoCarrinho.reduce((acc, p) => acc + p.preco, 0);

            // 5. Resgatar comprovante
            const inputFile = document.getElementById("inputComprovante");
            const arquivo = inputFile.files[0];

            if (!arquivo) {
                alert("⚠️ Nenhum comprovante foi selecionado. Por favor, envie o comprovante antes de concluir o pagamento.");
                console.warn("Nenhum comprovante foi selecionado.");
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

                        // Limpar carrinho
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

                        // Recriar os cartões do carrinho
                        import("./../../View/js/carrinho_view.js").then(({ criarCarrinho }) => {
                            criarCarrinho(); // Atualiza visualmente o carrinho
                        });

                        // Opcional: recarregar a página após 2 segundos
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
    const linkPix = "https://seu-link-do-pix.com"; // substitua pelo link real

    navigator.clipboard.writeText(linkPix)
        .then(() => {
            alert("Link copiado para a área de transferência!");
        })
        .catch(err => {
            console.error("Erro ao copiar o link:", err);
        });
}