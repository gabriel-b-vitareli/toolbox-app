/*
  ui.js
  Funcoes puras que geram HTML de pedacos de interface reutilizaveis.
  Mantidas separadas das telas para que qualquer tela (inicio, categoria,
  pesquisa...) possa montar os mesmos componentes sem duplicar markup.

  Nota sobre list-item: o "cartao" clicavel e um <div role="button"> (nao
  um <button>), porque alguns itens tem um botao de favorito por dentro -
  e HTML nao permite <button> aninhado em <button>. A navegacao dele e
  ligada via JS (evento de clique) pela tela que o usa.
*/

import { icons } from "./icons.js";
import { formatRelativeTime } from "./format.js";

export function sectionHeader(title, linkLabel) {
  return `
    <div class="section__header">
      <h2 class="section__title">${title}</h2>
      ${linkLabel ? `<button class="section__link" type="button">${linkLabel}</button>` : ""}
    </div>
  `;
}

export function emptyState({ title, hint }) {
  return `
    <div class="empty-state">
      ${icons.box()}
      <div class="empty-state__title">${title}</div>
      <div class="empty-state__hint">${hint}</div>
    </div>
  `;
}

export function categoryCard(category, count) {
  return `
    <button class="category-card" type="button" data-category="${category.id}">
      <span class="category-card__icon" style="background: var(--accent-${category.accent}-soft); color: var(--accent-${category.accent});">
        ${category.icon()}
      </span>
      <span class="category-card__text">
        <span class="category-card__name">${category.name}</span>
        <span class="category-card__count">${count} ${count === 1 ? "ferramenta" : "ferramentas"}</span>
      </span>
      ${icons.chevronRight().replace("<svg", '<svg class="category-card__chevron"')}
    </button>
  `;
}

function favoriteButton(toolId, isFavorite) {
  return `
    <button class="list-item__favorite" type="button" data-favorite-toggle="${toolId}" data-active="${isFavorite}" aria-label="${isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}">
      ${isFavorite ? icons.starFilled() : icons.star()}
    </button>
  `;
}

export function toolListItem(tool, { isFavorite = null } = {}) {
  const showFavorite = isFavorite !== null;
  return `
    <div class="list-item list-item--button" data-tool="${tool.id}" role="button" tabindex="0">
      <span class="list-item__icon" style="background: var(--accent-${tool.accent});">
        ${tool.icon()}
      </span>
      <span class="list-item__text">
        <span class="list-item__name">${tool.name}</span>
        <span class="list-item__detail">${tool.description || ""}</span>
      </span>
      ${showFavorite ? favoriteButton(tool.id, isFavorite) : icons.chevronRight().replace("<svg", '<svg class="category-card__chevron"')}
    </div>
  `;
}

export function historyListItem(tool, entry, { isFavorite = false } = {}) {
  return `
    <div class="list-item list-item--button" data-tool="${tool.id}" role="button" tabindex="0">
      <span class="list-item__icon" style="background: var(--accent-${tool.accent});">
        ${tool.icon()}
      </span>
      <span class="list-item__text">
        <span class="list-item__name">${tool.name}</span>
      </span>
      <span class="list-item__meta">
        <span class="list-item__time">${formatRelativeTime(entry.timestamp)}</span>
      </span>
      ${favoriteButton(tool.id, isFavorite)}
    </div>
  `;
}

export function toolCard(tool) {
  return `
    <button class="tool-card" type="button" data-tool="${tool.id}">
      <span class="tool-card__icon" style="background: var(--accent-${tool.accent});">
        ${tool.icon()}
      </span>
      <span class="tool-card__name">${tool.name}</span>
      <span class="tool-card__meta">${tool.categoryLabel || ""}</span>
    </button>
  `;
}
