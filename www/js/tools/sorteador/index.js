/*
  tools/sorteador/index.js
  Sorteador: joga moeda, joga dado, sorteia numero num intervalo, ou
  sorteia um item de uma lista digitada pelo usuario. Usa
  crypto.getRandomValues (mesma base do Gerador de Senha) para
  aleatoriedade de melhor qualidade que Math.random no resultado final.

  O resultado final SEMPRE vem de crypto.getRandomValues. A "roleta"
  visual que pisca valores rapidamente antes de revelar o resultado usa
  Math.random (e so decorativa, nao precisa da mesma qualidade).
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";
import { recordUsage } from "../../core/history.js";

const MODES = [
  { id: "moeda", label: "Moeda", icon: "🪙" },
  { id: "dado", label: "Dado", icon: "🎲" },
  { id: "numero", label: "Numero", icon: "#" },
  { id: "lista", label: "Lista", icon: "📋" },
];

const SPIN_DURATION = 650;
const SPIN_TICK = 55;

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

      <div class="randomizer-result" id="randomizer-result" data-mode="moeda">
        <span id="randomizer-result-text">🪙</span>
      </div>

      <div id="randomizer-options"></div>

      <button class="btn-primary" type="button" id="randomizer-go-btn">
        ${icons.dice()}
        Sortear
      </button>
    </div>
  `;

  const tabsEl = container.querySelector("#randomizer-tabs");
  const resultEl = container.querySelector("#randomizer-result");
  const resultTextEl = container.querySelector("#randomizer-result-text");
  const optionsEl = container.querySelector("#randomizer-options");
  const goBtn = container.querySelector("#randomizer-go-btn");

  let mode = "moeda";
  let spinning = false;

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

  /** Le as opcoes de entrada UMA vez (evita corrida se o usuario editar durante a animacao). */
  function prepareDraw() {
    if (mode === "moeda") {
      return { candidates: ["Cara", "Coroa"], final: () => (randomInt(0, 1) === 0 ? "Cara" : "Coroa") };
    }
    if (mode === "dado") {
      return { candidates: ["1", "2", "3", "4", "5", "6"], final: () => String(randomInt(1, 6)) };
    }
    if (mode === "numero") {
      const min = parseInt(container.querySelector("#randomizer-min").value, 10) || 0;
      const max = parseInt(container.querySelector("#randomizer-max").value, 10) || 0;
      if (min > max) return { error: "Intervalo invalido" };
      const sample = Array.from({ length: 8 }, () => String(Math.floor(min + Math.random() * (max - min + 1))));
      return { candidates: sample, final: () => String(randomInt(min, max)) };
    }
    // lista
    const items = container
      .querySelector("#randomizer-list")
      .value.split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (items.length === 0) return { error: "Digite algumas opcoes" };
    return { candidates: items, final: () => items[randomInt(0, items.length - 1)] };
  }

  function spinTo(finalValue, candidates) {
    return new Promise((resolve) => {
      const startedAt = Date.now();
      resultEl.classList.remove("randomizer-result--pop");
      const iv = setInterval(() => {
        if (Date.now() - startedAt >= SPIN_DURATION) {
          clearInterval(iv);
          resultTextEl.textContent = finalValue;
          // forca reflow para reiniciar a animacao de "pop" mesmo se o
          // resultado anterior tiver a mesma classe
          void resultEl.offsetWidth;
          resultEl.classList.add("randomizer-result--pop");
          resolve();
          return;
        }
        resultTextEl.textContent = candidates[Math.floor(Math.random() * candidates.length)];
      }, SPIN_TICK);
    });
  }

  async function draw() {
    if (spinning) return;
    const prepared = prepareDraw();

    if (prepared.error) {
      resultEl.classList.remove("randomizer-result--pop");
      resultTextEl.textContent = prepared.error;
      return;
    }

    spinning = true;
    goBtn.disabled = true;
    recordUsage("sorteador");

    await spinTo(prepared.final(), prepared.candidates);

    goBtn.disabled = false;
    spinning = false;
  }

  tabsEl.querySelectorAll(".randomizer-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      if (spinning) return;
      mode = tab.dataset.mode;
      tabsEl.querySelectorAll(".randomizer-tab").forEach((t) => t.setAttribute("data-active", String(t === tab)));
      resultEl.setAttribute("data-mode", mode);
      resultEl.classList.remove("randomizer-result--pop");
      resultTextEl.textContent = MODES.find((m) => m.id === mode).icon;
      renderOptions();
    });
  });

  goBtn.addEventListener("click", draw);

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
