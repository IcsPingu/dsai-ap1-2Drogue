# Cenários de simulação e qualidade *(2026-10-06)*

## O quê e por quê

Cenários descrevem estado inicial, semente, ações por tick e expectativas. Eles verificam regressões complexas de forma reproduzível e mostram exatamente onde uma execução divergiu.

## Critérios de aceitação

- repetir um cenário produz o mesmo status, eventos e checksum
- ações no mesmo tick usam ordem de sequência estável
- cada cenário começa com estado isolado dos anteriores
- expectativas consultam estado, eventos, métricas ou checksum sem alterar a execução
- uma falha informa cenário, tick, expectativa, valor esperado e valor observado
- filtros por ID, categoria e pacote selecionam somente os cenários correspondentes
- falha em um cenário não oculta o resultado dos demais fora do modo fail-fast
- pacotes gerados possuem IDs únicos e usam apenas ações registradas
- a matriz cobre combate, recursos, eventos, ondas, progressão e casos-limite
- todos os cenários participam do teste automatizado e do typecheck

## Fora do escopo

Teste visual por comparação de imagem, benchmark de hardware e execução distribuída.
