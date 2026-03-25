class Calculator {
  constructor(screen_display) {
    this.screen_display = screen_display;
    this.display_value = "";
    this.last_result = "";
  }

  append_number(number) {
    this.display_value += number;
    this.update_display();
  }

  append_dot() {
    if (
      this.display_value === "" ||
      "+-×÷%".includes(this.display_value.slice(-1))
    ) {
      this.display_value += "0.";
      this.update_display();
      return;
    }

    var last_number = "";
    for (var i = this.display_value.length - 1; i >= 0; i--) {
      if ("+-×÷%".includes(this.display_value[i])) break;
      last_number = this.display_value[i] + last_number;
    }

    if (!last_number.includes(".")) {
      this.display_value += ".";
      this.update_display();
    }
  }

  append_operator(operator) {
    if (this.display_value === "" && operator === "-") {
      this.display_value += operator;
      this.update_display();
      return;
    }

    if (
      this.display_value.length === 1 &&
      this.display_value === "-" &&
      "+×÷%".includes(operator)
    ) {
      return;
    }

    const last_char = this.display_value.slice(-1);
    if ("+-×÷%".includes(last_char)) {
      this.display_value = this.display_value.slice(0, -1) + operator;
    } else if (this.display_value !== "") {
      this.display_value += operator;
    }
    this.update_display();
  }

  delete() {
    this.display_value = this.display_value.slice(0, -1);
    this.update_display();
  }

  all_clear() {
    this.display_value = "";
    this.update_display();
  }

  append_ans() {
    if (this.last_result !== "") {
      this.display_value = "";
      this.display_value += this.last_result;
      this.update_display();
    }
  }

  calculate() {
    if (this.display_value === "") return;

    // Nếu ký tự cuối là toán tử
    if ("+-×÷%".includes(this.display_value.slice(-1))) {
      return;
    }

    var numbers = [];
    var operators = [];
    var current_number = "";

    // Vòng lặp tách lấy số và toán tử
    for (var i = 0; i < this.display_value.length; i++) {
      var current_char = this.display_value[i];
      if (
        current_char === "-" &&
        (i === 0 || "+-×÷%".includes(this.display_value[i - 1]))
      ) {
        current_number += current_char;
      } else if ("+-×÷%".includes(current_char)) {
        numbers.push(parseFloat(current_number));
        operators.push(current_char);
        current_number = "";
      } else {
        current_number += current_char;
      }
    }
    numbers.push(parseFloat(current_number));

    const precedence = ["÷", "%", "×", "-", "+"];

    // Lặp theo thứ tự ưu tiên
    precedence.forEach((op) => {
      var id_x = operators.indexOf(op);
      while (id_x !== -1) {
        switch (op) {
          case "÷":
            numbers.splice(id_x, 2, numbers[id_x] / numbers[id_x + 1]);
            break;
          case "×":
            numbers.splice(id_x, 2, numbers[id_x] * numbers[id_x + 1]);
            break;
          case "%":
            numbers.splice(id_x, 2, numbers[id_x] % numbers[id_x + 1]);
            break;
          case "+":
            numbers.splice(id_x, 2, numbers[id_x] + numbers[id_x + 1]);
            break;
          case "-":
            numbers.splice(id_x, 2, numbers[id_x] - numbers[id_x + 1]);
            break;
        }
        operators.splice(id_x, 1);
        id_x = operators.indexOf(op);
      }
    });
    this.display_value = numbers[0].toString();
    this.last_result = this.display_value;
    this.update_display();
  }

  update_display() {
    this.screen_display.value = this.display_value;
  }
}

const screen_display = document.querySelector("[data-display]");
const btn_all_clear = document.querySelector("[data-all-clear]");
const btn_delete = document.querySelector("[data-delete]");
const btn_dot = document.querySelector("[data-dot]");
const btn_ans = document.querySelector("[data-ans]");
const btn_equal = document.querySelector("[data-equal]");
const btn_operator = document.querySelectorAll("[data-operator]");
const btn_number = document.querySelectorAll("[data-number]");

const calculator = new Calculator(screen_display);

btn_number.forEach((btn) => {
  btn.addEventListener("click", () => {
    calculator.append_number(btn.innerText);
  });
});

btn_operator.forEach((btn) => {
  btn.addEventListener("click", () => {
    calculator.append_operator(btn.innerText);
  });
});

btn_dot.addEventListener("click", () => {
  calculator.append_dot();
});

btn_delete.addEventListener("click", () => {
  calculator.delete();
});

btn_ans.addEventListener("click", () => {
  calculator.append_ans();
});

btn_all_clear.addEventListener("click", () => {
  calculator.all_clear();
});

btn_equal.addEventListener("click", () => {
  calculator.calculate();
});
