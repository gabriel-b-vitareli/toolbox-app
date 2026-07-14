/*
  tools/volume/index.js
  Conversor de volume. Mesmo padrao de comprimento/massa: so define
  unidades e formula, a interface vem de core/converter-ui.js.
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";
import { createConverterUI } from "../../core/converter-ui.js";

// Fator de conversao de cada unidade para litros (unidade base).
const UNITS = [
  { id: "m3", symbol: "m3", label: "Metros cubicos", factor: 1000 },
  { id: "l", symbol: "L", label: "Litros", factor: 1 },
  { id: "ml", symbol: "mL", label: "Mililitros", factor: 0.001 },
  { id: "cm3", symbol: "cm3", label: "Centimetros cubicos", factor: 0.001 },
  { id: "gal", symbol: "gal", label: "Galoes (EUA)", factor: 3.785411784 },
  { id: "qt", symbol: "qt", label: "Quartos (EUA)", factor: 0.946352946 },
  { id: "pt", symbol: "pt", label: "Pintas (EUA)", factor: 0.473176473 },
  { id: "cup", symbol: "xic", label: "Xicaras (EUA)", factor: 0.2365882365 },
];

function convert(value, fromId, toId) {
  const from = UNITS.find((u) => u.id === fromId);
  const to = UNITS.find((u) => u.id === toId);
  const liters = value * from.factor;
  return liters / to.factor;
}

registry.register({
  id: "volume",
  name: "Volume",
  description: "Converta entre litros, mililitros, galoes e mais.",
  category: "conversores",
  keywords: ["volume", "litro", "mililitro", "galao", "m3", "xicara", "cozinha", "receita"],
  icon: icons.beaker,
  accent: "blue",
  requirements: [],
  render(container) {
    createConverterUI(container, {
      units: UNITS,
      convert,
      defaultFrom: "l",
      defaultTo: "ml",
      idPrefix: "volume",
    });
  },
});
