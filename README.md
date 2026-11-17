# BOOMEX — preparação Android para a Google Play

Esta branch prepara o jogo web atual para testes Android e para uma futura publicação. Ela não modifica `main` nem a versão web em produção. O aplicativo é uma WebView Capacitor que empacota os arquivos locais do jogo; o SDK remoto do Telegram é removido da cópia Android.

## Artefatos desta preparação

- APK de depuração para instalar e testar: `artifacts/boomex-preview-debug.apk` — pacote de teste `com.ivan419419.boomex.preview`.
- Jogo standalone sem conexão: `artifacts/boomex-offline.html` — um único arquivo HTML com JavaScript, sprites e a política local embutidos.
- AAB candidato assinado: `artifacts/boomex-candidate-release.aab` — ID de release `com.ivan419419.boomex`, `versionCode` 1, `versionName` 1.0.0, `minSdk` 24 e `targetSdk` 36. Foi gerado e verificado localmente, mas não foi enviado à Google Play.
- Ícone 512×512, duas alternativas visuais e gráfico 1024×500 estão em `assets/store/`. Os conceitos visuais ainda aguardam a escolha do proprietário antes de serem tratados como arte final.
- Duas capturas de gameplay 1080×1920 para revisão da ficha estão em `assets/store/screenshots/`.

O ícone A está aplicado provisoriamente ao APK/AAB porque combina melhor com o cão pixelado do jogo. O ícone B continua disponível como alternativa. Nenhuma dessas escolhas foi enviada para a loja.

## Estado técnico

- `npm test`: 11 testes passaram nesta preparação.
- O APK debug é assinado com a chave de depuração local; o AAB usa uma upload key RSA 2048 gerada para este candidato e a assinatura do arquivo foi verificada.
- A cópia Android não inclui o sprite `bomberman_walk.png`, que não é usado pelo jogo.
- O manifesto Android desativa backup automático (`allowBackup=false`). A permissão de internet permanece para o WebView e o link externo opcional do TikTok; o jogo inicia e funciona offline.
- O progresso é local no aparelho; não foram encontrados anúncios, analytics, cadastro de conta ou envio remoto do progresso na versão auditada.

## O que ainda precisa ser decidido ou concluído antes da loja

1. Confirmar que o pacote `com.ivan419419.boomex` está disponível na Play Console antes de criar a ficha; o ID é difícil de trocar depois que o app é criado.
2. Confirmar direitos comerciais/licenças dos assets usados no jogo, em especial `assets/images/boomex-dog-sprite.png` e `assets/images/bomb.png`. O histórico do repositório não documenta suas origens.
3. Escolher o ícone A ou B e aprovar a arte promocional/capturas.
4. Substituir `[INSERIR E-MAIL PÚBLICO DE SUPORTE]` em `privacy-policy.html`, escolher o contato que poderá ficar público e hospedar a política em uma URL HTTPS pública. O link interno já abre essa página no app.
5. Definir o público-alvo/idades e preencher as declarações de classificação etária, anúncios, Data safety e demais questionários da Play Console com base na versão final.
6. Completar teste em aparelho Android físico e, se a conta pessoal nova estiver sujeita à regra vigente, o teste fechado exigido pelo Google Play.

Nenhuma conta de desenvolvedor foi criada, nenhuma taxa foi paga e nenhum app foi submetido ou publicado.

## Comandos

```bash
npm install
npm test
npm run build:web
npm run build:offline
npm run build:android:debug
```

Para gerar um novo AAB assinado, forneça estas variáveis no ambiente apenas durante a compilação:

```bash
BOOMEX_UPLOAD_KEYSTORE=/caminho/privado/boomex-upload-key.jks
BOOMEX_UPLOAD_STORE_PASSWORD=...
BOOMEX_UPLOAD_KEY_ALIAS=boomex-upload
BOOMEX_UPLOAD_KEY_PASSWORD=...
npm run build:android:release
```

`BOOMEX_AAPT2_OVERRIDE` é opcional e serve apenas em hosts Linux ARM64 que precisem executar o AAPT2 oficial via emulação. No computador desta preparação, o AAB e o APK foram montados com API 36.

A upload key e as credenciais de recuperação estão em `artifacts/` no ambiente local e essa pasta é ignorada pelo Git. Faça uma cópia segura da chave antes de limpar o ambiente e nunca a envie ao repositório.
