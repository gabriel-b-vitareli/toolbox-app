/*
  screens/settings.js
  Tela de Configuracoes. Por enquanto so mostra a versao do app no
  rodape - mais preferencias (tema, etc) entram aqui no futuro, sem
  precisar mudar nenhuma outra tela.
*/

import { APP_VERSION, APP_CODENAME } from "../core/version.js";

export function mountSettingsScreen(container) {
  container.innerHTML = `
    <header class="app-header">
      <div class="app-header__text">
        <div class="app-header__title">Configuracoes</div>
        <div class="app-header__subtitle">Preferencias do app</div>
      </div>
    </header>

    <div class="settings-body">
      <div class="empty-state">
        <div class="empty-state__title">Nada por aqui ainda</div>
        <div class="empty-state__hint">Preferencias do app vao aparecer aqui em breve.</div>
      </div>
    </div>

    <footer class="settings-footer">
      <span class="version-badge">
        <span class="version-badge__number">v${APP_VERSION}</span>
        <span class="version-badge__dot"></span>
        <span class="version-badge__codename">${APP_CODENAME}</span>
      </span>
    </footer>
  `;
}
