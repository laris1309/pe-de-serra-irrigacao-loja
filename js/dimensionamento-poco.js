/* ===========================================================
   Dimensionamento de Bomba e Tubulação para Poço.

   Como funciona, em palavras simples:
   1) O cliente informa os dados do poço (requisitos): vazão desejada,
      profundidade, distâncias e tipo de rede elétrica
   2) O motor de regras (constantes vindas de js/regras_poco.js) aplica
      as condições e calcula uma ESTIMATIVA de potência da bomba,
      tubulação, fiação e itens periféricos
   3) É sempre uma estimativa inicial — por isso o resultado sempre traz
      avisos e um botão pra falar com um vendedor / eletricista.

   Fórmulas usadas (padrão de dimensionamento de bombas):
   - AMT (Altura Manométrica Total) = (altura de sucção + altura de
     recalque) x 1,10 (margem simplificada pra perda de carga) + 5m
     (pressão residual mínima estimada)
   - Potência (CV) = (Vazão em m³/h x AMT) / (270 x rendimento estimado)
   - A potência calculada é arredondada pra cima, pra a potência
     comercial mais próxima (as bombas não são vendidas em qualquer
     valor de CV, só em alguns "degraus" padrão)
   =========================================================== */

function encontrarRendimento(vazaoLh) {
  return RENDIMENTO_BOMBA.find((faixa) => vazaoLh <= faixa.vazaoMaximaLh) || RENDIMENTO_BOMBA[RENDIMENTO_BOMBA.length - 1];
}

function encontrarDiametroPoco(vazaoLh) {
  return FAIXAS_VAZAO_POCO.find((faixa) => vazaoLh <= faixa.vazaoMaximaLh) || FAIXAS_VAZAO_POCO[FAIXAS_VAZAO_POCO.length - 1];
}

function escolherPotenciaComercial(potenciaCalculadaCv) {
  const encontrada = POTENCIAS_COMERCIAIS.find((p) => potenciaCalculadaCv <= p.potenciaCv);
  if (encontrada) return encontrada;
  // Potência calculada maior que qualquer opção da tabela: retorna a maior, com aviso.
  return { ...POTENCIAS_COMERCIAIS[POTENCIAS_COMERCIAIS.length - 1], acimaDaTabela: true };
}

function encontrarBitolaFio(tipoRede, potenciaCv, distanciaM) {
  const candidatas = FIOS_BOMBA.filter(
    (f) => f.tipoRede === tipoRede && potenciaCv <= f.potenciaMaximaCv && distanciaM <= f.distanciaMaximaM
  );
  if (candidatas.length === 0) return null;
  return candidatas.reduce((menor, atual) => (atual.bitolaMm2 < menor.bitolaMm2 ? atual : menor));
}

function montarItensPerifericos(tipoRede) {
  const condicaoRede = tipoRede === "Trifásica" ? "trifasico" : "monofasico";
  return ITENS_PERIFERICOS_POCO.filter((item) => item.condicao === "sempre" || item.condicao === condicaoRede);
}

function calcularDimensionamentoPoco(dados) {
  const amt = (dados.profundidadeSuccao + dados.alturaRecalque) * 1.1 + 5;
  const vazaoM3h = dados.vazaoLh / 1000;

  const rendimento = encontrarRendimento(dados.vazaoLh);
  const potenciaCalculadaCv = (vazaoM3h * amt) / (270 * rendimento.rendimento);
  const potenciaComercial = escolherPotenciaComercial(potenciaCalculadaCv);

  const faixaDiametro = encontrarDiametroPoco(dados.vazaoLh);
  const comprimentoTotalTubulacao = dados.profundidadeSuccao + dados.alturaRecalque + dados.distanciaHorizontal;
  const quantidadeTubos = Math.max(Math.ceil(comprimentoTotalTubulacao / 6), 1); // barras padrão de 6m
  const quantidadeUnioes = Math.max(quantidadeTubos - 1, 0);
  const quantidadeAbracadeiras = quantidadeTubos;

  const bitolaFio = encontrarBitolaFio(dados.tipoRede, potenciaComercial.potenciaCv, dados.distanciaQuadro);
  const itensPerifericos = montarItensPerifericos(dados.tipoRede);

  return {
    amt: Math.round(amt * 10) / 10,
    vazaoM3h: Math.round(vazaoM3h * 100) / 100,
    potenciaCalculadaCv: Math.round(potenciaCalculadaCv * 100) / 100,
    potenciaComercial,
    diametroRecalqueMm: faixaDiametro.diametroRecalqueMm,
    comprimentoTotalTubulacao: Math.round(comprimentoTotalTubulacao),
    quantidadeTubos,
    quantidadeUnioes,
    quantidadeAbracadeiras,
    bitolaFio,
    itensPerifericos,
    tipoRede: dados.tipoRede
  };
}

function montarMensagemPocoWhatsapp(cliente, dados, resultado) {
  const itensTexto = resultado.itensPerifericos.map((i) => `- ${i.item}`).join("\n");
  const bitolaTexto = resultado.bitolaFio
    ? `${resultado.bitolaFio.bitolaMm2} mm²`
    : "distância/potência fora da tabela - fale com um eletricista";

  return (
    `Olá! Fiz uma simulação de dimensionamento de bomba/poço no site e gostaria de validar com vocês:\n\n` +
    `Cliente: ${cliente.nome} ${cliente.sobrenome}\n` +
    `Vazão desejada: ${dados.vazaoLh} L/h\n` +
    `Profundidade / nível dinâmico: ${dados.profundidadeSuccao} m\n` +
    `Altura de recalque: ${dados.alturaRecalque} m\n` +
    `Distância horizontal da tubulação: ${dados.distanciaHorizontal} m\n` +
    `Distância da bomba até o quadro de energia: ${dados.distanciaQuadro} m\n` +
    `Tipo de rede elétrica: ${dados.tipoRede}\n\n` +
    `Resultado estimado pelo site:\n` +
    `- Potência de bomba sugerida: ${resultado.potenciaComercial.rotulo}\n` +
    `- Diâmetro de tubulação de recalque: ${resultado.diametroRecalqueMm} mm\n` +
    `- Quantidade de tubos (barras de 6m): ${resultado.quantidadeTubos}\n` +
    `- Bitola de cabo elétrico sugerida: ${bitolaTexto}\n\n` +
    `Pode me ajudar a confirmar esses números e os itens periféricos?`
  );
}

function exibirResultadoPoco(resultado, dados, cliente) {
  const painel = document.getElementById("resultado-poco");
  painel.style.display = "block";

  const itensHtml = resultado.itensPerifericos
    .map((item) => `<li><strong>${item.item}</strong><br><span class="unidade">${item.observacao}</span></li>`)
    .join("");

  const avisoPotenciaAcima = resultado.potenciaComercial.acimaDaTabela
    ? `<div class="aviso" style="margin-top:10px;">⚠️ A potência calculada ficou acima da nossa tabela de referência. Fale com um vendedor pra um projeto técnico personalizado.</div>`
    : "";

  const bitolaTexto = resultado.bitolaFio
    ? `${resultado.bitolaFio.bitolaMm2} mm²`
    : "fora da tabela de referência - fale com um eletricista";

  const avisoBitola = !resultado.bitolaFio
    ? `<div class="aviso" style="margin-top:10px;">⚠️ A distância/potência informada ficou fora da nossa tabela de fiação de referência. É importante um eletricista calcular a bitola certa antes da instalação.</div>`
    : "";

  painel.innerHTML = `
    <div class="cartao">
      <h2>Resultado estimado</h2>

      <div class="linha-resultado">
        <span>Altura manométrica total (AMT)</span>
        <strong>${resultado.amt} m</strong>
      </div>
      <div class="linha-resultado">
        <span>Vazão</span>
        <strong>${resultado.vazaoM3h} m³/h</strong>
      </div>
      <div class="linha-resultado">
        <span>Potência de bomba sugerida</span>
        <strong>${resultado.potenciaComercial.rotulo}</strong>
      </div>
      <div class="linha-resultado">
        <span>Diâmetro da tubulação de recalque</span>
        <strong>${resultado.diametroRecalqueMm} mm</strong>
      </div>
      <div class="linha-resultado">
        <span>Comprimento total de tubulação</span>
        <strong>${resultado.comprimentoTotalTubulacao} m</strong>
      </div>
      <div class="linha-resultado">
        <span>Quantidade de tubos (barras de 6m)</span>
        <strong>${resultado.quantidadeTubos}</strong>
      </div>
      <div class="linha-resultado">
        <span>Uniões / emendas</span>
        <strong>${resultado.quantidadeUnioes}</strong>
      </div>
      <div class="linha-resultado">
        <span>Abraçadeiras (fixação do cabo)</span>
        <strong>${resultado.quantidadeAbracadeiras}</strong>
      </div>
      <div class="linha-resultado">
        <span>Rede elétrica</span>
        <strong>${resultado.tipoRede}</strong>
      </div>
      <div class="linha-resultado">
        <span>Bitola de cabo elétrico sugerida</span>
        <strong>${bitolaTexto}</strong>
      </div>

      ${avisoPotenciaAcima}
      ${avisoBitola}

      <h3 style="margin-top:20px;">Itens periféricos necessários</h3>
      <ul class="lista-itens-perifericos">
        ${itensHtml}
      </ul>

      <div class="aviso" style="margin-top:16px;">
        📌 Esse resultado é uma <strong>estimativa inicial</strong> baseada em regras de referência.
        A parte elétrica deve ser instalada por um eletricista qualificado, seguindo a NBR 5410, e o
        poço por um profissional habilitado. Fale com um vendedor pra confirmar tudo antes de comprar os materiais.
      </div>

      <button id="botao-enviar-poco" class="botao botao-whatsapp botao-bloco" style="margin-top:14px;">
        💬 Enviar esse resultado pro vendedor
      </button>
    </div>
  `;

  document.getElementById("botao-enviar-poco").addEventListener("click", function () {
    const mensagem = montarMensagemPocoWhatsapp(cliente, dados, resultado);
    window.open("https://wa.me/" + CONFIG.whatsappAdmin + "?text=" + encodeURIComponent(mensagem), "_blank");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-poco");

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const dados = {
      vazaoLh: parseFloat(document.getElementById("vazao").value) || 0,
      profundidadeSuccao: parseFloat(document.getElementById("profundidade").value) || 0,
      alturaRecalque: parseFloat(document.getElementById("altura-recalque").value) || 0,
      distanciaHorizontal: parseFloat(document.getElementById("distancia-horizontal").value) || 0,
      distanciaQuadro: parseFloat(document.getElementById("distancia-quadro").value) || 0,
      tipoRede: document.getElementById("tipo-rede").value
    };

    if (dados.vazaoLh <= 0 || dados.profundidadeSuccao <= 0 || !dados.tipoRede) {
      alert("Preencha ao menos a vazão desejada, a profundidade e o tipo de rede elétrica pra continuar.");
      return;
    }

    const cliente = obterCliente();
    const resultado = calcularDimensionamentoPoco(dados);
    exibirResultadoPoco(resultado, dados, cliente);

    document.getElementById("resultado-poco").scrollIntoView({ behavior: "smooth" });
  });
});
