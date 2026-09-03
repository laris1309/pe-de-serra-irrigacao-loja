/* ===========================================================
   ARQUIVO GERADO AUTOMATICAMENTE por scripts/gerar_regras.py
   NÃO edite este arquivo direto — edite os arquivos em data/
   (regras_cultura.csv, faixas_vazao.csv, fatores_ajuste.csv)
   e rode o script de novo.

   ATENÇÃO: os valores aqui são estimativas de referência.
   Antes de publicar pros clientes, valide com um responsável
   técnico da loja.
   =========================================================== */

const REGRAS_CULTURA = [
  {
    "cultura": "Milho",
    "necessidadeHidricaMmDia": 5,
    "observacao": "Fase vegetativa e enchimento de grão são as mais exigentes em água (EXEMPLO - validar com equipe técnica)"
  },
  {
    "cultura": "Hortaliças",
    "necessidadeHidricaMmDia": 5.5,
    "observacao": "Regas frequentes e leves, regularidade na umidade do solo (EXEMPLO - validar com equipe técnica)"
  },
  {
    "cultura": "Capim",
    "necessidadeHidricaMmDia": 6,
    "observacao": "Pastagem irrigada, alta demanda em período seco (EXEMPLO - validar com equipe técnica)"
  },
  {
    "cultura": "Frutas",
    "necessidadeHidricaMmDia": 7,
    "observacao": "Árvores frutíferas, cobertura maior por planta (EXEMPLO - validar com equipe técnica)"
  },
  {
    "cultura": "Grama/Jardim",
    "necessidadeHidricaMmDia": 5,
    "observacao": "Áreas ornamentais e gramados (EXEMPLO - validar com equipe técnica)"
  }
];

const FAIXAS_VAZAO = [
  {
    "vazaoMaximaLh": 1000,
    "diametroSugeridoMm": 20,
    "observacao": "Sistemas pequenos (EXEMPLO - validar com equipe técnica)"
  },
  {
    "vazaoMaximaLh": 2000,
    "diametroSugeridoMm": 25,
    "observacao": "Sistemas pequenos/médios (EXEMPLO - validar com equipe técnica)"
  },
  {
    "vazaoMaximaLh": 4000,
    "diametroSugeridoMm": 32,
    "observacao": "Sistemas médios (EXEMPLO - validar com equipe técnica)"
  },
  {
    "vazaoMaximaLh": 8000,
    "diametroSugeridoMm": 40,
    "observacao": "Sistemas médios/grandes (EXEMPLO - validar com equipe técnica)"
  },
  {
    "vazaoMaximaLh": 15000,
    "diametroSugeridoMm": 50,
    "observacao": "Sistemas grandes (EXEMPLO - validar com equipe técnica)"
  },
  {
    "vazaoMaximaLh": 999999999,
    "diametroSugeridoMm": 0,
    "observacao": "Vazão alta - recomendável um projeto técnico personalizado com um vendedor"
  }
];

const FATORES_AJUSTE = {
  "irrigacao": {
    "Aspersão convencional": {
      "fator": 1.2,
      "observacao": "Maior perda por evaporação e vento (EXEMPLO - validar com equipe técnica)"
    },
    "Gotejamento por fita de gotejamento": {
      "fator": 0.9,
      "observacao": "Sistema eficiente, baixa perda por evaporação (EXEMPLO - validar com equipe técnica)"
    },
    "Gotejamento por gotejadores": {
      "fator": 0.85,
      "observacao": "Aplicação bem localizada, sistema muito eficiente (EXEMPLO - validar com equipe técnica)"
    },
    "Microaspersão \"bailarina\"": {
      "fator": 1,
      "observacao": "Eficiência intermediária (EXEMPLO - validar com equipe técnica)"
    },
    "Microaspersão \"micrão\"": {
      "fator": 1,
      "observacao": "Eficiência intermediária, maior alcance (EXEMPLO - validar com equipe técnica)"
    }
  }
};
