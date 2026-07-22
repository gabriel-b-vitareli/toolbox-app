/*
  screens/settings.js
  Tela de Configuracoes. Por enquanto so tem a escolha de tema (claro/
  escuro/automatico) e a versao do app no rodape.
*/

import { icons } from "../core/icons.js";
import { APP_VERSION, APP_CODENAME } from "../core/version.js";
import { getThemePreference, setThemePreference } from "../core/theme.js";

const THEME_OPTIONS = [
  { id: "light", label: "Claro", icon: icons.sun },
  { id: "dark", label: "Escuro", icon: icons.moon },
  { id: "system", label: "Automatico", icon: icons.systemTheme },
];

export function mountSettingsScreen(container) {
  const current = getThemePreference();

  container.innerHTML = `
    <header class="app-header">
      <div class="app-header__text">
        <div class="app-header__title">Configuracoes</div>
        <div class="app-header__subtitle">Preferencias do app</div>
      </div>
    </header>

    <div class="settings-body">
      <section class="section">
        ${
          `<div class="section__header"><h2 class="section__title">Aparencia</h2></div>`
        }
        <div class="theme-picker" id="theme-picker">
          ${THEME_OPTIONS.map(
            (opt) => `
            <button class="theme-picker__option" type="button" data-theme-option="${opt.id}" data-active="${opt.id === current}">
              <span class="theme-picker__icon">${opt.icon()}</span>
              <span class="theme-picker__label">${opt.label}</span>
            </button>
          `
          ).join("")}
        </div>
        <p class="theme-picker__hint">"Automatico" segue o tema escolhido nas configuracoes do seu aparelho.</p>
      </section>
    </div>

    <footer class="settings-footer">
      <span class="version-badge">
        <span class="version-badge__number">v${APP_VERSION}</span>
        <span class="version-badge__dot"></span>
        <span class="version-badge__codename">${APP_CODENAME}</span>
      </span>
    </footer>
  `;

  const picker = container.querySelector("#theme-picker");
  picker.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-theme-option]");
    if (!btn) return;
    const chosen = btn.dataset.themeOption;
    setThemePreference(chosen);
    picker.querySelectorAll("[data-theme-option]").forEach((b) => {
      b.setAttribute("data-active", String(b === btn));
    });
  });
}
