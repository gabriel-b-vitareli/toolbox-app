/*
  tools/decibelimetro/index.js
  Medidor de nivel de som, usando o microfone (Web Audio API).

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

const LEVELS = [
  { max: 40, label: "Silencioso" },
  { max: 60, label: "Tranquilo" },
  { max: 70, label: "Conversa normal" },
  { max: 85, label: "Alto" },
  { max: 100, label: "Muito alto" },
  { max: Infinity, label: "Extremamente alto" },
];

function labelFor(db) {
  return LEVELS.find((l) => db <= l.max).label;
}

function render(container) {
  container.innerHTML = `
    <div class="db-meter">
      <div class="db-meter__gauge">
        <div class="db-meter__fill" id="db-fill"></div>
        <div class="db-meter__value" id="db-value">--</div>
        <div class="db-meter__unit">dB (aprox.)</div>
      </div>

      <div class="db-meter__label" id="db-label">Aguardando microfone...</div>

      <button class="btn-primary" type="button" id="db-start-btn">
        ${icons.waveform()}
        Iniciar medicao
      </button>

      <p class="db-meter__hint">
        Valor aproximado, sem calibracao - use como referencia relativa, nao como medicao oficial de ruido.
      </p>
    </div>
  `;

  const fill = container.querySelector("#db-fill");
  const valueEl = container.querySelector("#db-value");
  const labelEl = container.querySelector("#db-label");
  const startBtn = container.querySelector("#db-start-btn");

  let stream = null;
  let audioCtx = null;
  let analyser = null;
  let dataArray = null;
  let rafId = null;

  function updateGauge(db) {
    const clamped = Math.max(0, Math.min(120, db));
    const percent = (clamped / 120) * 100;
    fill.style.height = `${percent}%`;
    valueEl.textContent = Math.round(clamped);
    labelEl.textContent = labelFor(clamped);
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
    try {
      stream = await getUserMediaWithRetry({ audio: true });
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      dataArray = new Uint8Array(analyser.fftSize);

      startBtn.remove();
      labelEl.textContent = "Medindo...";
      tick();
    } catch (err) {
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
