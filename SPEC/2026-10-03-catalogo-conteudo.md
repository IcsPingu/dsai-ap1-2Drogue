# Catálogo e conteúdo *(2026-10-03)*

## O quê e por quê

O catálogo mostra personagens, inimigos, armas e itens que realmente existem no jogo. Ele usa as mesmas fontes de dados da partida para não anunciar conteúdo fictício ou desatualizado.

## Critérios de aceitação

- o catálogo abre pelo menu e retorna sem perder o perfil
- categorias de personagens, inimigos e armas exibem nome, imagem e descrição funcional
- cada identificador é único e não depende do texto apresentado
- cada inimigo anunciado pode ser criado pela fábrica usada na partida
- cada arma anunciada possui classe ou fonte de obtenção válida
- conteúdo bloqueado aparece identificado como bloqueado, não como disponível
- imagens ausentes usam fallback explícito sem quebrar a tela
- validação automatizada detecta IDs duplicados e referências inexistentes

## Fora do escopo

Wiki externa, conteúdo da comunidade e marketplace.
