/*
  tools/bussola/index.js
  Bussola - mostra para onde o aparelho esta apontando usando o evento
  de orientacao do dispositivo. Quando disponivel, usa
  "deviceorientationabsolute" (leitura absoluta, ligada ao norte real);
  senao cai para "deviceorientation" comum.

  Importante ser honesto sobre precisao: sem calibracao, o valor pode
  ficar impreciso perto de metais/eletronicos. Isso fica indicado no
  texto de dica, para nao passar uma falsa sensacao de exatidao.

  Requisito de hardware declarado: "magnetometer".
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";
import { needsMotionPermission, requestMotionPermission } from "../../core/motion-permission.js";
import { recordUsage } from "../../core/history.js";

const DIRECTIONS = ["N", "NE", "L", "SE", "S", "SO", "O", "NO"];

function cardinalFromHeading(heading) {
  const index = Math.round(heading / 45) % 8;
  return DIRECTIONS[index];
}

function render(container) {
  container.innerHTML = `
    <div class="compass-widget">
      <div class="compass-dial">
        <span class="compass-pointer"></span>
        <div class="compass-face" id="compass-face">
          <span class="compass-needle">
            <span class="compass-needle__half compass-needle__half--n"></span>
            <span class="compass-needle__half compass-needle__half--s"></span>
          </span>
          <span class="compass-label compass-label--n">N</span>
          <span class="compass-label compass-label--ne">NE</span>
          <span class="compass-label compass-label--l">L</span>
          <span class="compass-label compass-label--se">SE</span>
          <span class="compass-label compass-label--s">S</span>
          <span class="compass-label compass-label--so">SO</span>
          <span class="compass-label compass-label--o">O</span>
          <span class="compass-label compass-label--no">NO</span>
          <span class="compass-center-dot"></span>
        </div>
      </div>

      <div class="compass-readout">
        <span class="compass-heading" id="compass-heading">--°</span>
        <span class="compass-cardinal" id="compass-cardinal">-</span>
      </div>

      <p class="compass-hint" id="compass-hint">Aponte o topo do aparelho para a direcao que deseja identificar.</p>
    </div>
  `;

  const face = container.querySelector("#compass-face");
  const headingEl = container.querySelector("#compass-heading");
  const cardinalEl = container.querySelector("#compass-cardinal");
  const hint = container.querySelector("#compass-hint");
  const widget = container.querySelector(".compass-widget");

  let hasReceivedData = false;

  function updateCompass(heading) {
    if (!hasReceivedData) {
      hasReceivedData = true;
      recordUsage("bussola");
      hint.textContent = "Longe de metais e eletronicos, a leitura fica mais precisa.";
    }
    face.style.transform = `rotate(${-heading}deg)`;
    headingEl.textContent = `${Math.round(heading)}°`;
    cardinalEl.textContent = cardinalFromHeading(heading);
  }

  function handleOrientation(event) {
    let heading;
    if (typeof event.webkitCompassHeading === "number") {
      // Safari/iOS: ja vem pronto, 0 = norte, sentido horario.
      heading = event.webkitCompassHeading;
    } else if (typeof event.alpha === "number") {
      heading = 360 - event.alpha;
    } else {
      return;
    }
    heading = ((heading % 360) + 360) % 360;
    updateCompass(heading);
  }

  function startListening() {
    if ("ondeviceorientationabsolute" in window) {
      window.addEventListener("deviceorientationabsolute", handleOrientation);
    } else {
      window.addEventListener("deviceorientation", handleOrientation);
    }
    setTimeout(() => {
      if (!hasReceivedData) {
        hint.textContent =
          "Nao foi possivel ler o sensor de orientacao. Alguns emuladores e navegadores de desktop nao emitem esses dados.";
      }
    }, 3000);
  }

  if (needsMotionPermission()) {
    const btn = document.createElement("button");
    btn.className = "btn-primary";
    btn.type = "button";
    btn.textContent = "Ativar sensor de orientacao";
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
    window.removeEventListener("deviceorientationabsolute", handleOrientation);
    window.removeEventListener("deviceorientation", handleOrientation);
  };
}

registry.register({
  id: "bussola",
  name: "Bussola",
  description: "Descubra para onde o aparelho esta apontando.",
  category: "dispositivo",
  keywords: ["bussola", "norte", "direcao", "orientacao", "compass", "magnetometro"],
  icon: icons.compass,
  accent: "green",
  requirements: ["magnetometer"],
  render,
});
