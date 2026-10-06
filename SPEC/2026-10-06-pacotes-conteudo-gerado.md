# Pacotes de conteúdo gerado *(2026-10-06)*

## O quê e por quê

Scripts geram grandes catálogos TypeScript de conteúdo para ampliar o jogo sem edição repetitiva. O gerador é a fonte autoritativa, e quantidade de linhas só é válida quando o resultado compila, é rastreável e pode ser consumido.

## Critérios de aceitação

- executar o mesmo gerador com a mesma entrada produz `git diff` vazio
- cada definição gerada possui identificador único e valores válidos para seu esquema
- nomes de arquivo, símbolos exportados e índices seguem convenção estável
- referências entre pacotes apontam apenas para IDs existentes
- remover uma definição atualiza os índices correspondentes
- todos os arquivos gerados participam do typecheck
- ao menos uma integração real consome cada família anunciada como ativa
- variações anunciadas como diferentes alteram comportamento, parâmetros ou composição
- `cloc` exclui dependências, locks, build e dados conforme a regra da avaliação

## Fora do escopo

Gerar código com IA durante a execução e contar arquivos sem integração apenas para inflar métricas.
