/*
  screens/tool.js
  Tela generica que hospeda QUALQUER ferramenta. Ela mesma nao sabe nada
  sobre conversao, calculo ou geracao - so monta o cabecalho padrao (com
  botao de voltar) e delega o corpo da tela para a funcao render() que a
  propria ferramenta registrou no registry.

  E isso que faz "adicionar uma ferramenta nova exigir o minimo de
  alteracoes no resto do projeto": este arquivo nunca muda quando uma
  nova ferramenta e criada.

  Ciclo de vida: uma ferramenta pode opcionalmente retornar uma funcao de
  limpeza no render() (por exemplo, para parar de escutar um sensor).
  Essa funcao e guardada aqui e chamada automaticamente sempre que o
  usuario sai da tela de ferramenta - assim nenhuma ferramenta precisa
  se preocupar em "vazar" listeners quando o usuario navega para outro
  lugar do app.
*/

import { icons } from "../core/icons.js";
import { registry } from "../core/registry.js";
import { getCategoryById } from "../core/categories.js";
import { router } from "../core/router.js";
import { recordUsage } from "../core/history.js";
import { isFavorite, toggle as toggleFavorite } from "../core/favorites.js";

let activeCleanup = null;

// Roda uma unica vez (modulo carregado uma vez): sempre que o roteador
// sair da tela "ferramenta", executa a limpeza pendente, se houver.
router.onChange((screenId) => {
  if (screenId !== "ferramenta" && activeCleanup) {
    activeCleanup();
    activeCleanup = null;
  }
});

export function mountToolScreen(container, toolId) {
  // Trocou de ferramenta (ou reabriu a mesma) - limpa o que a anterior deixou.
  if (activeCleanup) {
    activeCleanup();
    activeCleanup = null;
  }

  const tool = registry.getById(toolId);

  if (!tool) {
    container.innerHTML = `<div class="screen-placeholder">
      <div class="screen-placeholder__title">Ferramenta nao encontrada</div>
    </div>`;
    return;
  }

  const category = getCategoryById(tool.category);
  const favorited = isFavorite(tool.id);

  container.innerHTML = `
    <header class="tool-screen-header">
      <button class="icon-btn" type="button" id="tool-back-btn" aria-label="Voltar">
        ${icons.arrowLeft()}
      </button>
      <span class="tool-screen-header__icon" style="background: var(--accent-${tool.accent});">
        ${tool.icon()}
      </span>
      <div style="flex: 1; min-width: 0;">
        <div class="tool-screen-header__title">${tool.name}</div>
        <div class="tool-screen-header__subtitle">${category ? category.name : ""}</div>
      </div>
      <button class="icon-btn" type="button" id="tool-favorite-btn" data-active="${favorited}" aria-label="${favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}">
        ${favorited ? icons.starFilled() : icons.star()}
      </button>
    </header>

    <div id="tool-body-slot"></div>
  `;

  container.querySelector("#tool-back-btn").addEventListener("click", () => {
    router.navigate("categoria", tool.category);
  });

  const favoriteBtn = container.querySelector("#tool-favorite-btn");
  favoriteBtn.addEventListener("click", () => {
    const nowFavorite = toggleFavorite(tool.id);
    favoriteBtn.setAttribute("data-active", String(nowFavorite));
    favoriteBtn.innerHTML = nowFavorite ? icons.starFilled() : icons.star();
    favoriteBtn.setAttribute("aria-label", nowFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos");
  });

  // A ferramenta desenha o proprio corpo aqui dentro. Se ela retornar uma
  // funcao, guardamos como a limpeza a rodar quando o usuario sair.
  const maybeCleanup = tool.render(container.querySelector("#tool-body-slot"));
  if (typeof maybeCleanup === "function") {
    activeCleanup = maybeCleanup;
  }

  // Registra o uso para "Continuar usando" e o Historico.
  recordUsage(tool.id);
}
