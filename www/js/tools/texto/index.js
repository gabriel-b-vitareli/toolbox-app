/*
  tools/texto/index.js
  Ferramentas de texto: mudar maiusculas/minusculas/titulo, e contar
  caracteres/palavras/linhas em tempo real. Nao se encaixa perfeitamente
  em nenhuma categoria especifica - por isso mora em "Outros".
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";
import { recordUsage } from "../../core/history.js";

function toTitleCase(str) {
  return str.replace(/\S+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function toSentenceCase(str) {
  return str.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
}

function render(container) {
  container.innerHTML = `
    <div class="text-tool-widget">
      <textarea id="text-tool-input" placeholder="Cole ou digite um texto..."></textarea>

      <div class="text-tool-actions">
        <button type="button" data-action="upper">MAIUSCULAS</button>
        <button type="button" data-action="lower">minusculas</button>
        <button type="button" data-action="title">Cada Palavra</button>
        <button type="button" data-action="sentence">Como frase</button>
        <button type="button" data-action="clear">Limpar</button>
      </div>

      <div class="text-tool-stats">
        <div class="text-tool-stats__item">
          <div class="text-tool-stats__value" id="text-stat-chars">0</div>
          <div class="text-tool-stats__label">caracteres</div>
        </div>
        <div class="text-tool-stats__item">
          <div class="text-tool-stats__value" id="text-stat-words">0</div>
          <div class="text-tool-stats__label">palavras</div>
        </div>
        <div class="text-tool-stats__item">
          <div class="text-tool-stats__value" id="text-stat-lines">0</div>
          <div class="text-tool-stats__label">linhas</div>
        </div>
      </div>
    </div>
  `;

  const textarea = container.querySelector("#text-tool-input");
  const charsEl = container.querySelector("#text-stat-chars");
  const wordsEl = container.querySelector("#text-stat-words");
  const linesEl = container.querySelector("#text-stat-lines");

  function updateStats() {
    const value = textarea.value;
    charsEl.textContent = value.length;
    wordsEl.textContent = value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
    linesEl.textContent = value === "" ? 0 : value.split("\n").length;
  }

  textarea.addEventListener("input", () => {
    recordUsage("texto");
    updateStats();
  });

  container.querySelector(".text-tool-actions").addEventListener("click", (event) => {
    const btn = event.target.closest("[data-action]");
    if (!btn) return;
    recordUsage("texto");
    const action = btn.dataset.action;

    if (action === "upper") textarea.value = textarea.value.toUpperCase();
    else if (action === "lower") textarea.value = textarea.value.toLowerCase();
    else if (action === "title") textarea.value = toTitleCase(textarea.value);
    else if (action === "sentence") textarea.value = toSentenceCase(textarea.value.toLowerCase());
    else if (action === "clear") textarea.value = "";

    updateStats();
  });

  updateStats();
}

registry.register({
  id: "texto",
  name: "Conversor de Texto",
  description: "Mude entre maiusculas, minusculas e conte palavras.",
  category: "outros",
  keywords: ["texto", "maiuscula", "minuscula", "contador", "palavras", "caracteres"],
  icon: icons.textCase,
  accent: "gray",
  requirements: [],
  render,
});
