"use strict";

export default class Sprite {
  constructor(cssSelector, p0, size) {
    this.cssSelector = cssSelector;
    this.element = document.querySelector(cssSelector);
    this.element.classList.add("sprite");
    this.p0 = p0;
    if (size) {
      this.resize(size);
    }
    // Move to the initial position.
    this.move(this.p0);
  }

  resize(pt) {
    this.element.style.width = `${pt.x}rem`;
    this.element.style.height = `${pt.y}rem`;
  }

  rotate(radians) {
    this.element.style.transform = `rotate(${radians}rad)`;
  }

  hide() {
    this.element.classList.add("hide");
  }

  show() {
    this.element.classList.remove("hide");
  }
  isVisible() {
    return !new Set(this.element.classList).has("hide");
  }
  toggle() {
    if (this.isVisible()) this.hide();
    else this.show();
  }

  move(pos) {
    this.element.style.left = `${pos.x}rem`;
    this.element.style.top = `${pos.y}rem`;
  }
}
