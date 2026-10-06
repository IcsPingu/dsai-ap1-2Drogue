# IA, navegação e táticas *(2026-10-06)*

## O quê e por quê

Inimigos usam uma grade navegável, busca de caminho, percepção e perfis táticos para perseguir, manter distância, flanquear ou defender sem atravessar paredes nem depender da taxa de quadros.

## Critérios de aceitação

- a grade marca bloqueios e custos a partir do mapa definitivo
- o A* encontra caminho em rota livre, contorna obstáculos e informa destino inalcançável
- nenhum ponto do caminho pertence a célula bloqueada na revisão calculada
- alteração do mapa invalida caminhos em cache afetados
- agente preso tenta recuperação limitada sem entrar em laço infinito
- inimigos corpo a corpo contornam obstáculos para chegar ao alcance
- inimigos à distância procuram sua faixa de combate em vez de colar no jogador
- múltiplos agentes reduzem sobreposição por separação ou reserva de espaço
- pausar o jogo interrompe decisão, navegação e ataque
- mesmo estado e semente reproduzem as mesmas decisões e rotas

## Fora do escopo

Aprendizado de máquina, treinamento online e coordenação por servidor.
