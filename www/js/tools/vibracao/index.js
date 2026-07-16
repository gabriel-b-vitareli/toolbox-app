/*
  tools/vibracao/index.js
  Testa o motor de vibracao do aparelho com alguns padroes prontos.
  Usa a Vibration API padrao da web (navigator.vibrate).

  Requisito de hardware declarado: "vibration".
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";

const PATTERNS = [
  { id: "curta", label: "Vibracao curta", pattern: 80 },
  { id: "media", label: "Vibracao media", pattern: 300 },
  { id: "longa", label: "Vibracao longa", pattern: 800 },
  { id: "dupla", label: "Duas batidas", pattern: [100, 100, 100] },
  { id: "sos", label: "SOS (padrao morse)", pattern: [80, 80, 80, 80, 80, 200, 200, 80, 200, 80, 200, 200, 80, 80, 80, 80, 80] },
];

function render(container) {
  container.innerHTML = `
    <div class="vibrate-widget">
      <span class="tool-screen-header__icon" style="background: var(--accent-orange); width:72px; height:72px;">
        ${icons.vibrate()}
      </span>
      <p class="flashlight-hint">Toque em um padrao para testar o motor de vibracao do aparelho.</p>
      <div class="vibrate-patterns" id="vibrate-patterns">
        ${PATTERNS.map((p) => `<button class="stopwatch-btn-secondary" type="button" data-pattern-id="${p.id}">${p.label}</button>`).join("")}
      </div>
    </div>
  `;

  container.querySelector("#vibrate-patterns").addEventListener("click", (event) => {
    const btn = event.target.closest("[data-pattern-id]");
    if (!btn) return;
    const found = PATTERNS.find((p) => p.id === btn.dataset.patternId);
    if (found && navigator.vibrate) {
      navigator.vibrate(found.pattern);
    }
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
