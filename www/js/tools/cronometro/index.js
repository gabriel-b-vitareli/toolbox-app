/*
  tools/cronometro/index.js
  Cronometro simples: iniciar, pausar, zerar e marcar voltas.
  Nao depende de nenhum sensor - so setInterval + Date.now() para manter
  precisao mesmo se o navegador atrasar um tick ocasional.
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";

function formatTime(ms) {
  const totalCentis = Math.floor(ms / 10);
  const centis = totalCentis % 100;
  const totalSeconds = Math.floor(totalCentis / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(minutes)}:${pad(seconds)},${pad(centis)}`;
}

function render(container) {
  container.innerHTML = `
    <div class="stopwatch-widget">
      <div class="stopwatch-time" id="stopwatch-time">00:00,00</div>

      <div class="stopwatch-actions">
        <button class="stopwatch-btn-secondary" type="button" id="stopwatch-lap-btn">Marcar volta</button>
        <button class="btn-primary" type="button" id="stopwatch-toggle-btn">
          ${icons.stopwatch()}
          Iniciar
        </button>
      </div>

      <div class="stopwatch-laps">
        <div class="list" id="stopwatch-laps-list"></div>
      </div>
    </div>
  `;

  const timeEl = container.querySelector("#stopwatch-time");
  const toggleBtn = container.querySelector("#stopwatch-toggle-btn");
  const lapBtn = container.querySelector("#stopwatch-lap-btn");
  const lapsList = container.querySelector("#stopwatch-laps-list");

  let running = false;
  let startedAt = 0;
  let elapsedBeforePause = 0;
  let intervalId = null;
  let laps = [];

  function currentElapsed() {
    return elapsedBeforePause + (running ? Date.now() - startedAt : 0);
  }

  function tick() {
    timeEl.textContent = formatTime(currentElapsed());
  }

  function start() {
    running = true;
    startedAt = Date.now();
    intervalId = setInterval(tick, 30);
    toggleBtn.innerHTML = `${icons.stopwatch()} Pausar`;
  }

  function pause() {
    running = false;
    elapsedBeforePause = currentElapsed();
    clearInterval(intervalId);
    toggleBtn.innerHTML = `${icons.stopwatch()} Continuar`;
  }

  function reset() {
    running = false;
    clearInterval(intervalId);
    elapsedBeforePause = 0;
    laps = [];
    timeEl.textContent = formatTime(0);
    lapsList.innerHTML = "";
    toggleBtn.innerHTML = `${icons.stopwatch()} Iniciar`;
  }

  function renderLaps() {
    lapsList.innerHTML = laps
      .map(
        (lap, i) => `
        <div class="list-item">
          <span class="list-item__text">
            <span class="list-item__name">Volta ${laps.length - i}</span>
          </span>
          <span class="list-item__time">${formatTime(lap)}</span>
        </div>
      `
      )
      .join("");
  }

  toggleBtn.addEventListener("click", () => {
    if (running) {
      pause();
    } else {
      start();
    }
  });

  lapBtn.addEventListener("click", () => {
    if (!running) return;
    laps.unshift(currentElapsed());
    renderLaps();
  });

  toggleBtn.addEventListener("dblclick", reset);

  // Duplo-clique e pouco descobrivel - deixa um botao de zerar acessivel
  // por toque longo tambem seria bom, mas por simplicidade um segundo
  // botao e mais claro. Adicionado abaixo dinamicamente:
  const resetBtn = document.createElement("button");
  resetBtn.className = "stopwatch-btn-secondary";
  resetBtn.type = "button";
  resetBtn.textContent = "Zerar";
  resetBtn.addEventListener("click", reset);
  container.querySelector(".stopwatch-actions").appendChild(resetBtn);

  return function cleanup() {
    clearInterval(intervalId);
  };
}

registry.register({
  id: "cronometro",
  name: "Cronometro",
  description: "Cronometre o tempo com precisao e marque voltas.",
  category: "medidores",
  keywords: ["cronometro", "tempo", "stopwatch", "volta", "cronometrar"],
  icon: icons.stopwatch,
  accent: "blue",
  requirements: [],
  render,
});
