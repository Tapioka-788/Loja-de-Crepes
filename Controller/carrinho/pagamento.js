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
