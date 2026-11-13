# Fatica Music — site estático

Site independente feito apenas com HTML5, CSS3 e JavaScript puro. Não usa React, npm, banco de dados, login nem serviço de pagamentos. Os áudios em `assets/audio/` são cópias de trabalho; os originais `.mpeg` da pasta acima permanecem intactos. Publicado no [GitHub Pages da Fatica Music](https://marcelooliveira8052668-cyber.github.io/fatica-music/), em repositório próprio e separado de outros sites.

O botão **Dia/Noite** alterna entre a paleta violeta noturna (texto branco) e uma versão clara com texto escuro legível. A escolha é salva no navegador quando o armazenamento local estiver disponível.

Os sete cards de músicas exibem **sete imagens diferentes** em vez da letra F. A faixa Sete Estrelas usa uma arte ilustrativa desenhada para o site; as capas oficiais e as correspondências definitivas ainda precisam ser confirmadas pela artista. Os arquivos originais não foram alterados.

A galeria apresenta um carrossel de imagens distintas em `assets/imagens/`: troca automática contínua a cada **3,5 s no computador** e **2,5 s no celular**, setas, indicadores, gesto de deslizar e botão para pausar. Toque na imagem para ampliar; na ampliação, use setas ou Escape. O avanço automático para com a foto ampliada, a aba em segundo plano ou quando o visitante pausa; se o sistema pedir menos movimento, inicia pausado. As imagens são cópias das originais; a captura do player e artes que reutilizam o mesmo retrato ficaram de fora. Um retrato foi recortado **da cópia** de uma captura de tela para retirar a interface. A arte promocional aparece apenas como imagem da galeria, não como capa de música sem confirmação.

## Abrir

Abra `index.html` no navegador (duplo clique). Os scripts são clássicos, sem módulos e sem `fetch`, para permitir a abertura também por `file://`. Para simular melhor uma hospedagem web, opcionalmente rode `python -m http.server 8000` nesta pasta e acesse `http://localhost:8000` (não é necessário instalar dependências). Alguns navegadores restringem áudio, área de transferência ou histórico em `file://`: para testar links e compartilhamento de forma representativa, use um servidor local.

## Atualizar o conteúdo

Edite **somente** `js/musicas.js`: `artista` contém apresentação, biografia, links HTTPS oficiais, número de WhatsApp com código do país e DDD (apenas dígitos), e os dados opcionais de Pix. `musicas` contém títulos, créditos, capa, texto autorizado da letra e caminho do áudio. Não preencha dados pessoais/financeiros sem aprovação. Para fotos, use `fotos: [{ src: 'assets/imagens/foto.jpg', alt: 'Descrição da foto' }]`; para vídeos públicos do YouTube use `videos: [{ titulo: 'Vídeo oficial', youtubeId: 'ID_DO_VIDEO' }]`. Ponha as imagens aprovadas em `assets/imagens/`.

Os créditos das sete faixas ainda precisam de confirmação, assim como alguns títulos, especialmente a **Faixa 06 — título a confirmar** (arquivo original `WhatsApp Audio 2026-11-13 at 14.50.24.mpeg`). O título **Sete Estrelas** foi informado pela família para o arquivo `WhatsApp Audio 2026-11-13 at 17.50.10.mpeg`. `capa-placeholder.svg` e `arte-provisoria-sete-estrelas.svg` **não são capas oficiais**. Letras, biografia, capas oficiais, vídeos, datas de lançamento, Instagram, YouTube, WhatsApp, e-mail e Pix estão pendentes. Com Pix vazio, o botão fica desativado. Sem WhatsApp oficial, o formulário não envia dados; há opção de copiar a mensagem. O botão de licenciamento usa o WhatsApp oficial ou e-mail quando houver, sem conceder licenças.

## Arquivos

```
index.html              Estrutura e metadados gerais
css/style.css           Layout responsivo e identidade visual
js/musicas.js           Dados editáveis do catálogo e da artista
js/player.js            Reprodução HTML5 e fila
js/app.js               Cards, formulários, galeria e compartilhamento
assets/audio/           Sete MP3 copiados/remuxados dos arquivos originais
assets/imagens/         Arte provisória; colocar aqui fotos e capas autorizadas
```

## Links e publicação

Cada faixa recebe um link `?musica=ID`, que seleciona a música sem iniciar automaticamente. Botões do WhatsApp enviam o **link**, não o áudio. Use IDs estáveis depois de divulgar links. `og:image` e `og:url` são URLs HTTPS absolutas da página geral; bots não executam JavaScript e, sem páginas HTML separadas por faixa, não exibem títulos individuais nas prévias. Links `file://` só funcionam no seu computador; para compartilhamento real, use o endereço HTTPS publicado.

O site é hospedável como arquivos estáticos no GitHub Pages, com limites de armazenamento e tráfego. O responsável confirmou autorização para publicar as gravações e imagens desta versão; **antes de adicionar novos arquivos, verifique os direitos e a autorização de cada áudio, letra, foto e capa**. Confirme identidade e créditos e não misture o projeto com outros repositórios. Não envie gravações demonstrativas de terceiros nem dados financeiros não autorizados. GitHub Pages não é serviço de streaming ilimitado e tem regras para sites comerciais.

## Teste manual recomendado

Depois de abrir num servidor local, verificar cada uma das sete faixas, próxima/anterior, repetição, aleatório, progresso, fila clicável, links `?musica=...`, WhatsApp, cópia de link, formulário, retrato/áudio, zoom de 320 px e dispositivos reais iPhone e Android. Em iOS, o controle de volume de `<audio>` pode depender dos botões físicos; o controle visual continua disponível, mas o sistema pode ignorar `audio.volume`. Não há autoplay sem interação do visitante.
