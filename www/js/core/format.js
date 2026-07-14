/*
  format.js
  Pequenas funcoes de formatacao usadas por mais de uma tela.
*/

export function formatRelativeTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();

  const time = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, now)) return `Hoje, ${time}`;
  if (isSameDay(date, yesterday)) return `Ontem, ${time}`;

  const dateLabel = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  return `${dateLabel}, ${time}`;
}
