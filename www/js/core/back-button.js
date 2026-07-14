/*
  back-button.js
  Intercepta o botao fisico/gesto de "voltar" do Android (via plugin
  @capacitor/app) para que ele navegue dentro do app em vez de fechar
  o app imediatamente.

  IMPORTANTE sobre a importacao abaixo: o projeto nao usa bundler (por
  escolha de arquitetura - JS puro). A partir do Capacitor 6, o recurso
  que permitia usar plugins nativos sem bundler ("bundledWebRuntime") foi
  removido pela propria Capacitor. Por isso o plugin App e importado de
  js/vendor/capacitor-app.js - uma copia local do pacote @capacitor/app,
  com o import "nu" de @capacitor/core reescrito para um caminho relativo
  que o navegador consegue resolver sem bundler. Isso segue a orientacao
  oficial da Capacitor para quem nao usa bundler: "trazer" o pacote para
  dentro do projeto. Ver README em js/vendor/ para detalhes.

  Regra de navegacao:
    - Se houver uma tela anterior no historico do roteador, volta um passo.
    - Se ja estiver na tela inicial (nao ha mais pra onde voltar dentro do
      app), exige um segundo toque em ate 2 segundos para sair de verdade,
      mostrando um aviso ("Toque novamente para sair") no meio do caminho.
*/

import { router } from "./router.js";
import { App } from "../vendor/capacitor-app.js";

const EXIT_CONFIRM_WINDOW = 2000;

let lastBackPressAt = 0;
let toastEl = null;
let toastTimer = null;

function getToastEl() {
  if (!toastEl) {
    toastEl = document.createElement("div");
    toastEl.className = "exit-toast";
    toastEl.textContent = "Toque novamente para sair";
    document.getElementById("app").appendChild(toastEl);
  }
  return toastEl;
}

function showExitHint() {
  const el = getToastEl();
  el.classList.add("exit-toast--visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove("exit-toast--visible");
  }, EXIT_CONFIRM_WINDOW);
}

function hideExitHint() {
  if (toastEl) toastEl.classList.remove("exit-toast--visible");
  clearTimeout(toastTimer);
}

function handleBackButton() {
  // Ainda ha tela(s) anterior(es) no historico do app: so volta um passo.
  if (router.current !== "home") {
    history.back();
    return;
  }

  // Ja na tela inicial: exige duplo toque para sair.
  const now = Date.now();
  if (now - lastBackPressAt < EXIT_CONFIRM_WINDOW) {
    hideExitHint();
    App.exitApp();
    return;
  }
  lastBackPressAt = now;
  showExitHint();
}

export function initBackButton() {
  App.addListener("backButton", handleBackButton)
    .then(() => console.info("[back-button] listener do botao fisico de voltar conectado."))
    .catch((err) => console.warn("[back-button] falha ao conectar o listener:", err));
}
