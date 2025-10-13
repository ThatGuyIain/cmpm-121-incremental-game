import "./style.css";

document.body.innerHTML = `
  <head>
    <title>Incremental game</title>
  </head>
  <h1>🌽 Corn Clicker 🌽</h1>
  <p><span id = 'counter'>0</span> ears of corn</p>
  <button id = "farmers">Hire a Corn Farmer(<span id = upgradeOneCost>10</span> ears)</button>
  <button id = "farms">Buy a Corn Field (<span id = upgradeTwoCost>100</span> ears)</button>
  <button id = 'tractors'>Buy a Tractor (<span id = upgradeThreeCost>1000</span> ears)</button>
  <button id = "factories">Buy a Factory (<span id = upgradeFourCost>10000</span> ears)</button>
  <button id = "theaters">Buy a Theater (<span id = upgradeFiveCost>100000</span> ears)</button>
  <p id = 'CPS'><span id = 'growth' >0</span> corn per second</p>
`;

// Defining an upgrade type to hold all the properties of an upgrade
interface upgradeType {
  name: HTMLButtonElement;
  cost: number;
  rate: number;
  amount: number;
  costElement: HTMLSpanElement;
  description: string;
}

// Creating an array of upgrades to hold all the upgrade objects
const upgrades: upgradeType[] = [
  {
    name: document.getElementById("farmers") as HTMLButtonElement,
    cost: 10,
    rate: 0.1,
    amount: 0,
    costElement: document.getElementById(
      "upgradeOneCost",
    ) as HTMLSpanElement,
    description: "A very very VERY underpaid farmer",
  },
  {
    name: document.getElementById("farms") as HTMLButtonElement,
    cost: 100,
    rate: 2,
    amount: 0,
    costElement: document.getElementById(
      "upgradeTwoCost",
    ) as HTMLSpanElement,
    description: "A new plot of land to grow even more corn",
  },
  {
    name: document.getElementById("tractors") as HTMLButtonElement,
    cost: 1000,
    rate: 50,
    amount: 0,
    costElement: document.getElementById(
      "upgradeThreeCost",
    ) as HTMLSpanElement,
    description: "A tractor improves efficiency tenfold",
  },
  {
    name: document.getElementById("factories") as HTMLButtonElement,
    cost: 10000,
    rate: 100,
    amount: 0,
    costElement: document.getElementById(
      "upgradeFourCost",
    ) as HTMLSpanElement,
    description: "Get that pipeline going to get corn to the masses",
  },
  {
    name: document.getElementById("theaters") as HTMLButtonElement,
    cost: 100000,
    rate: 200,
    amount: 0,
    costElement: document.getElementById(
      "upgradeFiveCost",
    ) as HTMLSpanElement,
    description: "Why just sell corn when you can also sell popcorn?",
  },
];

//Game countainer that holds all the game variables
const Game = {
  counter: 0,
};

//Creating a button variable and customizing it's properties
const button = document.createElement("button");
button.id = "button";
document.body.appendChild(button);
button.innerText = "🌽";
button.title =
  "The corn calls for you... Submit to the corn... become one with the corn... everything is corn... 🌽";

//Creating a counter variable and customizing it's properties
const counterElement = document.getElementById("counter") as HTMLSpanElement;

//Adding an event listener to the button to increment the counter variable
button.addEventListener("click", () => {
  Game.counter++;
  counterElement.innerText = Game.counter.toString();
});

//Helper function to deduct the cost of an upgrade from the counter
function purchase(cost: number) {
  Game.counter -= cost;
  counterElement.innerText = Game.counter.toString();
}

//Function to add event listeners to all upgrade buttons
function eventListeners() {
  for (const upgrade of upgrades) {
    upgrade.name.title = upgrade.description;
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
