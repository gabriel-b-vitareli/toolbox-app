/*
  theme.js
  Controla o tema visual do app (claro / escuro / automatico) e garante
  que a escolha do usuario seja salva no aparelho (localStorage) e
  continue valendo mesmo depois de fechar e reabrir o app.

  Como funciona:
    - "light" e "dark" aplicam o tema escolhido direto.
    - "system" acompanha a preferencia do sistema operacional
      (prefers-color-scheme) e continua acompanhando se o usuario mudar
      o tema do aparelho enquanto o app estiver aberto.

  O tema e aplicado via atributo data-theme na tag <html> - todo o CSS
  de cores do app reage a esse atributo (ver variables.css).
*/

const STORAGE_KEY = "toolbox:theme";
const VALID_THEMES = ["light", "dark", "system"];

const systemQuery = window.matchMedia("(prefers-color-scheme: dark)");

function resolveEffectiveTheme(preference) {
  if (preference === "system") {
    return systemQuery.matches ? "dark" : "light";
  }
  return preference;
}

function applyTheme(preference) {
  const effective = resolveEffectiveTheme(preference);
  document.documentElement.setAttribute("data-theme", effective);
}

/** Le a preferencia salva (ou "system" se o usuario nunca escolheu nada). */
export function getThemePreference() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return VALID_THEMES.includes(saved) ? saved : "system";
  } catch (err) {
    return "system";
  }
}

/** Salva e aplica uma nova preferencia de tema ("light" | "dark" | "system"). */
export function setThemePreference(preference) {
  if (!VALID_THEMES.includes(preference)) return;
  try {
    localStorage.setItem(STORAGE_KEY, preference);
  } catch (err) {
    console.warn("[theme] falha ao salvar preferencia de tema:", err);
  }
  applyTheme(preference);
}

/** Aplica a preferencia salva. Chamar uma vez ao iniciar o app. */
export function initTheme() {
  applyTheme(getThemePreference());

  // Se o usuario esta em "system", muda o tema sozinho quando o
  // sistema operacional trocar de claro para escuro (ou vice-versa)
  // com o app aberto, sem precisar recarregar a pagina.
  systemQuery.addEventListener("change", () => {
    if (getThemePreference() === "system") {
      applyTheme("system");
    }
  });
}
