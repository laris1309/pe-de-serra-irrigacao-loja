/* ===========================================================
   Tela do catálogo: abas por categoria, cardápio de produtos
   e o carrinho (lista de itens pro vendedor montar o orçamento).
   =========================================================== */

let categoriaAtiva = 0;

function renderizarAbas() {
  const container = document.getElementById("abas");
  container.innerHTML = "";

  CATALOGO.forEach((grupo, indice) => {
    const botao = document.createElement("button");
    botao.className = "aba-botao" + (indice === categoriaAtiva ? " ativa" : "");
    botao.textContent = grupo.categoria;
    botao.addEventListener("click", () => {
      categoriaAtiva = indice;
      renderizarAbas();
      renderizarProdutos();
    });
    container.appendChild(botao);
  });
}

function renderizarProdutos() {
  const lista = document.getElementById("lista-produtos");
  lista.innerHTML = "";

  const grupo = CATALOGO[categoriaAtiva];

  if (!grupo || grupo.itens.length === 0) {
    lista.innerHTML = '<p class="carrinho-vazio">Nenhum produto cadastrado nessa categoria ainda.</p>';
    return;
  }

  grupo.itens.forEach((produto) => {
    const qtd = quantidadeNoCarrinho(produto.nome);

    const item = document.createElement("div");
    item.className = "item-produto";
    item.innerHTML = `
      <div class="info">
        <h3>${produto.nome}</h3>
      </div>
      <div class="seletor-qtd">
        ${qtd > 0 ? `<button class="remover-item">−</button><span class="qtd">${qtd}</span>` : ""}
        <button class="adicionar">${qtd > 0 ? "+" : "Adicionar"}</button>
      </div>
    `;

    item.querySelector(".adicionar").addEventListener("click", () => {
      adicionarAoCarrinho(produto.nome, grupo.categoria);
      renderizarProdutos();
      atualizarBarraCarrinho();
    });

    const botaoRemover = item.querySelector(".remover-item");
    if (botaoRemover) {
      botaoRemover.addEventListener("click", () => {
        removerUnidade(produto.nome);
        renderizarProdutos();
        atualizarBarraCarrinho();
      });
    }

    lista.appendChild(item);
  });
}

function atualizarBarraCarrinho() {
  const barra = document.getElementById("barra-carrinho");
  const totalItens = totalItensCarrinho();

  if (totalItens > 0) {
    barra.classList.add("visivel");
    document.getElementById("resumo-carrinho").textContent =
      totalItens + (totalItens === 1 ? " item" : " itens") + " na lista";
  } else {
    barra.classList.remove("visivel");
  }
}

function renderizarPainelCarrinho() {
  const container = document.getElementById("itens-painel-carrinho");
  const carrinho = obterCarrinho();

  if (carrinho.length === 0) {
    container.innerHTML = '<p class="carrinho-vazio">Sua lista está vazia.<br>Adicione produtos no catálogo!</p>';
    document.getElementById("botao-finalizar").disabled = true;
    return;
  }

  document.getElementById("botao-finalizar").disabled = false;

  container.innerHTML = "";
  carrinho.forEach((item) => {
    const linha = document.createElement("div");
    linha.className = "linha-carrinho";
    linha.innerHTML = `
      <div>
        <div class="nome">${item.nome}</div>
        <div class="detalhe">${item.quantidade}x</div>
      </div>
      <button class="remover" title="Remover">🗑️</button>
    `;
    linha.querySelector(".remover").addEventListener("click", () => {
      removerItemInteiro(item.nome);
      renderizarPainelCarrinho();
      renderizarProdutos();
      atualizarBarraCarrinho();
    });
    container.appendChild(linha);
  });
}

function abrirPainelCarrinho() {
  renderizarPainelCarrinho();
  document.getElementById("painel-carrinho").classList.add("aberto");
}

function fecharPainelCarrinho() {
  document.getElementById("painel-carrinho").classList.remove("aberto");
}

function mostrarTelaSucesso(resultado) {
  document.getElementById("painel-carrinho-corpo").style.display = "none";
  const sucesso = document.getElementById("tela-sucesso");
  sucesso.style.display = "block";
  document.getElementById("texto-numero-pedido").textContent = "Pedido nº " + resultado.numeroPedido;

  document.getElementById("botao-whatsapp-admin").onclick = () => {
    window.open(resultado.linkWhatsappAdmin, "_blank");
  };
  document.getElementById("botao-whatsapp-cliente").onclick = () => {
    window.open(resultado.linkWhatsappCliente, "_blank");
  };
}

document.addEventListener("DOMContentLoaded", function () {
  renderizarAbas();
  renderizarProdutos();
  atualizarBarraCarrinho();

  document.getElementById("barra-carrinho").addEventListener("click", abrirPainelCarrinho);
  document.getElementById("fechar-painel").addEventListener("click", fecharPainelCarrinho);

  document.getElementById("botao-finalizar").addEventListener("click", function () {
    const cliente = obterCliente();
    const carrinho = obterCarrinho();

    if (!cliente || carrinho.length === 0) return;

    const resultado = finalizarPedido(cliente, carrinho);
    mostrarTelaSucesso(resultado);
    limparCarrinho();
    atualizarBarraCarrinho();
  });

  document.getElementById("botao-novo-pedido").addEventListener("click", function () {
    window.location.href = "catalogo.html";
  });
});
