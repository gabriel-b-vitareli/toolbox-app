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
 * Registra o uso de uma ferramenta agora mesmo. Se a ferramenta ja tiver
 * uma entrada no historico, so atualiza o horario dela (nao duplica) -
 * o historico mostra CADA ferramenta usada uma unica vez, na hora mais
 * recente em que foi usada.
 */
export function recordUsage(toolId) {
  const entries = readAll().filter((entry) => entry.toolId !== toolId);
  entries.unshift({ toolId, timestamp: Date.now() });
  writeAll(entries.slice(0, MAX_ENTRIES));
}

/** Todas as entradas, mais recente primeiro. Ja vem sem duplicatas. */
export function getAll() {
  return readAll().sort((a, b) => b.timestamp - a.timestamp);
}

/** Ate `limit` entradas mais recentes (sem duplicatas, ja e o padrao). */
export function getRecentUnique(limit = 5) {
  return getAll().slice(0, limit);
}

export function clear() {
  writeAll([]);
}
