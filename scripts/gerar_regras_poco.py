"""
===========================================================
 Pé de Serra Irrigação - Gerador de regras do
 Dimensionamento de Bomba e Tubulação para Poço
===========================================================

O QUE ESTE SCRIPT FAZ, EM PALAVRAS SIMPLES:

O site tem uma calculadora onde o cliente informa dados do poço dele
(vazão desejada, profundidade, distâncias, tipo de rede elétrica) e
recebe uma estimativa de: potência da bomba, diâmetro e quantidade de
tubos/conexões, bitola do cabo elétrico e a lista de itens periféricos
necessários (relé de nível, quadro de comando, etc.).

Esse cálculo usa 5 "planilhas" de regras que ficam em data/:

  1. data/rendimento_bomba.csv       -> rendimento estimado da bomba
                                         conforme a faixa de vazão.
  2. data/faixas_vazao_poco.csv      -> a partir de qual vazão (L/h) se
                                         recomenda cada diâmetro de
                                         tubulação de recalque.
  3. data/potencias_comerciais.csv   -> lista das potências de bomba
                                         que existem à venda (CV).
  4. data/fios_bomba.csv             -> bitola do cabo elétrico
                                         conforme potência, distância
                                         e tipo de rede (mono/trifásica).
  5. data/itens_perifericos_poco.csv -> lista de itens que sempre
                                         entram na lista (ex: relé de
                                         nível) e os que dependem do
                                         tipo de rede elétrica.

IMPORTANTE: os valores desses arquivos são EXEMPLOS de referência,
pra a calculadora já funcionar de ponta a ponta. Antes de divulgar
pros clientes, um responsável técnico (de preferência um eletricista
para a parte elétrica, seguindo a NBR 5410) precisa revisar e ajustar
esses números.

COMO USAR:

1. Edite os arquivos CSV citados acima (Excel, Google Sheets ou Bloco
   de Notas).
2. Rode: python3 scripts/gerar_regras_poco.py
3. Isso atualiza o arquivo js/regras_poco.js. Suba os arquivos
   alterados de novo no GitHub.

===========================================================
"""

import csv
import json
import os
import sys

PASTA_RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAMINHO_RENDIMENTO = os.path.join(PASTA_RAIZ, "data", "rendimento_bomba.csv")
CAMINHO_FAIXAS_VAZAO = os.path.join(PASTA_RAIZ, "data", "faixas_vazao_poco.csv")
CAMINHO_POTENCIAS = os.path.join(PASTA_RAIZ, "data", "potencias_comerciais.csv")
CAMINHO_FIOS = os.path.join(PASTA_RAIZ, "data", "fios_bomba.csv")
CAMINHO_ITENS = os.path.join(PASTA_RAIZ, "data", "itens_perifericos_poco.csv")
CAMINHO_SAIDA = os.path.join(PASTA_RAIZ, "js", "regras_poco.js")


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


def montar_rendimento_bomba():
    linhas = ler_csv(CAMINHO_RENDIMENTO, {"vazao_maxima_lh", "rendimento", "observacao"})
    dados = []
    for numero, linha in enumerate(linhas, start=2):
        dados.append({
            "vazaoMaximaLh": converter_numero(linha["vazao_maxima_lh"], "vazao_maxima_lh", numero, "rendimento_bomba.csv"),
            "rendimento": converter_numero(linha["rendimento"], "rendimento", numero, "rendimento_bomba.csv"),
            "observacao": (linha.get("observacao") or "").strip()
        })
    dados.sort(key=lambda d: d["vazaoMaximaLh"])
    return dados


def montar_faixas_vazao_poco():
    linhas = ler_csv(CAMINHO_FAIXAS_VAZAO, {"vazao_maxima_lh", "diametro_recalque_mm", "observacao"})
    dados = []
    for numero, linha in enumerate(linhas, start=2):
        dados.append({
            "vazaoMaximaLh": converter_numero(linha["vazao_maxima_lh"], "vazao_maxima_lh", numero, "faixas_vazao_poco.csv"),
            "diametroRecalqueMm": converter_numero(linha["diametro_recalque_mm"], "diametro_recalque_mm", numero, "faixas_vazao_poco.csv"),
            "observacao": (linha.get("observacao") or "").strip()
        })
    dados.sort(key=lambda d: d["vazaoMaximaLh"])
    return dados


def montar_potencias_comerciais():
    linhas = ler_csv(CAMINHO_POTENCIAS, {"potencia_cv", "rotulo"})
    dados = []
    for numero, linha in enumerate(linhas, start=2):
        dados.append({
            "potenciaCv": converter_numero(linha["potencia_cv"], "potencia_cv", numero, "potencias_comerciais.csv"),
            "rotulo": (linha.get("rotulo") or "").strip()
        })
    dados.sort(key=lambda d: d["potenciaCv"])
    return dados


def montar_fios_bomba():
    linhas = ler_csv(CAMINHO_FIOS, {"tipo_rede", "potencia_maxima_cv", "distancia_maxima_m", "bitola_mm2", "observacao"})
    dados = []
    for numero, linha in enumerate(linhas, start=2):
        dados.append({
            "tipoRede": (linha.get("tipo_rede") or "").strip(),
            "potenciaMaximaCv": converter_numero(linha["potencia_maxima_cv"], "potencia_maxima_cv", numero, "fios_bomba.csv"),
            "distanciaMaximaM": converter_numero(linha["distancia_maxima_m"], "distancia_maxima_m", numero, "fios_bomba.csv"),
            "bitolaMm2": converter_numero(linha["bitola_mm2"], "bitola_mm2", numero, "fios_bomba.csv"),
            "observacao": (linha.get("observacao") or "").strip()
        })
    return dados


def montar_itens_perifericos():
    linhas = ler_csv(CAMINHO_ITENS, {"condicao", "item", "observacao"})
    dados = []
    for linha in linhas:
        dados.append({
            "condicao": (linha.get("condicao") or "").strip(),
            "item": (linha.get("item") or "").strip(),
            "observacao": (linha.get("observacao") or "").strip()
        })
    return dados


def escrever_arquivo_js(rendimento, faixas_vazao, potencias, fios, itens):
    conteudo = (
        "/* ===========================================================\n"
        "   ARQUIVO GERADO AUTOMATICAMENTE por scripts/gerar_regras_poco.py\n"
        "   NÃO edite este arquivo direto — edite os arquivos em data/\n"
        "   (rendimento_bomba.csv, faixas_vazao_poco.csv,\n"
        "   potencias_comerciais.csv, fios_bomba.csv,\n"
        "   itens_perifericos_poco.csv) e rode o script de novo.\n"
        "\n"
        "   ATENÇÃO: os valores aqui são estimativas de referência.\n"
        "   A parte elétrica precisa ser validada por um eletricista\n"
        "   seguindo a NBR 5410 antes de qualquer instalação.\n"
        "   =========================================================== */\n\n"
        "const RENDIMENTO_BOMBA = " + json.dumps(rendimento, ensure_ascii=False, indent=2) + ";\n\n"
        "const FAIXAS_VAZAO_POCO = " + json.dumps(faixas_vazao, ensure_ascii=False, indent=2) + ";\n\n"
        "const POTENCIAS_COMERCIAIS = " + json.dumps(potencias, ensure_ascii=False, indent=2) + ";\n\n"
        "const FIOS_BOMBA = " + json.dumps(fios, ensure_ascii=False, indent=2) + ";\n\n"
        "const ITENS_PERIFERICOS_POCO = " + json.dumps(itens, ensure_ascii=False, indent=2) + ";\n"
    )
    os.makedirs(os.path.dirname(CAMINHO_SAIDA), exist_ok=True)
    with open(CAMINHO_SAIDA, "w", encoding="utf-8") as arquivo:
        arquivo.write(conteudo)


def main():
    print("⚡ Gerando regras do dimensionamento de bomba e poço...")
    rendimento = montar_rendimento_bomba()
    faixas_vazao = montar_faixas_vazao_poco()
    potencias = montar_potencias_comerciais()
    fios = montar_fios_bomba()
    itens = montar_itens_perifericos()

    escrever_arquivo_js(rendimento, faixas_vazao, potencias, fios, itens)

    print(f"✅ Pronto! {len(rendimento)} faixas de rendimento, {len(faixas_vazao)} faixas de vazão, "
          f"{len(potencias)} potências comerciais, {len(fios)} regras de fiação, {len(itens)} itens periféricos.")
    print(f"   Arquivo atualizado: {CAMINHO_SAIDA}")
    print("   Lembrete: valide a parte elétrica com um eletricista (NBR 5410) antes de publicar.")


if __name__ == "__main__":
    main()
