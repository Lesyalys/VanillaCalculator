import Calculator from "./src/Calculator.js";
import { buttons } from "./src/data.js";

const root = document.getElementById("app");
new Calculator(root, { buttons }).render();
