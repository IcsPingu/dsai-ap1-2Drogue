# Combate, coletas e bestiário *(2026-10-06)*

> Substitui as regras de entrada de ataque da spec `2026-09-30-combate-jogabilidade.md`, a apresentação das coletas de vida em `2026-10-01-fases-loja-audio.md`, a apresentação dos monstros em `2026-10-03-catalogo-conteudo.md` e a volta à primeira fase após a morte em `2026-10-05-progressao-fases-recursos.md`.

## O quê e por quê

O início de cada fase precisa dar tempo para o jogador reconhecer a sala antes de receber dano. Ataques comuns e ultimate ficam separados entre os dois botões do mouse. Coletas de vida parecem corações, inimigos podem derrubá-las, e o bestiário diferencia visualmente e descreve em português cada monstro implementado.

## Critérios de aceitação

- o jogador fica invencível durante os primeiros 5 segundos de cada fase e após reiniciar uma partida
- a invencibilidade inicial impede todo dano, sem impedir movimento ou ataques, e possui feedback exclusivamente visual, sem contagem no HUD
- morrer reinicia a mesma fase em que o jogador morreu, com vida e magia completas e moedas preservadas
- botão esquerdo executa somente o ataque primário da classe
- botão direito executa somente a ultimate da classe, desde que haja mana suficiente
- a ultimate desconta mana e é executada uma única vez por clique direito
- um clique esquerdo da maga dispara um projétil mágico
- manter o botão esquerdo pressionado com a maga dispara projéteis sucessivos no intervalo da arma até soltar o botão ou acabar a mana
- cada projétil primário da maga consome 4 pontos de mana e nenhum disparo ocorre com mana insuficiente
- no ladino, manter o botão esquerdo pressionado aumenta progressivamente o alcance da faca até o limite de carga
- uma coleta de vida usa um coração, nunca uma esfera verde, e recupera exatamente um coração
- cada inimigo derrotado possui 25% de chance independente de derrubar um coração
- o coração derrubado aparece na posição da morte e usa as mesmas regras de coleta dos demais itens de vida
- o catálogo exibe apenas monstros implementados, com nome, título e descrição em português
- Affinity, Applaud e Fortitudo possuem cores distintas tanto no catálogo quanto durante a partida
- a cor aplicada ao monstro preserva animação, leitura do sprite e feedback de dano

## Fora do escopo

Novas espécies de monstros, novos spritesheets, mudança da quantidade máxima de corações, regeneração automática de mana e rebalanceamento geral das classes.
