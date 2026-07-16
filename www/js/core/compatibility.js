/*
  compatibility.js
  Verifica se o navegador/aparelho realmente oferece um recurso de
  hardware antes de uma ferramenta ser exibida. E aqui que a regra
  "sem sensor, a ferramenta nao aparece" (descrita no planejamento do
  app) vira codigo de verdade.

  Cada chave de requisito usada por uma ferramenta (tool.requirements)
  precisa ter uma checagem correspondente aqui. Se uma ferramenta pedir
  um requisito nao mapeado, assumimos disponivel (fail-open) e avisamos
  no console, para nao esconder ferramentas por engano.
*/

const checks = {
  accelerometer: () =>
    typeof window !== "undefined" &&
    (typeof window.DeviceOrientationEvent !== "undefined" ||
      typeof window.DeviceMotionEvent !== "undefined"),

  magnetometer: () =>
    typeof window !== "undefined" && typeof window.DeviceOrientationEvent !== "undefined",

  geolocation: () => typeof navigator !== "undefined" && "geolocation" in navigator,

  camera: () =>
    typeof navigator !== "undefined" && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),

  microphone: () =>
    typeof navigator !== "undefined" && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),

  vibration: () => typeof navigator !== "undefined" && "vibrate" in navigator,
};

function isRequirementMet(requirement) {
  const check = checks[requirement];
  if (!check) {
    console.warn(`[compatibility] requisito desconhecido: '${requirement}', assumindo disponivel.`);
    return true;
  }
  try {
    return !!check();
  } catch (err) {
    console.warn(`[compatibility] falha ao checar '${requirement}':`, err);
    return false;
  }
}

/** True se TODOS os requisitos da lista forem atendidos pelo aparelho atual. */
export function isCompatible(requirements) {
  if (!requirements || requirements.length === 0) return true;
  return requirements.every(isRequirementMet);
}
