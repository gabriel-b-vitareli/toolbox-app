/*
  tools/decibelimetro/index.js
  Medidor de nivel de som, usando o microfone (Web Audio API). O
  mostrador e um arco (mesma linguagem visual dos outros sensores do
  app, como Nivel e Bussola), que se preenche e muda de cor conforme o
  nivel de som sobe.

  Importante ser transparente: este e um valor APROXIMADO, sem
  calibracao contra um microfone de referencia. Ele serve para dar uma
  nocao relativa ("esta mais alto ou mais baixo que antes?"), nao para
  medicoes profissionais/legais de ruido. Essa limitacao fica escrita
  na propria tela, para nao passar uma falsa precisao cientifica.

  Requisito de hardware declarado: "microphone".

  Como mantem o microfone aberto continuamente, o render() devolve uma
  funcao de limpeza que fecha tudo (stream, AudioContext, animationFrame)
  ao sair da tela - mesmo padrao ja usado por Nivel e Lanterna.
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";
import { getUserMediaWithRetry } from "../../core/media-access.js";
import { recordUsage } from "../../core/history.js";

const LEVELS = [
  { max: 40, label: "Silencioso", color: "var(--accent-green)" },
  { max: 60, label: "Tranquilo", color: "var(--accent-blue)" },
  { max: 70, label: "Conversa normal", color: "var(--accent-orange)" },
  { max: 85, label: "Alto", color: "#ff7a45" },
  { max: 100, label: "Muito alto", color: "#ef4444" },
  { max: Infinity, label: "Extremamente alto", color: "#dc2626" },
];

// Arco de 0 a 120 dB: M 20 100 A 80 80 0 0 1 180 100 (semicirculo, raio 80)
const ARC_LENGTH = Math.PI * 80; // ~251.33

function levelFor(db) {
  return LEVELS.find((l) => db <= l.max);
}

function render(container) {
  container.innerHTML = `
    <div class="db-widget">
      <div class="db-gauge">
        <svg viewBox="0 0 200 118" class="db-gauge__svg">
          <path class="db-gauge__track" d="M20 100 A80 80 0 0 1 180 100" />
          <path class="db-gauge__fill" id="db-fill-arc" d="M20 100 A80 80 0 0 1 180 100" />
          <text x="20" y="114" class="db-gauge__tick" text-anchor="start">0</text>
          <text x="100" y="14" class="db-gauge__tick" text-anchor="middle">60</text>
          <text x="180" y="114" class="db-gauge__tick" text-anchor="end">120</text>
        </svg>
        <div class="db-gauge__readout">
          <div class="db-gauge__value" id="db-value">--</div>
          <div class="db-gauge__unit">dB (aprox.)</div>
        </div>
      </div>

      <div class="db-status" id="db-label">Aguardando microfone...</div>

      <button class="btn-primary" type="button" id="db-start-btn">
        ${icons.waveform()}
        Iniciar medicao
      </button>

      <p class="db-hint">
        Valor aproximado, sem calibracao - use como referencia relativa, nao como medicao oficial de ruido.
      </p>
    </div>
  `;

  const fillArc = container.querySelector("#db-fill-arc");
  const valueEl = container.querySelector("#db-value");
  const labelEl = container.querySelector("#db-label");
  const startBtn = container.querySelector("#db-start-btn");

  fillArc.style.strokeDasharray = String(ARC_LENGTH);
  fillArc.style.strokeDashoffset = String(ARC_LENGTH);

  let stream = null;
  let audioCtx = null;
  let analyser = null;
  let dataArray = null;
  let rafId = null;

  function updateGauge(db) {
    const clamped = Math.max(0, Math.min(120, db));
    const percent = clamped / 120;
    const level = levelFor(clamped);

    fillArc.style.strokeDashoffset = String(ARC_LENGTH * (1 - percent));
    fillArc.style.stroke = level.color;

    valueEl.textContent = Math.round(clamped);
    valueEl.style.color = level.color;
    labelEl.textContent = level.label;
    labelEl.style.color = level.color;
  }

  function tick() {
    analyser.getByteTimeDomainData(dataArray);
    let sumSquares = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const norm = (dataArray[i] - 128) / 128;
      sumSquares += norm * norm;
    }
    const rms = Math.sqrt(sumSquares / dataArray.length);
    const db = rms > 0 ? 20 * Math.log10(rms) + 90 : 0;
    updateGauge(db);
    rafId = requestAnimationFrame(tick);
  }

  async function start() {
    startBtn.disabled = true;
    startBtn.textContent = "Conectando...";
    recordUsage("decibelimetro");
    try {
      stream = await getUserMediaWithRetry({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }
      const source = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      dataArray = new Uint8Array(analyser.fftSize);

      startBtn.remove();
      labelEl.textContent = "Medindo...";
      tick();
    } catch (err) {
      console.error("[decibelimetro] falha ao acessar o microfone:", err);
      startBtn.disabled = false;
      startBtn.innerHTML = `${icons.waveform()} Tentar novamente`;
      labelEl.textContent = "Nao foi possivel acessar o microfone. Verifique se voce permitiu o acesso.";
    }
  }

  startBtn.addEventListener("click", start);

  return function cleanup() {
    if (rafId) cancelAnimationFrame(rafId);
    if (audioCtx) audioCtx.close();
    if (stream) stream.getTracks().forEach((t) => t.stop());
  };
}

registry.register({
  id: "decibelimetro",
  name: "Decibelimetro",
  description: "Meça o nivel de som aproximado do ambiente.",
  category: "medidores",
  keywords: ["decibelimetro", "decibel", "som", "ruido", "barulho", "db", "microfone"],
  icon: icons.waveform,
  accent: "magenta",
  requirements: ["microphone"],
  render,
});
