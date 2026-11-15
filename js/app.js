/* Montagem da página e conteúdo. Edite os dados somente em js/musicas.js. */
(() => {
  'use strict'
  const dados = window.FATICA_DADOS
  const musicas = dados.musicas
  const artista = dados.artista
  const $ = (id) => document.getElementById(id)
  const capaPadrao = 'assets/imagens/capa-placeholder.svg'
  const elemento = (tag, classe, texto) => {
    const no = document.createElement(tag)
    if (classe) no.className = classe
    if (texto !== undefined) no.textContent = texto
    return no
  }
  const seguraHttps = (url) => { try { const u = new URL(url); return u.protocol === 'https:' ? u.href : '' } catch { return '' } }
  const telefone = /^\d{10,15}$/.test(artista.whatsapp || '') ? artista.whatsapp : ''
  let avisoTempo

  function avisar(mensagem) {
    const aviso = $('aviso')
    aviso.textContent = mensagem
    aviso.classList.add('visivel')
    clearTimeout(avisoTempo)
    avisoTempo = setTimeout(() => aviso.classList.remove('visivel'), 4800)
  }

  function enderecoMusica(musica) {
    const url = new URL(window.location.href)
    url.hash = ''
    url.searchParams.set('musica', musica.id)
    return url.href
  }

  async function copiar(texto) {
    try {
      if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(texto); return true }
    } catch { /* file:// pode bloquear a API; tentar método local abaixo. */ }
    const campo = elemento('textarea')
    campo.value = texto
    campo.style.cssText = 'position:fixed;left:-9999px;top:0'
    document.body.append(campo); campo.select()
    let ok = false
    try { ok = document.execCommand('copy') } catch { /* O visitante poderá copiar manualmente. */ }
    campo.remove()
    return ok
  }

  function linkWhatsapp(texto, numero = '') {
    return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
  }

  function selecionarNaUrl(musica) {
    try { history.replaceState(null, '', enderecoMusica(musica)) } catch { /* Alguns navegadores limitam history em file://. */ }
    document.title = `${musica.titulo} — Fafa Silva - Music`
  }

  const player = window.FATICA_PLAYER(musicas, avisar, selecionarNaUrl)

  function criarCard(musica, indice) {
    const card = elemento('article', 'musica-card')
    card.id = `faixa-${musica.id}`
    const capa = elemento('div', 'card-capa')
    capa.style.setProperty('--indice', String(indice))
    const imagem = elemento('img')
    imagem.src = musica.capa || capaPadrao
    imagem.alt = musica.capa ? `${musica.imagemProvisoria ? 'Imagem ilustrativa' : 'Capa'} de ${musica.titulo}` : 'Arte provisória: capa oficial pendente'
    imagem.loading = 'lazy'
    imagem.addEventListener('error', () => { imagem.src = capaPadrao })
    const play = elemento('button', 'card-play', '▶')
    play.type = 'button'; play.dataset.musica = musica.id; play.dataset.titulo = musica.titulo
    play.setAttribute('aria-label', `Reproduzir ${musica.titulo}`)
    play.addEventListener('click', () => player.selecionar(indice, true))
    capa.append(imagem, play)
    const corpo = elemento('div', 'card-corpo')
    corpo.append(elemento('span', 'card-numero', `FAIXA ${String(indice + 1).padStart(2, '0')}`))
    corpo.append(elemento('h3', null, musica.titulo))
    corpo.append(elemento('p', 'card-credito', musica.credito))
    if (musica.tituloPendente) corpo.append(elemento('span', 'card-pendente', 'Título/créditos a confirmar'))
    if (musica.nota) corpo.append(elemento('p', 'card-nota', musica.nota))
    const acoes = elemento('div', 'card-acoes')
    const compartilhar = elemento('a', 'acao-link', 'WhatsApp ↗')
    compartilhar.href = linkWhatsapp(`Ouça "${musica.titulo}" na Fafa Silva - Music: ${enderecoMusica(musica)}`)
    compartilhar.target = '_blank'; compartilhar.rel = 'noopener noreferrer'
    compartilhar.setAttribute('aria-label', `Compartilhar ${musica.titulo} pelo WhatsApp`)
    const botaoCopiar = elemento('button', 'acao-link', 'Copiar link')
    botaoCopiar.type = 'button'
    botaoCopiar.setAttribute('aria-label', `Copiar link de ${musica.titulo}`)
    botaoCopiar.addEventListener('click', async () => avisar(await copiar(enderecoMusica(musica)) ? 'Link da música copiado.' : 'Não foi possível copiar automaticamente; copie o endereço na barra do navegador.'))
    acoes.append(compartilhar, botaoCopiar)
    corpo.append(acoes); card.append(capa, corpo)
    return card
  }

  $('contador-musicas').textContent = `${String(musicas.length).padStart(2, '0')} faixas`
  musicas.forEach((musica, indice) => $('grade-musicas').append(criarCard(musica, indice)))

  musicas.forEach((musica) => {
    const caixa = elemento('details', 'letra-item')
    const resumo = elemento('summary', null, musica.titulo)
    const conteudo = elemento('div', 'letra-conteudo')
    if (musica.letra?.trim()) conteudo.append(elemento('p', 'letra-texto', musica.letra))
    else conteudo.append(elemento('p', null, 'Letra não publicada: aguardando autorização e texto oficial da compositora.'))
    caixa.append(resumo, conteudo); $('lista-letras').append(caixa)
  })

  $('hero-apresentacao').textContent = artista.apresentacao || $('hero-apresentacao').textContent
  if (artista.biografia?.trim()) {
    $('texto-biografia').textContent = artista.biografia
    document.querySelector('.selo-pendente').hidden = true
  }
  $('ano').textContent = new Date().getFullYear()

  // Nunca mostrar Pix nem QR Code sem os dados oficiais completos.
  if (artista.pix?.trim()) {
    $('pix-aviso').textContent = 'Contribuição voluntária. Antes de confirmar, confira o recebedor no aplicativo do seu banco.'
    $('pix-chave').textContent = artista.pix
    $('pix-copiar').disabled = false
    $('pix-copiar').addEventListener('click', async () => avisar(await copiar(artista.pix) ? 'Chave Pix copiada. Confira o recebedor no seu banco.' : 'Não foi possível copiar. Selecione a chave exibida e copie manualmente.'))
    $('pix-contribuir').disabled = false
    $('pix-contribuir').addEventListener('click', async () => avisar(await copiar(artista.pix) ? 'Chave Pix copiada. Abra seu banco e confira o recebedor antes de contribuir.' : 'Selecione a chave Pix exibida e copie manualmente para o aplicativo do seu banco.'))
    // O QR Code é uma imagem fornecida pela artista; o site não gera cobrança.
    if (/^(assets\/imagens\/[\w./-]+|https:\/\/[^\s]+)$/i.test(artista.qrCode || '')) {
      const img = elemento('img'); img.src = artista.qrCode; img.alt = 'QR Code Pix fornecido pela artista'
      img.addEventListener('error', () => { img.remove(); avisar('Imagem do QR Code indisponível.') })
      $('qr-container').replaceChildren(img)
    }
  }

  // Canais vazios não se transformam em links fictícios.
  const links = $('contato-links')
  let canais = 0
  function adicionarCanal(nome, endereco) {
    if (!endereco) return
    if (canais++ === 0) links.replaceChildren()
    const a = elemento('a', 'contato-link', `${nome} ↗`)
    a.href = endereco; a.target = '_blank'; a.rel = 'noopener noreferrer'
    links.append(a)
  }
  adicionarCanal('Instagram', seguraHttps(artista.instagram))
  adicionarCanal('YouTube', seguraHttps(artista.youtube))
  if (telefone) adicionarCanal('WhatsApp', linkWhatsapp('Olá! Conheci suas composições pelo site Fafa Silva - Music.', telefone))
  const emailValido = artista.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(artista.email)
  if (emailValido) adicionarCanal('E-mail', `mailto:${encodeURIComponent(artista.email).replace('%40', '@')}`)
  if (telefone) {
    $('form-aviso').textContent = 'Ao enviar, o WhatsApp abrirá com a mensagem pronta. Você deverá confirmar o envio no aplicativo.'
    $('link-licenciamento').href = linkWhatsapp('Olá! Gostaria de consultar a possibilidade de utilizar uma composição e negociar uma licença.', telefone)
    $('link-licenciamento').target = '_blank'; $('link-licenciamento').rel = 'noopener noreferrer'
  } else if (emailValido) {
    $('link-licenciamento').href = `mailto:${artista.email}?subject=${encodeURIComponent('Consulta sobre licenciamento musical')}`
  }

  const galeria = $('galeria-trilho')
  const fotosUnicas = []
  const fontesFotos = new Set()
  ;(artista.fotos || []).forEach((foto) => {
    if (!/^(assets\/imagens\/[\w./-]+|https:\/\/[^\s]+)$/i.test(foto.src || '') || !foto.alt) return
    const fonte = new URL(foto.src, window.location.href).href
    if (fontesFotos.has(fonte)) return // Nunca apresentar a mesma foto duas vezes.
    fontesFotos.add(fonte)
    fotosUnicas.push(foto)
  })

  const dialogoFoto = $('foto-dialogo')
  let fotoAtual = 0
  let slideAtual = 0
  const slides = []
  const pontos = []
  const carrossel = $('galeria-carrossel')
  const movimentoReduzido = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false
  let pausado = movimentoReduzido
  let voltandoAoInicio = false

  function atualizarIndicadores() {
    slides.forEach((slide, posicao) => {
      const visivel = posicao === slideAtual
      slide.setAttribute('aria-hidden', String(!visivel))
      slide.querySelector('button').tabIndex = visivel ? 0 : -1
      pontos[posicao].setAttribute('aria-current', visivel ? 'true' : 'false')
    })
  }

  function concluirVolta() {
    if (!voltandoAoInicio) return
    voltandoAoInicio = false
    galeria.style.transition = 'none'
    galeria.style.transform = 'translate3d(0, 0, 0)'
    void galeria.offsetWidth // Reposicionar sem animar de volta pelas fotos anteriores.
    galeria.style.transition = ''
  }

  function mostrarSlide(indice, anunciar = true) {
    if (!fotosUnicas.length) return
    concluirVolta()
    slideAtual = (indice + fotosUnicas.length) % fotosUnicas.length
    galeria.style.transform = `translate3d(-${slideAtual * 100}%, 0, 0)`
    atualizarIndicadores()
    if (anunciar) $('galeria-status').textContent = `Foto ${slideAtual + 1} de ${fotosUnicas.length}: ${fotosUnicas[slideAtual].legenda || fotosUnicas[slideAtual].alt}`
  }

  function abrirFoto(indice) {
    if (!fotosUnicas.length) return
    fotoAtual = (indice + fotosUnicas.length) % fotosUnicas.length
    mostrarSlide(fotoAtual, false)
    const foto = fotosUnicas[fotoAtual]
    $('foto-ampliada').src = foto.src
    $('foto-ampliada').alt = foto.alt
    $('foto-legenda').textContent = `${foto.legenda || foto.alt} · ${fotoAtual + 1} de ${fotosUnicas.length}`
    if (!dialogoFoto.open) dialogoFoto.showModal()
  }
  fotosUnicas.forEach((foto, indice) => {
    const slide = elemento('div', 'galeria-slide')
    slide.setAttribute('role', 'group')
    slide.setAttribute('aria-roledescription', 'foto')
    slide.setAttribute('aria-label', `Foto ${indice + 1} de ${fotosUnicas.length}`)
    const botao = elemento('button', 'galeria-foto')
    botao.type = 'button'
    botao.setAttribute('aria-label', `Ampliar foto ${indice + 1}: ${foto.alt}`)
    const img = elemento('img', 'foto-oficial')
    img.src = foto.src; img.alt = foto.alt; img.loading = 'lazy'
    img.addEventListener('error', () => { botao.hidden = true; avisar('Uma foto da galeria não pôde ser carregada.') })
    const legenda = elemento('span', 'galeria-legenda', foto.legenda || foto.alt)
    botao.append(img, legenda)
    botao.addEventListener('click', () => abrirFoto(indice))
    slide.append(botao)
    galeria.append(slide)
    slides.push(slide)
    const ponto = elemento('button', 'galeria-ponto')
    ponto.type = 'button'
    ponto.setAttribute('aria-label', `Mostrar foto ${indice + 1} de ${fotosUnicas.length}`)
    ponto.addEventListener('click', () => mostrarSlide(indice))
    $('galeria-pontos').append(ponto)
    pontos.push(ponto)
  })
  if (fotosUnicas.length > 1) {
    // Cópia visual temporária do primeiro slide: evita o salto para trás no fim.
    const copia = slides[0].cloneNode(true)
    copia.setAttribute('aria-hidden', 'true')
    copia.inert = true
    copia.classList.add('galeria-slide-copia')
    copia.querySelector('button').tabIndex = -1
    copia.querySelector('img').alt = ''
    galeria.append(copia)
    galeria.addEventListener('transitionend', (evento) => {
      if (evento.target === galeria && evento.propertyName === 'transform') concluirVolta()
    })
  }
  if (fotosUnicas.length) mostrarSlide(0, false)
  else carrossel.hidden = true
  $('carrossel-anterior').addEventListener('click', () => mostrarSlide(slideAtual - 1))
  $('carrossel-proxima').addEventListener('click', () => mostrarSlide(slideAtual + 1))
  const botaoPausar = $('carrossel-pausar')
  function atualizarPausa() {
    botaoPausar.textContent = pausado ? 'Reproduzir' : 'Pausar'
    botaoPausar.setAttribute('aria-label', pausado ? 'Retomar carrossel' : 'Pausar carrossel')
    botaoPausar.setAttribute('aria-pressed', String(pausado))
  }
  atualizarPausa()
  botaoPausar.addEventListener('click', () => { pausado = !pausado; atualizarPausa() })
  if (fotosUnicas.length > 1) {
    function avancarAutomaticamente() {
      if (!pausado && !document.hidden && !dialogoFoto.open) {
        if (slideAtual === fotosUnicas.length - 1 && !movimentoReduzido) {
          voltandoAoInicio = true
          slideAtual = 0
          galeria.style.transform = `translate3d(-${fotosUnicas.length * 100}%, 0, 0)`
          atualizarIndicadores()
        } else mostrarSlide(slideAtual + 1, false)
      }
      // Ajustar o intervalo à largura atual; funciona também após girar o celular.
      window.setTimeout(avancarAutomaticamente, window.matchMedia('(max-width: 700px)').matches ? 2500 : 3500)
    }
    window.setTimeout(avancarAutomaticamente, window.matchMedia('(max-width: 700px)').matches ? 2500 : 3500)
    let inicioToque = null
    $('galeria-oficial').addEventListener('touchstart', (evento) => { inicioToque = evento.changedTouches[0].clientX }, { passive: true })
    $('galeria-oficial').addEventListener('touchend', (evento) => {
      if (inicioToque === null) return
      const deslocamento = evento.changedTouches[0].clientX - inicioToque
      inicioToque = null
      if (Math.abs(deslocamento) > 45) mostrarSlide(slideAtual + (deslocamento < 0 ? 1 : -1))
    }, { passive: true })
  }
  $('foto-fechar').addEventListener('click', () => dialogoFoto.close())
  $('foto-anterior').addEventListener('click', () => abrirFoto(fotoAtual - 1))
  $('foto-proxima').addEventListener('click', () => abrirFoto(fotoAtual + 1))
  dialogoFoto.addEventListener('keydown', (evento) => {
    if (evento.key === 'ArrowLeft') { evento.preventDefault(); abrirFoto(fotoAtual - 1) }
    if (evento.key === 'ArrowRight') { evento.preventDefault(); abrirFoto(fotoAtual + 1) }
  })

  ;(artista.videos || []).forEach((video) => {
    if (!/^[\w-]{11}$/.test(video.youtubeId || '')) return
    const a = elemento('a', 'video-oficial', `${video.titulo || 'Vídeo oficial'} ↗`)
    a.href = `https://www.youtube.com/watch?v=${video.youtubeId}`; a.target = '_blank'; a.rel = 'noopener noreferrer'; $('galeria-videos').append(a)
  })

  function mensagemPedido() {
    const form = $('form-encomenda')
    return `Olá! Gostaria de conversar sobre uma composição personalizada.\n\nNome: ${form.elements.namedItem('nome').value.trim()}\nOcasião: ${form.elements.namedItem('ocasiao').value}\nEstilo desejado: ${form.elements.namedItem('estilo').value.trim()}\nDescrição: ${form.elements.namedItem('descricao').value.trim()}\n\nGostaria de saber sobre disponibilidade, prazo e valores.`
  }
  $('form-encomenda').addEventListener('submit', (evento) => {
    evento.preventDefault()
    if (!evento.currentTarget.reportValidity()) return
    if (!telefone) { avisar('WhatsApp oficial ainda não cadastrado. Use “Copiar mensagem do pedido” e envie pelo contato oficial quando disponível.'); return }
    const destino = linkWhatsapp(mensagemPedido(), telefone)
    const janela = window.open(destino, '_blank', 'noopener,noreferrer')
    if (!janela) { avisar('O navegador bloqueou a nova aba. Use o botão de copiar e envie pelo WhatsApp.'); }
  })
  $('copiar-pedido').addEventListener('click', async () => {
    if (!$('form-encomenda').reportValidity()) return
    avisar(await copiar(mensagemPedido()) ? 'Mensagem do pedido copiada.' : 'Não foi possível copiar a mensagem neste navegador.')
  })

  const menu = $('menu')
  const menuBotao = $('menu-botao')
  const temaBotao = $('tema-botao')
  function atualizarBotaoTema() {
    const dia = document.documentElement.dataset.theme === 'dia'
    $('tema-icone').textContent = dia ? '☾' : '☀'
    $('tema-texto').textContent = dia ? 'Noite' : 'Dia'
    temaBotao.setAttribute('aria-label', dia ? 'Ativar modo noite' : 'Ativar modo dia')
    temaBotao.title = temaBotao.getAttribute('aria-label')
    document.querySelector('meta[name="theme-color"]').content = dia ? '#f5f0ff' : '#16083e'
  }
  atualizarBotaoTema()
  temaBotao.addEventListener('click', () => {
    document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dia' ? 'noite' : 'dia'
    try { localStorage.setItem('fatica:tema', document.documentElement.dataset.theme) } catch { /* Preferência apenas nesta visita. */ }
    atualizarBotaoTema()
  })
  menuBotao.addEventListener('click', () => { const aberto = menu.classList.toggle('aberto'); menuBotao.setAttribute('aria-expanded', String(aberto)); menuBotao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu') })
  menu.addEventListener('click', (evento) => { if (evento.target.closest('a')) { menu.classList.remove('aberto'); menuBotao.setAttribute('aria-expanded', 'false'); menuBotao.setAttribute('aria-label', 'Abrir menu') } })

  const idInicial = new URLSearchParams(window.location.search).get('musica')
  if (idInicial) {
    const indice = musicas.findIndex((musica) => musica.id === idInicial)
    if (indice >= 0) { player.selecionar(indice); $('faixa-' + idInicial)?.scrollIntoView({ block: 'center' }) }
    else avisar('Faixa não encontrada. Escolha uma música do catálogo.')
  }
})()
