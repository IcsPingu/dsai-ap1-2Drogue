# Visão geral *(2026-09-29)*

## O quê e por quê

Umbra Trail é um roguelike 2D em pixel art para navegador. O jogador cria um herói, escolhe uma classe e atravessa fases com corredores, combates, recompensas e progressão. Phaser cuida da apresentação; regras reutilizáveis ficam em módulos TypeScript para que o jogo cresça sem concentrar tudo na cena principal.

## Critérios de aceitação

- o jogo inicia pela cena de carregamento e chega ao menu sem erro
- uma partida pode ser iniciada, concluída, reiniciada após a morte e encerrada no menu
- o canvas mantém proporção e centralização em diferentes tamanhos de janela
- o projeto executa typecheck antes do build
- o pacote de produção funciona quando publicado em subdiretório
- lógica determinística recebe tempo e aleatoriedade por contratos controláveis
- `npm run build` e `npm test -- --runInBand` terminam com sucesso

## Fora do escopo

Multijogador, servidor remoto, monetização, aplicativo nativo e sincronização em nuvem.
