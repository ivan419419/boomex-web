# Rascunho — Data safety do BOOMEX v0.3

**Status:** material de preparação; nada foi preenchido ou enviado à Play Console. A declaração final é responsabilidade do proprietário e deve corresponder exatamente ao AAB enviado.

## Base técnica revisada

- O jogo salva pontuação recorde, progresso, número de partidas e campanha em `localStorage` no próprio aparelho. O código não envia esses dados para um servidor.
- Não há conta, login, publicidade, compras no app, analytics ou SDK de anúncios no pacote Android revisado.
- O build Android remove o script remoto do SDK Telegram e carrega HTML, JavaScript e sprites localmente.
- O Manifesto declara `INTERNET`, necessária ao WebView/link externo, mas a permissão sozinha não demonstra coleta de dados. O jogo não depende de rede para jogar.
- A página inclui um link opcional para TikTok. Ao tocá-lo, o serviço externo poderá tratar dados da conexão de acordo com suas próprias regras; não há SDK TikTok dentro do app.
- Dependências Android identificadas: Capacitor 8.6.2, AndroidX e componentes padrão de plataforma; não foi identificada biblioteca de ads/analytics na configuração revisada.

## Respostas preliminares para o formulário

| Pergunta/declaração | Rascunho baseado no código | Confirmação necessária |
|---|---|---|
| O app coleta tipos de dados de usuário listados pelo Google? | **Provavelmente não**: os dados de progresso ficam no dispositivo e não são transmitidos pelo app. | Conferir o AAB final e SDKs transitivos; revisar o tratamento do link externo dentro do WebView. |
| O app compartilha dados de usuário com terceiros? | **Nenhum compartilhamento pelo código do jogo foi identificado.** | Confirmar como o sistema abre o link TikTok e responder conforme as definições atuais do formulário. |
| Dados em trânsito criptografados? | Se a resposta de coleta/compartilhamento for “não”, a pergunta condicional pode não se aplicar. | Não marcar “sim” sem mapear qualquer tráfego incluído no pacote. |
| Há forma de excluir dados? | O progresso local pode ser removido limpando dados do app ou desinstalando; não há dados de conta em servidor. | Descrever no campo correspondente somente se o formulário pedir para dados coletados. |
| O app contém anúncios? | **Não**, conforme código/configuração revisados. | Revalidar se qualquer SDK ou conteúdo de anúncio for acrescentado. |
| Política pública de privacidade | `https://boomex-web.vercel.app/privacy-policy.html` | Testar a URL na Play Console e manter a página acessível sem login. |

## Antes de enviar

1. Revisar a lista final de dependências dentro do AAB e as políticas dos SDKs incluídos.
2. Confirmar no dispositivo se o link do TikTok abre fora do app ou em WebView; atualizar a avaliação de dados se o comportamento mudar.
3. Preencher o formulário no Play Console com base no artefato efetivamente enviado. O Google exige formulário também para apps em testes fechados/abertos; apps exclusivamente em teste interno são a exceção indicada na ajuda oficial.
4. Não tratar este rascunho como declaração oficial: somente o proprietário conhece todo o tratamento de dados e deve confirmar cada resposta.

Fontes oficiais: [Data safety](https://support.google.com/googleplay/android-developer/answer/10787469?hl=pt-BR) · [Política de dados do usuário](https://support.google.com/googleplay/android-developer/answer/10144311?hl=pt-BR) · [Política de privacidade](https://support.google.com/googleplay/android-developer/answer/9859455?hl=pt-BR).
