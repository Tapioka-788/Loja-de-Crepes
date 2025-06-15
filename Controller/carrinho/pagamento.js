let pagamentoSect = document.getElementById("pagamento");
let sectionCart = document.getElementById('sectionCart')

export function pagamento(numeroTela) {
    if (numeroTela == 0) {
        pagamentoSect.style.left = '-' + numeroTela + '00vw'
        console.log("Abriu a tela de pagamento")
    } else if (numeroTela == 1) {
        pagamentoSect.style.left = '-' + numeroTela + '00vw'
        console.log("Fechou a tela de pagamento")
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