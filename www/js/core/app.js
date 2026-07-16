/*
  app.js
  Ponto de entrada do app. Responsabilidades:
    1. Registrar as telas no roteador.
    2. Montar a navegacao inferior.
    3. Iniciar o roteador na tela inicial.

  Ferramentas se registram importando seus proprios modulos aqui.
  Nesta etapa (fundacao da arquitetura) nenhuma ferramenta real existe
  ainda - a lista de imports abaixo e onde elas entrarao no futuro.
*/

import { router } from "./router.js";
import { icons } from "./icons.js";
import { initBackButton } from "./back-button.js";
import { mountHomeScreen } from "../screens/home.js";
import { mountPlaceholderScreen } from "../screens/placeholder.js";
import { mountCategoryScreen } from "../screens/category.js";
import { mountToolScreen } from "../screens/tool.js";
import { mountHistoryScreen } from "../screens/history.js";
import { mountFavoritesScreen } from "../screens/favorites.js";

// -----------------------------------------------------------------------
// Registro de ferramentas.
// Cada import abaixo e um modulo autocontido que se registra sozinho no
// motor central (registry.js) ao ser carregado. Para adicionar uma nova
// ferramenta no futuro, basta criar a pasta em js/tools/ e importa-la aqui.
// -----------------------------------------------------------------------
import "../tools/comprimento/index.js";
import "../tools/massa/index.js";
import "../tools/temperatura/index.js";
import "../tools/area/index.js";
import "../tools/volume/index.js";
import "../tools/velocidade/index.js";
import "../tools/nivel/index.js";
import "../tools/lanterna/index.js";
import "../tools/bussola/index.js";
import "../tools/vibracao/index.js";
import "../tools/decibelimetro/index.js";
import "../tools/cronometro/index.js";
import "../tools/senha/index.js";
import "../tools/sorteador/index.js";
import "../tools/calculadora/index.js";
import "../tools/idade/index.js";
import "../tools/desconto/index.js";
import "../tools/texto/index.js";

// -----------------------------------------------------------------------
// Telas
// -----------------------------------------------------------------------
router.addScreen("home", { mount: mountHomeScreen, dynamic: true });
router.addScreen("favoritos", { mount: mountFavoritesScreen, dynamic: true });
router.addScreen("pesquisa", {
  mount: mountPlaceholderScreen(
    "Pesquisa",
    "A busca por ferramentas sera implementada em uma proxima etapa."
  ),
});
router.addScreen("historico", { mount: mountHistoryScreen, dynamic: true });
router.addScreen("configuracoes", {
  mount: mountPlaceholderScreen(
    "Configuracoes",
    "Preferencias do app, tema e informacoes vao aparecer aqui em breve."
  ),
});
router.addScreen("categoria", { mount: mountCategoryScreen, dynamic: true });
router.addScreen("ferramenta", { mount: mountToolScreen, dynamic: true });

// -----------------------------------------------------------------------
// Navegacao inferior
// -----------------------------------------------------------------------
const NAV_ITEMS = [
  { id: "home", label: "Inicio", icon: icons.home },
  { id: "favoritos", label: "Favoritos", icon: icons.star },
  { id: "pesquisa", label: "Pesquisa", icon: icons.search, fab: true },
  { id: "historico", label: "Historico", icon: icons.clock },
  { id: "configuracoes", label: "Config.", icon: icons.settings },
];

function renderBottomNav() {
  const nav = document.getElementById("bottom-nav");
  nav.innerHTML = NAV_ITEMS.map((item) => {
    const fabClass = item.fab ? " nav-item--fab" : "";
    const label = item.fab ? "" : `<span>${item.label}</span>`;
    return `
      <button class="nav-item${fabClass}" type="button" data-nav="${item.id}" aria-label="${item.label}">
        ${item.icon()}
        ${label}
      </button>
    `;
  }).join("");

  nav.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => router.navigate(btn.dataset.nav));
  });
}

function updateActiveNavItem(screenId) {
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.setAttribute("data-active", String(btn.dataset.nav === screenId));
  });
}

// -----------------------------------------------------------------------
// Boot
// -----------------------------------------------------------------------
function boot() {
  renderBottomNav();
  router.onChange(updateActiveNavItem);
  router.start("home");
  initBackButton();
}

document.addEventListener("DOMContentLoaded", boot);
