/*
  tools/senha/index.js
  Gerador de senha aleatoria. Diferente das ferramentas de conversao,
  esta usa uma interface propria (nao reaproveita createConverterUI) -
  mostra que a arquitetura suporta qualquer tipo de tela, nao so
  conversores.

  Usa crypto.getRandomValues para gerar numeros aleatorios criptografi-
  camente seguros (mais confiavel que Math.random para senhas).
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";

const CHAR_SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%&*-_+=?",
};

function generatePassword(length, options) {
  const pools = Object.keys(options)
    .filter((key) => options[key])
    .map((key) => CHAR_SETS[key]);

  if (pools.length === 0) return "";

  const fullPool = pools.join("");
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  let password = "";
  for (let i = 0; i < length; i++) {
    password += fullPool[randomValues[i] % fullPool.length];
  }
  return password;
}

function render(container) {
  container.innerHTML = `
    <div class="password-output">
      <span class="password-output__value" id="senha-output">-</span>
      <button class="icon-btn" type="button" id="senha-copy-btn" aria-label="Copiar senha">
        ${icons.copy()}
      </button>
    </div>

    <div class="password-options">
      <div class="password-option-card">
        <div class="password-length-row">
          <span class="password-length-row__label">Tamanho</span>
          <span class="password-length-row__value" id="senha-length-value">16</span>
        </div>
        <input class="password-slider" type="range" id="senha-length" min="4" max="32" value="16" />
      </div>

      <div class="password-option-card">
        <label class="password-checkbox">
          <span>Letras maiusculas (A-Z)</span>
          <input type="checkbox" id="senha-upper" checked />
        </label>
        <label class="password-checkbox">
          <span>Letras minusculas (a-z)</span>
          <input type="checkbox" id="senha-lower" checked />
        </label>
        <label class="password-checkbox">
          <span>Numeros (0-9)</span>
          <input type="checkbox" id="senha-numbers" checked />
        </label>
        <label class="password-checkbox">
          <span>Simbolos (!@#$...)</span>
          <input type="checkbox" id="senha-symbols" />
        </label>
      </div>
    </div>

    <div class="password-actions">
      <button class="btn-primary" type="button" id="senha-generate-btn">
        ${icons.refresh()}
        Gerar nova senha
      </button>
    </div>
  `;

  const output = container.querySelector("#senha-output");
  const lengthInput = container.querySelector("#senha-length");
  const lengthValue = container.querySelector("#senha-length-value");
  const upperCheck = container.querySelector("#senha-upper");
  const lowerCheck = container.querySelector("#senha-lower");
  const numbersCheck = container.querySelector("#senha-numbers");
  const symbolsCheck = container.querySelector("#senha-symbols");
  const copyBtn = container.querySelector("#senha-copy-btn");
  const generateBtn = container.querySelector("#senha-generate-btn");

  function currentOptions() {
    return {
      upper: upperCheck.checked,
      lower: lowerCheck.checked,
      numbers: numbersCheck.checked,
      symbols: symbolsCheck.checked,
    };
  }

  function regenerate() {
    const options = currentOptions();
    const anySelected = Object.values(options).some(Boolean);

    if (!anySelected) {
      // Nao deixa o usuario ficar sem nenhum criterio marcado - religa "minusculas".
      lowerCheck.checked = true;
      options.lower = true;
    }

    output.textContent = generatePassword(Number(lengthInput.value), options);
  }

  lengthInput.addEventListener("input", () => {
    lengthValue.textContent = lengthInput.value;
    regenerate();
  });

  [upperCheck, lowerCheck, numbersCheck, symbolsCheck].forEach((el) => {
    el.addEventListener("change", regenerate);
  });

  generateBtn.addEventListener("click", regenerate);

  copyBtn.addEventListener("click", async () => {
    if (!output.textContent || output.textContent === "-") return;
    try {
      await navigator.clipboard.writeText(output.textContent);
      copyBtn.innerHTML = icons.check();
      setTimeout(() => {
        copyBtn.innerHTML = icons.copy();
      }, 1200);
    } catch (err) {
      console.warn("[senha] falha ao copiar:", err);
    }
  });

  regenerate();
}

registry.register({
  id: "senha",
  name: "Gerador de Senha",
  description: "Crie senhas aleatorias e seguras, do seu jeito.",
  category: "geradores",
  keywords: ["senha", "gerador", "seguranca", "aleatorio", "password"],
  icon: icons.key,
  accent: "magenta",
  requirements: [],
  render,
});
