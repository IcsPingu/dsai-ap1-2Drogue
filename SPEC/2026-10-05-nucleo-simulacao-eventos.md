# Núcleo de simulação e eventos *(2026-10-05)*

## O quê e por quê

O núcleo executa regras fora do Phaser com relógio fixo, aleatoriedade semeada, entidades, comandos, eventos e snapshots. Isso torna resultados reproduzíveis e permite testar a lógica sem canvas.

## Critérios de aceitação

- mesma semente, configuração e comandos produzem a mesma sequência de eventos e checksum
- sementes diferentes alteram resultados que dependem de aleatoriedade
- o relógio lógico avança em passos controlados e nunca retrocede
- sistemas com a mesma prioridade usam desempate estável
- eventos preservam ordem por tick, prioridade e sequência
- comandos inválidos não alteram o estado
- remover uma entidade impede atualizações posteriores não autorizadas
- restaurar um snapshot e repetir comandos converge com a execução original
- o journal permite identificar o primeiro evento divergente
- o núcleo e seus testes executam sem Phaser, DOM ou canvas

## Fora do escopo

Renderização, sincronização de rede e persistência de partidas completas em servidor.
