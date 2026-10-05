# Geração procedural *(2026-10-05)*

## O quê e por quê

O gerador produz mapas variados por algoritmos e biomas diferentes, mas todos precisam resultar em fases reproduzíveis, conectadas e adequadas ao combate em corredores e salas.

## Critérios de aceitação

- mesma configuração e semente produzem o mesmo mapa
- o motor permite trocar de algoritmo sem mudar o contrato de saída
- cada mapa possui exatamente um início ativo e um objetivo alcançável
- início, saída, inimigos e itens nunca aparecem em célula sólida
- corredores possuem largura suficiente para jogador e inimigos configurados
- regras de terreno respeitam prioridade explícita e não usam aleatoriedade global
- validação informa código, severidade e posição de cada problema detectado
- reparo modifica apenas o necessário e valida novamente o resultado
- falha irreparável retorna diagnóstico, nunca um mapa parcial como sucesso
- testes executam várias sementes de cada algoritmo sem aceitar fase inalcançável

## Fora do escopo

Geração por modelo de linguagem, download de mapas e edição manual dentro do gerador.
