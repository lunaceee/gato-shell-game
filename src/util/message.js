"use strict";

const gatoStatus = document.querySelector(".status");

export function message(str) {
  gatoStatus.innerText = str;
}
