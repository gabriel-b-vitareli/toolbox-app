/*
  tools/massa/index.js
  Conversor de massa. Mesmo padrao do Comprimento: so define unidades
  e formula, a interface vem de core/converter-ui.js.
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";
import { createConverterUI } from "../../core/converter-ui.js";

// Fator de conversao de cada unidade para gramas (unidade base).
const UNITS = [
  { id: "t", symbol: "t", label: "Toneladas", factor: 1000000 },
  { id: "kg", symbol: "kg", label: "Quilogramas", factor: 1000 },
  { id: "g", symbol: "g", label: "Gramas", factor: 1 },
  { id: "mg", symbol: "mg", label: "Miligramas", factor: 0.001 },
  { id: "lb", symbol: "lb", label: "Libras", factor: 453.59237 },
  { id: "oz", symbol: "oz", label: "Oncas", factor: 28.349523125 },
];

function convert(value, fromId, toId) {
  const from = UNITS.find((u) => u.id === fromId);
  const to = UNITS.find((u) => u.id === toId);
  const grams = value * from.factor;
  return grams / to.factor;
}

registry.register({
  id: "massa",
  name: "Massa",
  description: "Converta entre quilos, gramas, libras e mais.",
  category: "conversores",
  keywords: ["massa", "peso", "kg", "quilo", "grama", "libra", "onca", "tonelada"],
  icon: icons.scale,
  accent: "green",
  requirements: [],
  render(container) {
    createConverterUI(container, {
      units: UNITS,
      convert,
      defaultFrom: "kg",
      defaultTo: "lb",
      idPrefix: "massa",
    });
  },
});
