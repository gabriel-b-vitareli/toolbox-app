/*
  registry.js
  Motor central de registro de ferramentas.

  Nenhuma tela do app conhece uma ferramenta especifica. Em vez disso,
  cada ferramenta se registra aqui descrevendo a si mesma. As telas
  (inicio, categorias, pesquisa...) apenas consultam este registro.

  Isso e o que torna a adicao de uma nova ferramenta, no futuro, uma
  tarefa isolada: basta criar o modulo da ferramenta e chamar
  registry.register({...}) - nada mais no app precisa mudar.

  Formato esperado de uma ferramenta:
  {
    id: "comprimento",              string unico
    name: "Comprimento",            nome exibido
    description: "Converta...",     descricao curta
    category: "conversores",        id de uma categoria valida (categories.js)
    keywords: ["metros", "pes"],    termos extras para a busca
    icon: iconFn,                   funcao que retorna SVG (de icons.js ou propria)
    accent: "purple",               chave de cor (bate com --accent-*)
    requirements: [],               ex: ["magnetometer"], vazio = sem requisito
    render: (container) => {}       funcao que desenha a tela da ferramenta
  }
*/

import { isCompatible } from "./compatibility.js";

class ToolRegistry {
  constructor() {
    this._tools = new Map();
  }

  /**
   * Registra uma ferramenta no motor central.
   * Ferramentas com id duplicado sao rejeitadas (evita bugs silenciosos).
   */
  register(tool) {
    if (!tool || !tool.id) {
      console.error("[registry] ferramenta invalida, faltando 'id':", tool);
      return;
    }
    if (this._tools.has(tool.id)) {
      console.warn(`[registry] ferramenta '${tool.id}' ja registrada, ignorando duplicata.`);
      return;
    }
    this._tools.set(tool.id, tool);
  }

  /** Retorna todas as ferramentas registradas e compativeis com o aparelho. */
  getAll() {
    return [...this._tools.values()].filter((t) => this.isCompatible(t));
  }

  getById(id) {
    return this._tools.get(id) || null;
  }

  getByCategory(categoryId) {
    return this.getAll().filter((t) => t.category === categoryId);
  }

  /**
   * Verifica se os requisitos de hardware da ferramenta sao atendidos
   * pelo aparelho atual (ver core/compatibility.js).
   */
  isCompatible(tool) {
    return isCompatible(tool.requirements);
  }

  /**
   * Busca simples por nome, descricao ou palavras-chave.
   * Sera refinada quando a tela de pesquisa for implementada.
   */
  search(query) {
    const q = (query || "").trim().toLowerCase();
    if (!q) return [];
    return this.getAll().filter((t) => {
      const haystack = [t.name, t.description, ...(t.keywords || [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }
}

// Instancia unica compartilhada por todo o app.
export const registry = new ToolRegistry();
