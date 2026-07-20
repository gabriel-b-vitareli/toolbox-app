import { registerPlugin } from './capacitor-core.js';
const Haptics = registerPlugin('Haptics', {
    web: () => import('./capacitor-haptics-web.js').then(m => new m.HapticsWeb()),
});
export * from './capacitor-haptics-definitions.js';
export { Haptics };
