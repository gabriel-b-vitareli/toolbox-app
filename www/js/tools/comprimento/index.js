/*
  tools/comprimento/index.js
  Conversor de comprimento. So define unidades + formula de conversao;
  a interface e compartilhada com todas as outras ferramentas do tipo
  conversor (ver core/converter-ui.js).
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";
import { createConverterUI } from "../../core/converter-ui.js";

// Fator de conversao de cada unidade para metros (unidade base).
const UNITS = [
  { id: "km", symbol: "km", label: "Quilometros", factor: 1000 },
  { id: "m", symbol: "m", label: "Metros", factor: 1 },
  { id: "cm", symbol: "cm", label: "Centimetros", factor: 0.01 },
  { id: "mm", symbol: "mm", label: "Milimetros", factor: 0.001 },
  { id: "mi", symbol: "mi", label: "Milhas", factor: 1609.344 },
  { id: "yd", symbol: "jd", label: "Jardas", factor: 0.9144 },
  { id: "ft", symbol: "pe", label: "Pes", factor: 0.3048 },
  { id: "in", symbol: "pol", label: "Polegadas", factor: 0.0254 },
];

function convert(value, fromId, toId) {
  const from = UNITS.find((u) => u.id === fromId);
  const to = UNITS.find((u) => u.id === toId);
  const meters = value * from.factor;
  return meters / to.factor;
}

registry.register({
  id: "comprimento",
  name: "Comprimento",
  description: "Converta entre metros, quilometros, milhas e mais.",
  category: "conversores",
  keywords: ["comprimento", "metro", "km", "cm", "mm", "milha", "jarda", "pe", "polegada", "distancia", "tamanho"],
  icon: icons.ruler,
  accent: "purple",
  requirements: [],
  render(container) {
    createConverterUI(container, {
      units: UNITS,
      convert,
      defaultFrom: "m",
      defaultTo: "km",
      idPrefix: "comprimento",
    });
  },
});
