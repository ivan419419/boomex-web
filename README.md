# BOOMEX v0.3 — preparação Android e Play Store

## Estado desta preparação

A preparação está isolada na branch `cue/boomex-playstore-prep-20261118`, baseada no commit público `aff27278d4866855c3ea03b54ecf42594f56fb23`. O jogo mantém o tabuleiro original, as setas em cruz, o botão BOMBA e o crédito aprovado. Nenhuma alteração de mecânica ou tamanho de tabuleiro foi feita nesta etapa.

Antes de começar, foi confirmado no GitHub o backup do estado público: a branch `backup/boomex-public-before-playstore-20261118` e a tag `backup-boomex-public-before-playstore-20261118` apontam ambas para `aff27278d4866855c3ea03b54ecf42594f56fb23`. A branch `main` também estava nesse SHA na verificação.

A página inicial `https://boomex-web.vercel.app/` abre sem login. O rodapé já inclui o link “Privacidade”. O texto final da política está em `privacy-policy.html` e usa a URL permanente `https://boomex-web.vercel.app/privacy-policy.html`; a atualização do conteúdo público dessa página só deve ocorrer depois da validação e publicação desta branch.

## O que está preparado

- **Android:** Capacitor 8.6.2; ID candidato `com.ivan419419.boomex`; versão `0.3` / `versionCode 3`; `minSdk 24`; `targetSdk 36`.
- **Pacote Android:** o jogo, JavaScript e artes ficam no pacote local. O build Android não inclui o SDK remoto do Telegram; não é necessário estar dentro do Telegram para jogar no app.
- **Jogo offline:** `artifacts/boomex-offline.html` é um arquivo único com as artes incorporadas. O progresso é mantido localmente no aparelho/navegador.
- **Arte da loja:** ícone A em `assets/store/boomex-icon-512-playstore.png` (512×512); gráfico panorâmico aprovado em `assets/store/boomex-feature-graphic-1024x500.png` (1024×500); duas capturas atuais em `assets/store/screenshots/`.
- **Ficha:** texto em `assets/store/listing-copy-pt-BR.md`; rascunho de Data safety em `assets/store/data-safety-draft-pt-BR.md`; procedência das artes em `assets/store/asset-provenance-v0.3.md`.
- **Contato público de suporte e privacidade:** `ivanmoreira1001@gmail.com`.
- **Público conforme escolha do proprietário:** não direcionado a menores de 13 anos. As faixas etárias exatas ainda devem ser escolhidas no formulário do Play Console.

As artes do cachorro, da bomba, do ícone e do gráfico foram criadas especificamente para o BOOMEX. O registro de procedência reduz o uso de assets sem origem conhecida, mas não é uma garantia jurídica de exclusividade ou de ausência de semelhança não intencional.

## Validação e AAB

- `npm test`: **11 testes passaram; 0 falharam**.
- O AAB foi produzido e validado estruturalmente pelo bundletool. Manifesto confirmado dentro do pacote: `com.ivan419419.boomex`, versão `0.3`, `versionCode 3`, `targetSdk 36`, `minSdk 24`.
- Artefato: `artifacts/boomex-v0.3-unsigned.aab` — 3.793.300 bytes; SHA-256 `3533b816347c920ab23f95ccf35c069a2ea4c17a8a43166c3b5e15834a8a15d9`.
- **O AAB está sem assinatura.** Nenhuma chave de assinatura foi carregada ou usada nesta build. O arquivo é para inspeção técnica e não pode ser enviado à Play Console até o proprietário decidir e aplicar uma chave de upload válida.
- O HTML offline tem imagens embutidas e não carrega o SDK remoto do Telegram.

Comandos locais usados para validar:

```bash
npm ci
npm test
npm run build:offline
npm run build:android:unsigned
```

## O que ainda depende do proprietário

1. Criar e configurar a conta Play Console com `ivanmoreira1001@gmail.com`, concluir as verificações exigidas e pagar a taxa de cadastro. Nada foi cadastrado, pago ou enviado nesta preparação.
2. Conferir na Play Console se `com.ivan419419.boomex` está disponível; a disponibilidade não pode ser garantida sem criar a ficha.
3. Escolher e proteger uma chave de upload para assinar a versão final. Nenhuma chave foi criada ou usada nesta preparação; o AAB entregue está sem assinatura.
4. Revisar e preencher Data safety, público/faixas etárias, classificação IARC e declaração de anúncios. Os arquivos desta branch são rascunhos e não substituem as respostas do proprietário na Console.
5. Instalar e testar em aparelho Android o pacote final assinado. A aprovação de alvo API foi configurada em `36`, o mínimo exigido para novos apps a partir de 31 de agosto de 2026.
6. Se a conta pessoal for criada agora, concluir o teste fechado com pelo menos 12 testadores inscritos por 14 dias consecutivos e, depois, solicitar acesso à produção.

Nenhum app foi criado ou enviado no Play Console, nenhuma publicação na Play Store foi feita e nenhum pagamento foi realizado.

## Fontes oficiais do Google Play

- [Requisitos de nível desejado da API](https://support.google.com/googleplay/android-developer/answer/11926878?hl=pt-BR)
- [Requisitos de teste para novas contas pessoais](https://support.google.com/googleplay/android-developer/answer/14151465?hl=pt-BR)
- [Como começar a usar o Play Console](https://support.google.com/googleplay/android-developer/answer/6112435?hl=pt-BR)
- [Política de privacidade e Data safety](https://support.google.com/googleplay/android-developer/answer/9859455?hl=pt-BR)
