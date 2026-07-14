import { registerPlugin } from './capacitor-core.js';
const App = registerPlugin('App', {
    web: () => import('./capacitor-app-web.js').then(m => new m.AppWeb()),
});
export * from './capacitor-app-definitions.js';
export { App };
