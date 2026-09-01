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
    "cultura": "Hortaliças (folhosas: alface, couve, rúcula)",
    "necessidadeHidricaMmDia": 5,
    "sistemaRecomendado": "Gotejamento",
    "observacao": "Regas frequentes e leves, evitar molhar as folhas (EXEMPLO - validar com equipe técnica)"
  },
  {
    "cultura": "Hortaliças (frutos: tomate, pimentão, pepino)",
    "necessidadeHidricaMmDia": 6,
    "sistemaRecomendado": "Gotejamento",
    "observacao": "Precisa de regularidade na umidade do solo (EXEMPLO - validar com equipe técnica)"
  },
  {
    "cultura": "Fruticultura (árvores frutíferas/pomar)",
    "necessidadeHidricaMmDia": 7,
    "sistemaRecomendado": "Microaspersão",
    "observacao": "Cobertura maior de área por planta (EXEMPLO - validar com equipe técnica)"
  },
  {
    "cultura": "Grama e jardim",
    "necessidadeHidricaMmDia": 5,
    "sistemaRecomendado": "Aspersão",
    "observacao": "Gramados e áreas ornamentais grandes (EXEMPLO - validar com equipe técnica)"
  },
  {
    "cultura": "Horta em vaso ou pequena escala",
    "necessidadeHidricaMmDia": 4,
    "sistemaRecomendado": "Gotejamento",
    "observacao": "Vasos, canteiros e hortas pequenas (EXEMPLO - validar com equipe técnica)"
  },
  {
    "cultura": "Plantas ornamentais e paisagismo",
    "necessidadeHidricaMmDia": 4,
    "sistemaRecomendado": "Microaspersão",
    "observacao": "Jardins ornamentais e paisagismo (EXEMPLO - validar com equipe técnica)"
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
  "solo": {
    "Arenoso": {
      "fator": 1.15,
      "observacao": "Retém menos água, aumenta a necessidade (EXEMPLO - validar com equipe técnica)"
    },
    "Argiloso": {
      "fator": 0.9,
      "observacao": "Retém mais água, reduz a necessidade (EXEMPLO - validar com equipe técnica)"
    },
    "Misto": {
      "fator": 1,
      "observacao": "Padrão (EXEMPLO - validar com equipe técnica)"
    }
  },
  "declividade": {
    "Plano": {
      "fator": 1,
      "observacao": "Padrão, sem perda relevante (EXEMPLO - validar com equipe técnica)"
    },
    "Levemente inclinado": {
      "fator": 1.1,
      "observacao": "Alguma perda por escoamento (EXEMPLO - validar com equipe técnica)"
    },
    "Inclinado": {
      "fator": 1.2,
      "observacao": "Maior perda por escoamento (EXEMPLO - validar com equipe técnica)"
    }
  }
};
