//import exampleIconUrl from "./noun-paperclip-7598668-00449F.png";
import "./style.css";
/*
document.body.innerHTML = `
  <p>Example image asset: <img src="${exampleIconUrl}" class="icon" /></p>
`;
*/

document.body.innerHTML = `
  <h1>Incremental game</h1>
  <button id = "button">💣Press</button>
  <p> Counter: <span id = 'counter'>0</p>
`;

//creating a counter variable for counting the number of button presses
let counter = 0;

//Creating a button variable and customizing it's properties
const button = document.getElementById("button") as HTMLButtonElement;

button.style.backgroundColor = "#ddab3fff";
button.style.boxShadow = "0 4px 8px #4e4e4eff";
button.style.borderRadius = "50px";
button.style.scale = "1.4";

//Adding an event listener to the button to increment the counter variable and log it to the console
button.addEventListener("click", () => {
  counter++;
  const counterElement = document.getElementById("counter") as HTMLSpanElement;
  counterElement.innerText = counter.toString();
});
