let movimentacoes = JSON.parse(localStorage.getItem("caixaPro")) || [];

function salvar() {
    localStorage.setItem("caixaPro", JSON.stringify(movimentacoes));
}

function adicionar() {
    let data = document.getElementById("data").value;
    let descricao = document.getElementById("descricao").value;
    let tipo = document.getElementById("tipo").value;
    let valor = parseFloat(document.getElementById("valor").value);

    if (!data || !descricao || !valor) {
        alert("Preencha tudo!");
        return;
    }

    movimentacoes.push({ data, descricao, tipo, valor });
    salvar();
    atualizarTela();
}

function remover(index) {
    movimentacoes.splice(index, 1);
    salvar();
    atualizarTela();
}

function atualizarTela() {
    let tabela = document.getElementById("tabela");
    tabela.innerHTML = "";

    let entradas = 0;
    let saidas = 0;

    let filtroMes = document.getElementById("filtroMes").value;

    movimentacoes.forEach((mov, index) => {

        if (filtroMes && !mov.data.startsWith(filtroMes)) return;

        let tr = document.createElement("tr");

        tr.innerHTML = `
      <td>${mov.data}</td>
      <td>${mov.descricao}</td>
      <td>${mov.tipo}</td>
      <td>R$ ${mov.valor.toFixed(2)}</td>
      <td><button class="delete" onclick="remover(${index})">X</button></td>
    `;

        tabela.appendChild(tr);

        if (mov.tipo === "entrada") entradas += mov.valor;
        else saidas += mov.valor;
    });

    document.getElementById("totalEntradas").textContent = entradas.toFixed(2);
    document.getElementById("totalSaidas").textContent = saidas.toFixed(2);
    document.getElementById("saldo").textContent = (entradas - saidas).toFixed(2);
}

// ===== RELATÓRIOS =====

function enviarWhats(mensagem) {
    let url = "https://wa.me/?text=" + encodeURIComponent(mensagem);
    window.open(url, "_blank");
}

function relatorioDiario() {
    let hoje = new Date().toISOString().split("T")[0];

    let entradas = 0;
    let saidas = 0;

    movimentacoes.forEach(mov => {
        if (mov.data === hoje) {
            if (mov.tipo === "entrada") entradas += mov.valor;
            else saidas += mov.valor;
        }
    });

    let saldo = entradas - saidas;

    let msg = `🐶 Relatório Diário
📅 ${hoje}

💰 Entradas: R$ ${entradas.toFixed(2)}
💸 Saídas: R$ ${saidas.toFixed(2)}
📊 Saldo: R$ ${saldo.toFixed(2)}`;

    enviarWhats(msg);
}

function relatorioMensal() {
    let mes = document.getElementById("filtroMes").value;

    if (!mes) {
        alert("Selecione o mês!");
        return;
    }

    let entradas = 0;
    let saidas = 0;

    movimentacoes.forEach(mov => {
        if (mov.data.startsWith(mes)) {
            if (mov.tipo === "entrada") entradas += mov.valor;
            else saidas += mov.valor;
        }
    });

    let saldo = entradas - saidas;

    let msg = `🐶 Relatório Mensal
📅 ${mes}

💰 Entradas: R$ ${entradas.toFixed(2)}
💸 Saídas: R$ ${saidas.toFixed(2)}
📊 Saldo: R$ ${saldo.toFixed(2)}`;

    enviarWhats(msg);
}

atualizarTela();