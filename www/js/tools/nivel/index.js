/*
  tools/nivel/index.js
  Primeira ferramenta do dispositivo: nivel de bolha, usando o
  acelerometro (evento deviceorientation) para saber a inclinacao
  do aparelho e mostrar se uma superficie esta nivelada.

  Requisito de hardware declarado: "accelerometer". Se o aparelho nao
  tiver suporte, o registry esconde esta ferramenta automaticamente
  (ver core/compatibility.js) - nenhuma logica extra precisa existir
  aqui para isso.

  Como fica escutando um sensor continuamente, o render() retorna uma
  funcao de limpeza: a tela generica (screens/tool.js) chama essa funcao
  sozinha quando o usuario sai da ferramenta, parando o listener.
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";

const MAX_TILT = 45; // graus considerados o "fim da escala" visual
const FLAT_THRESHOLD = 1.5; // graus de tolerancia para considerar "nivelado"

function render(container) {
  container.innerHTML = `
    <div class="level-widget">
      <div class="level-track" id="level-track">
        <span class="level-crosshair-h"></span>
        <span class="level-crosshair-v"></span>
        <span class="level-target-ring"></span>
        <span class="level-bubble" id="level-bubble"></span>
      </div>

      <div class="level-status" id="level-status">Aguardando o sensor...</div>

      <div class="level-readout">
        <div class="level-readout__item">
          <div class="level-readout__value" id="level-value-x">0,0°</div>
          <div class="level-readout__label">Esquerda / Direita</div>
        </div>
        <div class="level-readout__item">
          <div class="level-readout__value" id="level-value-y">0,0°</div>
          <div class="level-readout__label">Frente / Tras</div>
        </div>
      </div>

      <p class="level-hint" id="level-hint">Apoie o aparelho sobre a superficie que voce quer verificar.</p>
    </div>
  `;

  const track = container.querySelector("#level-track");
  const bubble = container.querySelector("#level-bubble");
  const status = container.querySelector("#level-status");
  const valueX = container.querySelector("#level-value-x");
  const valueY = container.querySelector("#level-value-y");
  const hint = container.querySelector("#level-hint");
  const widget = container.querySelector(".level-widget");

  bubble.style.left = "50%";
  bubble.style.top = "50%";
  bubble.style.transform = "translate(-50%, -50%)";

  let hasReceivedData = false;

  function formatDegrees(value) {
    return `${value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}°`;
  }

  function handleOrientation(event) {
    const beta = event.beta ?? 0; // inclinacao frente/tras
    const gamma = event.gamma ?? 0; // inclinacao esquerda/direita

    if (!hasReceivedData) {
      hasReceivedData = true;
      hint.textContent = "Apoie o aparelho sobre a superficie que voce quer verificar.";
    }

    const clampedGamma = Math.max(-MAX_TILT, Math.min(MAX_TILT, gamma));
    const clampedBeta = Math.max(-MAX_TILT, Math.min(MAX_TILT, beta));
    const radius = track.clientWidth * 0.35;
    const offsetX = (clampedGamma / MAX_TILT) * radius;
    const offsetY = (clampedBeta / MAX_TILT) * radius;

    bubble.style.transform = `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px)`;

    const isFlat = Math.abs(beta) < FLAT_THRESHOLD && Math.abs(gamma) < FLAT_THRESHOLD;
    bubble.setAttribute("data-flat", String(isFlat));
    status.setAttribute("data-flat", String(isFlat));
    status.textContent = isFlat ? "Nivelado!" : "Ajuste o angulo";

    valueX.textContent = formatDegrees(gamma);
    valueY.textContent = formatDegrees(beta);
  }

  function startListening() {
    window.addEventListener("deviceorientation", handleOrientation);
    setTimeout(() => {
      if (!hasReceivedData) {
        hint.textContent =
          "Nao foi possivel ler o sensor do aparelho. Alguns emuladores e navegadores de desktop nao emitem esses dados.";
      }
    }, 3000);
  }

  const needsPermission =
    typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function";

  if (needsPermission) {
    // iOS 13+ exige permissao explicita do usuario para ler sensores de movimento.
    const btn = document.createElement("button");
    btn.className = "btn-primary";
    btn.type = "button";
    btn.textContent = "Ativar sensor de movimento";
    btn.addEventListener("click", async () => {
      try {
        const result = await DeviceOrientationEvent.requestPermission();
        if (result === "granted") {
          btn.remove();
          startListening();
        } else {
          hint.textContent = "Permissao negada. Ative o sensor de movimento nas configuracoes do navegador para usar esta ferramenta.";
        }
      } catch (err) {
        hint.textContent = "Nao foi possivel solicitar acesso ao sensor.";
      }
    });
    widget.insertBefore(btn, hint);
  } else {
    startListening();
  }

  return function cleanup() {
    window.removeEventListener("deviceorientation", handleOrientation);
  };
}

registry.register({
  id: "nivel",
  name: "Nivel",
  description: "Veja se uma superficie esta nivelada usando o acelerometro do aparelho.",
  category: "dispositivo",
  keywords: ["nivel", "bolha", "nivelar", "equilibrio", "horizontal", "prumo", "level"],
  icon: icons.level,
  accent: "blue",
  requirements: ["accelerometer"],
  render,
});
