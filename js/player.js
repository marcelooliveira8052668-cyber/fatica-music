/* Player independente, sem frameworks. Só inicia áudio após interação do visitante. */
window.FATICA_PLAYER = function criarPlayer(musicas, avisar, aoSelecionar) {
  const $ = (id) => document.getElementById(id)
  const audio = $('audio')
  const botoes = { play: $('botao-play'), anterior: $('botao-anterior'), proximo: $('botao-proximo'), aleatorio: $('botao-aleatorio'), repetir: $('botao-repetir'), fila: $('botao-fila') }
  let indice = -1
  let aleatorio = false
  let repetir = false
  let aguardandoReproducao = false
  let historico = []
  const capaPadrao = 'assets/imagens/capa-placeholder.svg'
  const tempo = (segundos) => Number.isFinite(segundos) ? `${Math.floor(segundos / 60)}:${String(Math.floor(segundos % 60)).padStart(2, '0')}` : '0:00'

  function atualizarInterface() {
    const musica = musicas[indice]
    $('player-titulo').textContent = musica?.titulo || 'Escolha uma música'
    $('player-artista').textContent = musica?.credito && !/^Artista e créditos a confirmar/i.test(musica.credito) ? musica.credito : 'Fafa Silva - Music'
    $('player-capa').src = musica?.capa || capaPadrao
    $('player-capa').alt = musica?.capa ? `${musica.imagemProvisoria ? 'Imagem ilustrativa' : 'Capa'} de ${musica.titulo}` : 'Capa provisória'
    botoes.play.textContent = !audio.paused && musica ? '❚❚' : '▶'
    botoes.play.setAttribute('aria-label', !audio.paused && musica ? 'Pausar' : 'Reproduzir')
    botoes.play.title = botoes.play.getAttribute('aria-label')
    $('tempo-atual').textContent = tempo(audio.currentTime)
    $('tempo-total').textContent = tempo(audio.duration)
    $('progresso').value = Number.isFinite(audio.duration) && audio.duration > 0 ? Math.round(audio.currentTime / audio.duration * 1000) : 0
    document.querySelectorAll('[data-musica]').forEach((item) => {
      const atual = item.dataset.musica === musica?.id
      item.classList.toggle('tocando', atual && !audio.paused)
      if (item.matches('button[data-musica]')) {
        item.setAttribute('aria-label', `${atual && !audio.paused ? 'Pausar' : 'Reproduzir'} ${item.dataset.titulo || ''}`.trim())
        item.textContent = atual && !audio.paused ? '❚❚' : '▶'
      }
    })
    document.querySelectorAll('#fila-lista button').forEach((item) => item.setAttribute('aria-current', item.dataset.fila === musica?.id ? 'true' : 'false'))
  }

  function falhaReproducao(erro) {
    aguardandoReproducao = false
    if (erro?.name === 'AbortError') return
    avisar(erro?.name === 'NotAllowedError' ? 'Toque em reproduzir para iniciar o áudio neste dispositivo.' : 'Não foi possível tocar esta música. Tente novamente.')
    atualizarInterface()
  }

  function tocar() {
    if (indice < 0) indice = 0
    if (!musicas[indice]) return
    if (!audio.src) audio.src = musicas[indice].arquivo
    // Chamado diretamente do clique, sem fetch ou espera antes de play().
    aguardandoReproducao = true
    const tentativa = audio.play()
    if (tentativa?.catch) tentativa.catch(falhaReproducao)
    atualizarInterface()
  }

  function selecionar(posicao, iniciar = false, registrar = true) {
    if (posicao < 0 || posicao >= musicas.length) return
    if (indice === posicao && iniciar) {
      if (audio.paused) tocar(); else audio.pause()
      return
    }
    if (indice >= 0 && registrar) historico.push(indice)
    indice = posicao
    aguardandoReproducao = false
    audio.pause()
    audio.src = musicas[indice].arquivo
    audio.load()
    $('progresso').value = 0
    $('tempo-atual').textContent = '0:00'
    $('tempo-total').textContent = '0:00'
    aoSelecionar(musicas[indice])
    atualizarInterface()
    if (iniciar) tocar()
  }

  function proxima(aoTerminar = false) {
    if (!musicas.length) return
    if (indice < 0) return selecionar(0, true)
    if (aoTerminar && repetir) return selecionarMesma()
    let destino = indice + 1
    if (aleatorio && musicas.length > 1) {
      do { destino = Math.floor(Math.random() * musicas.length) } while (destino === indice)
    } else if (destino >= musicas.length) {
      if (aoTerminar) { atualizarInterface(); return }
      destino = 0
    }
    selecionar(destino, true)
  }

  function selecionarMesma() { audio.currentTime = 0; tocar() }
  function anterior() {
    if (indice < 0) return
    if (audio.currentTime > 3) return selecionarMesma()
    const destino = historico.length ? historico.pop() : (indice - 1 + musicas.length) % musicas.length
    selecionar(destino, true, false)
  }

  botoes.play.addEventListener('click', () => { if (audio.paused) tocar(); else audio.pause() })
  botoes.proximo.addEventListener('click', () => proxima())
  botoes.anterior.addEventListener('click', anterior)
  botoes.aleatorio.addEventListener('click', () => { aleatorio = !aleatorio; botoes.aleatorio.setAttribute('aria-pressed', String(aleatorio)); botoes.aleatorio.setAttribute('aria-label', aleatorio ? 'Desativar modo aleatório' : 'Ativar modo aleatório') })
  botoes.repetir.addEventListener('click', () => { repetir = !repetir; botoes.repetir.setAttribute('aria-pressed', String(repetir)); botoes.repetir.setAttribute('aria-label', repetir ? 'Desativar repetição da música' : 'Ativar repetição da música') })
  $('progresso').addEventListener('input', (evento) => { if (Number.isFinite(audio.duration) && audio.duration > 0) audio.currentTime = Number(evento.target.value) / 1000 * audio.duration })
  $('volume').addEventListener('input', (evento) => { audio.volume = Number(evento.target.value) / 100 })
  audio.volume = Number($('volume').value) / 100
  audio.addEventListener('timeupdate', atualizarInterface)
  audio.addEventListener('durationchange', atualizarInterface)
  audio.addEventListener('play', () => { aguardandoReproducao = false; atualizarInterface() })
  audio.addEventListener('pause', atualizarInterface)
  audio.addEventListener('ended', () => proxima(true))
  audio.addEventListener('error', () => { if (indice >= 0 && !aguardandoReproducao) avisar('Esta música não está disponível agora. Tente novamente mais tarde.'); atualizarInterface() })

  const fila = $('fila-musicas')
  function alternarFila(forcar) { fila.hidden = typeof forcar === 'boolean' ? !forcar : !fila.hidden; botoes.fila.setAttribute('aria-expanded', String(!fila.hidden)) }
  botoes.fila.addEventListener('click', () => alternarFila())
  $('fechar-fila').addEventListener('click', () => alternarFila(false))
  document.addEventListener('keydown', (evento) => { if (evento.key === 'Escape' && !fila.hidden) alternarFila(false) })
  const lista = $('fila-lista')
  musicas.forEach((musica, posicao) => {
    const item = document.createElement('li')
    const botao = document.createElement('button')
    botao.type = 'button'; botao.dataset.fila = musica.id
    botao.textContent = `${String(posicao + 1).padStart(2, '0')}  ${musica.titulo}`
    botao.addEventListener('click', () => { selecionar(posicao, true); alternarFila(false) })
    item.append(botao); lista.append(item)
  })
  atualizarInterface()
  return { selecionar, atual: () => musicas[indice] || null, estaTocando: () => !audio.paused }
}
