/*
  tools/vibracao/index.js
  Testa o motor de vibracao do aparelho com alguns padroes prontos.

  Usa o plugin nativo @capacitor/haptics (vendorizado em js/vendor/) em
  vez da API de vibracao do navegador (navigator.vibrate) - motivo
  detalhado no README de js/vendor/.

  Usa DOIS caminhos nativos diferentes do plugin, de proposito:
    - Haptics.impact() para o toque curto - usa o sistema de "toque
      haptico" do Android (o mesmo que da aquele clique ao digitar no
      teclado), que em muitos aparelhos e mais confiavel.
    - Haptics.vibrate() para os padroes mais longos - aciona o motor de
      vibracao "de verdade" (o mesmo de notificacoes/chamadas).
  Se um padrao funcionar e outro nao, isso ja e uma pista de qual
  configuracao do aparelho esta bloqueando o outro caminho.

  IMPORTANTE: em varios aparelhos (Motorola incluso, principalmente a
  partir do Android 13) existe uma configuracao separada do sistema -
  "Som e vibracao" > "Vibracao ao toque" (as vezes chamada de "toque
  haptico") - que precisa estar ATIVADA para qualquer app conseguir
  vibrar o aparelho. Nao tem nenhum jeito de checar essa configuracao
  pelo navegador/WebView, entao a tela avisa isso diretamente pro
  usuario em vez de so falhar em silencio.

  Requisito de hardware declarado: "vibration".
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";
import { Haptics, ImpactStyle } from "../../vendor/capacitor-haptics.js";
import { recordUsage } from "../../core/history.js";

// Cada padrao e uma lista de duracoes em ms, alternando vibra/pausa
// (indice par = vibra, indice impar = pausa) - mesma convencao da
// Vibration API do navegador, para ficar familiar. "curta" e um caso
// especial que usa Haptics.impact() em vez de vibrate() (ver acima).
const PATTERNS = [
  { id: "curta", label: "Toque curto (impact)", kind: "impact" },
  { id: "media", label: "Vibracao media", kind: "vibrate", pattern: [300] },
  { id: "longa", label: "Vibracao longa", kind: "vibrate", pattern: [800] },
  { id: "dupla", label: "Duas batidas", kind: "vibrate", pattern: [120, 120, 120] },
  {
    id: "sos",
    label: "SOS (padrao morse)",
    kind: "vibrate",
    pattern: [100, 100, 100, 100, 100, 250, 250, 100, 250, 100, 250, 250, 100, 100, 100, 100, 100],
  },
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function playVibratePattern(pattern) {
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

      <div class="vibrate-tip">
        <strong>Nao sentiu nada?</strong> Em varios aparelhos (Motorola incluso) existe uma configuracao separada
        do sistema para isso: va em <strong>Configuracoes do aparelho &gt; Som e vibracao &gt; Vibracao ao toque</strong>
        (o nome exato varia por aparelho) e confirme que esta ativada. Sem ela, nenhum app consegue vibrar o
        aparelho, mesmo com a permissao concedida.
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
    hint.textContent = `Testando: ${found.label.toLowerCase()}...`;
    try {
      if (found.kind === "impact") {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      } else {
        await playVibratePattern(found.pattern);
      }
      hint.textContent = "Toque em um padrao para testar o motor de vibracao do aparelho.";
    } catch (err) {
      console.error("[vibracao] falha ao vibrar:", err);
      hint.textContent = "Nao foi possivel vibrar o aparelho - veja a dica abaixo.";
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
