# js/vendor/

Copias locais de pacotes do Capacitor, adaptadas para funcionar sem bundler.

## Por que isso existe

O projeto usa JavaScript puro (sem Webpack/Vite/Rollup) de proposito. Ate
o Capacitor 5, isso era possivel gracas a uma opcao chamada
`bundledWebRuntime`, que gerava um arquivo `capacitor.js` prontinho para
usar. **A partir do Capacitor 6, essa opcao foi removida** - a orientacao
oficial passou a ser "use um bundler". Como este projeto optou por nao
usar bundler, a alternativa (tambem usada por outros projetos vanilla-JS
com Capacitor) e trazer o codigo do pacote para dentro do projeto,
reescrevendo o import "nu" (`from '@capacitor/core'`, que o navegador nao
sabe resolver sem bundler) para um caminho relativo comum.

## Arquivos

- `capacitor-core.js` - copia identica de `@capacitor/core/dist/index.js`.
  Nao precisou de nenhuma edicao (nao tem imports externos).
- `capacitor-app.js` - copia de `@capacitor/app/dist/esm/index.js`, com o
  import de `@capacitor/core` reescrito para `./capacitor-core.js`.
- `capacitor-app-web.js` - implementacao de fallback usada apenas quando
  o app roda num navegador comum (nao dentro do Android/iOS nativo).
- `capacitor-app-definitions.js` - apenas tipos, sem codigo (mantido para
  o `export *` do capacitor-app.js nao quebrar).

## Como atualizar quando o plugin @capacitor/app for atualizado

1. `npm install @capacitor/app@ultima-versao`
2. Repita a copia + os mesmos 4 `sed` de substituicao (ver historico do
   projeto/changelog) ou copie novamente os arquivos de
   `node_modules/@capacitor/app/dist/esm/` e `node_modules/@capacitor/core/dist/index.js`,
   reaplicando as mesmas trocas de import.

## Se um dia adicionarmos outro plugin nativo (ex: Camera, Geolocation)

O mesmo processo se aplica: copiar o `dist/esm/index.js` do pacote,
reescrever o import de `@capacitor/core` para `./capacitor-core.js`, e
importar o plugin resultante diretamente (em vez de tentar acessar via
`window.Capacitor.Plugins.NomeDoPlugin`, que nao e confiavel neste tipo
de projeto sem bundler).
