# Motor de combate, habilidades e efeitos *(2026-10-05)*

## O quê e por quê

O motor centraliza atributos, recursos, dano, habilidades, efeitos, projéteis, zonas e combos. A apresentação apenas reproduz o resultado, evitando cálculos diferentes entre cenas e entidades.

## Critérios de aceitação

- o motor executa em testes sem Phaser e recebe relógio e aleatoriedade controlados
- habilidade sem recurso, alvo ou alcance válido não executa, não cobra custo e não inicia recarga
- habilidade válida cobra o custo e inicia a recarga exatamente uma vez
- cada registro de dano informa origem, alvo, tipo, modificadores e valor final finito
- vida e recursos permanecem entre zero e seus máximos
- projétil perfurante não repete dano no mesmo alvo sem regra explícita
- efeitos testam aplicação, pilha, renovação, expiração e remoção de modificadores
- reações encadeadas possuem limite que impede ciclo infinito
- derrota e recompensa são emitidas uma única vez por combatente
- a ponte visual não recalcula o dano produzido pelo motor

## Fora do escopo

Balanceamento competitivo, servidor autoritativo e editor visual de habilidades.
