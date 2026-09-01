# Pé de Serra Irrigação — Autoatendimento

Manual de orientação escrito em linguagem simples, sem termos técnicos difíceis. Leia com calma, um passo de cada vez — não precisa saber programar pra colocar isso no ar.

## O que é essa página

Um site simples pra você colocar no WhatsApp, Instagram ou onde quiser, e o cliente:

1. Preenche nome, sobrenome e WhatsApp
2. Cai num menu com 6 opções: **Catálogo**, **Simulador de Irrigação**, **Bomba e Poço**, **Falar com Lucas**, **Falar com Erica** e **Manuais das Máquinas**
3. No catálogo, monta um orçamento tipo cardápio (separado em abas: Jardinagem, Material elétrico, Bombas d'água, Tubos e conexões, Mangueiras, Piscina, Peças, Parafusos e ferragens)
4. Ao finalizar, abre o WhatsApp já com a mensagem do pedido pronta pra vocês (só falta o cliente apertar "enviar")
5. O cliente também recebe, no WhatsApp dele, uma confirmação do pedido pronta pra enviar como comprovante

**Importante sobre o WhatsApp:** por regra do próprio WhatsApp, nenhum site consegue mandar mensagem sozinho, 100% automático, sem custo. O que fizemos aqui é o melhor caminho gratuito: a mensagem já sai pronta, escrita, no número certo — falta só 1 toque em "enviar". Isso é o que a grande maioria das lojas pequenas usa.

---

## Passo 1 — Testar no seu computador antes de publicar

Isso é opcional, mas ajuda a ver se está tudo certo antes de colocar no ar.

1. Instale o **Python** no seu computador, se ainda não tiver: [python.org/downloads](https://www.python.org/downloads/) (baixe e clique em "Next" até instalar)
2. Abra a pasta `pe-de-serra-irrigacao-loja` no Terminal (Mac) ou Prompt de Comando (Windows).
   - No Mac: clique com o botão direito na pasta → "Novo Terminal na Pasta" (ou abra o Terminal e digite `cd ` seguido do caminho da pasta)
   - No Windows: abra a pasta, clique na barra de endereço, digite `cmd` e aperte Enter
3. Digite:
   ```
   python3 -m http.server 8000
   ```
   (No Windows, se der erro, tente `python -m http.server 8000`)
4. Abra o navegador e acesse: `http://localhost:8000`
5. Pronto, você está vendo o site rodando no seu computador! Aperte `Ctrl + C` no terminal quando quiser parar.

---

## Passo 2 — Publicar no GitHub Pages (o site fica no ar, de graça)

### 2.1 Criar sua conta

Acesse [github.com](https://github.com) e crie uma conta gratuita, se ainda não tiver.

### 2.2 Criar o repositório (a "pasta" do seu site no GitHub)

1. No canto superior direito, clique no `+` → **New repository**
2. Em "Repository name", digite: `pe-de-serra-irrigacao-loja`
3. Deixe marcado como **Public**
4. Clique em **Create repository**

### 2.3 Subir os arquivos

1. Na página do repositório recém-criado, clique no link **uploading an existing file**
2. Arraste TODA a pasta `pe-de-serra-irrigacao-loja` (com tudo dentro: index.html, css, js, data, scripts, manuais) pra dentro da área de upload
   - Se o navegador não aceitar arrastar a pasta inteira, arraste os arquivos e subpastas um de cada vez
3. Role pra baixo e clique em **Commit changes**

### 2.4 Ativar o GitHub Pages (deixar o site visível pra todo mundo)

1. Na página do repositório, clique em **Settings** (Configurações)
2. No menu da esquerda, clique em **Pages**
3. Em "Branch", selecione **main** e a pasta **/ (root)**
4. Clique em **Save**
5. Espere 1 ou 2 minutinhos e atualize a página — vai aparecer um link tipo:
   ```
   https://seu-usuario.github.io/pe-de-serra-irrigacao-loja/
   ```
6. Esse é o link que você vai compartilhar com os clientes!

---

## Passo 3 — Editar produtos e preços (o "cardápio")

Você **não precisa mexer em código** pra isso.

1. Abra o arquivo `data/produtos.csv` no Excel, Google Sheets ou Bloco de Notas
2. Cada linha é um produto, com 3 colunas: `categoria`, `nome`, `preco`
   - A categoria precisa ser uma dessas: Jardinagem, Material elétrico, Bombas d'água, Tubos e conexões, Mangueiras, Piscina, Peças, Parafusos e ferragens
   - Se o nome do produto tiver vírgula (ex: "2,5mm"), coloque o nome inteiro entre aspas: `"Fio 2,5mm"`
   - O preço pode ser com ponto ou vírgula: `19.90` ou `19,90`
3. Adicione, remova ou edite as linhas que quiser
4. Salve o arquivo (mantendo o formato CSV)
5. Rode o script Python que atualiza o site:
   ```
   python3 scripts/gerar_catalogo.py
   ```
6. Isso vai atualizar o arquivo `js/produtos.js` sozinho. Suba os dois arquivos (`data/produtos.csv` e `js/produtos.js`) de novo no GitHub (passo 2.3)

**Atenção:** os produtos que estão lá agora são só EXEMPLOS pra você ver o site funcionando. Troque todos pelos produtos reais da loja antes de divulgar o link pros clientes.

---

## Passo 3.5 — Simulador de Dimensionamento de Irrigação

O site tem uma página (`simulacao.html`) onde o cliente preenche os dados da plantação dele — cultura, área, tipo de solo, declividade do terreno e quantas horas por dia pretende irrigar — e recebe na hora uma **estimativa** de vazão, sistema recomendado e diâmetro de tubulação.

**Muito importante:** os números que vêm configurados agora (quanto de água cada cultura precisa por dia, a partir de qual vazão usar cada diâmetro de cano, o quanto o solo/declividade influenciam) são **exemplos de referência**, só pra o simulador já funcionar. Antes de divulgar essa página pros clientes, peça pra alguém com conhecimento técnico de irrigação (vocês mesmos, um engenheiro agrônomo ou técnico de confiança) revisar esses valores. Por isso o resultado sempre aparece com um aviso e um botão pra o cliente confirmar com um vendedor pelo WhatsApp — o simulador é um "pontapé inicial" pro atendimento, não substitui a avaliação técnica.

### Como editar as regras do simulador

Assim como o catálogo, as regras ficam em arquivos CSV dentro de `data/`, e você só precisa editar planilhas — sem mexer em código.

1. **`data/regras_cultura.csv`** — quanto de água (em mm por dia) cada tipo de cultivo costuma precisar, e qual sistema (gotejamento, aspersão, microaspersão) costuma ser indicado.
2. **`data/faixas_vazao.csv`** — a partir de qual vazão (em litros por hora) se indica cada diâmetro de tubulação (em mm). A última linha (vazão muito alta) sempre aponta pra "fale com um vendedor", pra sistemas grandes que precisam de projeto técnico de verdade.
3. **`data/fatores_ajuste.csv`** — o quanto o tipo de solo (arenoso, argiloso, misto) e a declividade do terreno (plano, levemente inclinado, inclinado) aumentam ou diminuem a necessidade de água.

Depois de editar qualquer um desses arquivos, rode:
```
python3 scripts/gerar_regras.py
```
Isso atualiza o arquivo `js/regras.js` sozinho — suba os arquivos alterados de novo no GitHub (passo 2.3).

**Como o cálculo funciona por trás:** volume diário de água (litros) = área (m²) × necessidade da cultura (mm/dia) já ajustada pelo solo e pela declividade. A vazão (L/h) é esse volume dividido pelas horas de irrigação disponíveis por dia. É a conta padrão usada em dimensionamento de irrigação — o que muda com o tempo são os números de cada regra, e esses vocês ajustam direto no CSV.

---

## Passo 3.6 — Dimensionamento de Bomba e Tubulação para Poço

A página `dimensionamento-poco.html` funciona parecido com o simulador de irrigação: o cliente informa a vazão que precisa, a profundidade do poço, as distâncias até a caixa d'água e até o quadro de energia, e se a rede é monofásica ou trifásica. O site devolve na hora:

- Potência de bomba sugerida (numa das potências que realmente existem à venda, tipo 1/2 CV, 1 CV, 2 CV etc.)
- Diâmetro e quantidade de tubos e conexões (uniões, abraçadeiras)
- Bitola do cabo elétrico sugerida, considerando a distância
- Lista de itens periféricos necessários

**Duas regras fixas, sempre aplicadas:**
- Todo resultado sempre inclui **relé de nível (boia elétrica)** na lista de itens, não importa o poço.
- Sempre que a rede for **trifásica**, o resultado sempre inclui **quadro elétrico com relé de falta de fase** — esse item protege o motor da bomba contra queima quando falta uma das fases.

**Atenção especial aqui:** essa calculadora envolve parte elétrica, que é uma área sensível — bitola de cabo errada pode causar aquecimento e riscos. Os valores de bitola em `data/fios_bomba.csv` são **exemplos de referência** e precisam ser revisados por um eletricista, seguindo a norma NBR 5410, antes de a página ser usada por clientes de verdade. Por isso o resultado sempre vem com aviso reforçando que a instalação elétrica deve ser feita por um profissional qualificado.

### Como editar as regras dessa calculadora

Os arquivos ficam em `data/`:

1. **`data/rendimento_bomba.csv`** — rendimento estimado da bomba por faixa de vazão (usado na conta da potência).
2. **`data/faixas_vazao_poco.csv`** — diâmetro de tubulação de recalque sugerido por faixa de vazão.
3. **`data/potencias_comerciais.csv`** — lista das potências de bomba que existem à venda (CV). Se a loja trabalha com outras opções, edite essa lista.
4. **`data/fios_bomba.csv`** — bitola do cabo elétrico por tipo de rede (monofásica/trifásica), potência e distância. **Esse é o arquivo mais importante de revisar com um eletricista.**
5. **`data/itens_perifericos_poco.csv`** — itens que sempre entram na lista (`condicao = sempre`), que só entram se a rede for trifásica (`condicao = trifasico`) ou monofásica (`condicao = monofasico`). É aqui que ficam as regras do relé de nível e do relé de falta de fase — se quiser mudar o texto ou adicionar mais itens fixos, edite essa planilha.

Depois de editar, rode:
```
python3 scripts/gerar_regras_poco.py
```
Isso atualiza `js/regras_poco.js` sozinho. Suba os arquivos alterados de novo no GitHub (passo 2.3).

**Como o cálculo funciona por trás:** a Altura Manométrica Total (AMT) soma a altura de sucção com a de recalque e aplica uma margem simplificada de 10% pra perdas de carga, mais 5 metros de pressão residual. A potência em CV é `(vazão em m³/h × AMT) ÷ (270 × rendimento estimado)` — essa é a fórmula padrão de dimensionamento de bombas, e o resultado é arredondado pra cima pra potência comercial mais próxima. Isso é uma forma simplificada de estimar; um projeto técnico completo (com curva da bomba do fabricante) é sempre mais preciso.

---

## Passo 4 — Adicionar os manuais em PDF das máquinas

1. Coloque os arquivos PDF dentro da pasta `manuais/pdfs/`
2. Abra o arquivo `manuais.html` em um editor de texto e procure a lista `MANUAIS` perto do final do arquivo
3. Pra cada manual, ajuste ou adicione um bloco assim:
   ```js
   {
     titulo: "Nome que aparece pro cliente",
     descricao: "Uma frase curta explicando",
     arquivo: "nome-exato-do-arquivo.pdf"
   }
   ```
   O campo `arquivo` precisa ser **idêntico** ao nome do PDF que você colocou na pasta.
4. Salve e suba os arquivos de novo no GitHub

---

## Passo 5 — Trocar números de WhatsApp

Tudo isso fica em um único lugar: o arquivo `js/config.js`. Abra com um editor de texto e altere:

- `vendedores.lucas.whatsapp` e `vendedores.erica.whatsapp` — números dos vendedores
- `whatsappAdmin` — número que recebe o resumo dos pedidos

Sempre no formato: código do país (55) + DDD + número, tudo junto, sem espaço, sem traço, sem `+`. Exemplo: `5585986107362`.

---

## Perguntas frequentes

**O cliente precisa instalar algo?** Não, só precisa de um navegador (Chrome, Safari etc.) e ter o WhatsApp instalado no celular pra usar os botões de contato.

**O carrinho fica salvo se o cliente fechar a página?** Não — o carrinho é temporário (some quando fecha a aba), mas os dados do cadastro (nome e WhatsApp) ficam salvos, então na próxima visita ele não precisa cadastrar de novo.

**Dá pra ver o histórico de pedidos?** Cada pedido concluído fica também registrado no navegador do próprio cliente (não em um lugar central). O jeito confiável de acompanhar os pedidos é pelas mensagens que chegam no WhatsApp.

**Posso mudar as cores ou a fonte?** Sim, tudo fica no arquivo `css/style.css`, logo no início, nas linhas que começam com `--cor-`.

**Alguma dúvida técnica?** Qualquer editor de texto simples serve pra abrir e editar os arquivos `.html`, `.css`, `.js` e `.csv` — no Windows o Bloco de Notas, no Mac o TextEdit (salvando como texto simples).
