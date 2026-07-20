/*
  tools/velocidade/index.js
  Conversor de velocidade. Mesmo padrao de comprimento/massa/area/volume:
  so define unidades e formula, a interface vem de core/converter-ui.js.
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";
import { createConverterUI } from "../../core/converter-ui.js";

// Fator de conversao de cada unidade para m/s (unidade base).
const UNITS = [
  { id: "kmh", symbol: "km/h", label: "Quilometros por hora", factor: 1 / 3.6 },
  { id: "ms", symbol: "m/s", label: "Metros por segundo", factor: 1 },
  { id: "mph", symbol: "mph", label: "Milhas por hora", factor: 0.44704 },
  { id: "kn", symbol: "nos", label: "Nos (maritimos)", factor: 0.514444 },
  { id: "fts", symbol: "pe/s", label: "Pes por segundo", factor: 0.3048 },
];

function convert(value, fromId, toId) {
  const from = UNITS.find((u) => u.id === fromId);
  const to = UNITS.find((u) => u.id === toId);
  const metersPerSecond = value * from.factor;
  return metersPerSecond / to.factor;
}

registry.register({
  id: "velocidade",
  name: "Velocidade",
  description: "Converta entre km/h, mph, nos e mais.",
  category: "conversores",
  keywords: ["velocidade", "km/h", "mph", "nos", "speed", "rapidez"],
  icon: icons.speedometer,
  accent: "purple",
  requirements: [],
  render(container) {
    createConverterUI(container, {
      units: UNITS,
      convert,
      defaultFrom: "kmh",
      defaultTo: "mph",
      idPrefix: "velocidade",
      toolId: "velocidade",
    });
  },
});
