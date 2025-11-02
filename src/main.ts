import "./style.css";

/******************************/
//Game State
//UI Elements
//Runner Button Helper Functions
//Helper Functions
//Upgrade Definitions
//Update Loop & Game Tickers
//Event Listeners
//Start
/******************************/

/*~~~~~~~~~~~~~~~~~~ GAME STATE ~~~~~~~~~~~~~~~~~~*/

// Defining an upgrade type to hold all the properties of an upgrade
interface upgradeType {
  name: HTMLButtonElement;
  cost: number;
  rate: number;
  amount: number;
  costElement: HTMLSpanElement;
  description: string;
}

type Vec = { x: number; y: number };

const MAXSPEED: number = 3;
const DRAG: number = 0.1;
const FLEEDIST: number = 300;

let counter = 0;

// Mouse position
let mouse: Vec = { x: 0, y: 0 };

// targetButton class and related helper functions done by Andrew Richmond(acrmine)
class targetButton {
  btn: HTMLButtonElement;
  x: number;
  y: number;
  vel: Vec;
  btnRect: DOMRect;
  btnCenter: Vec;
  kicked: boolean;

  constructor(buttonElem: string, buttonText: string) {
    this.btn = document.createElement("button");
    this.btn.id = buttonElem;
    this.btn.classList.add(buttonElem);
    this.btn.textContent = buttonText;
    this.x = globalThis.innerWidth / 2;
    this.y = globalThis.innerHeight / 2;
    this.vel = { x: 0, y: 0 };
    document.body.appendChild(this.btn);
    this.setBtnPos();
    this.btnRect = this.btn.getBoundingClientRect();
    this.btnCenter = {
      x: this.x + this.btnRect.width / 2,
      y: this.y + this.btnRect.height / 2,
    };
    this.x -= this.btnRect.width / 2;
    this.y -= this.btnRect.width / 2;
    this.setBtnPos();
    this.kicked = false;
  }

  // Update button position on screen
  setBtnPos() {
    this.btn.style.left = `${this.x}px`;
    this.btn.style.top = `${this.y}px`;
  }

  // Adds the values to velocity, position needs to be updated after that
  addRepulsion(pos: Vec, strength: number) {
    const dx = this.btnCenter.x - pos.x;
    const dy = this.btnCenter.y - pos.y;
    const d = Math.max(1, Math.hypot(dx, dy));
    const scale = strength / (d * d); // inverse square
    this.vel.x += (dx / d) * scale;
    this.vel.y += (dy / d) * scale;
  }

  // Kick button in a direction (Needs work for actual implementation)
  kickBtn(pos: Vec, strength: number) {
    this.kicked = true;
    this.addRepulsion(pos, strength);
    this.updatePosWVel();
    this.setBtnPos();
  }

  // Update recorded button position
  updatePosWVel() {
    this.x += this.vel.x;
    this.y += this.vel.y;
  }

  fleeFromObject(pos: Vec) {
    if (!this.kicked) {
      if (dist(mouse, this.btnCenter) <= FLEEDIST) {
        this.addRepulsion(pos, 10000);
      }
    }
  }

  handleSpeed() {
    const speed = Math.hypot(this.vel.x, this.vel.y);
    if (this.kicked) {
      if (speed > MAXSPEED) {
        this.vel.x = shrink(this.vel.x, DRAG * 2);
        this.vel.y = shrink(this.vel.y, DRAG * 2);
      } else {
        this.kicked = false;
      }
    } else {
      if (speed > MAXSPEED) {
        this.vel.x = (this.vel.x / speed) * MAXSPEED;
        this.vel.y = (this.vel.y / speed) * MAXSPEED;
      } else if (speed > 0) {
        this.vel.x = shrink(this.vel.x, DRAG);
        this.vel.y = shrink(this.vel.y, DRAG);
      }
    }
  }

  keepButtonOnScreen() {
    this.x = Math.max(
      0,
      Math.min(globalThis.innerWidth - this.btnRect.width, this.x),
    );
    this.y = Math.max(
      0,
      Math.min(globalThis.innerHeight - this.btnRect.height, this.y),
    );
  }

  update() {
    this.btnRect = this.btn.getBoundingClientRect();
    this.btnCenter = {
      x: this.x + this.btnRect.width / 2,
      y: this.y + this.btnRect.height / 2,
    };

    this.fleeFromObject(mouse);
    this.handleSpeed();

    this.updatePosWVel();
    this.keepButtonOnScreen();
    this.setBtnPos();
  }
}

/*~~~~~~~~~~~~~~~~~~ UI ELEMENTS ~~~~~~~~~~~~~~~~~~*/

document.body.innerHTML = `
  <head>
    <title>Incremental game</title>
  </head>
  <h1>🌽 Corn Clicker 🌽</h1>
  <p id = 'total'><span id = 'counter'>0</span> ears of corn</p>
  <button id = "farmers">Hire a Corn Farmer(<span id = upgradeOneCost>10</span> ears)</button>
  <button id = "farms">Buy a Corn Field (<span id = upgradeTwoCost>100</span> ears)</button>
  <button id = 'tractors'>Buy a Tractor (<span id = upgradeThreeCost>1000</span> ears)</button>
  <button id = "factories">Buy a Factory (<span id = upgradeFourCost>10000</span> ears)</button>
  <button id = "theaters">Buy a Theater (<span id = upgradeFiveCost>100000</span> ears)</button>
  <p id = 'CPS'><span id = 'growth' >0</span> corn per second</p>
`;

const targetBtn = new targetButton("button", "🌽");

const counterElement = document.getElementById("counter") as HTMLSpanElement;

/*~~~~~~~~~~~~~~~~~~ UPGRADE DEFINITIONS ~~~~~~~~~~~~~~~~~~*/

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

/*~~~~~~~~~~~~~~~~~~ RUNNER BUTTON HELPER FUNCTIONS ~~~~~~~~~~~~~~~~~~*/

// Calc distance between two points
const dist = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);

// Shrink "val" towards 0 by "amount" without passing it
const shrink = (val: number, amount: number): number => {
  if (val !== 0) {
    if (val > 0) {
      return Math.max(0, val - amount);
    } else if (val < 0) {
      return Math.min(0, val + amount);
    }
  }
  return val;
};

const addToCounter = (step: number) => {
  counter += step;
  counterElement.textContent = counter.toFixed(2) + "ears of corn";
};

/*~~~~~~~~~~~~~~~~~~ HELPER FUNCTIONS ~~~~~~~~~~~~~~~~~~*/

//Helper function to deduct the cost of an upgrade from the counter
function purchase(cost: number) {
  counter -= cost;
  counterElement.innerText = counter.toString();
}

// Helper function to check if the player can afford an upgrade and disable/enable the button accordingly
function disableCheck() {
  for (const upgrade of upgrades) {
    if (counter < upgrade.cost) {
      upgrade.name.disabled = true;
    } else {
      upgrade.name.disabled = false;
    }
  }
}

// Helper function to calculate the total CPS from all upgrades
function calcCornPerSecond(): number {
  let CornPerSecond = 0;

  for (const upgrade of upgrades) {
    CornPerSecond += upgrade.amount * upgrade.rate;
  }

  return CornPerSecond;
}

// HelperFunction to update the counter based on auto-clickers
function updateCounter(deltaTime: number) {
  for (const upgrade of upgrades) {
    counter += upgrade.amount * upgrade.rate * deltaTime;
  }

  // Update the displayed counter to the floored value of counter
  counterElement.innerText = Math.floor(counter).toString();
}

// Helper Function to update the cornPerSecond display
function updateCornPerSecond() {
  const cornPerSecondGrowth = document.getElementById(
    "growth",
  ) as HTMLSpanElement;
  const cornPerSecond: number = calcCornPerSecond();
  cornPerSecondGrowth.innerText = cornPerSecond.toFixed(1).toString();
}

/*~~~~~~~~~~~~~~~~~~ UPDATE LOOP & GAME TICKERS ~~~~~~~~~~~~~~~~~~*/

let lastTime = performance.now();
// Function to update the counter display and handle auto-clickers
function update(currentTime: number) {
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  // Check if the player can afford upgrades and enable/disable buttons accordingly
  disableCheck();

  // Update the counter based on auto-clickers
  updateCounter(deltaTime);
  // Update the cornPerSecond display
  updateCornPerSecond();

  targetBtn.update();

  // Loop again!
  requestAnimationFrame(update);
}

/*~~~~~~~~~~~~~~~~~~ EVENT LISTENERS ~~~~~~~~~~~~~~~~~~*/

//Adding an event listener to the button to increment the counter variable
targetBtn.btn.addEventListener("click", () => {
  addToCounter(1);

  targetBtn.vel.x = 0;
  targetBtn.vel.y = 0;
});

document.addEventListener("mousemove", (e) => {
  mouse = { x: e.clientX, y: e.clientY };
});

//Function to add event listeners to all upgrade buttons
function initializeEventListeners() {
  for (const upgrade of upgrades) {
    upgrade.name.title = upgrade.description;
    upgrade.name.addEventListener("click", () => {
      if (counter >= upgrade.cost) {
        purchase(upgrade.cost);
        upgrade.amount++;
        upgrade.cost = upgrade.cost * 1.15;
        upgrade.costElement.innerText = upgrade.cost.toFixed(2).toString();
      }
    });
  }
}

initializeEventListeners();

/*~~~~~~~~~~~~~~~~~~ START ~~~~~~~~~~~~~~~~~~*/
// Start the update loop
requestAnimationFrame(update);
