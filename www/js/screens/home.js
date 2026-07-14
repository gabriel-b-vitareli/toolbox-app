/*
  screens/home.js
  Tela inicial do app. So le dados do registry, categorias, historico e
  favoritos - nao conhece nenhuma ferramenta especifica.
*/

import { icons } from "../core/icons.js";
import { registry } from "../core/registry.js";
import { categories, getCategoryById } from "../core/categories.js";
import { sectionHeader, emptyState, categoryCard, toolCard, historyListItem } from "../core/ui.js";
import { router } from "../core/router.js";
import { getRecentUnique, getAll as getAllHistory } from "../core/history.js";
import { isFavorite } from "../core/favorites.js";
import { wireToolNavigation, wireFavoriteToggles } from "../core/list-behavior.js";

export function mountHomeScreen(container) {
  container.innerHTML = `
    <header class="app-header">
      <div class="app-header__logo">${icons.logoGrid()}</div>
      <div class="app-header__text">
        <div class="app-header__title">Toolbox</div>
        <div class="app-header__subtitle">Sempre existe uma ferramenta para isso.</div>
      </div>
      <button class="app-header__action" type="button" id="home-settings-btn" aria-label="Configuracoes">
        ${icons.settings()}
      </button>
    </header>

    <button class="search-bar" type="button" id="home-search-btn">
      ${icons.search()}
      <span style="flex:1; text-align:left; color: var(--color-text-tertiary);">Buscar ferramentas...</span>
      <span class="search-bar__mic">${icons.mic()}</span>
    </button>

    <section class="section">
      ${sectionHeader("Continuar usando")}
      <div id="home-continue-slot"></div>
    </section>

    <section class="section">
      ${sectionHeader("Categorias", "Ver todas")}
      <div class="category-grid" id="home-categories-grid"></div>
    </section>

    <section class="section">
      ${sectionHeader("Recente", "Ver historico")}
      <div id="home-recent-slot"></div>
    </section>
  `;

  renderContinueUsing(container);
  renderCategories(container);
  renderRecent(container);

  container.querySelector("#home-settings-btn").addEventListener("click", () => {
    router.navigate("configuracoes");
  });

  container.querySelector("#home-search-btn").addEventListener("click", () => {
    router.navigate("pesquisa");
  });
}

function renderContinueUsing(container) {
  const slot = container.querySelector("#home-continue-slot");
  const recentTools = getRecentUnique(6)
    .map((entry) => registry.getById(entry.toolId))
    .filter(Boolean);

  if (recentTools.length === 0) {
    slot.innerHTML = emptyState({
      title: "Nenhuma ferramenta usada ainda",
      hint: "As ferramentas que voce mais usar vao aparecer aqui.",
    });
    return;
  }

  slot.innerHTML = `<div class="hscroll">${recentTools
    .map((tool) => {
      const category = getCategoryById(tool.category);
      return toolCard({ ...tool, categoryLabel: category ? category.name : "" });
    })
    .join("")}</div>`;

  wireToolNavigation(slot);
}

function renderCategories(container) {
  const grid = container.querySelector("#home-categories-grid");
  grid.innerHTML = categories
    .map((cat) => categoryCard(cat, registry.getByCategory(cat.id).length))
    .join("");

  grid.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
      router.navigate("categoria", card.dataset.category);
    });
  });
}

function renderRecent(container) {
  const slot = container.querySelector("#home-recent-slot");
  const entries = getAllHistory().slice(0, 5);

  if (entries.length === 0) {
    slot.innerHTML = emptyState({
      title: "Nenhuma atividade recente",
      hint: "Seu historico de uso vai aparecer aqui.",
    });
    return;
  }

  slot.innerHTML = `<div class="list">${entries
    .map((entry) => {
      const tool = registry.getById(entry.toolId);
      return tool ? historyListItem(tool, entry, { isFavorite: isFavorite(tool.id) }) : "";
    })
    .join("")}</div>`;

  wireToolNavigation(slot);
  wireFavoriteToggles(slot);

  const historyLink = container.querySelector(".section:last-of-type .section__link");
  if (historyLink) historyLink.addEventListener("click", () => router.navigate("historico"));
}
