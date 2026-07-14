/*
  tools/area/index.js
  Conversor de area. Mesmo padrao de comprimento/massa: so define
  unidades e formula, a interface vem de core/converter-ui.js.
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";
import { createConverterUI } from "../../core/converter-ui.js";

// Fator de conversao de cada unidade para metros quadrados (unidade base).
const UNITS = [
  { id: "km2", symbol: "km2", label: "Quilometros quadrados", factor: 1000000 },
  { id: "ha", symbol: "ha", label: "Hectares", factor: 10000 },
  { id: "m2", symbol: "m2", label: "Metros quadrados", factor: 1 },
  { id: "cm2", symbol: "cm2", label: "Centimetros quadrados", factor: 0.0001 },
  { id: "acre", symbol: "acre", label: "Acres", factor: 4046.8564224 },
  { id: "mi2", symbol: "mi2", label: "Milhas quadradas", factor: 2589988.110336 },
  { id: "yd2", symbol: "jd2", label: "Jardas quadradas", factor: 0.83612736 },
  { id: "ft2", symbol: "pe2", label: "Pes quadrados", factor: 0.09290304 },
];

function convert(value, fromId, toId) {
  const from = UNITS.find((u) => u.id === fromId);
  const to = UNITS.find((u) => u.id === toId);
  const squareMeters = value * from.factor;
  return squareMeters / to.factor;
}

registry.register({
  id: "area",
  name: "Area",
  description: "Converta entre metros quadrados, hectares, acres e mais.",
  category: "conversores",
  keywords: ["area", "m2", "metro quadrado", "hectare", "acre", "terreno", "km2"],
  icon: icons.square,
  accent: "purple",
  requirements: [],
  render(container) {
    createConverterUI(container, {
      units: UNITS,
      convert,
      defaultFrom: "m2",
      defaultTo: "ha",
      idPrefix: "area",
    });
  },
});
