/* ===========================================================
   "Segurança" simples: se a pessoa não fez o cadastro ainda,
   ela é mandada de volta pra tela inicial.
   Coloque este script em toda página interna (menu, catálogo,
   vendedores, manuais).
   =========================================================== */

(function () {
  const clienteSalvo = localStorage.getItem("psi_cliente");
  if (!clienteSalvo) {
    window.location.href = "index.html";
  }
})();

function obterCliente() {
  const dados = localStorage.getItem("psi_cliente");
  return dados ? JSON.parse(dados) : null;
}

function sairDoCadastro() {
  localStorage.removeItem("psi_cliente");
  sessionStorage.removeItem("psi_carrinho");
  window.location.href = "index.html";
}
