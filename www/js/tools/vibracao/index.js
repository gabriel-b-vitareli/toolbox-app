/*
  tools/vibracao/index.js
  Testa o motor de vibracao do aparelho com alguns padroes prontos.

  Usa o plugin nativo @capacitor/haptics (vendorizado em js/vendor/) em
  vez da API de vibracao do navegador (navigator.vibrate). A diferenca
  importa: navigator.vibrate depende de como o WebView do Android
  implementa a API, o que varia muito entre aparelhos/fabricantes. O
  plugin Haptics aciona o servico de vibracao nativo do Android
  diretamente, contornando essa inconsistencia - e o mesmo motivo pelo
  qual o botao fisico de voltar (core/back-button.js) tambem usa um
  plugin vendorizado em vez de uma API pura do navegador.

  Requisito de hardware declarado: "vibration".
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";
import { Haptics } from "../../vendor/capacitor-haptics.js";
import { recordUsage } from "../../core/history.js";

// Cada padrao e uma lista de duracoes em ms, alternando vibra/pausa
// (indice par = vibra, indice impar = pausa) - mesma convencao da
// Vibration API do navegador, para ficar familiar.
const PATTERNS = [
  { id: "curta", label: "Vibracao curta", pattern: [80] },
  { id: "media", label: "Vibracao media", pattern: [300] },
  { id: "longa", label: "Vibracao longa", pattern: [800] },
  { id: "dupla", label: "Duas batidas", pattern: [120, 120, 120] },
  {
    id: "sos",
    label: "SOS (padrao morse)",
    pattern: [100, 100, 100, 100, 100, 250, 250, 100, 250, 100, 250, 250, 100, 100, 100, 100, 100],
  },
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function playPattern(pattern) {
  for (let i = 0; i < pattern.length; i++) {
    const isVibratePhase = i % 2 === 0;
    if (isVibratePhase) {
      await Haptics.vibrate({ duration: pattern[i] });
    }
    await wait(pattern[i]);
  }
}

function render(container) {
  container.innerHTML = `
    <div class="vibrate-widget">
      <span class="tool-screen-header__icon" style="background: var(--accent-orange); width:72px; height:72px;">
        ${icons.vibrate()}
      </span>
      <p class="flashlight-hint" id="vibrate-hint">Toque em um padrao para testar o motor de vibracao do aparelho.</p>
      <div class="vibrate-patterns" id="vibrate-patterns">
        ${PATTERNS.map((p) => `<button class="stopwatch-btn-secondary" type="button" data-pattern-id="${p.id}">${p.label}</button>`).join("")}
      </div>
    </div>
  `;

  const hint = container.querySelector("#vibrate-hint");
  let isPlaying = false;

  container.querySelector("#vibrate-patterns").addEventListener("click", async (event) => {
    const btn = event.target.closest("[data-pattern-id]");
    if (!btn || isPlaying) return;

    const found = PATTERNS.find((p) => p.id === btn.dataset.patternId);
    if (!found) return;

    isPlaying = true;
    recordUsage("vibracao");
    hint.textContent = `Vibrando: ${found.label.toLowerCase()}...`;
    try {
      await playPattern(found.pattern);
      hint.textContent = "Toque em um padrao para testar o motor de vibracao do aparelho.";
    } catch (err) {
      console.error("[vibracao] falha ao vibrar:", err);
      hint.textContent = "Nao foi possivel vibrar o aparelho. Verifique se a vibracao esta ativada nas configuracoes do sistema.";
    }
    isPlaying = false;
  });
}

registry.register({
  id: "vibracao",
  name: "Vibracao",
  description: "Teste o motor de vibracao do aparelho com padroes prontos.",
  category: "dispositivo",
  keywords: ["vibracao", "vibrar", "motor", "haptico", "teste"],
  icon: icons.vibrate,
  accent: "purple",
  requirements: ["vibration"],
  render,
});
