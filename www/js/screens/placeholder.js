/*
  screens/placeholder.js
  Tela generica usada pelas abas que ainda nao foram implementadas
  (favoritos, pesquisa, historico, configuracoes). Cada uma sera
  substituida por seu proprio modulo em uma etapa futura.
*/

export function mountPlaceholderScreen(title, hint) {
  return (container) => {
    container.innerHTML = `
      <div class="screen-placeholder">
        <div class="screen-placeholder__title">${title}</div>
        <p>${hint}</p>
      </div>
    `;
  };
}
