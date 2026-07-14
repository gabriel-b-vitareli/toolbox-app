/*
  screens/category.js
  Mostra as ferramentas de uma categoria. Tela dinamica: o parametro
  (id da categoria) muda a cada navegacao, entao ela e remontada toda vez.
  Nao conhece nenhuma ferramenta especifica - so consulta o registry.
*/

import { icons } from "../core/icons.js";
import { registry } from "../core/registry.js";
import { getCategoryById } from "../core/categories.js";
import { emptyState, toolListItem } from "../core/ui.js";
import { router } from "../core/router.js";
import { isFavorite } from "../core/favorites.js";
import { wireToolNavigation, wireFavoriteToggles } from "../core/list-behavior.js";

export function mountCategoryScreen(container, categoryId) {
  const category = getCategoryById(categoryId);

  if (!category) {
    container.innerHTML = `<div class="screen-placeholder">
      <div class="screen-placeholder__title">Categoria nao encontrada</div>
    </div>`;
    return;
  }

  const tools = registry.getByCategory(categoryId);

  container.innerHTML = `
    <header class="tool-screen-header">
      <button class="icon-btn" type="button" id="category-back-btn" aria-label="Voltar">
        ${icons.arrowLeft()}
      </button>
      <span class="tool-screen-header__icon" style="background: var(--accent-${category.accent});">
        ${category.icon()}
      </span>
      <div>
        <div class="tool-screen-header__title">${category.name}</div>
        <div class="tool-screen-header__subtitle">${tools.length} ${tools.length === 1 ? "ferramenta" : "ferramentas"}</div>
      </div>
    </header>

    <section class="section" id="category-tools-slot"></section>
  `;

  const slot = container.querySelector("#category-tools-slot");

  if (tools.length === 0) {
    slot.innerHTML = emptyState({
      title: "Nenhuma ferramenta aqui ainda",
      hint: "Essa categoria vai ganhar ferramentas nas proximas etapas.",
    });
  } else {
    slot.innerHTML = `<div class="list">${tools
      .map((tool) => toolListItem(tool, { isFavorite: isFavorite(tool.id) }))
      .join("")}</div>`;
    wireToolNavigation(slot);
    wireFavoriteToggles(slot);
  }

  container.querySelector("#category-back-btn").addEventListener("click", () => {
    router.navigate("home");
  });
}
