// #region GAME LOGIC AND DATA

// DATA
let startButton = document.getElementById("start-button");
let inflateButton = document.getElementById("inflate-button");
let clickCount = 0;
let height = 120;
let width = 100;
let inflationRate = 20;
let maxSize = 300;
let highestPopCount = 0;
let currentPopCount = 0;
let gameLength = 5000;
let clockId = 0;
let currentPlayer = {};

//starts game, this makes the buttons un-click-able after clicking,starts clock
function startGame() {
  startButton.setAttribute("disabled", "true");
  inflateButton.removeAttribute("disabled");
  startClock();
  setTimeout(stopGame, gameLength);
}

//clock starts, game time is time-remaining, in intervals of 1 second
function startClock() {
  timeRemaining = gameLength;
  drawClock();
  clockId = setInterval(drawClock, 1000);
}

//clears clock/resets
function stopClock() {
  clearInterval(clockId);
}

//this function allows clock/time to change in increments of 1 second (1000)
function drawClock() {
  let countdownElem = document.getElementById("countdown");
  countdownElem.innerText = (timeRemaining / 1000).toString();
  timeRemaining -= 1000;
}

//allows us to add clicks, and lets clicks inflate the ballon with heighth/width
// "if statement" lets us call on draw, and allows balloon to pop/resets balloon
function inflate() {
  clickCount++;
  height += inflationRate;
  width += inflationRate;

  if (height >= maxSize) {
    console.log("pop the balloon");
    currentPopCount++;
    height = 0;
    width = 0;
  }
  draw();
}

// draw is letting us put the changing variables onto the screen in visual terms
function draw() {
  let balloonElement = document.getElementById("balloon");
  let clickCountElem = document.getElementById("click-count");
  let popCountElem = document.getElementById("pop-count");
  let highPopCountElem = document.getElementById("high-pop-count");
  let playerNameElem = document.getElementById("player-name");

  balloonElement.style.height = height + "px";
  balloonElement.style.width = width + "px";

  clickCountElem.innerText = clickCount.toString();
  popCountElem.innerText = currentPopCount.toString();
  highPopCountElem.innerText = currentPlayer.topScore.toString();
  playerNameElem.innerText = currentPlayer.name;
}

// in this function we are displaying the game has ended, and resets our buttons/elements that changed in 'function-start game'
// 'if-statement' lets us save our top pop count after multiple attempts
function stopGame() {
  console.log("its been five seconds");

  inflateButton.setAttribute("disabled", "true");
  startButton.removeAttribute("disabled");

  clickCount = 0;
  height = 120;
  width = 100;

  if (currentPopCount > currentPlayer.topScore) {
    currentPlayer.topScore = currentPopCount;
    savePlayers();
  }
  currentPopCount = 0;
  stopClock();

  draw();
}

// #endregion

let players = [];
loadPlayers();

//prevents needing form resubmission,finds our player from our local storage but if there is not history creates a new player
//lets us hide elements we don't want changed during play, statement says if not player, make player
function setPlayer(event) {
  event.preventDefault();
  let form = event.target;
  let playerName = form.playerName.value;

  currentPlayer = players.find((player) => player.name == playerName);

  if (!currentPlayer) {
    currentPlayer = { name: playerName, topScore: 0 };
    players.push(currentPlayer);
    savePlayers();
  }

  console.log(currentPlayer);

  form.reset();

  document.getElementById("game").classList.remove("hidden");
  form.classList.add("hidden");
  draw();
}

// Lets us change player without resubmitting form
function changePlayer() {
  document.getElementById("player-form").classList.remove("hidden");
  document.getElementById("game").classList.add("hidden");
}
//saves players to local-host-storage, 'JSON.stringify' rather than '.tostring'
function savePlayers() {
  window.localStorage.setItem("players", JSON.stringify(players));
}

//lets us pull players out of our saved data
function loadPlayers() {
  let playersData = JSON.parse(window.localStorage.getItem("players"));
  if (playersData) {
    players = playersData;
  }
}
