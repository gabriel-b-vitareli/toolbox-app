/*
  version.js
  Versao do app exibida na interface (tela de Configuracoes).

  Importante: como o projeto nao usa bundler, este arquivo nao consegue
  ler o package.json automaticamente em tempo de execucao no navegador -
  por isso o numero abaixo precisa ser atualizado manualmente sempre que
  o "version" do package.json mudar. E so essa constante que a interface
  usa; nenhuma tela le o package.json diretamente.

  APP_CODENAME e o apelido da familia de versoes (ex: todo 0.3.x chama-se
  "Titanium"). Muda bem menos frequentemente que APP_VERSION.
*/

export const APP_VERSION = "0.3.2";
export const APP_CODENAME = "Titanium";
