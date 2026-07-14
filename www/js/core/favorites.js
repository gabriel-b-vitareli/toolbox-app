/*
  favorites.js
  Guarda a lista de ferramentas favoritadas no dispositivo (localStorage).
  Mesmo padrao do core/history.js: nenhuma tela mexe no localStorage
  diretamente, tudo passa por aqui.
*/

const STORAGE_KEY = "toolbox:favorites";

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("[favorites] falha ao ler favoritos:", err);
    return [];
  }
}

function writeAll(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch (err) {
    console.warn("[favorites] falha ao salvar favoritos:", err);
  }
}

export function isFavorite(toolId) {
  return readAll().includes(toolId);
}

export function getAll() {
  return readAll();
}

/** Alterna o estado de favorito da ferramenta. Retorna o novo estado (true/false). */
export function toggle(toolId) {
  const ids = readAll();
  const index = ids.indexOf(toolId);
  if (index === -1) {
    ids.push(toolId);
    writeAll(ids);
    return true;
  }
  ids.splice(index, 1);
  writeAll(ids);
  return false;
}
