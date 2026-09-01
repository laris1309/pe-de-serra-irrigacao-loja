/* ===========================================================
   CONFIGURAÇÕES DA LOJA
   Este é o único arquivo que você provavelmente vai precisar
   editar com frequência. Tudo em português, sem "mistério".
   =========================================================== */

const CONFIG = {
  // Nome da loja, aparece no topo das páginas
  nomeLoja: "Pé de Serra Irrigação",

  // ---------- WhatsApp dos vendedores ----------
  // Formato: código do país (55) + DDD + número, TUDO JUNTO, sem espaço, sem +, sem traço.
  vendedores: {
    lucas: {
      nome: "Lucas",
      cargo: "Vendedor",
      whatsapp: "5585991294682",
      mensagemPadrao: "Olá Lucas! Vim pelo Instagram da Pé de Serra Irrigação e gostaria de tirar uma dúvida."
    },
    erica: {
      nome: "Erica",
      cargo: "Vendedora",
      whatsapp: "5585991294682",
      mensagemPadrao: "Olá Erica! Vim pelo Instagram da Pé de Serra Irrigação e gostaria de tirar uma dúvida."
    }
  },

  // ---------- Para onde os PEDIDOS do carrinho são enviados ----------
  // WhatsApp do administrador que recebe o resumo do pedido (hoje configurado com o número do Lucas).
  whatsappAdmin: "5585991294682"
};
