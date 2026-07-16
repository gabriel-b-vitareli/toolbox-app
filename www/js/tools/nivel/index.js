/*
  tools/nivel/index.js
  Nivel de bolha, usando o acelerometro (evento deviceorientation) para
  saber a inclinacao do aparelho.

  Tem dois "modos" visuais, trocados de acordo com a ORIENTACAO DA TELA
  (retrato vs paisagem) - nao com a inclinacao medida:
    - Paisagem (celular deitado de lado): tubos horizontais com bolha
      deslizante, parecido com um nivel de bolha de verdade.
    - Retrato (celular na posicao normal, em pe): disco circular, que
      representa inclinacao nos dois eixos ao mesmo tempo.

  Um detalhe tecnico importante: os eixos beta/gamma do sensor sao
  relativos ao CORPO FISICO do aparelho, nao a tela atual. Girar o
  aparelho para paisagem troca qual eixo fisico corresponde a "esquerda/
  direita" da tela. Por isso os valores sao compensados com o angulo de
  rotacao da tela (screen.orientation.angle) antes de desenhar os tubos -
  senao os tubos ficariam invertidos ou trocados quando girado.

  Requisito de hardware declarado: "accelerometer". Se o aparelho nao
  tiver suporte, o registry esconde esta ferramenta automaticamente
  (ver core/compatibility.js).

  Como fica escutando um sensor continuamente, o render() retorna uma
  funcao de limpeza: a tela generica (screens/tool.js) chama essa funcao
  sozinha quando o usuario sai da ferramenta, parando o listener.
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";
import { needsMotionPermission, requestMotionPermission } from "../../core/motion-permission.js";

const MAX_TILT = 45; // graus considerados o "fim da escala" visual (modo disco)
const TUBE_MAX_TILT = 20; // tubos sao mais sensiveis - faz sentido no uso tipico deitado
const FLAT_THRESHOLD = 1.5; // graus de tolerancia para considerar "nivelado"

function getScreenAngle() {
  if (window.screen && window.screen.orientation && typeof window.screen.orientation.angle === "number") {
    return window.screen.orientation.angle;
  }
  if (typeof window.orientation === "number") {
    return window.orientation;
  }
  return 0;
}

/**
 * Traduz beta/gamma (relativos ao corpo do aparelho) para x/y relativos
 * a tela como ela esta sendo mostrada agora (compensando a rotacao).
 * Em retrato (angulo 0), x = gamma e y = beta, exatamente como antes.
 */
function compensateForRotation(beta, gamma) {
  const angle = getScreenAngle();
  switch (angle) {
    case 90:
      return { x: beta, y: -gamma };
    case -90:
    case 270:
      return { x: -beta, y: gamma };
    case 180:
      return { x: -gamma, y: -beta };
    default:
      return { x: gamma, y: beta };
  }
}

function render(container) {
  container.innerHTML = `
    <div class="level-widget">
      <div class="level-mode-badge" id="level-mode-badge">Modo padrao (retrato)</div>

      <div class="level-tube-view" id="level-tube-view">
        <div class="level-tube">
          <span class="level-tube__marks"></span>
          <span class="level-tube__bubble" id="level-tube-bubble-x"></span>
        </div>
        <div class="level-tube__label">Esquerda / Direita</div>

        <div class="level-tube">
          <span class="level-tube__marks"></span>
          <span class="level-tube__bubble" id="level-tube-bubble-y"></span>
        </div>
        <div class="level-tube__label">Frente / Tras</div>
      </div>

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

      <p class="level-hint" id="level-hint">Gire o aparelho para o modo paisagem para usar como nivel de bolha.</p>
    </div>
  `;

  const modeBadge = container.querySelector("#level-mode-badge");
  const tubeView = container.querySelector("#level-tube-view");
  const track = container.querySelector("#level-track");
  const bubble = container.querySelector("#level-bubble");
  const tubeBubbleX = container.querySelector("#level-tube-bubble-x");
  const tubeBubbleY = container.querySelector("#level-tube-bubble-y");
  const status = container.querySelector("#level-status");
  const valueX = container.querySelector("#level-value-x");
  const valueY = container.querySelector("#level-value-y");
  const hint = container.querySelector("#level-hint");
  const widget = container.querySelector(".level-widget");

  bubble.style.left = "50%";
  bubble.style.top = "50%";
  bubble.style.transform = "translate(-50%, -50%)";

  let hasReceivedData = false;
  let isLandscapeMode = false;
  const landscapeQuery = window.matchMedia("(orientation: landscape)");

  function formatDegrees(value) {
    return `${value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}°`;
  }

  function applyMode() {
    isLandscapeMode = landscapeQuery.matches;
    tubeView.style.display = isLandscapeMode ? "flex" : "none";
    track.style.display = isLandscapeMode ? "none" : "flex";
    modeBadge.textContent = isLandscapeMode ? "Modo bolha (paisagem)" : "Modo padrao (retrato)";
    hint.textContent = isLandscapeMode
      ? "Apoie o aparelho sobre a superficie que voce quer verificar."
      : "Gire o aparelho para o modo paisagem para usar como nivel de bolha.";
  }

  function updateTube(bubbleEl, tiltDegrees, isLevel) {
    const clamped = Math.max(-TUBE_MAX_TILT, Math.min(TUBE_MAX_TILT, tiltDegrees));
    const trackEl = bubbleEl.parentElement;
    const maxOffset = trackEl.clientWidth * 0.5 - 24; // 24 = metade do tamanho da bolha
    const offset = (clamped / TUBE_MAX_TILT) * maxOffset;
    bubbleEl.style.transform = `translate(calc(-50% + ${offset}px), -50%)`;
    bubbleEl.setAttribute("data-flat", String(isLevel));
  }

  function handleOrientation(event) {
    const beta = event.beta ?? 0; // inclinacao frente/tras (relativa ao aparelho)
    const gamma = event.gamma ?? 0; // inclinacao esquerda/direita (relativa ao aparelho)

    if (!hasReceivedData) {
      hasReceivedData = true;
    }

    const isFlat = Math.abs(beta) < FLAT_THRESHOLD && Math.abs(gamma) < FLAT_THRESHOLD;

    if (isLandscapeMode) {
      const { x, y } = compensateForRotation(beta, gamma);
      updateTube(tubeBubbleX, x, isFlat);
      updateTube(tubeBubbleY, y, isFlat);
      valueX.textContent = formatDegrees(x);
      valueY.textContent = formatDegrees(y);
    } else {
      const clampedGamma = Math.max(-MAX_TILT, Math.min(MAX_TILT, gamma));
      const clampedBeta = Math.max(-MAX_TILT, Math.min(MAX_TILT, beta));
      const radius = track.clientWidth * 0.35;
      const offsetX = (clampedGamma / MAX_TILT) * radius;
      const offsetY = (clampedBeta / MAX_TILT) * radius;
      bubble.style.transform = `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px)`;
      bubble.setAttribute("data-flat", String(isFlat));
      valueX.textContent = formatDegrees(gamma);
      valueY.textContent = formatDegrees(beta);
    }

    status.setAttribute("data-flat", String(isFlat));
    status.textContent = isFlat ? "Nivelado!" : "Ajuste o angulo";
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

  applyMode();
  landscapeQuery.addEventListener("change", applyMode);

  if (needsMotionPermission()) {
    // iOS 13+ exige permissao explicita do usuario para ler sensores de movimento.
    const btn = document.createElement("button");
    btn.className = "btn-primary";
    btn.type = "button";
    btn.textContent = "Ativar sensor de movimento";
    btn.addEventListener("click", async () => {
      const granted = await requestMotionPermission();
      if (granted) {
        btn.remove();
        startListening();
      } else {
        hint.textContent = "Permissao negada. Ative o sensor de movimento nas configuracoes do navegador para usar esta ferramenta.";
      }
    });
    widget.insertBefore(btn, hint);
  } else {
    startListening();
  }

  return function cleanup() {
    window.removeEventListener("deviceorientation", handleOrientation);
    landscapeQuery.removeEventListener("change", applyMode);
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
