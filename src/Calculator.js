export default class Calculator {
  constructor(root, { buttons }) {
    this.root = root;
    this.buttons = buttons;
    this.display = "0";
    this.previous = null;
    this.operator = null;
    this.fresh = true;
    this.storage = localStorage;
  }

  render() {
    this.root.innerHTML = `
      <div class="display">${this.display}</div>
      <div class="grid">
        ${this.buttons
          .map(
            (e) =>
              `<button class="btn ${e.classStyle}" data-id="${e.id}" data-type="${e.type}">${e.value}</button>`,
          )
          .join("")}
      </div>
    `;

    this.root.querySelector(".grid").addEventListener("click", (e) => {
      const btn = e.target.closest("button.btn");
      if (!btn) return;
      this.handleClick(btn.dataset.id, btn.dataset.type);
    });
  }

  handleClick(id, type) {
    if (type === "number") this.inputNumber(id);
    if (type === "operator") this.inputOperator(id);
    if (type === "action") this.inputAction(id);
    if (type === "memory") this.inputMemory(id);
    this.updateDisplay();
  }

  inputNumber(id) {
    if (id === "comma") {
      if (this.fresh) {
        this.display = "0";
        this.fresh = false;
      }
      if (!this.display.includes(",")) this.display += ",";
      return;
    }
    if (this.fresh || this.display === "0") {
      this.display = id;
      this.fresh = false;
    } else {
      this.display += id;
    }
  }

  inputOperator(id) {
    if (id === "equals") {
      this.calculate();
      return;
    }
    this.previous = parseFloat(this.display.replace(",", "."));
    this.operator = id;
    this.fresh = true;
  }

  inputAction(id) {
    if (id === "ac") {
      this.display = "0";
      this.previous = null;
      this.operator = null;
      this.fresh = true;
    }
    if (id === "percent") {
      this.display = String(
        parseFloat(this.display.replace(",", ".")) / 100,
      ).replace(".", ",");
      this.fresh = true;
    }
  }

  inputMemory(id) {
    const value = parseFloat(this.display.replace(",", "."));
    if (id === "ms") this.storage.setItem("calc.memory", value);
    if (id === "mc") this.storage.removeItem("calc.memory");
    if (id === "m+")
      this.storage.setItem(
        "calc.memory",
        (parseFloat(this.storage.getItem("calc.memory")) || 0) + value,
      );
    if (id === "m-")
      this.storage.setItem(
        "calc.memory",
        (parseFloat(this.storage.getItem("calc.memory")) || 0) - value,
      );
    if (id === "mr") {
      this.display = String(this.storage.getItem("calc.memory") || "0").replace(
        ".",
        ",",
      );
      this.fresh = true;
    }
  }

  calculate() {
    if (this.operator === null || this.previous === null) return;
    const a = this.previous;
    const b = parseFloat(this.display.replace(",", "."));
    let result = 0;

    if (this.operator === "add") result = a + b;
    if (this.operator === "sub") result = a - b;
    if (this.operator === "mul") result = a * b;
    if (this.operator === "div") result = b === 0 ? NaN : a / b;

    this.display = isFinite(result)
      ? String(result).replace(".", ",")
      : "Ошибка";
    this.previous = null;
    this.operator = null;
    this.fresh = true;
  }

  updateDisplay() {
    this.root.querySelector(".display").textContent = this.display;
  }
}
