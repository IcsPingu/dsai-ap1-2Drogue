# Perfil e configurações *(2026-10-02)*

## O quê e por quê

A aparência, a classe e as preferências escolhidas devem sobreviver ao recarregamento da página. Dados inválidos não podem impedir o jogador de abrir o jogo.

## Critérios de aceitação

- salvar no editor atualiza o personagem exibido no menu e na partida
- recarregar a página restaura todas as escolhas de aparência e classe
- som e exibição do tutorial persistem entre sessões
- a primeira execução cria um perfil padrão completo
- JSON corrompido ou campos inválidos são substituídos por valores válidos
- campos desconhecidos não apagam campos reconhecidos
- indisponibilidade de `localStorage` mantém a sessão atual funcional
- alterações incompatíveis no formato exigem versão e migração explícitas

## Fora do escopo

Conta de usuário, salvamento em servidor e sincronização entre dispositivos.
