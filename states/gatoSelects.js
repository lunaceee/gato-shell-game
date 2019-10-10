"use strict";
class GatoSelects extends GameState {
  constructor(state) {
    super();
    this.state = state;
    this.state.catSelection = Math.floor(Math.random() * 3);
  }

  onStart() {
    gato.legsDefault.hide();
    const s = this.state.catSelection;
    if (s === 0) gato.legsLeft.show();
    if (s === 1) gato.legsCenter.show();
    if (s === 2) gato.legsRight.show();
  }

  isDone() {
    return this.elapsed > 1000;
  }

  nextState() {
    return new GameReveal(this.state);
  }
}
