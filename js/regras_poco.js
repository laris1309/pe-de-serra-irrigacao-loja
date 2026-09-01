/* ===========================================================
   ARQUIVO GERADO AUTOMATICAMENTE por scripts/gerar_regras_poco.py
   NÃO edite este arquivo direto — edite os arquivos em data/
   (rendimento_bomba.csv, faixas_vazao_poco.csv,
   potencias_comerciais.csv, fios_bomba.csv,
   itens_perifericos_poco.csv) e rode o script de novo.

   ATENÇÃO: os valores aqui são estimativas de referência.
   A parte elétrica precisa ser validada por um eletricista
   seguindo a NBR 5410 antes de qualquer instalação.
   =========================================================== */

const RENDIMENTO_BOMBA = [
  {
    "vazaoMaximaLh": 1000,
    "rendimento": 0.4,
    "observacao": "Bombas pequenas costumam ter rendimento menor (EXEMPLO - validar com equipe técnica)"
  },
  {
    "vazaoMaximaLh": 3000,
    "rendimento": 0.45,
    "observacao": "(EXEMPLO - validar com equipe técnica)"
  },
  {
    "vazaoMaximaLh": 6000,
    "rendimento": 0.5,
    "observacao": "(EXEMPLO - validar com equipe técnica)"
  },
  {
    "vazaoMaximaLh": 12000,
    "rendimento": 0.55,
    "observacao": "(EXEMPLO - validar com equipe técnica)"
  },
  {
    "vazaoMaximaLh": 999999999,
    "rendimento": 0.6,
    "observacao": "Bombas maiores costumam ter rendimento melhor (EXEMPLO - validar com equipe técnica)"
  }
];

const FAIXAS_VAZAO_POCO = [
  {
    "vazaoMaximaLh": 1500,
    "diametroRecalqueMm": 25,
    "observacao": "(EXEMPLO - validar com equipe técnica)"
  },
  {
    "vazaoMaximaLh": 3000,
    "diametroRecalqueMm": 32,
    "observacao": "(EXEMPLO - validar com equipe técnica)"
  },
  {
    "vazaoMaximaLh": 6000,
    "diametroRecalqueMm": 40,
    "observacao": "(EXEMPLO - validar com equipe técnica)"
  },
  {
    "vazaoMaximaLh": 10000,
    "diametroRecalqueMm": 50,
    "observacao": "(EXEMPLO - validar com equipe técnica)"
  },
  {
    "vazaoMaximaLh": 20000,
    "diametroRecalqueMm": 60,
    "observacao": "(EXEMPLO - validar com equipe técnica)"
  },
  {
    "vazaoMaximaLh": 999999999,
    "diametroRecalqueMm": 75,
    "observacao": "Vazão muito alta - recomendável um projeto técnico personalizado com um vendedor"
  }
];

const POTENCIAS_COMERCIAIS = [
  {
    "potenciaCv": 0.33,
    "rotulo": "1/3 CV"
  },
  {
    "potenciaCv": 0.5,
    "rotulo": "1/2 CV"
  },
  {
    "potenciaCv": 0.75,
    "rotulo": "3/4 CV"
  },
  {
    "potenciaCv": 1,
    "rotulo": "1 CV"
  },
  {
    "potenciaCv": 1.5,
    "rotulo": "1,5 CV"
  },
  {
    "potenciaCv": 2,
    "rotulo": "2 CV"
  },
  {
    "potenciaCv": 3,
    "rotulo": "3 CV"
  },
  {
    "potenciaCv": 5,
    "rotulo": "5 CV"
  },
  {
    "potenciaCv": 7.5,
    "rotulo": "7,5 CV"
  },
  {
    "potenciaCv": 10,
    "rotulo": "10 CV"
  }
];

const FIOS_BOMBA = [
  {
    "tipoRede": "Monofásica",
    "potenciaMaximaCv": 0.5,
    "distanciaMaximaM": 20,
    "bitolaMm2": 2.5,
    "observacao": "(EXEMPLO - validar com eletricista conforme NBR 5410)"
  },
  {
    "tipoRede": "Monofásica",
    "potenciaMaximaCv": 0.5,
    "distanciaMaximaM": 50,
    "bitolaMm2": 4,
    "observacao": "(EXEMPLO - validar com eletricista conforme NBR 5410)"
  },
  {
    "tipoRede": "Monofásica",
    "potenciaMaximaCv": 1,
    "distanciaMaximaM": 20,
    "bitolaMm2": 4,
    "observacao": "(EXEMPLO - validar com eletricista conforme NBR 5410)"
  },
  {
    "tipoRede": "Monofásica",
    "potenciaMaximaCv": 1,
    "distanciaMaximaM": 50,
    "bitolaMm2": 6,
    "observacao": "(EXEMPLO - validar com eletricista conforme NBR 5410)"
  },
  {
    "tipoRede": "Monofásica",
    "potenciaMaximaCv": 2,
    "distanciaMaximaM": 20,
    "bitolaMm2": 6,
    "observacao": "(EXEMPLO - validar com eletricista conforme NBR 5410)"
  },
  {
    "tipoRede": "Monofásica",
    "potenciaMaximaCv": 2,
    "distanciaMaximaM": 50,
    "bitolaMm2": 10,
    "observacao": "(EXEMPLO - validar com eletricista conforme NBR 5410)"
  },
  {
    "tipoRede": "Monofásica",
    "potenciaMaximaCv": 3,
    "distanciaMaximaM": 100,
    "bitolaMm2": 10,
    "observacao": "(EXEMPLO - validar com eletricista conforme NBR 5410)"
  },
  {
    "tipoRede": "Trifásica",
    "potenciaMaximaCv": 1,
    "distanciaMaximaM": 30,
    "bitolaMm2": 2.5,
    "observacao": "(EXEMPLO - validar com eletricista conforme NBR 5410)"
  },
  {
    "tipoRede": "Trifásica",
    "potenciaMaximaCv": 1,
    "distanciaMaximaM": 60,
    "bitolaMm2": 4,
    "observacao": "(EXEMPLO - validar com eletricista conforme NBR 5410)"
  },
  {
    "tipoRede": "Trifásica",
    "potenciaMaximaCv": 3,
    "distanciaMaximaM": 30,
    "bitolaMm2": 4,
    "observacao": "(EXEMPLO - validar com eletricista conforme NBR 5410)"
  },
  {
    "tipoRede": "Trifásica",
    "potenciaMaximaCv": 3,
    "distanciaMaximaM": 60,
    "bitolaMm2": 6,
    "observacao": "(EXEMPLO - validar com eletricista conforme NBR 5410)"
  },
  {
    "tipoRede": "Trifásica",
    "potenciaMaximaCv": 5,
    "distanciaMaximaM": 60,
    "bitolaMm2": 10,
    "observacao": "(EXEMPLO - validar com eletricista conforme NBR 5410)"
  },
  {
    "tipoRede": "Trifásica",
    "potenciaMaximaCv": 10,
    "distanciaMaximaM": 100,
    "bitolaMm2": 16,
    "observacao": "(EXEMPLO - validar com eletricista conforme NBR 5410)"
  }
];

const ITENS_PERIFERICOS_POCO = [
  {
    "condicao": "sempre",
    "item": "Relé de nível (boia elétrica)",
    "observacao": "Protege a bomba contra funcionamento a seco - recomendado em todos os poços"
  },
  {
    "condicao": "sempre",
    "item": "Quadro de comando e proteção da bomba",
    "observacao": "Abriga contator/térmico e demais proteções (EXEMPLO - validar com equipe técnica)"
  },
  {
    "condicao": "sempre",
    "item": "Válvula de retenção",
    "observacao": "Evita retorno de água pela tubulação (EXEMPLO - validar com equipe técnica)"
  },
  {
    "condicao": "sempre",
    "item": "Registro de esfera",
    "observacao": "Permite isolar a linha para manutenção (EXEMPLO - validar com equipe técnica)"
  },
  {
    "condicao": "sempre",
    "item": "Abraçadeiras para fixar o cabo elétrico na tubulação",
    "observacao": "Aproximadamente uma a cada barra de tubo (EXEMPLO - validar com equipe técnica)"
  },
  {
    "condicao": "sempre",
    "item": "Cabo elétrico na bitola calculada",
    "observacao": "Confirmar a bitola com um eletricista conforme a NBR 5410"
  },
  {
    "condicao": "sempre",
    "item": "Tampa sanitária do poço",
    "observacao": "Veda a boca do poço e evita contaminação (EXEMPLO - validar com equipe técnica)"
  },
  {
    "condicao": "trifasico",
    "item": "Quadro elétrico com relé de falta de fase",
    "observacao": "Recomendado para redes trifásicas: protege o motor contra queima por falta de fase"
  },
  {
    "condicao": "monofasico",
    "item": "Capacitor de partida",
    "observacao": "Verificar necessidade conforme o modelo específico da bomba (EXEMPLO - validar com equipe técnica)"
  }
];
