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
  <p><span id = 'counter'>0</span> ears of corn</p>
  <button id = "upgrade1">Hire a Corn Farmer(<span id = upgradeOneCost>10</span> ears)</button>
  <button id = "upgrade2">Buy a Corn Field (<span id = upgradeTwoCost>100</span> ears)</button>
  <button id = 'upgrade3'>Buy a Tractor (<span id = upgradeThreeCost>1000</span> ears)</button>
  <p id = 'CPS'><span id = 'growth' >0</span> corn per second</p>
`;

//Initializing upgrade button elements
const farmers = document.getElementById("upgrade1") as HTMLButtonElement;
const farms = document.getElementById("upgrade2") as HTMLButtonElement;
const tractors = document.getElementById("upgrade3") as HTMLButtonElement;

// Initializing upgrade cost elements
const upgradeOneCostElement = document.getElementById(
  "upgradeOneCost",
) as HTMLSpanElement;
const upgradeTwoCostElement = document.getElementById(
  "upgradeTwoCost",
) as HTMLSpanElement;
const upgradeThreeCostElement = document.getElementById(
  "upgradeThreeCost",
) as HTMLSpanElement;

interface upgradeType {
  name: HTMLButtonElement;
  cost: number;
  rate: number;
  amount: number;
  costElement: HTMLSpanElement;
}

const upgrades: upgradeType[] = [
  {
    name: farmers,
    cost: 10,
    rate: 0.1,
    amount: 0,
    costElement: upgradeOneCostElement,
  },
  {
    name: farms,
    cost: 100,
    rate: 2,
    amount: 0,
    costElement: upgradeTwoCostElement,
  },
  {
    name: tractors,
    cost: 1000,
    rate: 50,
    amount: 0,
    costElement: upgradeThreeCostElement,
  },
];

//Game countainer that holds all the game variables
const Game = {
  counter: 10000,
};

//Creating a button variable and customizing it's properties
const button = document.createElement("button");
button.id = "button";
document.body.appendChild(button);
button.innerText = "🌽";

//Adding an event listener to the button to increment the counter variable and log it to the console
button.addEventListener("click", () => {
  Game.counter++;
  counterElement.innerText = Game.counter.toString();
});

//Creating a counter variable and customizing it's properties
const counterElement = document.getElementById("counter") as HTMLSpanElement;

//Helper function to deduct the cost of an upgrade from the counter
function purchase(cost: number) {
  Game.counter -= cost;
  counterElement.innerText = Game.counter.toString();
}

//Function to add event listeners to all upgrade buttons
function eventListeners() {
  for (const upgrade of upgrades) {
    upgrade.name.addEventListener("click", () => {
      if (Game.counter >= upgrade.cost) {
        purchase(upgrade.cost);
        upgrade.amount++;
        upgrade.cost = upgrade.cost * 1.15;
        upgrade.costElement.innerText = upgrade.cost.toFixed(2).toString();
      }
    });
  }
}
eventListeners();

// Helper function to check if the player can afford an upgrade and disable/enable the button accordingly
function disableCheck() {
  for (const upgrade of upgrades) {
    if (Game.counter < upgrade.cost) {
      upgrade.name.disabled = true;
    } else {
      upgrade.name.disabled = false;
    }
  }
}

// Helper function to calculate the total CPS from all upgrades
function calcCPS(): number {
  let cps = 0;

  for (const upgrade of upgrades) {
    cps += upgrade.amount * upgrade.rate;
  }

  return cps;
}

// Helper Function to update the CPS display
function updateCPS() {
  const cpsGrowth = document.getElementById("growth") as HTMLSpanElement;
  /*
  const cps: number = (Game.farmers * .1) + (Game.farms * 2) +
    (Game.tractors * 50);
    */
  const cps: number = calcCPS();
  cpsGrowth.innerText = cps.toFixed(1).toString();
}

// HelperFunction to update the counter based on auto-clickers
function updateCounter(deltaTime: number) {
  // Grow count continuously (e.g., 2 per second)
  /*
  Game.counter += Game.farmers * 0.1 * deltaTime;
  Game.counter += Game.farms * 2 * deltaTime;
  Game.counter += Game.tractors * 50 * deltaTime;
  */

  for (const upgrade of upgrades) {
    Game.counter += upgrade.amount * upgrade.rate * deltaTime;
  }

  // Update the displayed counter to the floored value of Game.counter
  counterElement.innerText = Math.floor(Game.counter).toString();
}

// Function to update the counter display and handle auto-clickers
let lastTime = performance.now();

function update(currentTime: number) {
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  // Check if the player can afford upgrades and enable/disable buttons accordingly
  disableCheck();

  // Update the counter based on auto-clickers
  updateCounter(deltaTime);
  // Update the CPS display
  updateCPS();

  // Loop again!
  requestAnimationFrame(update);
}
// Start the update loop
requestAnimationFrame(update);

/*
//Creating an upgrade button variables and customizing their properties
const upgrade1 = document.getElementById("upgrade1") as HTMLButtonElement;
const upgrade2 = document.getElementById("upgrade2") as HTMLButtonElement;
const upgrade3 = document.getElementById("upgrade3") as HTMLButtonElement;
*/

/*
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
 */

/*
//Adding an event listener to the upgrade button to increase the counter by 1 if the counter is greater than or equal to the upgrade cost
upgrade1.addEventListener("click", () => {
  if (Game.counter >= Game.upgradeOneCost) {
    costCheck(Game.upgradeOneCost);
    Game.farmers++;
    //Game.upgradeOneCost = Math.ceil(1.5 * (Game.upgradeOneCost + 1.2));
    Game.upgradeOneCost = Game.upgradeOneCost * 1.15;
    upgradeOneCostElement.innerText = Game.upgradeOneCost.toFixed(2).toString();
  }
});



//Adding an event listener to the upgrade button to increase the counter by 1 if the counter is greater than or equal to the upgrade cost
upgrade2.addEventListener("click", () => {
  if (Game.counter >= Game.upgradeTwoCost) {
    purchase(Game.upgradeTwoCost);
    Game.farms++;
    //Game.upgradeTwoCost = Math.ceil(1.6 * (Game.upgradeTwoCost + 7));
    Game.upgradeTwoCost = Game.upgradeTwoCost * 1.15;
    upgradeTwoCostElement.innerText = Game.upgradeTwoCost.toFixed(2).toString();
  }
});

upgrade3.addEventListener("click", () => {
  if (Game.counter >= Game.upgradeThreeCost) {
    purchase(Game.upgradeThreeCost);
    Game.tractors++;
    //Game.upgradeThreeCost = Math.ceil(1.7 * (Game.upgradeThreeCost + 50));
    Game.upgradeThreeCost = Game.upgradeThreeCost * 1.15;
    upgradeThreeCostElement.innerText = Game.upgradeThreeCost.toFixed(2)
      .toString();
  }
});
*/

/*
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
*/

/*
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
*/
