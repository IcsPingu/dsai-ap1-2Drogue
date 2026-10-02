# Animações e recursos visuais *(2026-10-02)*

## O quê e por quê

Heróis e inimigos devem parecer personagens animados, não imagens arrastadas ou formas geométricas. Caminhada, ataque, dano e esquiva usam quadros próprios e preservam a nitidez da pixel art.

## Critérios de aceitação

- cada classe alterna claramente os pés durante a caminhada
- caminhar não é simulado apenas por balanço, inclinação ou rotação do sprite
- ataque, dano e esquiva usam sequências visuais distintas da caminhada
- esquiva não gira a imagem inteira em 360 graus
- arma, corpo e efeitos separados permanecem alinhados durante a animação
- terminar uma ação restaura ângulo, escala, origem e visibilidade corretos
- nenhum quadro exibe pixels vazados de células vizinhas do atlas
- cavaleiro, maga, arqueiro e ladino são verificados em caminhada, ataque e dano
- inimigos usam sprites e antecipam ataques em vez de aparecerem como primitivas geométricas
- animações continuam funcionando após morte, reinício e troca de fase

## Fora do escopo

Animação esquelética 3D, captura de movimento e geração de sprites em tempo de execução.
