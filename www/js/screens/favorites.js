/*
  screens/favorites.js
  Lista as ferramentas favoritadas pelo usuario. Le do core/favorites.js -
  nunca acessa o localStorage diretamente.
*/

import { registry } from "../core/registry.js";
import { emptyState, toolListItem } from "../core/ui.js";
import * as favorites from "../core/favorites.js";
import { wireToolNavigation, wireFavoriteToggles } from "../core/list-behavior.js";

export function mountFavoritesScreen(container) {
  render(container);
}

function render(container) {
  const tools = favorites
    .getAll()
    .map((id) => registry.getById(id))
    .filter(Boolean);

  container.innerHTML = `
    <header class="app-header">
      <div class="app-header__text">
        <div class="app-header__title">Favoritos</div>
        <div class="app-header__subtitle">${tools.length} ${tools.length === 1 ? "ferramenta" : "ferramentas"}</div>
      </div>
    </header>
    <section class="section" id="favorites-list-slot"></section>
  `;

  const slot = container.querySelector("#favorites-list-slot");

  if (tools.length === 0) {
    slot.innerHTML = emptyState({
      title: "Nenhum favorito ainda",
      hint: "Toque na estrela de uma ferramenta para guarda-la aqui.",
    });
    return;
  }

  slot.innerHTML = `<div class="list">${tools
    .map((tool) => toolListItem(tool, { isFavorite: true }))
    .join("")}</div>`;

  wireToolNavigation(slot);
  // Ao desfavoritar aqui, o item some da lista na hora (ela SO mostra favoritos).
  wireFavoriteToggles(slot, (toolId, nowFavorite) => {
    if (!nowFavorite) {
      render(container);
    }
  });
}
