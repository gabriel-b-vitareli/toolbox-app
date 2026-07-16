/*
  media-access.js
  Pede acesso a camera/microfone (getUserMedia) com uma nova tentativa
  automatica em caso de falha.

  Por que isso existe: em WebViews Android (inclusive dentro do
  Capacitor), e comum a PRIMEIRA chamada de getUserMedia falhar mesmo
  quando o usuario acabou de conceder a permissao - a promise do
  JavaScript as vezes resolve com erro antes do sistema terminar de
  processar a concessao. Ferramentas como Lanterna e Decibelimetro usam
  isso em vez de chamar getUserMedia diretamente, para nao fazer o
  usuario pensar que "a permissao nao funcionou" quando na verdade so
  precisava tentar de novo.
*/

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {MediaStreamConstraints} constraints
 * @param {{ retries?: number, delayMs?: number }} options
 * @returns {Promise<MediaStream>}
 */
export async function getUserMediaWithRetry(constraints, { retries = 1, delayMs = 400 } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      lastError = err;
      // So vale a pena tentar de novo se o erro nao for uma negacao
      // explicita e permanente do usuario - nesse caso, insistir e so
      // gerar mais um dialogo de sistema sem necessidade.
      if (err && err.name === "NotAllowedError" && attempt > 0) break;
      if (attempt < retries) await wait(delayMs);
    }
  }
  throw lastError;
}
