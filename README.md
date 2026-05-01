# Jogo da Bugalha

Um jogo local para dois jogadores, inspirado no minigame **Knucklebones**, presente em **Cult of the Lamb**.

Este projeto foi criado com intuito de **aprendizado, pratica de desenvolvimento web e entretenimento**. A ideia foi recriar a logica principal do minigame usando HTML, CSS e JavaScript puro, explorando manipulacao de DOM, controle de estado, animacoes e responsividade.

## Sobre o jogo

No Jogo da Bugalha, dois jogadores se enfrentam colocando dados em colunas. Cada jogador possui um tabuleiro com 3 colunas e 9 espacos no total.

A cada turno, o jogador recebe um dado aleatorio e escolhe uma coluna para posiciona-lo. O dado sempre cai para o espaco livre mais baixo da coluna, simulando gravidade.

## Regras principais

- O primeiro jogador e escolhido aleatoriamente.
- Depois do primeiro turno, a vez alterna entre os dois jogadores.
- Cada jogador so pode jogar no proprio tabuleiro.
- O dado sempre ocupa o espaco livre mais baixo da coluna escolhida.
- Quando um dado e colocado em uma coluna, dados iguais na mesma coluna do adversario sao removidos.
- A partida termina quando um dos jogadores completa todos os espacos do proprio tabuleiro.
- Ao final, o jogo compara as pontuacoes e anuncia o vencedor.

## Sistema de pontuacao

A pontuacao de cada coluna considera dados iguais como multiplicadores.

Exemplos:

```txt
Um dado 5:
5 * 1 * 1 = 5

Dois dados 5:
5 * 2 * 2 = 20

Tres dados 5:
5 * 3 * 3 = 45
```

Se a coluna possuir valores diferentes, cada grupo e calculado separadamente e somado.

```txt
Coluna: 5, 5, 2
Pontuacao: 20 + 2 = 22
```

## Funcionalidades

- Tela inicial para escolher nome dos dois jogadores.
- Foto de perfil por URL para cada jogador.
- Previa da imagem de perfil.
- Salvamento dos perfis no navegador.
- Sorteio automatico de quem comeca.
- Indicador visual de turno.
- Dado aleatorio a cada turno.
- Animacao de queda dos dados.
- Remocao animada dos dados iguais do adversario.
- Reorganizacao dos dados na coluna apos remocao.
- Calculo automatico de pontuacao por coluna e pontuacao total.
- Tela final anunciando vencedor ou empate.
- Opcoes para continuar jogando ou voltar para a tela inicial.
- Layout responsivo para desktop e celular.

## Tecnologias usadas

- HTML
- CSS
- JavaScript

O projeto nao utiliza frameworks. Toda a logica foi feita com JavaScript puro.

## Como jogar localmente

Abra o arquivo:

```txt
src/index.html
```

Ou, se preferir usar um servidor local:

```bash
python -m http.server
```

Depois acesse no navegador:

```txt
http://localhost:8000/src/
```

## GitHub Pages

O projeto tambem possui uma versao preparada para publicacao na pasta:

```txt
docs/
```

No GitHub Pages, configure:

```txt
Branch: main
Folder: /docs
```

## Inspiracao

Este jogo foi inspirado no minigame **Knucklebones**, de **Cult of the Lamb**.

Todos os direitos de Cult of the Lamb pertencem aos seus respectivos criadores e publicadores. Este projeto e apenas uma recriacao feita por fa, com objetivo educacional e recreativo.

## Objetivo do projeto

O foco deste projeto foi praticar:

- criacao de interfaces responsivas;
- manipulacao de elementos HTML com JavaScript;
- organizacao de regras de jogo;
- controle de turnos;
- calculo de pontuacao;
- animacoes com CSS;
- persistencia simples com `localStorage`;
- preparacao de projeto para GitHub Pages.

## Autor

Desenvolvido por **Raizoca** como projeto de aprendizado e diversao.
