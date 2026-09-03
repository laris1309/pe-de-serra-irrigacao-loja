/* ===========================================================
   Cadastro simples do cliente: nome e sobrenome (num campo só),
   WhatsApp e data de nascimento (opcional).
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
    const whatsappBruto = document.getElementById("whatsapp").value.trim();
    const whatsapp = limparNumeroWhatsapp(whatsappBruto);
    const nascimento = document.getElementById("nascimento").value; // opcional

    let valido = true;

    if (nome.length < 2) {
      marcarInvalido("nome", true);
      valido = false;
    } else {
      marcarInvalido("nome", false);
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
      whatsapp: whatsappCompleto,
      nascimento: nascimento || null,
      cadastradoEm: new Date().toISOString()
    };

    localStorage.setItem("psi_cliente", JSON.stringify(cliente));
    window.location.href = "menu.html";
  });
});
