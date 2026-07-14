/*
  screens/history.js
  Mostra o historico completo de uso das ferramentas, mais recente primeiro.
  Le do modulo core/history.js - nunca acessa o localStorage diretamente.
*/

import { icons } from "../core/icons.js";
import { registry } from "../core/registry.js";
import { emptyState, historyListItem } from "../core/ui.js";
import * as history from "../core/history.js";
import { isFavorite } from "../core/favorites.js";
import { wireToolNavigation, wireFavoriteToggles } from "../core/list-behavior.js";

export function mountHistoryScreen(container) {
  render(container);
}

function render(container) {
  const entries = history.getAll();

  container.innerHTML = `
    <header class="app-header">
      <div class="app-header__text">
        <div class="app-header__title">Historico</div>
        <div class="app-header__subtitle">${entries.length} ${entries.length === 1 ? "registro" : "registros"}</div>
      </div>
      ${entries.length > 0
        ? `<button class="app-header__action" type="button" id="history-clear-btn" aria-label="Limpar historico">${icons.trash()}</button>`
        : ""}
    </header>
    <section class="section" id="history-list-slot"></section>
  `;

  const slot = container.querySelector("#history-list-slot");

  if (entries.length === 0) {
    slot.innerHTML = emptyState({
      title: "Nenhuma atividade ainda",
      hint: "Toda ferramenta que voce usar vai aparecer aqui, na ordem que foi usada.",
    });
  } else {
    slot.innerHTML = `<div class="list">${entries
      .map((entry) => {
        const tool = registry.getById(entry.toolId);
        return tool ? historyListItem(tool, entry, { isFavorite: isFavorite(tool.id) }) : "";
      })
      .join("")}</div>`;

    wireToolNavigation(slot);
    wireFavoriteToggles(slot);
  }

  const clearBtn = container.querySelector("#history-clear-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      history.clear();
      render(container);
    });
  }
}
