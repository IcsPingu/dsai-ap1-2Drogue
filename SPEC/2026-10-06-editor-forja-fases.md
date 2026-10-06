# Editor e forja de fases *(2026-10-06)*

## O quê e por quê

O editor permite criar e modificar fases com ferramentas reversíveis. O documento exportado usa contratos aceitos pelo jogo e só é tratado como válido quando início, saída, objetos e conectividade passam pela validação.

## Critérios de aceitação

- pintar, apagar, criar, mover e configurar elementos pode ser desfeito e refeito
- executar novo comando após desfazer descarta a ramificação incompatível de refazer
- seleção nunca mantém referência a objeto removido
- IDs continuam únicos após duplicação, importação e geração
- exportar e importar produz documento semanticamente igual
- documento incompatível é rejeitado antes de substituir o documento aberto
- validação detecta objetos fora do mapa, posições sólidas, início ou saída ausente e falta de caminho
- teste da fase usa uma cópia e não altera o documento aberto
- geração registra algoritmo e semente usados
- uma ferramenta gerada só aparece quando está registrada e possui execução válida

## Fora do escopo

Colaboração simultânea, marketplace de fases e edição gráfica de sprites.
