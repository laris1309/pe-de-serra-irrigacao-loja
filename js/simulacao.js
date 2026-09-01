/* ===========================================================
   Simulador de Dimensionamento de Irrigação.

   Como funciona, em palavras simples:
   1) O cliente preenche os dados da plantação dele (requisitos)
   2) O motor de regras (as constantes REGRAS_CULTURA, FAIXAS_VAZAO
      e FATORES_AJUSTE, vindas de js/regras.js) aplica as condições
   3) O resultado é uma ESTIMATIVA inicial, não um projeto técnico
      definitivo — por isso sempre aparece o aviso e o botão pra
      falar com um vendedor.

   Fórmula usada (padrão de irrigação):
   - 1mm de lâmina de água sobre 1m² de área = 1 litro
   - Volume diário (L) = área (m²) x necessidade hídrica ajustada (mm/dia)
   - Vazão necessária (L/h) = volume diário / horas de irrigação disponíveis
   =========================================================== */

function preencherSelectCultura() {
  const select = document.getElementById("cultura");
  select.innerHTML = '<option value="">Selecione...</option>';
  REGRAS_CULTURA.forEach((regra) => {
    const opcao = document.createElement("option");
    opcao.value = regra.cultura;
    opcao.textContent = regra.cultura;
    select.appendChild(opcao);
  });
}

function preencherSelectFatores(idSelect, tipo) {
  const select = document.getElementById(idSelect);
  select.innerHTML = "";
  const opcoes = FATORES_AJUSTE[tipo] || {};
  Object.keys(opcoes).forEach((valor) => {
    const opcao = document.createElement("option");
    opcao.value = valor;
    opcao.textContent = valor;
    select.appendChild(opcao);
  });
}

function encontrarFaixaVazao(vazaoLh) {
  return FAIXAS_VAZAO.find((faixa) => vazaoLh <= faixa.vazaoMaximaLh);
}

function calcularSimulacao(dados) {
  const regraCultura = REGRAS_CULTURA.find((r) => r.cultura === dados.cultura);
  if (!regraCultura) {
    return { erro: "Não encontramos essa cultura na nossa base. Fale com um vendedor pra um cálculo personalizado." };
  }

  const fatorSolo = (FATORES_AJUSTE.solo && FATORES_AJUSTE.solo[dados.solo]) || { fator: 1, observacao: "" };
  const fatorDeclividade = (FATORES_AJUSTE.declividade && FATORES_AJUSTE.declividade[dados.declividade]) || { fator: 1, observacao: "" };

  const necessidadeAjustada = regraCultura.necessidadeHidricaMmDia * fatorSolo.fator * fatorDeclividade.fator;
  const volumeDiarioLitros = dados.areaM2 * necessidadeAjustada;
  const horas = Math.max(dados.horasDisponiveis, 0.5); // evita divisão por zero
  const vazaoLh = volumeDiarioLitros / horas;

  const faixa = encontrarFaixaVazao(vazaoLh);
  const precisaProjetoTecnico = !faixa || faixa.diametroSugeridoMm === 0;

  return {
    cultura: regraCultura.cultura,
    sistemaRecomendado: regraCultura.sistemaRecomendado,
    volumeDiarioLitros: Math.round(volumeDiarioLitros),
    vazaoLh: Math.round(vazaoLh),
    diametroSugeridoMm: precisaProjetoTecnico ? null : faixa.diametroSugeridoMm,
    observacaoCultura: regraCultura.observacao,
    observacaoSolo: fatorSolo.observacao,
    observacaoDeclividade: fatorDeclividade.observacao,
    observacaoFaixa: faixa ? faixa.observacao : "",
    precisaProjetoTecnico
  };
}

function montarMensagemSimulacaoWhatsapp(cliente, dados, resultado) {
  return (
    `Olá! Fiz uma simulação de irrigação no site e gostaria de validar com vocês:\n\n` +
    `Cliente: ${cliente.nome} ${cliente.sobrenome}\n` +
    `Cultura: ${dados.cultura}\n` +
    `Área: ${dados.areaM2} m²\n` +
    `Tipo de solo: ${dados.solo}\n` +
    `Declividade: ${dados.declividade}\n` +
    `Horas de irrigação disponíveis por dia: ${dados.horasDisponiveis}\n\n` +
    `Resultado estimado pelo site:\n` +
    `- Sistema recomendado: ${resultado.sistemaRecomendado}\n` +
    `- Volume diário estimado: ${resultado.volumeDiarioLitros} litros\n` +
    `- Vazão estimada: ${resultado.vazaoLh} L/h\n` +
    `- Diâmetro sugerido: ${resultado.diametroSugeridoMm ? resultado.diametroSugeridoMm + " mm" : "a definir com projeto técnico"}\n\n` +
    `Pode me ajudar a confirmar esses números?`
  );
}

function exibirResultado(resultado, dados, cliente) {
  const painel = document.getElementById("resultado-simulacao");
  painel.style.display = "block";

  if (resultado.erro) {
    painel.innerHTML = `<div class="aviso">⚠️ ${resultado.erro}</div>`;
    return;
  }

  painel.innerHTML = `
    <div class="cartao">
      <h2>Resultado estimado</h2>

      <div class="linha-resultado">
        <span>Cultura</span>
        <strong>${resultado.cultura}</strong>
      </div>
      <div class="linha-resultado">
        <span>Sistema recomendado</span>
        <strong>${resultado.sistemaRecomendado}</strong>
      </div>
      <div class="linha-resultado">
        <span>Volume de água estimado por dia</span>
        <strong>${resultado.volumeDiarioLitros} litros</strong>
      </div>
      <div class="linha-resultado">
        <span>Vazão necessária estimada</span>
        <strong>${resultado.vazaoLh} L/h</strong>
      </div>
      <div class="linha-resultado">
        <span>Diâmetro de tubulação sugerido</span>
        <strong>${resultado.diametroSugeridoMm ? resultado.diametroSugeridoMm + " mm" : "Projeto técnico personalizado"}</strong>
      </div>

      <div class="aviso" style="margin-top:16px;">
        📌 Esse resultado é uma <strong>estimativa inicial</strong> baseada em regras de referência
        (não substitui uma visita técnica). Fale com um vendedor pra confirmar antes de comprar os materiais.
      </div>

      <button id="botao-enviar-simulacao" class="botao botao-whatsapp botao-bloco" style="margin-top:14px;">
        💬 Enviar esse resultado pro vendedor
      </button>
    </div>
  `;

  document.getElementById("botao-enviar-simulacao").addEventListener("click", function () {
    const mensagem = montarMensagemSimulacaoWhatsapp(cliente, dados, resultado);
    window.open("https://wa.me/" + CONFIG.whatsappAdmin + "?text=" + encodeURIComponent(mensagem), "_blank");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  preencherSelectCultura();
  preencherSelectFatores("solo", "solo");
  preencherSelectFatores("declividade", "declividade");

  const form = document.getElementById("form-simulacao");
  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const dados = {
      cultura: document.getElementById("cultura").value,
      areaM2: parseFloat(document.getElementById("area").value) || 0,
      solo: document.getElementById("solo").value,
      declividade: document.getElementById("declividade").value,
      horasDisponiveis: parseFloat(document.getElementById("horas").value) || 2
    };

    if (!dados.cultura || dados.areaM2 <= 0) {
      alert("Preencha a cultura e a área a ser irrigada pra continuar.");
      return;
    }

    const cliente = obterCliente();
    const resultado = calcularSimulacao(dados);
    exibirResultado(resultado, dados, cliente);

    document.getElementById("resultado-simulacao").scrollIntoView({ behavior: "smooth" });
  });
});
