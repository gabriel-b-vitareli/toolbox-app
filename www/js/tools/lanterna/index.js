/*
  tools/lanterna/index.js
  Lanterna com tres modos: ligada (fixa), estroboscopio (pisca em
  velocidade ajustavel) e SOS (repete o padrao morse ate ser desligada).
  Usa a API padrao da web (getUserMedia + MediaStreamTrack "torch"
  constraint) - nao precisa de nenhum plugin nativo extra.

  Importante: o requisito "camera" (ver core/compatibility.js) so
  garante que o aparelho TEM camera - nao garante que ela tenha flash
  controlavel por software. Isso so se sabe depois de abrir a camera,
  entao a ferramenta trata esse caso e avisa o usuario com clareza em
  vez de travar.

  Como abre a camera (stream ativo) e pode ficar rodando um loop de
  piscar, o render() devolve uma funcao de limpeza que para tudo e
  libera a camera ao sair da tela - mesmo padrao ja usado pelo Nivel
  para o acelerometro.
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";
import { getUserMediaWithRetry } from "../../core/media-access.js";
import { recordUsage } from "../../core/history.js";

const MODES = [
  { id: "ligada", label: "Ligada" },
  { id: "estrobo", label: "Estroboscopio" },
  { id: "sos", label: "SOS" },
];

const STROBE_SPEEDS = [
  { id: "lenta", label: "Lenta", interval: 450 },
  { id: "media", label: "Media", interval: 220 },
  { id: "rapida", label: "Rapida", interval: 100 },
];

// Padrao morse de SOS em ms, alternando aceso/apagado.
const SOS_PATTERN = [150, 150, 150, 150, 150, 400, 400, 150, 400, 150, 400, 400, 150, 150, 150, 150, 150, 900];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function render(container) {
  container.innerHTML = `
    <div class="flashlight-widget">
      <div class="flashlight-modes" id="flash-modes">
        ${MODES.map((m, i) => `<button class="randomizer-tab" type="button" data-mode="${m.id}" data-active="${i === 0}">${m.label}</button>`).join("")}
      </div>

      <button class="flashlight-toggle" type="button" id="flash-toggle" aria-label="Ligar ou desligar a lanterna" data-on="false">
        ${icons.flashlight()}
      </button>

      <div class="flashlight-speeds" id="flash-speeds" style="display:none;">
        ${STROBE_SPEEDS.map((s, i) => `<button class="randomizer-tab" type="button" data-speed="${s.id}" data-active="${i === 1}">${s.label}</button>`).join("")}
      </div>

      <div class="flashlight-status" id="flash-status" data-on="false">Desligada</div>
      <p class="flashlight-hint" id="flash-hint">Toque no icone para ligar a lanterna.</p>
    </div>
  `;

  const modesEl = container.querySelector("#flash-modes");
  const speedsEl = container.querySelector("#flash-speeds");
  const toggleBtn = container.querySelector("#flash-toggle");
  const status = container.querySelector("#flash-status");
  const hint = container.querySelector("#flash-hint");

  let stream = null;
  let track = null;
  let isOn = false;
  let isBusy = false;
  let isRunningLoop = false;
  let stopRequested = false;
  let mode = "ligada";
  let strobeInterval = STROBE_SPEEDS[1].interval;

  function setUI(on) {
    isOn = on;
    toggleBtn.setAttribute("data-on", String(on));
    status.setAttribute("data-on", String(on));
    status.textContent = on ? "Ligada" : "Desligada";
  }

  async function ensureStream() {
    if (stream) return true;
    try {
      stream = await getUserMediaWithRetry({
        video: { facingMode: { ideal: "environment" } },
      });
      track = stream.getVideoTracks()[0];
      return true;
    } catch (err) {
      hint.textContent = "Nao foi possivel acessar a camera. Verifique se voce permitiu o acesso.";
      return false;
    }
  }

  async function setTorch(on) {
    try {
      await track.applyConstraints({ advanced: [{ torch: on }] });
      return true;
    } catch (err) {
      return false;
    }
  }

  async function runStrobe() {
    while (!stopRequested) {
      await setTorch(true);
      await wait(strobeInterval);
      if (stopRequested) break;
      await setTorch(false);
      await wait(strobeInterval);
    }
  }

  async function runSOS() {
    while (!stopRequested) {
      for (let i = 0; i < SOS_PATTERN.length && !stopRequested; i++) {
        const isOnPhase = i % 2 === 0;
        await setTorch(isOnPhase);
        await wait(SOS_PATTERN[i]);
      }
    }
  }

  async function start() {
    const ready = await ensureStream();
    if (!ready) return;

    const capabilities = track.getCapabilities ? track.getCapabilities() : {};
    if (!capabilities.torch) {
      hint.textContent = "Este aparelho ou navegador nao permite controlar o flash pelo app.";
      return;
    }

    if (mode === "ligada") {
      const ok = await setTorch(true);
      if (ok) {
        setUI(true);
        hint.textContent = "Toque no icone para desligar a lanterna.";
      } else {
        hint.textContent = "Nao foi possivel controlar o flash deste aparelho.";
      }
      return;
    }

    setUI(true);
    isRunningLoop = true;
    stopRequested = false;
    hint.textContent = mode === "estrobo" ? "Piscando..." : "Repetindo SOS...";
    if (mode === "estrobo") {
      await runStrobe();
    } else {
      await runSOS();
    }
    isRunningLoop = false;
  }

  async function stop() {
    stopRequested = true;
    if (track) await setTorch(false);
    setUI(false);
    hint.textContent = "Toque no icone para ligar a lanterna.";
  }

  async function toggle() {
    if (isBusy) return;
    isBusy = true;
    recordUsage("lanterna");

    if (isOn || isRunningLoop) {
      await stop();
    } else {
      await start();
    }
    isBusy = false;
  }

  function setMode(newMode) {
    mode = newMode;
    modesEl.querySelectorAll(".randomizer-tab").forEach((t) => t.setAttribute("data-active", String(t.dataset.mode === newMode)));
    speedsEl.style.display = newMode === "estrobo" ? "flex" : "none";
  }

  modesEl.addEventListener("click", async (event) => {
    const btn = event.target.closest("[data-mode]");
    if (!btn || isBusy) return;
    if (isOn || isRunningLoop) await stop();
    setMode(btn.dataset.mode);
  });

  speedsEl.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-speed]");
    if (!btn) return;
    const found = STROBE_SPEEDS.find((s) => s.id === btn.dataset.speed);
    if (!found) return;
    strobeInterval = found.interval;
    speedsEl.querySelectorAll(".randomizer-tab").forEach((t) => t.setAttribute("data-active", String(t === btn)));
  });

  toggleBtn.addEventListener("click", toggle);

  return function cleanup() {
    stopRequested = true;
    if (track) {
      try {
        track.applyConstraints({ advanced: [{ torch: false }] });
      } catch (err) {
        // aparelho pode nao suportar desligar programaticamente - tudo bem,
        // o stream sera encerrado de qualquer forma logo abaixo.
      }
    }
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
  };
}

registry.register({
  id: "lanterna",
  name: "Lanterna",
  description: "Lanterna com modo fixo, estroboscopio e SOS.",
  category: "dispositivo",
  keywords: ["lanterna", "flash", "luz", "flashlight", "camera", "estrobo", "sos", "piscar"],
  icon: icons.flashlight,
  accent: "orange",
  requirements: ["camera"],
  render,
});
