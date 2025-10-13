//import exampleIconUrl from "./noun-paperclip-7598668-00449F.png";
import "./style.css";
/*
document.body.innerHTML = `
  <p>Example image asset: <img src="${exampleIconUrl}" class="icon" /></p>
`;
*/

document.body.innerHTML = `
  <head>
    <title>Incremental game</title>
  </head>
  <h1>🌽 Corn Clicker 🌽</h1>
  <button id = "button">🌽</button>
  <p><span id = 'counter'>0</span> ears of corn</p>
  <button id = "upgrade1">Hire a Corn Farmer(<span id = upgradeOneCost>10</span> ears)</button>
  <button id = "upgrade2">Buy a Corn Field (<span id = upgradeTwoCost>100</span> ears)</button>
  <button id = 'upgrade3'>Buy a Tractor (<span id = upgradeThreeCost>1000</span> ears)</button>
  <p id = 'CPS'><span id = 'growth' >0</span> corn per second</p>
`;

//Game countainer that holds all the game variables
const Game = {
  counter: 10000,
  farmers: 0,
  farms: 0,
  tractors: 0,
  upgradeOneCost: 10,
  upgradeTwoCost: 100,
  upgradeThreeCost: 1000,
};

//Creating a button variable and customizing it's properties
const button = document.getElementById("button") as HTMLButtonElement;

//Creating an upgrade button variables and customizing their properties
const upgrade1 = document.getElementById("upgrade1") as HTMLButtonElement;
const upgrade2 = document.getElementById("upgrade2") as HTMLButtonElement;
const upgrade3 = document.getElementById("upgrade3") as HTMLButtonElement;

//Creating a counter variable and customizing it's properties
const counterElement = document.getElementById("counter") as HTMLSpanElement;

//Creating upgrade cost variables and customizing it's properties
const upgradeOneCostElement = document.getElementById(
  "upgradeOneCost",
) as HTMLSpanElement;
const upgradeTwoCostElement = document.getElementById(
  "upgradeTwoCost",
) as HTMLSpanElement;
const upgradeThreeCostElement = document.getElementById(
  "upgradeThreeCost",
) as HTMLSpanElement;

//Adding an event listener to the button to increment the counter variable and log it to the console
button.addEventListener("click", () => {
  Game.counter++;
  counterElement.innerText = Game.counter.toString();
});

//Helper function to deduct the cost of an upgrade from the counter
function costCheck(cost: number) {
  Game.counter -= cost;
  counterElement.innerText = Game.counter.toString();
}

//Adding an event listener to the upgrade button to increase the counter by 1 if the counter is greater than or equal to the upgrade cost
upgrade1.addEventListener("click", () => {
  if (Game.counter >= Game.upgradeOneCost) {
    costCheck(Game.upgradeOneCost);
    Game.farmers++;
    Game.upgradeOneCost = Math.ceil(1.5 * (Game.upgradeOneCost + 1.2));
    upgradeOneCostElement.innerText = Game.upgradeOneCost.toString();
  }
});

//Adding an event listener to the upgrade button to increase the counter by 1 if the counter is greater than or equal to the upgrade cost
upgrade2.addEventListener("click", () => {
  if (Game.counter >= Game.upgradeTwoCost) {
    costCheck(Game.upgradeTwoCost);
    Game.farms++;
    Game.upgradeTwoCost = Math.ceil(1.6 * (Game.upgradeTwoCost + 7));
    upgradeTwoCostElement.innerText = Game.upgradeTwoCost.toString();
  }
});

upgrade3.addEventListener("click", () => {
  if (Game.counter >= Game.upgradeThreeCost) {
    costCheck(Game.upgradeThreeCost);
    Game.tractors++;
    Game.upgradeThreeCost = Math.ceil(1.7 * (Game.upgradeThreeCost + 50));
    upgradeThreeCostElement.innerText = Game.upgradeThreeCost.toString();
  }
});

// Helper function to check if the player can afford an upgrade and disable/enable the button accordingly
function disableCheck(
  counter: number,
  cost: number,
  upgrade: HTMLButtonElement,
) {
  if (counter < cost) {
    upgrade.disabled = true;
  } else {
    upgrade.disabled = false;
  }
}

function updateCPS() {
  const cpsGrowth = document.getElementById("growth") as HTMLSpanElement;
  const cps: number = (Game.farmers * .1) + (Game.farms * 2) +
    (Game.tractors * 50);
  cpsGrowth.innerText = cps.toFixed(1).toString();
}

function updateCounter(deltaTime: number) {
  // Grow count continuously (e.g., 2 per second)
  Game.counter += Game.farmers * 0.1 * deltaTime;
  Game.counter += Game.farms * 2 * deltaTime;
  Game.counter += Game.tractors * 50 * deltaTime;

  // Update the displayed counter to the floored value of Game.counter
  counterElement.innerText = Math.floor(Game.counter).toString();
}

// Function to update the counter display and handle auto-clickers
let lastTime = performance.now();

function update(currentTime: number) {
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  // Check if the player can afford upgrades and enable/disable buttons accordingly
  disableCheck(Game.counter, Game.upgradeOneCost, upgrade1);
  disableCheck(Game.counter, Game.upgradeTwoCost, upgrade2);
  disableCheck(Game.counter, Game.upgradeThreeCost, upgrade3);

  // Update the counter based on auto-clickers
  updateCounter(deltaTime);
  // Update the CPS display
  updateCPS();

  // Loop again!
  requestAnimationFrame(update);
}

requestAnimationFrame(update);
