/*
  tools/temperatura/index.js
  Conversor de temperatura. Diferente de comprimento/massa, a conversao
  nao e um simples fator multiplicativo (celsius, fahrenheit e kelvin tem
  escalas com "zeros" diferentes) - por isso usa formulas proprias, mas
  a interface continua vindo do mesmo helper compartilhado.
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";
import { createConverterUI } from "../../core/converter-ui.js";

const UNITS = [
  { id: "c", symbol: "\u00b0C", label: "Celsius" },
  { id: "f", symbol: "\u00b0F", label: "Fahrenheit" },
  { id: "k", symbol: "K", label: "Kelvin" },
];

function toCelsius(value, unitId) {
  if (unitId === "c") return value;
  if (unitId === "f") return (value - 32) * (5 / 9);
  if (unitId === "k") return value - 273.15;
  return value;
}

function fromCelsius(celsius, unitId) {
  if (unitId === "c") return celsius;
  if (unitId === "f") return celsius * (9 / 5) + 32;
  if (unitId === "k") return celsius + 273.15;
  return celsius;
}

function convert(value, fromId, toId) {
  return fromCelsius(toCelsius(value, fromId), toId);
}

registry.register({
  id: "temperatura",
  name: "Temperatura",
  description: "Converta entre Celsius, Fahrenheit e Kelvin.",
  category: "conversores",
  keywords: ["temperatura", "celsius", "fahrenheit", "kelvin", "graus", "clima"],
  icon: icons.thermometer,
  accent: "orange",
  requirements: [],
  render(container) {
    createConverterUI(container, {
      units: UNITS,
      convert,
      defaultFrom: "c",
      defaultTo: "f",
      idPrefix: "temperatura",
      toolId: "temperatura",
    });
  },
});
