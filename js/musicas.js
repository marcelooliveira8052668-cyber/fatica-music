/* Conteúdo editável localmente. Não inserir dados pessoais sem autorização. */
window.FATICA_DADOS = {
  artista: {
    nome: 'Fafa Silva - Music', // Nome de exibição solicitado pela família; confirmar com a artista.
    apresentacao: 'Conheça as composições, descubra novos sons e acompanhe os próximos passos da artista.',
    biografia: '', // Preencher apenas com texto aprovado pela artista.
    instagram: '', // Ex.: https://www.instagram.com/perfil-oficial/
    youtube: '', // Ex.: https://www.youtube.com/@canal-oficial
    whatsapp: '', // Somente dígitos: código do país + DDD + telefone. Exemplo NÃO cadastrado aqui.
    email: '', // Opcional: endereço autorizado para contato e licenciamento.
    pix: '', // Não preencher sem autorização expressa.
    qrCode: '', // Caminho de imagem de QR Code oficial, se autorizado.
    // Retratos distintos na galeria; alguns também ilustram cards, sem vínculo oficial confirmado.
    fotos: [
      { src: 'assets/imagens/retrato-artista.jpeg', alt: 'Retrato da artista sorrindo, com blusa lilás', legenda: 'Retrato da artista' },
      { src: 'assets/imagens/retrato-chapeu.jpeg', alt: 'Retrato da artista com chapéu em cenário sertanejo', legenda: 'Em clima sertanejo' },
      { src: 'assets/imagens/retrato-por-do-sol.jpeg', alt: 'Retrato da artista ao pôr do sol, ao lado de um violão', legenda: 'Ao pôr do sol' },
      { src: 'assets/imagens/retrato-lilas-chapeu.jpeg', alt: 'Retrato da artista de chapéu e blusa lilás', legenda: 'Retrato de chapéu e blusa lilás' },
      { src: 'assets/imagens/arte-coracao-aviao.jpeg', alt: 'Arte promocional com retrato da artista de chapéu e óculos', legenda: 'Arte promocional' }
    ],
    videos: [] // Ex.: [{ titulo: 'Videoclipe oficial', youtubeId: 'ID_PUBLICO_DO_VIDEO' }]
  },
  // Imagens ilustrativas, NÃO capas oficiais confirmadas. Validar correspondência e créditos.
  musicas: [
    { id: 'coracao-no-volante', titulo: 'Coração no Volante', credito: 'Artista e créditos a confirmar', arquivo: 'assets/audio/coracao-no-volante.mp3', capa: 'assets/imagens/retrato-artista.jpeg', imagemProvisoria: true, letra: '', tituloPendente: true, nota: 'Nome do arquivo; metadados dizem “sertanejo 1”. Confirmar título oficial e autoria.' },
    { id: 'so-o-teu-amor-importa-depois', titulo: 'Só o teu amor importa', credito: 'Artista e créditos a confirmar', arquivo: 'assets/audio/so-o-teu-amor-importa-depois.mp3', capa: 'assets/imagens/arte-so-teu-amor.jpeg', imagemProvisoria: true, letra: '', tituloPendente: false, nota: 'Título corrigido pela família; confirmar créditos e se a arte “Só teu amor me importa” corresponde à gravação.' },
    { id: 'amor-escondido', titulo: 'Amor Escondido', credito: 'Artista e créditos a confirmar', arquivo: 'assets/audio/amor-escondido.mp3', capa: 'assets/imagens/retrato-lilas-chapeu.jpeg', imagemProvisoria: true, letra: '', tituloPendente: true, nota: 'Título dos metadados; confirmar créditos. Retrato extraído de uma imagem com o mesmo título.' },
    { id: 'faixa-sem-titulo', titulo: 'Faixa sem título confirmado', credito: 'Artista e créditos a confirmar', arquivo: 'assets/audio/faixa-sem-titulo.mp3', capa: 'assets/imagens/retrato-chapeu.jpeg', imagemProvisoria: true, letra: '', tituloPendente: true, nota: 'Arquivo das 14.58.01: sem metadados. Foto ilustrativa, título a confirmar.' },
    { id: 'apenas-army', titulo: 'Apenas Army', credito: 'Artista e créditos a confirmar', arquivo: 'assets/audio/apenas-army.mp3', capa: 'assets/imagens/retrato-por-do-sol.jpeg', imagemProvisoria: true, letra: '', tituloPendente: true, nota: 'Título dos metadados; confirmar grafia, autoria e créditos. Foto ilustrativa.' },
    { id: 'faixa-06-sem-titulo', titulo: 'Faixa 06 — título a confirmar', credito: 'Artista e créditos a confirmar', arquivo: 'assets/audio/faixa-06-sem-titulo.mp3', capa: 'assets/imagens/retrato-faixa-06.jpeg', imagemProvisoria: true, letra: '', tituloPendente: true, nota: 'Gravação das 14.50.24 sem metadados. Foto ilustrativa; identificar título e autoria posteriormente.' },
    { id: 'sete-estrelas', titulo: 'Sete Estrelas', credito: 'Artista e créditos a confirmar', arquivo: 'assets/audio/sete-estrelas.mp3', capa: 'assets/imagens/arte-provisoria-sete-estrelas.svg', imagemProvisoria: true, letra: '', tituloPendente: false, nota: 'Nome informado pela família para o arquivo das 17.50.10. Confirmar créditos e capa oficial.' }
  ]
}
