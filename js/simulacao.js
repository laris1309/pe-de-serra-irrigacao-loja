/* ===========================================================
   Simulador de Dimensionamento de Irrigação.

   Como funciona, em palavras simples:
   1) O cliente preenche os dados da plantação e do terreno dele
   2) O motor de regras (REGRAS_CULTURA e FATORES_AJUSTE, vindas de
      js/regras.js) calcula uma estimativa de vazão e tubulação
   3) O resultado é uma ESTIMATIVA inicial, não um projeto técnico
      definitivo — por isso sempre aparece o aviso e o botão pra
      falar com um vendedor.

   Fórmula usada (padrão de irrigação):
   - 1mm de lâmina de água sobre 1m² de área = 1 litro
   - Área (m²) = comprimento x largura do terreno
   - Necessidade ajustada (mm/dia) = necessidade da cultura x fator do
     tipo de irrigação escolhido (sistemas menos eficientes, como
     aspersão, perdem mais água e precisam de mais volume aplicado)
   - Volume diário (L) = área x necessidade ajustada
   - Vazão necessária (L/h) = volume diário / horas de irrigação por dia

   Sobre as horas de irrigação: o formulário não pergunta isso direto
   pro cliente (pra não ficar longo demais), então usamos um padrão de
   referência (HORAS_IRRIGACAO_PADRAO) — o vendedor ajusta esse número
   com o cliente depois, se for diferente na prática.

   Desnível, fonte de água, distância e energia não entram na conta de
   vazão/tubulação: eles são justamente os dados que o vendedor usa na
   calculadora "Bomba e Poço" pra dimensionar a bomba certa. Por isso
   ficam só recolhidos e mandados junto na mensagem do WhatsApp.
   =========================================================== */

const HORAS_IRRIGACAO_PADRAO = 4;

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
  select.innerHTML = '<option value="">Selecione...</option>';
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

function calcularNumeroPlantas(areaM2, espacamento) {
  if (!espacamento) return null;
  const partes = espacamento.split("x").map(Number);
  if (partes.length !== 2 || !partes[0] || !partes[1]) return null;
  const areaPorPlanta = partes[0] * partes[1];
  return Math.ceil(areaM2 / areaPorPlanta);
}

function calcularSimulacao(dados) {
  const regraCultura = REGRAS_CULTURA.find((r) => r.cultura === dados.cultura);
  if (!regraCultura) {
    return { erro: "Não encontramos essa cultura na nossa base. Fale com um vendedor pra um cálculo personalizado." };
  }

  const fatorIrrigacao = (FATORES_AJUSTE.irrigacao && FATORES_AJUSTE.irrigacao[dados.tipoIrrigacao]) || { fator: 1, observacao: "" };

  const areaM2 = dados.comprimento * dados.largura;
  const necessidadeAjustada = regraCultura.necessidadeHidricaMmDia * fatorIrrigacao.fator;
  const volumeDiarioLitros = areaM2 * necessidadeAjustada;
  const vazaoLh = volumeDiarioLitros / HORAS_IRRIGACAO_PADRAO;

  const faixa = encontrarFaixaVazao(vazaoLh);
  const precisaProjetoTecnico = !faixa || faixa.diametroSugeridoMm === 0;

  const numeroPlantas = dados.cultura === "Frutas" ? calcularNumeroPlantas(areaM2, dados.espacamento) : null;

  return {
    cultura: regraCultura.cultura,
    tipoIrrigacao: dados.tipoIrrigacao,
    areaM2: Math.round(areaM2),
    numeroPlantas,
    volumeDiarioLitros: Math.round(volumeDiarioLitros),
    vazaoLh: Math.round(vazaoLh),
    diametroSugeridoMm: precisaProjetoTecnico ? null : faixa.diametroSugeridoMm,
    observacaoCultura: regraCultura.observacao,
    observacaoIrrigacao: fatorIrrigacao.observacao,
    observacaoFaixa: faixa ? faixa.observacao : "",
    precisaProjetoTecnico,
    semEnergia: dados.energia === "Não tenho"
  };
}

function montarMensagemSimulacaoWhatsapp(cliente, dados, resultado) {
  return (
    `Olá! Fiz uma simulação de irrigação no site e gostaria de validar com vocês:\n\n` +
    `Cliente: ${cliente.nome} ${cliente.sobrenome}\n` +
    `1. O que vai plantar: ${dados.cultura}\n` +
    `2. Tipo de irrigação desejada: ${dados.tipoIrrigacao}\n` +
    (dados.espacamento ? `3. Espaçamento das plantas: ${dados.espacamento.replace("x", "m x ")}m\n` : "") +
    `4. Desnível do terreno (bomba até o ponto mais alto): ${dados.desnivel} m\n` +
    `5. Fonte de água: ${dados.fonteAgua}\n` +
    `6. Distância da fonte de água até a irrigação: ${dados.distanciaFonte} m\n` +
    `7. Comprimento do terreno: ${dados.comprimento} m\n` +
    `8. Largura do terreno: ${dados.largura} m\n` +
    `9. Energia disponível: ${dados.energia}\n\n` +
    `Resultado estimado pelo site:\n` +
    `- Área total: ${resultado.areaM2} m²\n` +
    (resultado.numeroPlantas ? `- Número estimado de plantas: ${resultado.numeroPlantas}\n` : "") +
    `- Volume diário estimado: ${resultado.volumeDiarioLitros} litros\n` +
    `- Vazão estimada: ${resultado.vazaoLh} L/h\n` +
    `- Diâmetro sugerido: ${resultado.diametroSugeridoMm ? resultado.diametroSugeridoMm + " mm" : "a definir com projeto técnico"}\n\n` +
    `Pode me ajudar a confirmar esses números e a dimensionar a bomba?`
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
        <span>Tipo de irrigação</span>
        <strong>${resultado.tipoIrrigacao}</strong>
      </div>
      <div class="linha-resultado">
        <span>Área total</span>
        <strong>${resultado.areaM2} m²</strong>
      </div>
      ${resultado.numeroPlantas ? `
      <div class="linha-resultado">
        <span>Número estimado de plantas</span>
        <strong>${resultado.numeroPlantas}</strong>
      </div>` : ""}
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
        (assumimos ${HORAS_IRRIGACAO_PADRAO}h de irrigação por dia — o vendedor ajusta isso com você). Não substitui uma visita técnica.
        ${resultado.semEnergia ? " Como você não tem energia elétrica no local, o vendedor também pode indicar uma motobomba a combustão como alternativa." : ""}
      </div>

      <button id="botao-enviar-simulacao" class="botao botao-whatsapp botao-bloco" style="margin-top:14px;">
        💬 Enviar esse resultado pro vendedor
      </button>
      <a href="dimensionamento-poco.html" class="botao botao-fantasma botao-bloco" style="margin-top:10px;">
        ⚡ Calcular a bomba pra esse sistema
      </a>
    </div>
  `;

  document.getElementById("botao-enviar-simulacao").addEventListener("click", function () {
    const mensagem = montarMensagemSimulacaoWhatsapp(cliente, dados, resultado);
    window.open("https://wa.me/" + CONFIG.whatsappAdmin + "?text=" + encodeURIComponent(mensagem), "_blank");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  preencherSelectCultura();
  preencherSelectFatores("tipo-irrigacao", "irrigacao");

  const selectCultura = document.getElementById("cultura");
  const campoEspacamento = document.getElementById("campo-espacamento");
  const selectEspacamento = document.getElementById("espacamento");

  selectCultura.addEventListener("change", function () {
    const ehFrutas = selectCultura.value === "Frutas";
    campoEspacamento.style.display = ehFrutas ? "block" : "none";
    selectEspacamento.required = ehFrutas;
    if (!ehFrutas) selectEspacamento.value = "";
  });

  const form = document.getElementById("form-simulacao");
  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const dados = {
      cultura: selectCultura.value,
      tipoIrrigacao: document.getElementById("tipo-irrigacao").value,
      espacamento: selectEspacamento.value,
      desnivel: parseFloat(document.getElementById("desnivel").value) || 0,
      fonteAgua: document.getElementById("fonte-agua").value,
      distanciaFonte: parseFloat(document.getElementById("distancia-fonte").value) || 0,
      comprimento: parseFloat(document.getElementById("comprimento").value) || 0,
      largura: parseFloat(document.getElementById("largura").value) || 0,
      energia: document.getElementById("energia").value
    };

    if (!dados.cultura || !dados.tipoIrrigacao || !dados.fonteAgua || !dados.energia || dados.comprimento <= 0 || dados.largura <= 0) {
      alert("Preencha todas as perguntas pra gente conseguir calcular.");
      return;
    }

    if (dados.cultura === "Frutas" && !dados.espacamento) {
      alert("Selecione o espaçamento das plantas.");
      return;
    }

    const cliente = obterCliente();
    const resultado = calcularSimulacao(dados);
    exibirResultado(resultado, dados, cliente);

    document.getElementById("resultado-simulacao").scrollIntoView({ behavior: "smooth" });
  });
});
