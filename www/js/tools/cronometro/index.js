/*
  tools/cronometro/index.js
  Cronometro com mostrador circular (como um cronometro de verdade) e
  controles em botoes circulares de TAMANHO FIXO - troca so o icone
  (play/pause), nunca o texto, entao o botao nunca muda de tamanho ao
  clicar.

  Nao depende de nenhum sensor - so setInterval + Date.now() para manter
  precisao mesmo se o navegador atrasar um tick ocasional.
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";
import { recordUsage } from "../../core/history.js";

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
      <div class="stopwatch-face">
        <div class="stopwatch-face__time" id="stopwatch-time">00:00,00</div>
      </div>

      <div class="stopwatch-controls">
        <button class="stopwatch-btn-circle" type="button" id="stopwatch-reset-btn" aria-label="Zerar">
          ${icons.refresh()}
        </button>
        <button class="stopwatch-btn-play" type="button" id="stopwatch-toggle-btn" data-running="false" aria-label="Iniciar">
          ${icons.play()}
        </button>
        <button class="stopwatch-btn-circle" type="button" id="stopwatch-lap-btn" aria-label="Marcar volta" disabled>
          ${icons.flag()}
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
  const resetBtn = container.querySelector("#stopwatch-reset-btn");
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

  function setToggleUI() {
    toggleBtn.setAttribute("data-running", String(running));
    toggleBtn.innerHTML = running ? icons.pause() : icons.play();
    toggleBtn.setAttribute("aria-label", running ? "Pausar" : "Iniciar");
    lapBtn.disabled = !running;
  }

  function start() {
    recordUsage("cronometro");
    running = true;
    startedAt = Date.now();
    intervalId = setInterval(tick, 30);
    setToggleUI();
  }

  function pause() {
    running = false;
    elapsedBeforePause = currentElapsed();
    clearInterval(intervalId);
    setToggleUI();
  }

  function reset() {
    running = false;
    clearInterval(intervalId);
    elapsedBeforePause = 0;
    laps = [];
    timeEl.textContent = formatTime(0);
    lapsList.innerHTML = "";
    setToggleUI();
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

  resetBtn.addEventListener("click", reset);

  setToggleUI();

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
