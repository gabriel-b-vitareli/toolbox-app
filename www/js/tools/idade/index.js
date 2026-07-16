/*
  tools/idade/index.js
  Calculadora de idade: a partir de uma data de nascimento, calcula
  anos, meses e dias completos ate hoje, alem de mostrar quantos dias
  faltam para o proximo aniversario.
*/

import { icons } from "../../core/icons.js";
import { registry } from "../../core/registry.js";

function calculateAge(birthDate, today) {
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const daysInPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += daysInPrevMonth;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

function daysUntilNextBirthday(birthDate, today) {
  let next = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (next < today) next = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
  return Math.round((next - today) / (1000 * 60 * 60 * 24));
}

function render(container) {
  container.innerHTML = `
    <div class="age-widget">
      <div class="age-field">
        <label for="age-birthdate">Data de nascimento</label>
        <input type="date" id="age-birthdate" />
      </div>

      <div class="age-result" id="age-result-slot" style="display:none;">
        <div class="age-result__item">
          <div class="age-result__value" id="age-years">0</div>
          <div class="age-result__label">anos</div>
        </div>
        <div class="age-result__item">
          <div class="age-result__value" id="age-months">0</div>
          <div class="age-result__label">meses</div>
        </div>
        <div class="age-result__item">
          <div class="age-result__value" id="age-days">0</div>
          <div class="age-result__label">dias</div>
        </div>
      </div>

      <p class="age-extra" id="age-extra"></p>
    </div>
  `;

  const input = container.querySelector("#age-birthdate");
  const resultSlot = container.querySelector("#age-result-slot");
  const yearsEl = container.querySelector("#age-years");
  const monthsEl = container.querySelector("#age-months");
  const daysEl = container.querySelector("#age-days");
  const extraEl = container.querySelector("#age-extra");

  const todayStr = new Date().toISOString().split("T")[0];
  input.max = todayStr;

  input.addEventListener("input", () => {
    if (!input.value) {
      resultSlot.style.display = "none";
      extraEl.textContent = "";
      return;
    }
    const birthDate = new Date(`${input.value}T00:00:00`);
    const today = new Date();

    if (birthDate > today) {
      resultSlot.style.display = "none";
      extraEl.textContent = "Essa data ainda nao chegou.";
      return;
    }

    const { years, months, days } = calculateAge(birthDate, today);
    yearsEl.textContent = years;
    monthsEl.textContent = months;
    daysEl.textContent = days;
    resultSlot.style.display = "flex";

    const untilBirthday = daysUntilNextBirthday(birthDate, today);
    extraEl.textContent =
      untilBirthday === 0
        ? "Hoje e aniversario! 🎉"
        : `Faltam ${untilBirthday} ${untilBirthday === 1 ? "dia" : "dias"} para o proximo aniversario.`;
  });
}

registry.register({
  id: "idade",
  name: "Calculadora de Idade",
  description: "Calcule a idade exata a partir da data de nascimento.",
  category: "utilidades",
  keywords: ["idade", "aniversario", "nascimento", "anos", "data"],
  icon: icons.cake,
  accent: "orange",
  requirements: [],
  render,
});
