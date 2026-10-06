# Progressão persistente *(2026-10-06)*

## O quê e por quê

Experiência, níveis, moedas persistentes, maestria, missões e desbloqueios evoluem entre partidas. Um serviço versionado valida tudo antes de salvar ou substituir o estado ativo.

## Critérios de aceitação

- experiência suficiente concede todos os níveis alcançados e preserva o excedente
- limiares de experiência são finitos, positivos e crescentes
- desbloqueio sem nó, pré-requisito ou saldo válido é rejeitado
- desbloqueio válido cobra o custo e concede o nó uma única vez
- mortes, fases, dano, itens e objetivos atualizam os contadores correspondentes
- salvar e carregar preserva estado semanticamente equivalente
- dados corrompidos voltam a um estado válido sem impedir o jogo
- experiência, moedas, pontos e contadores nunca ficam negativos
- falha de armazenamento preserva o estado válido da sessão
- o esquema v1 usa a chave `vigrid-progression-v1`

## Fora do escopo

Conta online, ranking global, temporada e compra de progressão com dinheiro real.
