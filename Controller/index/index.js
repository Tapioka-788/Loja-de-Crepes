import { iniciarTrocaAutomatica } from "./bannerRotativo.js"
import { trocarBanner } from  "./bannerRotativo.js";

import { escondeTelaCad } from "./../login.js";
import { recolheDadosLogin } from "./../login.js";
import { limparDadosLogin } from "./../login.js";

window.escondeTelaCad = escondeTelaCad;
window.recolheDadosLogin = recolheDadosLogin;
window.limparDadosLogin = limparDadosLogin;

document.addEventListener("DOMContentLoaded", () => {
    iniciarTrocaAutomatica();
});

window.trocarBanner = trocarBanner


function trocarImagensParaMobile() {
    if (window.innerWidth <= 900) {
        document.getElementById("img1").src = "./../../Model/francaPe.jpeg";
        document.getElementById("img2").src = "./../../Model/pe.png";
        document.getElementById("img3").src = "./../../Model/fullStackpe.jpeg";
        // document.getElementById("img4").src = "./../../Model/docepe.jpeg";
    }
}

// Executa ao carregar a página
window.addEventListener("load", trocarImagensParaMobile);

// Também executa se a pessoa redimensionar a tela
window.addEventListener("resize", trocarImagensParaMobile);