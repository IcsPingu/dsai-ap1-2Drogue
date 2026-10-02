# Fluxo de cenas e interface *(2026-10-02)*

## O quê e por quê

O jogo precisa de um fluxo completo fora do combate: tela inicial, criação de personagem, ajustes, catálogo, editor e partida. Cada tela deve abrir e fechar sem perder o estado persistente ou deixar entradas da tela anterior ativas.

## Critérios de aceitação

- o menu oferece `Jogar`, `Editar personagem`, `Ajustes`, `Catálogo` e `Editor` quando disponíveis
- iniciar uma partida exibe o tutorial de controles quando essa preferência estiver ativa
- o tutorial informa movimento, mira, ataque primário, especial, esquiva e loja
- tutorial, loja e transições impedem que o combate avance
- `ESC` retorna ao menu a partir das telas que permitem saída
- nenhuma cena recriada duplica teclas, listeners, temporizadores ou elementos de HUD
- textos e botões permanecem legíveis na resolução lógica de 1280 × 720

## Fora do escopo

Navegação por conta remota, localização multilíngue e acessibilidade por leitor de tela.
