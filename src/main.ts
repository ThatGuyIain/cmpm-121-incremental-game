//import exampleIconUrl from "./noun-paperclip-7598668-00449F.png";
import "./style.css";
/*
document.body.innerHTML = `
  <p>Example image asset: <img src="${exampleIconUrl}" class="icon" /></p>
`;
*/

document.body.innerHTML = `
  <h1>Incremental game</h1>
  <button id = "button">🌽Press</button>
  <p><span id = 'counter'>0</span> ears of corn</p>
  <button id = "upgrade1">Purchase Auto Clicker (<span id = upgradeOneCost>10</span> ears)</button>
`;

//Game countainer that holds all the game variables
const Game = {
  counter: 0,
  autoclickers: 0,
};

//Creating a button variable and customizing it's properties
const button = document.getElementById("button") as HTMLButtonElement;

button.style.backgroundColor = "#ddab3fff";
button.style.boxShadow = "0 4px 8px #4e4e4eff";
button.style.borderRadius = "50px";
button.style.scale = "1.4";

//Adding an event listener to the button to increment the counter variable and log it to the console
button.addEventListener("click", () => {
  Game.counter++;
  const counterElement = document.getElementById("counter") as HTMLSpanElement;
  counterElement.innerText = Game.counter.toString();
});

//Creating an upgrade button variable and customizing it's properties
const upgrade1 = document.getElementById("upgrade1") as HTMLButtonElement;

upgrade1.style.backgroundColor = "#ddab3fff";
upgrade1.style.boxShadow = "0 4px 8px #4e4e4eff";
upgrade1.style.borderRadius = "50px";
upgrade1.style.scale = "1.4";

//Adding an event listener to the upgrade button to increase the counter by 2 if the counter is greater than or equal to 10
upgrade1.addEventListener("click", () => {
  if (Game.counter >= 10) {
    Game.counter -= 10;
    const counterElement = document.getElementById(
      "counter",
    ) as HTMLSpanElement;
    counterElement.innerText = Game.counter.toString();
    Game.autoclickers++;
    const upgradeOneCostElement = document.getElementById(
      "upgradeOneCost",
    ) as HTMLSpanElement;
    upgradeOneCostElement.innerText = (10 * (Game.autoclickers + 1)).toString();
  }
});

//Autoclicker function that increments the counter by the number of autoclickers every second
setInterval(() => {
  if (Game.autoclickers > 0) {
    Game.counter = Game.counter + 1;
    const counterElement = document.getElementById(
      "counter",
    ) as HTMLSpanElement;
    counterElement.innerText = Game.counter.toString();
  }
}, 1000 - (Game.autoclickers * 100)); //The more autoclickers you have, the faster the interval runs
