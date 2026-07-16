/*
  tools/desconto/index.js
  Calculadora de desconto: a partir do preco original e da porcentagem
  de desconto, mostra o preco final e quanto foi economizado.
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function render(container) {
  container.innerHTML = `
    <div class="discount-widget">
      <div class="converter__field">
        <label class="converter__label" for="discount-price">Preco original</label>
        <div class="converter__row">
          <input class="converter__input" id="discount-price" type="number" inputmode="decimal" placeholder="0,00" />
        </div>
      </div>

      <div class="converter__field">
        <label class="converter__label" for="discount-percent">Desconto (%)</label>
        <div class="converter__row">
          <input class="converter__input" id="discount-percent" type="number" inputmode="decimal" placeholder="0" />
        </div>
      </div>

      <div class="discount-result">
        <div class="discount-result__value" id="discount-final">R$ 0,00</div>
        <div class="discount-result__label">preco final</div>
        <div class="discount-result__saved" id="discount-saved">Voce economiza R$ 0,00</div>
      </div>
    </div>
  `;

  const priceInput = container.querySelector("#discount-price");
  const percentInput = container.querySelector("#discount-percent");
  const finalEl = container.querySelector("#discount-final");
  const savedEl = container.querySelector("#discount-saved");

  function recalc() {
    const price = parseFloat(priceInput.value.replace(",", ".")) || 0;
    const percent = parseFloat(percentInput.value.replace(",", ".")) || 0;
    const saved = price * (percent / 100);
    const final = price - saved;

    finalEl.textContent = formatCurrency(final);
    savedEl.textContent = `Voce economiza ${formatCurrency(saved)}`;
  }

  priceInput.addEventListener("input", recalc);
  percentInput.addEventListener("input", recalc);
  recalc();
}

registry.register({
  id: "desconto",
  name: "Calculadora de Desconto",
  description: "Veja o preco final e quanto voce economiza com um desconto.",
  category: "financeiro",
  keywords: ["desconto", "preco", "promocao", "economia", "porcentagem", "off"],
  icon: icons.percent,
  accent: "green",
  requirements: [],
  render,
});
