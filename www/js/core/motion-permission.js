/*
  motion-permission.js
  iOS 13+ exige que o usuario autorize explicitamente o acesso a sensores
  de movimento/orientacao (DeviceOrientationEvent). Android nao pede essa
  autorizacao extra. Qualquer ferramenta que use o acelerometro/giroscopio
  (Nivel, Bussola...) passa por aqui em vez de duplicar essa checagem.
*/

export function needsMotionPermission() {
  return (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  );
}

export async function requestMotionPermission() {
  try {
    const result = await DeviceOrientationEvent.requestPermission();
    return result === "granted";
  } catch (err) {
    console.warn("[motion-permission] falha ao solicitar permissao:", err);
    return false;
  }
}
