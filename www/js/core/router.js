/*
  router.js
  Roteador simples baseado no hash da URL (#home, #favoritos, #categoria/conversores...).
  Nao usa nenhuma biblioteca externa - so o essencial para trocar
  qual "tela" esta visivel dentro de #screen-content.

  Cada tela e registrada com router.addScreen(id, { mount, dynamic }).
  "mount" recebe (container, param) e desenha o conteudo daquela tela.

  Telas "dynamic: true" (ex: categoria, ferramenta) sao remontadas toda
  vez que sao acessadas, porque o parametro pode mudar (categoria X vs Y).
  Telas estaticas (home, favoritos...) sao montadas uma unica vez.
*/

class Router {
  constructor() {
    this._screens = new Map();
    this._current = null;
    this._onChangeCallbacks = [];
  }

  addScreen(id, { mount, dynamic = false }) {
    this._screens.set(id, { mount, dynamic, mounted: false });
  }

  onChange(callback) {
    this._onChangeCallbacks.push(callback);
  }

  start(defaultScreen = "home") {
    window.addEventListener("hashchange", () => this._handleHashChange());
    const { id, param } = this._parseHash();
    this._navigate(id || defaultScreen, param, { replace: true });
  }

  navigate(screenId, param) {
    const hash = param ? `#${screenId}/${encodeURIComponent(param)}` : `#${screenId}`;
    window.location.hash = hash;
  }

  back() {
    history.back();
  }

  _parseHash() {
    const raw = window.location.hash.replace("#", "");
    if (!raw) return { id: null, param: null };
    const [id, param] = raw.split("/");
    return { id: id || null, param: param ? decodeURIComponent(param) : null };
  }

  _handleHashChange() {
    const { id, param } = this._parseHash();
    if (id) this._navigate(id, param);
  }

  _navigate(screenId, param, { replace = false } = {}) {
    if (!this._screens.has(screenId)) {
      console.warn(`[router] tela '${screenId}' nao existe.`);
      return;
    }
    if (replace) {
      const hash = param ? `#${screenId}/${encodeURIComponent(param)}` : `#${screenId}`;
      history.replaceState(null, "", hash);
    }

    document.querySelectorAll(".screen").forEach((el) => {
      el.setAttribute("data-visible", "false");
    });

    const screen = this._screens.get(screenId);
    let el = document.getElementById(`screen-${screenId}`);

    if (!el) {
      el = document.createElement("div");
      el.id = `screen-${screenId}`;
      el.className = "screen";
      document.getElementById("screen-content").appendChild(el);
    }

    if (!screen.mounted || screen.dynamic) {
      screen.mount(el, param);
      screen.mounted = true;
    }

    el.setAttribute("data-visible", "true");
    this._current = screenId;

    this._onChangeCallbacks.forEach((cb) => cb(screenId, param));
  }

  get current() {
    return this._current;
  }
}

export const router = new Router();
