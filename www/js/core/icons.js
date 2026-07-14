/*
  icons.js
  Icones SVG usados na interface. Cada funcao retorna uma string de markup
  pronta para ser inserida via innerHTML. Usam "currentColor" para herdar
  a cor definida em CSS pelo elemento pai.
*/

export const icons = {
  logoGrid: () => `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="7.5" height="7.5" rx="2"/>
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/>
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/>
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>
    </svg>`,

  search: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <circle cx="11" cy="11" r="7"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>`,

  mic: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3"/>
      <path d="M5 10a7 7 0 0 0 14 0"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
    </svg>`,

  settings: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>`,

  home: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 10.5 12 3l9 7.5"/>
      <path d="M5 9.5V21h14V9.5"/>
    </svg>`,

  star: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2.5 15.1 9 22.2 10 17.1 15 18.3 22 12 18.6 5.7 22 6.9 15 1.8 10 8.9 9"/>
    </svg>`,

  starFilled: () => `
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round">
      <polygon points="12 2.5 15.1 9 22.2 10 17.1 15 18.3 22 12 18.6 5.7 22 6.9 15 1.8 10 8.9 9"/>
    </svg>`,

  clock: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <polyline points="12 7 12 12 15.5 14"/>
    </svg>`,

  chevronRight: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="9 6 15 12 9 18"/>
    </svg>`,

  box: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/>
      <path d="M3 8l9 5 9-5"/>
      <path d="M12 13v8"/>
    </svg>`,

  /* Icones de categorias */
  swap: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 3 21 7l-4 4"/>
      <path d="M21 7H9"/>
      <path d="M7 21 3 17l4-4"/>
      <path d="M3 17h12"/>
    </svg>`,

  smartphone: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="6" y="2" width="12" height="20" rx="2.5"/>
      <line x1="11" y1="18" x2="13" y2="18"/>
    </svg>`,

  calculator: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/>
      <line x1="8" y1="6" x2="16" y2="6"/>
      <line x1="8" y1="11" x2="8" y2="11.01"/>
      <line x1="12" y1="11" x2="12" y2="11.01"/>
      <line x1="16" y1="11" x2="16" y2="11.01"/>
      <line x1="8" y1="15" x2="8" y2="15.01"/>
      <line x1="12" y1="15" x2="12" y2="15.01"/>
      <line x1="16" y1="15" x2="16" y2="15.01"/>
      <line x1="8" y1="19" x2="8" y2="19.01"/>
      <line x1="12" y1="19" x2="12" y2="19.01"/>
      <line x1="16" y1="19" x2="16" y2="19.01"/>
    </svg>`,

  briefcase: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2.5" y="7" width="19" height="13" rx="2"/>
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      <line x1="2.5" y1="12.5" x2="21.5" y2="12.5"/>
    </svg>`,

  wand: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 20 18 6"/>
      <path d="M15 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z"/>
      <line x1="19" y1="14" x2="19" y2="18"/>
      <line x1="17" y1="16" x2="21" y2="16"/>
    </svg>`,

  dollar: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M15 9.5c0-1.4-1.3-2.5-3-2.5s-3 1-3 2.3c0 3 6 1.4 6 4.3 0 1.4-1.3 2.4-3 2.4s-3-1-3-2.4"/>
      <line x1="12" y1="5.5" x2="12" y2="18.5"/>
    </svg>`,

  gauge: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4.5 16.5a8 8 0 1 1 15 0"/>
      <line x1="12" y1="13" x2="15.2" y2="9.5"/>
      <circle cx="12" cy="13" r="1"/>
    </svg>`,

  dots: () => `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="6" cy="12" r="1.6"/>
      <circle cx="12" cy="12" r="1.6"/>
      <circle cx="18" cy="12" r="1.6"/>
    </svg>`,

  /* Icones de ferramentas */
  ruler: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2.5" y="7.5" width="19" height="9" rx="1.5" transform="rotate(-45 12 12)"/>
      <path d="M9 9l1.5 1.5M12 6l1.5 1.5M6 12l1.5 1.5M15 3l1.5 1.5" transform="translate(1.2 1.2)"/>
    </svg>`,

  arrowLeft: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="11 6 5 12 11 18"/>
    </svg>`,

  arrowsUpDown: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 3v14"/>
      <path d="M4.5 13.5 8 17l3.5-3.5"/>
      <path d="M16 21V7"/>
      <path d="M19.5 10.5 16 7l-3.5 3.5"/>
    </svg>`,

  scale: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M9 15a3 3 0 0 1 6 0"/>
      <line x1="12" y1="12" x2="12" y2="9"/>
      <line x1="12" y1="12" x2="14.2" y2="10.3"/>
    </svg>`,

  thermometer: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 14.5V4.5a2 2 0 0 0-4 0v10a4 4 0 1 0 4 0Z"/>
      <line x1="10" y1="8" x2="12" y2="8"/>
    </svg>`,

  trash: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3.5 6 5.5 6 20.5 6"/>
      <path d="M8.5 6V4a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 15.5 4v2"/>
      <path d="M6.5 6l1 13.5A2 2 0 0 0 9.5 21.5h5a2 2 0 0 0 2-2L17.5 6"/>
      <line x1="10.5" y1="10.5" x2="10.5" y2="16.5"/>
      <line x1="13.5" y1="10.5" x2="13.5" y2="16.5"/>
    </svg>`,

  level: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2.5" y="9" width="19" height="6" rx="2"/>
      <circle cx="12" cy="12" r="2.3"/>
      <line x1="6" y1="9" x2="6" y2="15"/>
      <line x1="18" y1="9" x2="18" y2="15"/>
    </svg>`,

  square: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
      <path d="M4 9h2M4 15h2M18 9h2M18 15h2M9 4v2M15 4v2M9 18v2M15 18v2"/>
    </svg>`,

  beaker: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 2.5h6"/>
      <path d="M10 3v6.5L4.5 19a1.8 1.8 0 0 0 1.6 2.7h11.8a1.8 1.8 0 0 0 1.6-2.7L14 9.5V3"/>
      <path d="M7 15.5h10"/>
    </svg>`,

  key: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="7.5" cy="15.5" r="4.5"/>
      <path d="M10.8 12.2 20 3"/>
      <path d="M16.5 6.5 19 9"/>
      <path d="M13.5 9.5 15.5 11.5"/>
    </svg>`,

  copy: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="8.5" y="8.5" width="12" height="12" rx="2"/>
      <path d="M15.5 8.5V5.5a2 2 0 0 0-2-2h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>
    </svg>`,

  refresh: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 11A8 8 0 1 0 18.5 16"/>
      <polyline points="20 5 20 11 14 11"/>
    </svg>`,

  check: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="4 12.5 9.5 18 20 5"/>
    </svg>`,

  flashlight: () => `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 2.5h6l-1 5h2.5L10 21.5v-8H7.5l1-5H8Z"/>
    </svg>`,
};
