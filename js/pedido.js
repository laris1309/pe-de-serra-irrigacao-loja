/* ===========================================================
   Envio da lista de produtos:
   1) Gera o número da solicitação
   2) Abre o WhatsApp do administrador com a lista pronta pra enviar,
      pra ele montar o orçamento com os valores
   3) Abre o WhatsApp do próprio cliente com a confirmação pronta pra enviar

   Sobre o WhatsApp: por segurança, o WhatsApp não deixa nenhum site
   mandar mensagem sozinho sem a pessoa apertar "enviar" pelo menos uma
   vez (a não ser que a loja pague por uma API oficial do WhatsApp
   Business). Por isso os links abaixo já vêm com a mensagem pronta,
   só falta um toque em "enviar".
   =========================================================== */

function gerarNumeroPedido() {
  const agora = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const carimbo =
    agora.getFullYear() +
    pad(agora.getMonth() + 1) +
    pad(agora.getDate()) +
    pad(agora.getHours()) +
    pad(agora.getMinutes()) +
    pad(agora.getSeconds());
  return "PS" + carimbo;
}

function formatarDataHora(data) {
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function montarListaItensTexto(carrinho) {
  return carrinho
    .map((item) => `- ${item.quantidade}x ${item.nome}`)
    .join("\n");
}

function montarMensagemAdmin({ numeroPedido, cliente, dataHora, itensTexto }) {
  return (
    `Número da solicitação: ${numeroPedido}\n` +
    `Nome do cliente: ${cliente.nome} ${cliente.sobrenome}\n` +
    `Contato do cliente: ${cliente.whatsapp}\n` +
    `Data e hora: ${dataHora}\n` +
    `Produtos solicitados:\n${itensTexto}`
  );
}

function montarMensagemCliente({ numeroPedido, itensTexto }) {
  return (
    `Sua lista foi enviada para a equipe Pé de Serra Irrigação\n` +
    `Número da solicitação: ${numeroPedido}\n` +
    `Produtos solicitados:\n${itensTexto}\n` +
    `Em breve um vendedor te manda o orçamento com os valores.`
  );
}

function linkWhatsapp(numero, mensagem) {
  return "https://wa.me/" + numero + "?text=" + encodeURIComponent(mensagem);
}

/* Função principal chamada pela tela de checkout do catálogo. */
function finalizarPedido(cliente, carrinho) {
  const numeroPedido = gerarNumeroPedido();
  const dataHora = formatarDataHora(new Date());
  const itensTexto = montarListaItensTexto(carrinho);

  const dadosPedido = { numeroPedido, cliente, dataHora, itensTexto };

  const mensagemAdmin = montarMensagemAdmin(dadosPedido);
  const mensagemCliente = montarMensagemCliente(dadosPedido);

  // Também guarda um histórico simples no navegador (útil pra loja conferir depois, se quiser).
  const historico = JSON.parse(localStorage.getItem("psi_pedidos") || "[]");
  historico.push(dadosPedido);
  localStorage.setItem("psi_pedidos", JSON.stringify(historico));

  return {
    numeroPedido,
    linkWhatsappAdmin: linkWhatsapp(CONFIG.whatsappAdmin, mensagemAdmin),
    linkWhatsappCliente: linkWhatsapp(cliente.whatsapp, mensagemCliente)
  };
}
