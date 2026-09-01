/* ===========================================================
   Cadastro simples do cliente: nome, sobrenome e WhatsApp.
   Fica guardado no navegador (localStorage) para não pedir
   de novo toda vez que a pessoa visitar o site.
   =========================================================== */

function limparNumeroWhatsapp(valor) {
  return valor.replace(/\D/g, ""); // deixa só números
}

function marcarInvalido(idCampo, mostrar) {
  const campo = document.getElementById(idCampo).closest(".campo");
  campo.classList.toggle("invalido", mostrar);
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-cadastro");
  if (!form) return;

  // Se já tem cadastro salvo, pula direto pro menu
  const clienteSalvo = localStorage.getItem("psi_cliente");
  if (clienteSalvo) {
    window.location.href = "menu.html";
    return;
  }

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const sobrenome = document.getElementById("sobrenome").value.trim();
    const whatsappBruto = document.getElementById("whatsapp").value.trim();
    const whatsapp = limparNumeroWhatsapp(whatsappBruto);

    let valido = true;

    if (nome.length < 2) {
      marcarInvalido("nome", true);
      valido = false;
    } else {
      marcarInvalido("nome", false);
    }

    if (sobrenome.length < 2) {
      marcarInvalido("sobrenome", true);
      valido = false;
    } else {
      marcarInvalido("sobrenome", false);
    }

    // Espera algo como DDD + número = pelo menos 10 dígitos (com ou sem o 55 na frente)
    if (whatsapp.length < 10) {
      marcarInvalido("whatsapp", true);
      valido = false;
    } else {
      marcarInvalido("whatsapp", false);
    }

    if (!valido) return;

    // Garante que o número tenha o código do Brasil (55) na frente,
    // pra funcionar certinho nos links do WhatsApp depois.
    let whatsappCompleto = whatsapp;
    if (!whatsappCompleto.startsWith("55")) {
      whatsappCompleto = "55" + whatsappCompleto;
    }

    const cliente = {
      nome: nome,
      sobrenome: sobrenome,
      whatsapp: whatsappCompleto,
      cadastradoEm: new Date().toISOString()
    };

    localStorage.setItem("psi_cliente", JSON.stringify(cliente));
    window.location.href = "menu.html";
  });
});
