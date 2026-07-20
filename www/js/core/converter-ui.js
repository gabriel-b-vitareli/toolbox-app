/*
  converter-ui.js
  Componente compartilhado por qualquer ferramenta do tipo "converta X para Y"
  (comprimento, massa, temperatura, area, volume...). Cada ferramenta so
  precisa fornecer a lista de unidades e a funcao de conversao - o HTML,
  os eventos e a formatacao ficam centralizados aqui, uma unica vez.
*/

import { icons } from "./icons.js";
import { recordUsage } from "./history.js";

function formatNumber(value) {
  if (!isFinite(value)) return "0";
  return value.toLocaleString("pt-BR", { maximumFractionDigits: 6 });
}

function unitOptions(units, selectedId) {
  return units
    .map((u) => `<option value="${u.id}" ${u.id === selectedId ? "selected" : ""}>${u.symbol}</option>`)
    .join("");
}

/**
 * Desenha um conversor de/para dentro de "container".
 *
 * @param {HTMLElement} container
 * @param {Object} options
 * @param {Array}  options.units       lista de { id, symbol, label }
 * @param {Function} options.convert   (value, fromId, toId) => number
 * @param {string} options.defaultFrom id da unidade inicial de entrada
 * @param {string} options.defaultTo   id da unidade inicial de saida
 * @param {string} options.idPrefix    prefixo unico para os ids dos inputs (evita colisao entre ferramentas)
 * @param {string} options.toolId      id da ferramenta no registry, para registrar uso real no historico
 */
export function createConverterUI(container, { units, convert, defaultFrom, defaultTo, idPrefix, toolId }) {
  const p = idPrefix;

  container.innerHTML = `
    <div class="converter">
      <div class="converter__field">
        <label class="converter__label" for="${p}-input-value">De</label>
        <div class="converter__row">
          <input class="converter__input" id="${p}-input-value" type="number" inputmode="decimal" value="1" />
          <select class="converter__select" id="${p}-input-unit">${unitOptions(units, defaultFrom)}</select>
        </div>
      </div>

      <button class="converter__swap" id="${p}-swap-btn" type="button" aria-label="Inverter unidades">
        ${icons.arrowsUpDown()}
      </button>

      <div class="converter__field">
        <label class="converter__label" for="${p}-output-value">Para</label>
        <div class="converter__row">
          <input class="converter__input" id="${p}-output-value" type="text" readonly />
          <select class="converter__select" id="${p}-output-unit">${unitOptions(units, defaultTo)}</select>
        </div>
      </div>
    </div>
  `;

  const inputValue = container.querySelector(`#${p}-input-value`);
  const inputUnit = container.querySelector(`#${p}-input-unit`);
  const outputValue = container.querySelector(`#${p}-output-value`);
  const outputUnit = container.querySelector(`#${p}-output-unit`);
  const swapBtn = container.querySelector(`#${p}-swap-btn`);

  function recalc() {
    const value = parseFloat(inputValue.value.replace(",", ".")) || 0;
    const result = convert(value, inputUnit.value, outputUnit.value);
    outputValue.value = formatNumber(result);
  }

  // So registra uso em resposta a um evento de verdade do usuario (digitar,
  // trocar unidade, inverter) - nunca no calculo inicial automatico que
  // roda so para popular a tela quando ela abre.
  function handleUserInteraction() {
    recalc();
    if (toolId) recordUsage(toolId);
  }

  inputValue.addEventListener("input", handleUserInteraction);
  inputUnit.addEventListener("change", handleUserInteraction);
  outputUnit.addEventListener("change", handleUserInteraction);

  swapBtn.addEventListener("click", () => {
    const from = inputUnit.value;
    const to = outputUnit.value;
    inputUnit.value = to;
    outputUnit.value = from;
    handleUserInteraction();
  });

  recalc();
}
