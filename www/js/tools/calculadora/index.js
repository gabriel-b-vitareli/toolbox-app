/*
  tools/calculadora/index.js
  Calculadora basica (soma, subtracao, multiplicacao, divisao). Interface
  propria (grid de botoes), nao reaproveita nenhum helper existente -
  mais um exemplo de que a arquitetura aceita qualquer tipo de tela.
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";

const BUTTONS = [
  { label: "C", type: "clear" },
  { label: "±", type: "sign" },
  { label: "%", type: "percent" },
  { label: "÷", type: "op", value: "/" },
  { label: "7", type: "digit" },
  { label: "8", type: "digit" },
  { label: "9", type: "digit" },
  { label: "×", type: "op", value: "*" },
  { label: "4", type: "digit" },
  { label: "5", type: "digit" },
  { label: "6", type: "digit" },
  { label: "-", type: "op", value: "-" },
  { label: "1", type: "digit" },
  { label: "2", type: "digit" },
  { label: "3", type: "digit" },
  { label: "+", type: "op", value: "+" },
  { label: "0", type: "digit", wide: true },
  { label: ",", type: "decimal" },
  { label: "=", type: "equals" },
];

function formatValue(n) {
  if (!isFinite(n)) return "Erro";
  const rounded = Math.round((n + Number.EPSILON) * 1e10) / 1e10;
  return rounded.toLocaleString("pt-BR", { maximumFractionDigits: 8 });
}

function render(container) {
  container.innerHTML = `
    <div class="calc-widget">
      <div class="calc-display">
        <div class="calc-display__expression" id="calc-expression">&nbsp;</div>
        <div class="calc-display__value" id="calc-value">0</div>
      </div>
      <div class="calc-grid" id="calc-grid">
        ${BUTTONS.map((b) => {
          const classes = ["calc-btn"];
          if (b.type === "op") classes.push("calc-btn--op");
          if (b.type === "equals") classes.push("calc-btn--equals", "calc-btn--op");
          if (b.wide) classes.push("calc-btn--wide");
          return `<button class="${classes.join(" ")}" type="button" data-type="${b.type}" data-value="${b.value || b.label}">${b.label}</button>`;
        }).join("")}
      </div>
    </div>
  `;

  const expressionEl = container.querySelector("#calc-expression");
  const valueEl = container.querySelector("#calc-value");
  const grid = container.querySelector("#calc-grid");

  let current = "0";
  let previous = null;
  let pendingOp = null;
  let justEvaluated = false;

  function updateDisplay() {
    valueEl.textContent = current;
    expressionEl.textContent = previous !== null && pendingOp ? `${formatValue(previous)} ${labelForOp(pendingOp)}` : "\u00A0";
  }

  function labelForOp(op) {
    return { "/": "÷", "*": "×", "-": "-", "+": "+" }[op] || op;
  }

  function compute(a, b, op) {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? NaN : a / b;
      default: return b;
    }
  }

  function inputDigit(d) {
    if (justEvaluated) {
      current = d;
      justEvaluated = false;
    } else {
      current = current === "0" ? d : current + d;
    }
  }

  function inputDecimal() {
    if (justEvaluated) {
      current = "0,";
      justEvaluated = false;
      return;
    }
    if (!current.includes(",")) current += ",";
  }

  function toNumber(str) {
    return parseFloat(str.replace(",", ".")) || 0;
  }

  function handleOp(op) {
    if (pendingOp && previous !== null && !justEvaluated) {
      previous = compute(previous, toNumber(current), pendingOp);
      current = formatValue(previous);
    } else {
      previous = toNumber(current);
    }
    pendingOp = op;
    justEvaluated = true; // proximo digito comeca um numero novo
  }

  function handleEquals() {
    if (pendingOp === null || previous === null) return;
    const result = compute(previous, toNumber(current), pendingOp);
    current = formatValue(result);
    previous = null;
    pendingOp = null;
    justEvaluated = true;
  }

  grid.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-type]");
    if (!btn) return;
    const { type, value } = btn.dataset;

    switch (type) {
      case "digit":
        inputDigit(value);
        break;
      case "decimal":
        inputDecimal();
        break;
      case "clear":
        current = "0";
        previous = null;
        pendingOp = null;
        justEvaluated = false;
        break;
      case "sign":
        current = formatValue(toNumber(current) * -1);
        break;
      case "percent":
        current = formatValue(toNumber(current) / 100);
        break;
      case "op":
        handleOp(value);
        break;
      case "equals":
        handleEquals();
        break;
    }
    updateDisplay();
  });

  updateDisplay();
}

registry.register({
  id: "calculadora",
  name: "Calculadora",
  description: "Some, subtraia, multiplique e divida rapidamente.",
  category: "calculadoras",
  keywords: ["calculadora", "conta", "soma", "matematica", "calculo"],
  icon: icons.calculator,
  accent: "green",
  requirements: [],
  render,
});
