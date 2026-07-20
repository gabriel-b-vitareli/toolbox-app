/*
  tools/sorteador/index.js
  Sorteador: joga moeda, joga dado, sorteia numero num intervalo, ou
  sorteia um item de uma lista digitada pelo usuario. Usa
  crypto.getRandomValues (mesma base do Gerador de Senha) para
  aleatoriedade de melhor qualidade que Math.random.
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";
import { recordUsage } from "../../core/history.js";

const MODES = [
  { id: "moeda", label: "Moeda" },
  { id: "dado", label: "Dado" },
  { id: "numero", label: "Numero" },
  { id: "lista", label: "Lista" },
];

function randomInt(min, max) {
  const range = max - min + 1;
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return min + (arr[0] % range);
}

function render(container) {
  container.innerHTML = `
    <div class="randomizer-widget">
      <div class="randomizer-tabs" id="randomizer-tabs">
        ${MODES.map((m, i) => `<button class="randomizer-tab" type="button" data-mode="${m.id}" data-active="${i === 0}">${m.label}</button>`).join("")}
      </div>

      <div class="randomizer-result" id="randomizer-result">🪙</div>

      <div id="randomizer-options"></div>

      <button class="btn-primary" type="button" id="randomizer-go-btn">
        ${icons.dice()}
        Sortear
      </button>
    </div>
  `;

  const tabsEl = container.querySelector("#randomizer-tabs");
  const resultEl = container.querySelector("#randomizer-result");
  const optionsEl = container.querySelector("#randomizer-options");
  const goBtn = container.querySelector("#randomizer-go-btn");

  let mode = "moeda";

  function renderOptions() {
    if (mode === "numero") {
      optionsEl.innerHTML = `
        <div class="randomizer-row">
          <div class="converter__field">
            <label class="converter__label">De</label>
            <input class="converter__input" type="number" id="randomizer-min" value="1" style="font-size:1.1rem;" />
          </div>
          <div class="converter__field">
            <label class="converter__label">Ate</label>
            <input class="converter__input" type="number" id="randomizer-max" value="100" style="font-size:1.1rem;" />
          </div>
        </div>
      `;
    } else if (mode === "lista") {
      optionsEl.innerHTML = `
        <div class="randomizer-field">
          <label class="converter__label">Uma opcao por linha</label>
          <textarea id="randomizer-list" placeholder="Pizza&#10;Sushi&#10;Massa&#10;Churrasco"></textarea>
        </div>
      `;
    } else {
      optionsEl.innerHTML = "";
    }
  }

  function draw() {
    if (mode === "moeda") {
      resultEl.textContent = randomInt(0, 1) === 0 ? "Cara" : "Coroa";
    } else if (mode === "dado") {
      resultEl.textContent = String(randomInt(1, 6));
    } else if (mode === "numero") {
      const min = parseInt(container.querySelector("#randomizer-min").value, 10) || 0;
      const max = parseInt(container.querySelector("#randomizer-max").value, 10) || 0;
      resultEl.textContent = min > max ? "Intervalo invalido" : String(randomInt(min, max));
    } else if (mode === "lista") {
      const items = container
        .querySelector("#randomizer-list")
        .value.split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      resultEl.textContent = items.length === 0 ? "Digite algumas opcoes" : items[randomInt(0, items.length - 1)];
    }
  }

  tabsEl.querySelectorAll(".randomizer-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      mode = tab.dataset.mode;
      tabsEl.querySelectorAll(".randomizer-tab").forEach((t) => t.setAttribute("data-active", String(t === tab)));
      resultEl.textContent = mode === "moeda" ? "🪙" : mode === "dado" ? "🎲" : "?";
      renderOptions();
    });
  });

  goBtn.addEventListener("click", () => {
    recordUsage("sorteador");
    draw();
  });

  renderOptions();
}

registry.register({
  id: "sorteador",
  name: "Sorteador",
  description: "Jogue moeda, dado, ou sorteie um numero ou item de uma lista.",
  category: "geradores",
  keywords: ["sorteador", "sorteio", "dado", "moeda", "aleatorio", "random", "decisao"],
  icon: icons.dice,
  accent: "orange",
  requirements: [],
  render,
});
