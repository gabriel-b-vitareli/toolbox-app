/*
  screens/search.js
  Busca ferramentas em tempo real, conforme o usuario digita. Usa
  registry.search() (ja existia desde a etapa 1 do motor central) - esta
  tela so precisava ligar a interface a ele.
*/

import { icons } from "../core/icons.js";
import { registry } from "../core/registry.js";
import { emptyState, toolListItem } from "../core/ui.js";
import { isFavorite } from "../core/favorites.js";
import { wireToolNavigation, wireFavoriteToggles } from "../core/list-behavior.js";

export function mountSearchScreen(container) {
  container.innerHTML = `
    <header class="app-header">
      <div class="app-header__text">
        <div class="app-header__title">Pesquisar</div>
        <div class="app-header__subtitle">Encontre qualquer ferramenta do app</div>
      </div>
    </header>

    <div class="search-bar">
      ${icons.search()}
      <input
        type="search"
        id="search-input"
        placeholder="Buscar ferramentas..."
        autocomplete="off"
      />
    </div>

    <section class="section" id="search-results-slot"></section>
  `;

  const input = container.querySelector("#search-input");
  const slot = container.querySelector("#search-results-slot");

  function renderResults(query) {
    const trimmed = query.trim();

    if (trimmed === "") {
      slot.innerHTML = emptyState({
        title: "Busque por qualquer ferramenta",
        hint: "Digite um nome, categoria ou palavra-chave - por exemplo \u201Ctemperatura\u201D ou \u201Csenha\u201D.",
      });
      return;
    }

    const results = registry.search(trimmed);

    if (results.length === 0) {
      slot.innerHTML = emptyState({
        title: "Nenhuma ferramenta encontrada",
        hint: `Nada encontrado para "${trimmed}". Tente outra palavra.`,
      });
      return;
    }

    slot.innerHTML = `<div class="list">${results
      .map((tool) => toolListItem(tool, { isFavorite: isFavorite(tool.id) }))
      .join("")}</div>`;

    wireToolNavigation(slot);
    wireFavoriteToggles(slot);
  }

  input.addEventListener("input", () => renderResults(input.value));

  renderResults("");

  // Foca o campo automaticamente ao abrir a tela (ajuda em telas maiores;
  // em celulares, o teclado so abre de fato apos um toque do usuario).
  input.focus();
}
