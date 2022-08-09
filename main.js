// #region GAME LOGIC AND DATA

// DATA
let clickCount = 0;
let height = 120;
let width = 100;
let inflationRate = 20;
let maxSize = 300;
let highestPopCount = 0;
let currentPopCount = 0;
let gameLength = 10000;
let clockId = 0;
let currentPlayer = {};
let currentColor = "blue";
let possibleColors = ["blue", "yellow", "pink", "purple"];

//starts game, this makes the buttons un-click-able after clicking,starts clock
function startGame() {
  document.getElementById("game-controls").classList.remove("hidden");
  document.getElementById("main-controls").classList.add("hidden");
  document.getElementById("scoreboard").classList.add("hidden");
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
  checkBalloonPop();
  draw();
}

function checkBalloonPop() {
  if (height >= maxSize) {
    console.log("pop the balloon");
    let balloonElement = document.getElementById("balloon");
    balloonElement.classList.remove(currentColor);
    getRandomColor();
    balloonElement.classList.add(currentColor);
    document.getElementById("pop-sound").play();
    currentPopCount++;
    height = 0;
    width = 0;
  }
}

function getRandomColor() {
  let i = Math.floor(Math.random() * possibleColors.length);
  currentColor = possibleColors[i];
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
  // console.log("its been five seconds");

  document.getElementById("game-controls").classList.add("hidden");
  document.getElementById("main-controls").classList.remove("hidden");
  document.getElementById("scoreboard").classList.remove("hidden");

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
  drawScoreboard();
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
  drawScoreboard();
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

function drawScoreboard() {
  let template = "";

  players.sort((p1, p2) => p2.topScore - p1.topScore);

  players.forEach((player) => {
    template += ` <div class="d-flex space-between">
    <span>
      <i class="fa fa-user"></i>
      ${player.name}
    </span>
    <span>score: ${player.topScore}</span>
  </div>`;
  });
  document.getElementById("players").innerHTML = template;
}

drawScoreboard();
