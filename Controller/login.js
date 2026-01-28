import { cadastrarUx } from "./../Controller/services/login_S.js";

const bdProprio = JSON.parse(localStorage.getItem('bdProprio')) || [];

function salvarBdProprio() {
    localStorage.setItem('bdProprio', JSON.stringify(bdProprio));
}

let telaCad = document.getElementById('login')

export function escondeTelaCad() {
    telaCad.style.left = '-100vw'
    // telaCad.style.left = '00vw'
}

export function mostraTelaCad() {
    if (bdProprio.length > 0) {
        telaCad.style.left = '0vw'
    } else {
        escondeTelaCad()
    }
}

export function recolheDadosLogin() {
    let nomeUx = document.getElementById('nomeAdd');
    let turma = document.getElementById('turmaAdd');
    let nChamada = document.getElementById('nChamadaAdd');

    bdProprio.push({
        nome: nomeUx.value,
        turma: turma.value,
        chamada: nChamada.value
    });

    salvarBdProprio();

    console.log(bdProprio);

    if (nomeUx.value === "" || turma.value === "" || nChamada.value === "") {
        alert('Check se todos os campos estão preenchidos');
    } else {
        cadastrarUx(nomeUx.value, turma.value, nChamada.value,);
        escondeTelaCad();

        nomeUx.value = '';
        turma.value = '';
        nChamada.value = '';
    }
}

export function limparDadosLogin() {
    let nomeUx = document.getElementById('nomeAdd');
    let turma = document.getElementById('turmaAdd');
    let nChamada = document.getElementById('nChamadaAdd');

    nomeUx.value = '';
    turma.value = '';
    nChamada.value = '';
}

document.addEventListener("DOMContentLoaded", () => {
    if (bdProprio.length > 0) {
        escondeTelaCad();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const bdSalvo = JSON.parse(localStorage.getItem('bdProprio')) || [];
    bdProprio.push(...bdSalvo);
});

export async function adicionarAoCarrinho(produto) {
    try {
        // Pegamos o primeiro usuário cadastrado em bdProprio (se houver)
        const usuario = bdProprio.length > 0 ? bdProprio[0] : null;

        if (!usuario) {
            alert("Nenhum usuário cadastrado! Faça login primeiro.");
            return;
        }

        const response = await fetch('https://back-end-crepes.vercel.app/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario: {
                    nomeUx: usuario.nome,
                    turma: usuario.turma,
                    nChamada: usuario.chamada
                },
                produtoId: produto.id
            }),
        });

        if (response.status === 201) {
            alert("Produto adicionado ao carrinho!");
        } else {
            alert("Erro ao adicionar ao carrinho.");
        }
    }
    catch (e) {
        console.error(e);
    }
}