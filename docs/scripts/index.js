import { jogadorComeca } from "./playerStarts.js";
import { mostrarVezJogador } from "./turnIndicator.js";
import { mostrarTelaVencedor } from "./winnerModal.js";
const defaultProfiles = {
  player1: {
    name: "Salsicha Auras",
    avatar: "./styles/images/p1.jpg",
  },
  player2: {
    name: "Satoru Banguela",
    avatar: "./styles/images/p2.jpg",
  },
};
const profileStorageKey = "bugalha-player-profiles";
const profileScreen = document.querySelector(".profile-screen");
const profileForm = document.querySelector(".profile-card");
const profileInputs = document.querySelectorAll("[data-profile-field]");
const profilePreviews = document.querySelectorAll("[data-preview]");
const profileError = document.querySelector(".profile-error");
const playerElements = {
  player1: {
    name: document.querySelector(".player-one-name"),
    avatar: document.querySelector(".player-one-avatar"),
    score: document.querySelector(".player-one-score"),
    info: document.querySelector(".player-one-info"),
    board: document.querySelector(".p1"),
  },
  player2: {
    name: document.querySelector(".player-two-name"),
    avatar: document.querySelector(".player-two-avatar"),
    score: document.querySelector(".player-two-score"),
    info: document.querySelector(".player-two-info"),
    board: document.querySelector(".p2"),
  },
};
const boardPlayers = {
  p1: "player1",
  p2: "player2",
};
let currentPlayer = null;
let currentDiceValue = null;
let isResolvingTurn = false;
let isGameOver = false;

function buscarPerfisSalvos() {
  try {
    return {
      ...defaultProfiles,
      ...JSON.parse(localStorage.getItem(profileStorageKey)),
    };
  } catch {
    return defaultProfiles;
  }
}

function buscarCampoPerfil(player, field) {
  return document.querySelector(
    `[data-player="${player}"][data-profile-field="${field}"]`,
  );
}

function buscarPreviaPerfil(player) {
  return document.querySelector(`[data-preview="${player}"]`);
}

function aplicarPerfis(profiles) {
  Object.entries(profiles).forEach(([player, profile]) => {
    playerElements[player].name.textContent = profile.name;
    playerElements[player].avatar.src = profile.avatar;
    buscarPreviaPerfil(player).src = profile.avatar;
    buscarCampoPerfil(player, "name").value = profile.name;
    buscarCampoPerfil(player, "avatar").value = profile.avatar.startsWith(".")
      ? ""
      : profile.avatar;
  });
}

function urlValida(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function iniciarJogo() {
  const sortPlayer = Math.floor(Math.random() * 2) + 1;
  isGameOver = false;
  currentPlayer = sortPlayer === 1 ? "player1" : "player2";
  reiniciarTabuleiro();
  atualizarPontuacoes();
  iniciarTurno(true);
}

aplicarPerfis(buscarPerfisSalvos());

profileInputs.forEach((input) => {
  input.addEventListener("input", () => {
    profileError.textContent = "";

    if (input.dataset.profileField !== "avatar") {
      return;
    }

    const avatarUrl = input.value.trim();
    if (urlValida(avatarUrl)) {
      buscarPreviaPerfil(input.dataset.player).src = avatarUrl;
    }
  });
});

profilePreviews.forEach((preview) => {
  preview.addEventListener("error", () => {
    const player = preview.dataset.preview;
    preview.src = defaultProfiles[player].avatar;

    if (buscarCampoPerfil(player, "avatar").value.trim()) {
      profileError.textContent = "Não foi possivel carregar uma das imagens.";
    }
  });
});

Object.entries(playerElements).forEach(([player, elements]) => {
  elements.avatar.addEventListener("error", () => {
    elements.avatar.src = defaultProfiles[player].avatar;
  });
});

function buscarPerfisDoFormulario() {
  return Object.keys(defaultProfiles).reduce((profiles, player) => {
    profiles[player] = {
      name: buscarCampoPerfil(player, "name").value.trim(),
      avatar: buscarCampoPerfil(player, "avatar").value.trim(),
    };

    return profiles;
  }, {});
}

function validarPerfis(profiles) {
  for (const [player, profile] of Object.entries(profiles)) {
    const playerNumber = player === "player1" ? "1" : "2";

    if (profile.name.length < 2) {
      return `Digite um nome com pelo menos 2 letras para o jogador ${playerNumber}.`;
    }

    if (!urlValida(profile.avatar)) {
      return `Use uma URL completa, com http ou https, para o jogador ${playerNumber}.`;
    }
  }

  return "";
}

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const profiles = buscarPerfisDoFormulario();
  const error = validarPerfis(profiles);

  if (error) {
    profileError.textContent = error;
    return;
  }

  localStorage.setItem(profileStorageKey, JSON.stringify(profiles));
  aplicarPerfis(profiles);
  profileScreen.classList.add("hidden");
  iniciarJogo();
});

function rolarDado() {
  return Math.floor(Math.random() * 6) + 1;
}

function buscarImagemDado(value) {
  return `./styles/images/dado/${value}.png`;
}

function buscarJogadorDoTabuleiro(element) {
  const board = element.closest(".p1, .p2");
  const boardClass = board?.classList.contains("p1") ? "p1" : "p2";

  return boardPlayers[boardClass];
}

function limparDadoDaVez() {
  Object.values(playerElements).forEach((elements) => {
    const img = elements.info.querySelector(".info-dado .dado-img");
    img.src = "";
    img.classList.remove("active");
  });
}

function atualizarDestaqueDaVez() {
  Object.entries(playerElements).forEach(([player, elements]) => {
    const isActive = player === currentPlayer;

    elements.info.classList.toggle("active-turn", isActive);
    elements.board.classList.toggle("active-turn", isActive);
  });

  document.querySelectorAll(".slot").forEach((slot) => {
    const slotPlayer = buscarJogadorDoTabuleiro(slot);
    slot.classList.toggle("blocked", slotPlayer !== currentPlayer);
  });
}

function mostrarDadoAtual() {
  limparDadoDaVez();

  const img = playerElements[currentPlayer].info.querySelector(
    ".info-dado .dado-img",
  );
  img.src = buscarImagemDado(currentDiceValue);
  img.classList.add("active");
}

function iniciarTurno(isFirstTurn = false) {
  if (isGameOver) {
    return;
  }

  currentDiceValue = rolarDado();
  atualizarDestaqueDaVez();
  mostrarDadoAtual();
  const playerName = playerElements[currentPlayer].name.textContent;

  if (isFirstTurn) {
    jogadorComeca(playerName);
    return;
  }

  mostrarVezJogador(playerName);
}

function alternarTurno() {
  currentPlayer = currentPlayer === "player1" ? "player2" : "player1";
  iniciarTurno();
}

function buscarEspacosColuna(column) {
  return [...column.querySelectorAll(".slot")];
}

function buscarValoresColuna(column) {
  return buscarEspacosColuna(column)
    .map((slot) => Number(slot.querySelector(".dado-img").dataset.value))
    .filter(Boolean);
}

function calcularPontosColuna(values) {
  const valueCounts = values.reduce((counts, value) => {
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});

  return Object.entries(valueCounts).reduce((score, [value, count]) => {
    return score + Number(value) * count * count;
  }, 0);
}

function atualizarPontuacoes() {
  Object.values(playerElements).forEach((elements) => {
    let playerScore = 0;

    elements.board.querySelectorAll(".box").forEach((column) => {
      const columnScore = calcularPontosColuna(buscarValoresColuna(column));
      column.querySelector(".num").textContent = columnScore;
      playerScore += columnScore;
      column.classList.toggle("full", !buscarEspacoVazioMaisBaixo(column));
    });

    elements.score.textContent = playerScore;
  });
}

function buscarEspacoVazioMaisBaixo(column) {
  return buscarEspacosColuna(column)
    .reverse()
    .find(
      (slot) => !slot.querySelector(".dado-img").classList.contains("active"),
    );
}

function podeColocarDado(column) {
  const columnPlayer = buscarJogadorDoTabuleiro(column);

  return (
    !isResolvingTurn &&
    columnPlayer === currentPlayer &&
    buscarEspacoVazioMaisBaixo(column)
  );
}

function buscarIndiceColuna(column) {
  const board = column.closest(".p1, .p2");
  return [...board.querySelectorAll(".box")].indexOf(column);
}

function buscarAdversario(player) {
  return player === "player1" ? "player2" : "player1";
}

function buscarColunaDoJogador(player, columnIndex) {
  return playerElements[player].board.querySelectorAll(".box")[columnIndex];
}

function limparImagemDado(img) {
  img.src = "";
  img.dataset.value = "";
  img.classList.remove("active", "drop", "remove");
}

function definirImagemDado(img, value, shouldDrop = false) {
  img.src = buscarImagemDado(value);
  img.dataset.value = value;
  img.classList.remove("drop", "remove");
  img.classList.add("active");

  if (shouldDrop) {
    void img.offsetWidth;
    img.classList.add("drop");
  }
}

function assentarColuna(column) {
  const values = buscarValoresColuna(column);
  const slots = buscarEspacosColuna(column);
  const firstFilledIndex = slots.length - values.length;

  slots.forEach((slot) => limparImagemDado(slot.querySelector(".dado-img")));

  values.forEach((value, index) => {
    const img = slots[firstFilledIndex + index].querySelector(".dado-img");
    definirImagemDado(img, value, true);
  });
}

function removerDadosIguaisDoAdversario(player, columnIndex, diceValue) {
  const opponent = buscarAdversario(player);
  const opponentColumn = buscarColunaDoJogador(opponent, columnIndex);
  const matchingDice = buscarEspacosColuna(opponentColumn)
    .map((slot) => slot.querySelector(".dado-img"))
    .filter(
      (img) =>
        img.classList.contains("active") &&
        Number(img.dataset.value) === diceValue,
    );

  if (!matchingDice.length) {
    return false;
  }

  matchingDice.forEach((img) => {
    img.classList.remove("drop");
    img.classList.add("remove");
  });

  setTimeout(() => {
    matchingDice.forEach(limparImagemDado);
    assentarColuna(opponentColumn);
    atualizarPontuacoes();
  }, 240);

  return true;
}

function buscarPontuacaoJogador(player) {
  return Number(playerElements[player].score.textContent);
}

function tabuleiroCompleto(board) {
  return [...board.querySelectorAll(".dado-img")].every((img) =>
    img.classList.contains("active"),
  );
}

function buscarJogadorFinalizado() {
  return Object.entries(playerElements).find(([, elements]) =>
    tabuleiroCompleto(elements.board),
  )?.[0];
}

function buscarDadosVencedor() {
  const player1Score = buscarPontuacaoJogador("player1");
  const player2Score = buscarPontuacaoJogador("player2");
  const player1Name = playerElements.player1.name.textContent;
  const player2Name = playerElements.player2.name.textContent;
  const placar = `${player1Name}: ${player1Score} | ${player2Name}: ${player2Score}`;

  if (player1Score === player2Score) {
    return {
      titulo: "Empate",
      placar,
    };
  }

  const winner = player1Score > player2Score ? "player1" : "player2";

  return {
    titulo: `${playerElements[winner].name.textContent} venceu`,
    placar,
  };
}

function finalizarJogo() {
  isGameOver = true;
  currentPlayer = null;
  currentDiceValue = null;
  limparDadoDaVez();
  atualizarDestaqueDaVez();

  mostrarTelaVencedor({
    ...buscarDadosVencedor(),
    aoContinuar: iniciarJogo,
    aoVoltarInicio: voltarTelaPerfil,
  });
}

function reiniciarTabuleiro() {
  document.querySelectorAll(".slot .dado-img").forEach(limparImagemDado);
  document
    .querySelectorAll(".slot")
    .forEach((slot) => slot.classList.remove("blocked"));
  document
    .querySelectorAll(".box")
    .forEach((column) => column.classList.remove("full"));
  Object.values(playerElements).forEach((elements) => {
    elements.info.classList.remove("active-turn");
    elements.board.classList.remove("active-turn");
  });
  document.querySelector(".winner-overlay")?.remove();
  document.querySelector(".turn-overlay")?.remove();
  document.querySelector(".overlay")?.remove();
}

function voltarTelaPerfil() {
  isGameOver = false;
  currentPlayer = null;
  currentDiceValue = null;
  reiniciarTabuleiro();
  atualizarPontuacoes();
  limparDadoDaVez();
  profileScreen.classList.remove("hidden");
}

function colocarDado(column) {
  isResolvingTurn = true;
  const slot = buscarEspacoVazioMaisBaixo(column);
  const img = slot.querySelector(".dado-img");
  const placedValue = currentDiceValue;
  const columnIndex = buscarIndiceColuna(column);

  definirImagemDado(img, placedValue, true);

  atualizarPontuacoes();

  const removedOpponentDice = removerDadosIguaisDoAdversario(
    currentPlayer,
    columnIndex,
    placedValue,
  );
  const turnDelay = removedOpponentDice ? 320 : 120;

  setTimeout(() => {
    atualizarPontuacoes();

    if (buscarJogadorFinalizado()) {
      isResolvingTurn = false;
      finalizarJogo();
      return;
    }

    isResolvingTurn = false;
    alternarTurno();
  }, turnDelay);
}

document.querySelectorAll(".box").forEach((column) => {
  column.addEventListener("click", function () {
    if (!currentPlayer || !podeColocarDado(this)) {
      return;
    }

    colocarDado(this);
  });
});
