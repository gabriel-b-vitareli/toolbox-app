/*
  history.js
  Guarda o historico de uso das ferramentas no dispositivo (localStorage).
  Nenhuma tela grava diretamente no localStorage - tudo passa por aqui,
  entao a forma de persistir pode mudar no futuro (ex: SQLite nativo)
  sem afetar o resto do app.
*/

const STORAGE_KEY = "toolbox:history";
const MAX_ENTRIES = 50;

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("[history] falha ao ler o historico:", err);
    return [];
  }
}

function writeAll(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (err) {
    console.warn("[history] falha ao salvar o historico:", err);
  }
}

/**
 * Registra o uso de uma ferramenta agora mesmo.
 * Cada uso vira uma entrada nova (nao substitui a anterior), para que o
 * historico completo reflita quando cada uso aconteceu.
 */
export function recordUsage(toolId) {
  const entries = readAll();
  entries.unshift({ toolId, timestamp: Date.now() });
  writeAll(entries.slice(0, MAX_ENTRIES));
}

/** Todas as entradas, mais recente primeiro. */
export function getAll() {
  return readAll().sort((a, b) => b.timestamp - a.timestamp);
}

/** Ate `limit` entradas, sem repetir a mesma ferramenta duas vezes. */
export function getRecentUnique(limit = 5) {
  const seen = new Set();
  const result = [];
  for (const entry of getAll()) {
    if (seen.has(entry.toolId)) continue;
    seen.add(entry.toolId);
    result.push(entry);
    if (result.length >= limit) break;
  }
  return result;
}

export function clear() {
  writeAll([]);
}
