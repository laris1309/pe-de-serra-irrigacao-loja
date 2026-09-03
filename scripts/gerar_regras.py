"""
===========================================================
 Pé de Serra Irrigação - Gerador de regras do simulador
===========================================================

O QUE ESTE SCRIPT FAZ, EM PALAVRAS SIMPLES:

O site tem um "Simulador de Dimensionamento de Irrigação": o cliente
preenche dados da plantação dele (o que vai plantar, tipo de irrigação
desejado, terreno etc.) e o site já calcula uma estimativa de vazão e
diâmetro de tubulação.

Esse cálculo usa 3 "planilhas" de regras que ficam em data/:

  1. data/regras_cultura.csv     -> quanto de água cada tipo de cultivo
                                     costuma precisar por dia.
  2. data/faixas_vazao.csv       -> a partir de qual vazão (L/h) se
                                     recomenda cada diâmetro de cano.
  3. data/fatores_ajuste.csv     -> o quanto cada tipo de irrigação
                                     (aspersão, gotejamento, microaspersão)
                                     aumenta ou diminui a necessidade de
                                     água por conta da eficiência dele.

IMPORTANTE: os valores que vêm nesses arquivos são só EXEMPLOS, pra
o simulador já funcionar de ponta a ponta. Antes de divulgar o site
pros clientes, um responsável técnico da loja deve revisar e ajustar
esses números pra refletir a realidade (clima local, tipo de sistema
que a loja trabalha, etc.).

COMO USAR:

1. Edite os 3 arquivos CSV (pode abrir no Excel, Google Sheets ou
   Bloco de Notas) com os valores corretos.
2. Rode: python3 scripts/gerar_regras.py
3. Isso atualiza o arquivo js/regras.js, que é o que o simulador usa
   de verdade. Suba os arquivos alterados de novo no GitHub.

===========================================================
"""

import csv
import json
import os
import sys

PASTA_RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAMINHO_REGRAS_CULTURA = os.path.join(PASTA_RAIZ, "data", "regras_cultura.csv")
CAMINHO_FAIXAS_VAZAO = os.path.join(PASTA_RAIZ, "data", "faixas_vazao.csv")
CAMINHO_FATORES_AJUSTE = os.path.join(PASTA_RAIZ, "data", "fatores_ajuste.csv")
CAMINHO_SAIDA = os.path.join(PASTA_RAIZ, "js", "regras.js")


def converter_numero(texto, nome_campo, numero_linha, arquivo):
    texto = texto.strip().replace(",", ".")
    try:
        valor = float(texto)
        return int(valor) if valor.is_integer() else valor
    except ValueError:
        print(f'❌ {arquivo}, linha {numero_linha}: não consegui entender "{nome_campo}" = "{texto}"')
        sys.exit(1)


def ler_csv(caminho, colunas_esperadas):
    if not os.path.exists(caminho):
        print(f"❌ Não encontrei o arquivo: {caminho}")
        sys.exit(1)

    with open(caminho, newline="", encoding="utf-8") as arquivo:
        leitor = csv.DictReader(arquivo)
        if not colunas_esperadas.issubset(set(leitor.fieldnames or [])):
            print(f"❌ {caminho} precisa ter as colunas: {', '.join(colunas_esperadas)}")
            print(f"   Encontrei: {leitor.fieldnames}")
            sys.exit(1)
        return list(leitor)


def montar_regras_cultura():
    linhas = ler_csv(CAMINHO_REGRAS_CULTURA, {"cultura", "necessidade_hidrica_mm_dia", "observacao"})
    regras = []
    for numero, linha in enumerate(linhas, start=2):
        cultura = (linha.get("cultura") or "").strip()
        if not cultura:
            continue
        regras.append({
            "cultura": cultura,
            "necessidadeHidricaMmDia": converter_numero(linha["necessidade_hidrica_mm_dia"], "necessidade_hidrica_mm_dia", numero, "regras_cultura.csv"),
            "observacao": (linha.get("observacao") or "").strip()
        })
    return regras


def montar_faixas_vazao():
    linhas = ler_csv(CAMINHO_FAIXAS_VAZAO, {"vazao_maxima_lh", "diametro_sugerido_mm", "observacao"})
    faixas = []
    for numero, linha in enumerate(linhas, start=2):
        faixas.append({
            "vazaoMaximaLh": converter_numero(linha["vazao_maxima_lh"], "vazao_maxima_lh", numero, "faixas_vazao.csv"),
            "diametroSugeridoMm": converter_numero(linha["diametro_sugerido_mm"], "diametro_sugerido_mm", numero, "faixas_vazao.csv"),
            "observacao": (linha.get("observacao") or "").strip()
        })
    faixas.sort(key=lambda f: f["vazaoMaximaLh"])
    return faixas


def montar_fatores_ajuste():
    linhas = ler_csv(CAMINHO_FATORES_AJUSTE, {"tipo", "valor", "fator", "observacao"})
    fatores = {}
    for numero, linha in enumerate(linhas, start=2):
        tipo = (linha.get("tipo") or "").strip()
        valor = (linha.get("valor") or "").strip()
        if not tipo or not valor:
            continue
        fatores.setdefault(tipo, {})
        fatores[tipo][valor] = {
            "fator": converter_numero(linha["fator"], "fator", numero, "fatores_ajuste.csv"),
            "observacao": (linha.get("observacao") or "").strip()
        }
    return fatores


def escrever_arquivo_js(regras_cultura, faixas_vazao, fatores_ajuste):
    conteudo = (
        "/* ===========================================================\n"
        "   ARQUIVO GERADO AUTOMATICAMENTE por scripts/gerar_regras.py\n"
        "   NÃO edite este arquivo direto — edite os arquivos em data/\n"
        "   (regras_cultura.csv, faixas_vazao.csv, fatores_ajuste.csv)\n"
        "   e rode o script de novo.\n"
        "\n"
        "   ATENÇÃO: os valores aqui são estimativas de referência.\n"
        "   Antes de publicar pros clientes, valide com um responsável\n"
        "   técnico da loja.\n"
        "   =========================================================== */\n\n"
        "const REGRAS_CULTURA = " + json.dumps(regras_cultura, ensure_ascii=False, indent=2) + ";\n\n"
        "const FAIXAS_VAZAO = " + json.dumps(faixas_vazao, ensure_ascii=False, indent=2) + ";\n\n"
        "const FATORES_AJUSTE = " + json.dumps(fatores_ajuste, ensure_ascii=False, indent=2) + ";\n"
    )

    os.makedirs(os.path.dirname(CAMINHO_SAIDA), exist_ok=True)
    with open(CAMINHO_SAIDA, "w", encoding="utf-8") as arquivo:
        arquivo.write(conteudo)


def main():
    print("💧 Gerando regras do simulador de dimensionamento...")
    regras_cultura = montar_regras_cultura()
    faixas_vazao = montar_faixas_vazao()
    fatores_ajuste = montar_fatores_ajuste()

    escrever_arquivo_js(regras_cultura, faixas_vazao, fatores_ajuste)

    print(f"✅ Pronto! {len(regras_cultura)} culturas, {len(faixas_vazao)} faixas de vazão, "
          f"{sum(len(v) for v in fatores_ajuste.values())} fatores de ajuste.")
    print(f"   Arquivo atualizado: {CAMINHO_SAIDA}")
    print("   Lembrete: valide esses números com um responsável técnico antes de publicar.")


if __name__ == "__main__":
    main()
