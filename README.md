# BOOMEX v0.3 — validação Telegram e Android

Esta branch (`cue/android-validation-20261116`) é isolada: `main` e o jogo em produção permanecem intactos. A versão v0.3 mantém o tabuleiro, o canvas, os controles e as mecânicas existentes; só troca o sprite do cão e a imagem da bomba por arte nova, e identifica a versão no título/metadata.

## Escolhas confirmadas

- Nome: BOOMEX; `versionName` Android: `0.3`; `versionCode`: `3`; versão do pacote npm: `0.3.0`.
- ID candidato: `com.ivan419419.boomex`; APK de teste usa o sufixo `.preview`.
- Ícone A aprovado, reconstruído a partir da nova mascote; o gráfico promocional 1024×500 aprovado foi mantido.
- A versão não é direcionada a menores de 13 anos.
- Contato público de suporte/privacidade: `ivanmoreira1001@gmail.com`.
- Os sprites de procedência incerta foram substituídos por assets originais gerados para esta versão; o código de gameplay e os controles não foram alterados.

## Ordem desta rodada

1. `npm run build:telegram-preview` cria `telegram-preview/` com somente HTML, scripts de runtime, política e as imagens necessárias. O SDK Telegram continua ativo, para que o link HTTPS possa ser aberto no webview do Telegram.
2. O preview é testado no Telegram primeiro. Nenhum APK v0.3 será entregue como aprovado antes desse teste.
3. Depois do retorno do teste no Telegram, gerar o APK de depuração para o aparelho Android e, se solicitado/necessário, o AAB de validação. Não há publicação automática.

O diretório temporário `telegram-preview/` é ignorado pelo Git e o servidor HTTP deve apontar somente para ele. Ele não contém o keystore, credenciais, APK/AAB nem fontes de build.

## Estado da loja

A política local agora mostra o contato e o público escolhidos, mas ainda precisa de uma URL HTTPS permanente antes do envio à loja. O ID não foi conferido na Play Console. As declarações de conteúdo, privacidade/Data safety e classificação etária precisam ser preenchidas na conta do desenvolvedor com base no app final. Nenhuma conta foi criada, taxa paga, build enviada ou publicação feita.

## Verificações

`npm test` cobre 11 testes automatizados de mapa, movimento/colisão, progresso local e campanha. O pacote Android usa `minSdk` 24 e `targetSdk` 36. Antes do APK final desta rodada, também será necessário conferir o preview no aparelho físico; o usuário quer validar primeiro dentro do Telegram.

## Comandos

```bash
npm install
npm test
npm run build:telegram-preview
npm run build:offline
npm run build:android:debug
npm run build:android:release
```

A chave de upload e suas credenciais permanecem em `artifacts/` no ambiente local, ignoradas pelo Git. Faça cópia segura se for necessário manter uma futura assinatura de release; nunca as envie ao repositório.
