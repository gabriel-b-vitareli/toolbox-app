/*
  categories.js
  Lista fixa das categorias do app. Uma ferramenta sempre pertence a uma
  destas categorias (id). Novas categorias podem ser adicionadas aqui sem
  afetar o resto do sistema.
*/

import { icons } from "./icons.js";

export const categories = [
  { id: "conversores", name: "Conversores", icon: icons.swap, accent: "purple" },
  { id: "dispositivo", name: "Dispositivo", icon: icons.smartphone, accent: "blue" },
  { id: "calculadoras", name: "Calculadoras", icon: icons.calculator, accent: "green" },
  { id: "utilidades", name: "Utilidades", icon: icons.briefcase, accent: "orange" },
  { id: "geradores", name: "Geradores", icon: icons.wand, accent: "orange" },
  { id: "financeiro", name: "Financeiro", icon: icons.dollar, accent: "green" },
  { id: "medidores", name: "Medidores", icon: icons.gauge, accent: "blue" },
  { id: "outros", name: "Outros", icon: icons.dots, accent: "gray" },
];

export function getCategoryById(id) {
  return categories.find((c) => c.id === id) || null;
}
