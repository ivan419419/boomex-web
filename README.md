# BOOMEX Web — validação Android

Este branch prepara o jogo web atual para uma **build Android de depuração**, mantendo `main` e a versão web de produção intactas. O wrapper usa Capacitor e empacota os arquivos locais do jogo em uma WebView.

## Estado e limites

- `applicationId` provisório do APK de teste: `com.ivan419419.boomex.preview`. Não usar como identidade definitiva de publicação sem decisão explícita.
- O APK `debug` é assinado com a chave de depuração local e serve para instalação/teste; não é um pacote de lançamento para a Play Store.
- A cópia Android omite o carregamento do SDK remoto do Telegram, que é opcional para o jogo standalone. `index.html` e o restante do código-fonte original não são alterados pelo script de cópia.
- Licenças e procedência dos assets, identidade final do app, ícone, política de privacidade e comportamento em aparelhos ainda precisam ser validados antes de qualquer lançamento.
- Nenhuma conta ou configuração da Play Store faz parte deste projeto de validação.

## Requisitos

- Node.js 22 ou superior.
- Java 21.
- Android SDK com uma plataforma e Build Tools compatíveis; o wrapper Capacitor 8 usa Android API 24 como mínimo suportado.

## Comandos

```bash
npm install
npm test
npm run build:web
npx cap add android       # somente na primeira criação do projeto nativo
npm run sync:android
npm run build:android:debug
```

O APK de depuração é criado em `android/app/build/outputs/apk/debug/app-debug.apk`. `npm run build:web` copia apenas os arquivos necessários do jogo e os assets para `www/`; essa pasta e os assets Android sincronizados são saídas geradas e ficam fora do Git.

Para abrir o projeto depois de sincronizar, importe a pasta `android/` no Android Studio. A execução em dispositivo/emulador não foi automatizada neste branch.
