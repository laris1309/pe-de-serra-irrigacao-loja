"""
===========================================================
 Pé de Serra Irrigação - Gerador de catálogo
===========================================================

O QUE ESTE SCRIPT FAZ, EM PALAVRAS SIMPLES:

Você edita a "planilha" data/produtos.csv (pode abrir e editar
no Excel, Google Sheets ou até no Bloco de Notas) colocando o
nome de cada produto, separado por categoria. Não tem preço —
o catálogo aqui serve só pra o cliente montar a lista do que
precisa; quem monta o orçamento com valores é o vendedor, pelo
WhatsApp.

Depois roda este script, e ele transforma essa planilha no
arquivo js/produtos.js, que é o arquivo que o site realmente
usa para mostrar o catálogo pros clientes.

Ou seja: você NUNCA precisa mexer em código para atualizar
os produtos. Só edita o CSV e roda o script de novo.

COMO USAR (passo a passo está também no README.md):

1. Instale o Python no seu computador (se ainda não tiver).
2. Abra o Terminal (Mac) ou Prompt de Comando (Windows) dentro
   da pasta do projeto.
3. Digite: python scripts/gerar_catalogo.py
4. Pronto! O arquivo js/produtos.js foi atualizado.
5. Se você só editou preços/produtos, é só publicar de novo no
   GitHub (ou substituir o arquivo js/produtos.js no seu site).

===========================================================
"""

import csv
import json
import os
import sys

PASTA_RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAMINHO_CSV = os.path.join(PASTA_RAIZ, "data", "produtos.csv")
CAMINHO_SAIDA = os.path.join(PASTA_RAIZ, "js", "produtos.js")

# Ordem em que as categorias (abas) devem aparecer no site.
# O texto precisa ser IDÊNTICO ao usado na coluna "categoria" do CSV.
ORDEM_CATEGORIAS = [
    "Jardinagem",
    "Material elétrico",
    "Bombas d'água",
    "Tubos e conexões",
    "Mangueiras",
    "Piscina",
    "Peças",
    "Parafusos e ferragens",
]


def ler_produtos(caminho_csv):
    if not os.path.exists(caminho_csv):
        print(f"❌ Não encontrei o arquivo: {caminho_csv}")
        print("   Confira se ele existe em data/produtos.csv")
        sys.exit(1)

    produtos_por_categoria = {}

    with open(caminho_csv, newline="", encoding="utf-8") as arquivo:
        leitor = csv.DictReader(arquivo)

        colunas_esperadas = {"categoria", "nome"}
        if not colunas_esperadas.issubset(set(leitor.fieldnames or [])):
            print("❌ O arquivo CSV precisa ter as colunas: categoria, nome")
            print(f"   Encontrei estas colunas: {leitor.fieldnames}")
            sys.exit(1)

        for numero_linha, linha in enumerate(leitor, start=2):
            categoria = (linha.get("categoria") or "").strip()
            nome = (linha.get("nome") or "").strip()

            if not categoria or not nome:
                print(f"⚠️  Linha {numero_linha} incompleta, foi ignorada: {linha}")
                continue

            produtos_por_categoria.setdefault(categoria, []).append({
                "nome": nome
            })

    return produtos_por_categoria


def montar_lista_final(produtos_por_categoria):
    """Coloca as categorias na ordem definida em ORDEM_CATEGORIAS.
    Categorias que aparecerem no CSV mas não estiverem na lista
    acima entram no final, na ordem em que apareceram."""
    categorias_final = []

    for categoria in ORDEM_CATEGORIAS:
        if categoria in produtos_por_categoria:
            categorias_final.append(categoria)

    for categoria in produtos_por_categoria:
        if categoria not in categorias_final:
            categorias_final.append(categoria)

    return [
        {"categoria": categoria, "itens": produtos_por_categoria[categoria]}
        for categoria in categorias_final
    ]


def escrever_arquivo_js(catalogo, caminho_saida):
    conteudo = (
        "/* ===========================================================\n"
        "   ARQUIVO GERADO AUTOMATICAMENTE por scripts/gerar_catalogo.py\n"
        "   NÃO edite este arquivo direto — edite data/produtos.csv e\n"
        "   rode o script de novo. Assim você não perde suas alterações.\n"
        "   =========================================================== */\n\n"
        "const CATALOGO = "
        + json.dumps(catalogo, ensure_ascii=False, indent=2)
        + ";\n"
    )

    os.makedirs(os.path.dirname(caminho_saida), exist_ok=True)
    with open(caminho_saida, "w", encoding="utf-8") as arquivo:
        arquivo.write(conteudo)


def main():
    print("🌱 Gerando catálogo da Pé de Serra Irrigação...")
    produtos_por_categoria = ler_produtos(CAMINHO_CSV)

    if not produtos_por_categoria:
        print("⚠️  Nenhum produto válido foi encontrado no CSV.")
        sys.exit(1)

    catalogo = montar_lista_final(produtos_por_categoria)
    escrever_arquivo_js(catalogo, CAMINHO_SAIDA)

    total_itens = sum(len(c["itens"]) for c in catalogo)
    print(f"✅ Pronto! {total_itens} produtos em {len(catalogo)} categorias.")
    print(f"   Arquivo atualizado: {CAMINHO_SAIDA}")


if __name__ == "__main__":
    main()
