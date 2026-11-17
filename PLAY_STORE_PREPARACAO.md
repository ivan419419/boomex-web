# Boomex — rascunho da ficha e plano de teste (17/11/2026)

Documento provisório. Não foi submetido ao Google Play. Confirmar direitos dos recursos gráficos, público e conteúdo da versão final antes de enviar.

## Texto da ficha

**Nome provisório:** Boomex

**Descrição curta (≤80 caracteres):** Explore 25 labirintos, plante bombas e ajude o cão a vencer inimigos e perigos.

**Descrição completa (rascunho):**

Ajude o cãozinho Boomex a atravessar 25 labirintos, derrotar inimigos e escapar de perigos. Explore cada fase, plante bombas para abrir caminho e encontre a saída.

• 25 fases de campanha, com labirintos e desafios progressivos.  
• Controles táteis na tela para mover o personagem e usar bombas.  
• Vidas, pontuação e progresso salvos localmente neste aparelho.  
• A partida funciona com os recursos do jogo incluídos no aplicativo; abrir links externos, como TikTok, requer internet.

Jogo individual sem conta ou compras no app na versão atual de teste. A ficha deve ser revisada caso qualquer uma dessas características mude antes do lançamento.

## Público-alvo — recomendação preliminar, não declaração final

**Sugestão para revisão:** não posicionar como app infantil; avaliar faixa **13 anos ou mais** no Play Console. O jogo apresenta um personagem de cão visualmente amigável, mas a jogabilidade envolve bombas e eliminar inimigos. A seleção de público deve corresponder ao marketing real e ao conteúdo completo. Não marcar crianças como público só para ampliar alcance; se crianças forem escolhidas, aplicam-se requisitos adicionais da política Families.

## Classificação de conteúdo

**Não atribuir uma classificação numérica por antecipação.** O desenvolvedor deve completar o questionário IARC no Play Console, respondendo sobre todo o conteúdo e recursos reais; as autoridades emitem as classificações por território. Respostas preliminares que precisam ser verificadas: violência estilizada/fantasia por bombas e inimigos; nenhuma violência realista ou sangue verificados no jogo observado; confirmar linguagem, medo, compras, interação social, anúncios e conteúdo externo no pacote e nos recursos promocionais. O jogo não contém chat conhecido na versão auditada. Link para TikTok abre conteúdo externo, que deve ser incluído na revisão contextual.

## Sequência para o teste fechado (conta pessoal nova)

1. Ivan conclui a criação/verificação da conta Play Console e confirma um dispositivo físico exigido; não iniciar cadastro, pagamento ou autenticação por este trabalho.
2. Resolver direitos e licença de todos os recursos de arte e som; registrar origem/autorização. O sprite de aparência semelhante a Mario encontrado no repo não foi incluído na prévia Android.
3. Testar a APK no aparelho real, corrigir o que aparecer e concluir o teste funcional/acessibilidade/offline. Gerar AAB de release assinado, definir ID final e verificar API 36 ou superior no pacote final.
4. Preparar página HTTPS pública de Política de Privacidade específica do app e linká-la na ficha e dentro do app. Auditar tráfego e declarar Data safety com base na versão efetivamente enviada. Declarar anúncios com precisão.
5. Completar ativos/textos, público-alvo e conteúdo, classificação IARC, informações de suporte e direitos. Criar o app e carregar pacote no Play Console para começar primeiro um teste interno e corrigir alertas.
6. Criar faixa de teste fechado. Convidar **pelo menos 12 pessoas distintas** (preferencialmente mais como reserva); cada uma deve aceitar o convite/entrar (opt in) pelo link do Google Play, com a conta Google correta.
7. Iniciar a contagem apenas quando pelo menos 12 estiverem inscritos. Manter esses 12 continuamente por **14 dias consecutivos completos**; desistência ou opt-out pode invalidar a continuidade daquele testador. Acompanhar feedback, corrigir problemas e manter build/teste no ar durante o período.
8. Após os 14 dias e requisitos satisfeitos, responder no Console às perguntas do teste e solicitar acesso à produção. O Google analisa o pedido e o app; aprovação/publicação não é automática. Publicar somente após autorização explícita do Ivan.

### Lista de acompanhamento (preencher após Ivan aprovar um build)

| Nº | Testador convidado | Aceitou/opt-in confirmado | Conta Google confirmada | Início contínuo | Feedback/correções |
|---:|---|---|---|---|---|
| 01–12 | A preencher | A confirmar no Play Console | A confirmar | A definir | A recolher |

Não coletar nem registrar e-mails pessoais de testadores neste documento. Usar o próprio controle de testadores do Play Console.

## Estado técnico conhecido

O APK debug atual foi compilado usando `compileSdk 36` e `targetSdk 36`, sem alterarmos o tamanho/estilo do canvas para a alteração tipográfica. Isso confirma o alvo técnico deste APK, não de um AAB de release. Não houve instalação/teste manual em celular, upload ao Play Console, validação IARC, nem aprovação do Google. O APK é debug, não assinado para distribuição no Play.
