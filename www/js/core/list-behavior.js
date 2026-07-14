/*
  list-behavior.js
  Comportamentos de interacao compartilhados por qualquer tela que mostre
  uma lista de ferramentas (Inicio, Categoria, Historico, Favoritos...).
  Centralizado aqui para nao repetir a mesma logica de clique em cada tela.
*/

import { router } from "./router.js";
import { toggle as toggleFavorite } from "./favorites.js";
import { icons } from "./icons.js";

/** Clicar em qualquer item de lista (fora do botao de favorito) abre a ferramenta. */
export function wireToolNavigation(container, selector = "[data-tool]") {
  container.querySelectorAll(selector).forEach((item) => {
    item.addEventListener("click", (event) => {
      if (event.target.closest("[data-favorite-toggle]")) return;
      router.navigate("ferramenta", item.dataset.tool);
    });
  });
}

/**
 * Liga os botoes de estrela de uma lista. Atualiza o proprio botao na hora
 * (sem re-renderizar a lista inteira) e opcionalmente avisa quem chamou
 * via onToggle, para telas como "Favoritos" que precisam remover o item
 * da lista quando ele e desfavoritado.
 */
export function wireFavoriteToggles(container, onToggle) {
  container.querySelectorAll("[data-favorite-toggle]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const toolId = btn.dataset.favoriteToggle;
      const nowFavorite = toggleFavorite(toolId);
      btn.setAttribute("data-active", String(nowFavorite));
      btn.innerHTML = nowFavorite ? icons.starFilled() : icons.star();
      btn.setAttribute("aria-label", nowFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos");
      if (typeof onToggle === "function") onToggle(toolId, nowFavorite);
    });
  });
}
