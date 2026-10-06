# Integração dos sistemas *(2026-10-06)*

## O quê e por quê

A cena do jogo coordena apresentação, simulação, combate, geração procedural, IA, progressão e editor. Cada estado tem uma única fonte de verdade para impedir dano, recompensa ou HUD calculados duas vezes.

## Critérios de aceitação

- mapa carregado ou gerado é validado antes de criar navegação e entidades
- entrada do jogador vira intenção ou comando antes de produzir efeito de domínio
- HUD mostra os mesmos valores de vida, magia, moedas, combo e objetivo usados pelas regras
- pontes reproduzem eventos de domínio sem recalcular dano ou recompensa
- pausar tutorial, loja ou transição interrompe todos os sistemas temporais relevantes
- alterar o mapa atualiza a revisão de navegação e invalida caminhos incompatíveis
- cada derrota, compra, recompensa e conclusão é processada uma única vez
- encerrar a cena remove listeners, timers, colisores e referências transitórias
- reiniciar após morte cria estado transitório novo e preserva somente dados permitidos
- o fluxo menu → jogo → próxima fase → morte → reinício → menu funciona na mesma sessão
- uma fase do editor pode ser validada e executada pelo fluxo normal
- build e testes terminam sem erro após integrar todos os módulos

## Fora do escopo

Arquitetura de microsserviços, sincronização multiplayer e plugins de terceiros em tempo de execução.
