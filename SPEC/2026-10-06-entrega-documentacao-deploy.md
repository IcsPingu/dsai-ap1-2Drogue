# Entrega, documentação e publicação *(2026-10-06)*

## O quê e por quê

O projeto precisa apresentar, na raiz do repositório, evidências verificáveis de que o jogo está publicado, documentado, especificado e auditável. A documentação de entrega deve permitir que o professor abra o jogo, confira a contagem de código, encontre as especificações e consulte as sessões brutas sem depender de explicações externas.

## Critérios de aceitação

- o `README.md` da raiz contém uma URL pública clicável para o jogo
- a URL pública responde com sucesso depois da publicação
- o projeto possui publicação automatizada da pasta `dist` no GitHub Pages
- o `README.md` lista a ferramenta de IA, o modelo e o nível de raciocínio usados
- o `README.md` reproduz o comando oficial do `cloc` e sua saída completa
- a saída registrada do `cloc` possui pelo menos 100 mil linhas de código, sem contar dependências, builds, prompts, Markdown, JSON, YAML, CSV, texto, SVG, locks ou arquivos minificados
- o `README.md` aponta para o índice das specs e para `prompts/sessoes/`
- as sessões brutas permanecem preservadas, com arquivos grandes compactados em gzip e hashes documentados
- cada commit produzido a partir desta spec contém os trailers `Agent:` e `Spec:`
- uma auditoria automática do conteúdo versionado não encontra chaves de API, senhas, tokens conhecidos, chaves privadas ou arquivos `.env`
- esta spec aparece no histórico antes do workflow de publicação e do `README.md` da raiz

## Fora do escopo

Reescrever commits históricos publicados antes da adoção dos trailers, pois isso alteraria todos os hashes e exigiria `force push`. Os trailers passam a ser obrigatórios a partir desta especificação.
