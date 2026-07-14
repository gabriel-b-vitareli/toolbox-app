/*
  tools/lanterna/index.js
  Liga/desliga o flash da camera traseira como lanterna. Usa a API
  padrao da web (getUserMedia + MediaStreamTrack "torch" constraint) -
  nao precisa de nenhum plugin nativo extra.

  Importante: o requisito "camera" (ver core/compatibility.js) so
  garante que o aparelho TEM camera - nao garante que ela tenha flash
  controlavel por software. Isso so se sabe depois de abrir a camera,
  entao a ferramenta trata esse caso e avisa o usuario com clareza em
  vez de travar.

  Como abre a camera (stream ativo), o render() devolve uma funcao de
  limpeza que desliga a lanterna e libera a camera ao sair da tela -
  mesmo padrao ja usado pelo Nivel para o acelerometro.
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";

function render(container) {
  container.innerHTML = `
    <div class="flashlight-widget">
      <button class="flashlight-toggle" type="button" id="flash-toggle" aria-label="Ligar ou desligar a lanterna" data-on="false">
        ${icons.flashlight()}
      </button>
      <div class="flashlight-status" id="flash-status" data-on="false">Desligada</div>
      <p class="flashlight-hint" id="flash-hint">Toque no icone para ligar a lanterna.</p>
    </div>
  `;

  const toggleBtn = container.querySelector("#flash-toggle");
  const status = container.querySelector("#flash-status");
  const hint = container.querySelector("#flash-hint");

  let stream = null;
  let track = null;
  let isOn = false;
  let isBusy = false;

  function setUI(on) {
    isOn = on;
    toggleBtn.setAttribute("data-on", String(on));
    status.setAttribute("data-on", String(on));
    status.textContent = on ? "Ligada" : "Desligada";
  }

  async function ensureStream() {
    if (stream) return true;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      track = stream.getVideoTracks()[0];
      return true;
    } catch (err) {
      hint.textContent = "Nao foi possivel acessar a camera. Verifique se voce permitiu o acesso.";
      return false;
    }
  }

  async function toggle() {
    if (isBusy) return;
    isBusy = true;

    const ready = await ensureStream();
    if (!ready) {
      isBusy = false;
      return;
    }

    const capabilities = track.getCapabilities ? track.getCapabilities() : {};
    if (!capabilities.torch) {
      hint.textContent = "Este aparelho ou navegador nao permite controlar o flash pelo app.";
      isBusy = false;
      return;
    }

    try {
      await track.applyConstraints({ advanced: [{ torch: !isOn }] });
      setUI(!isOn);
      hint.textContent = isOn ? "Toque no icone para desligar a lanterna." : "Toque no icone para ligar a lanterna.";
    } catch (err) {
      hint.textContent = "Nao foi possivel controlar o flash deste aparelho.";
    }
    isBusy = false;
  }

  toggleBtn.addEventListener("click", toggle);

  return function cleanup() {
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
  description: "Ligue o flash da camera para usar como lanterna.",
  category: "dispositivo",
  keywords: ["lanterna", "flash", "luz", "flashlight", "camera"],
  icon: icons.flashlight,
  accent: "orange",
  requirements: ["camera"],
  render,
});
