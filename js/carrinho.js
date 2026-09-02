/* ===========================================================
   Carrinho de compras (lista de produtos pro orçamento).
   Fica guardado em sessionStorage: some quando fecha a aba,
   assim cada visita começa com carrinho zerado.
   =========================================================== */

const CHAVE_CARRINHO = "psi_carrinho";

function obterCarrinho() {
  const dados = sessionStorage.getItem(CHAVE_CARRINHO);
  return dados ? JSON.parse(dados) : [];
}

function salvarCarrinho(carrinho) {
  sessionStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
}

function adicionarAoCarrinho(nome, categoria) {
  const carrinho = obterCarrinho();
  const existente = carrinho.find((item) => item.nome === nome);

  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({ nome, categoria, quantidade: 1 });
  }

  salvarCarrinho(carrinho);
  return carrinho;
}

function removerUnidade(nome) {
  let carrinho = obterCarrinho();
  const existente = carrinho.find((item) => item.nome === nome);

  if (existente) {
    existente.quantidade -= 1;
    if (existente.quantidade <= 0) {
      carrinho = carrinho.filter((item) => item.nome !== nome);
    }
  }

  salvarCarrinho(carrinho);
  return carrinho;
}

function removerItemInteiro(nome) {
  const carrinho = obterCarrinho().filter((item) => item.nome !== nome);
  salvarCarrinho(carrinho);
  return carrinho;
}

function limparCarrinho() {
  sessionStorage.removeItem(CHAVE_CARRINHO);
}

function quantidadeNoCarrinho(nome) {
  const item = obterCarrinho().find((item) => item.nome === nome);
  return item ? item.quantidade : 0;
}

function totalItensCarrinho() {
  return obterCarrinho().reduce((soma, item) => soma + item.quantidade, 0);
}
