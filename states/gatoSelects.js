"use strict";
class GatoSelects extends GameState {
  constructor(state) {
    super();
    this.state = state;
    this.state.catSelection = Math.floor(Math.random() * 3);
  }

  onStart() {
    const s = this.state.catSelection;
    if (s === 0) gato.legsLeft.show();
    gato.legsDefault.hide();
    if (s === 1) gato.legsCenter.show();
    gato.legsDefault.hide();
    if (s === 2) gato.legsRight.show();
    gato.legsDefault.hide();
  }
  isDone() {
    return this.elapsed > 1000;
  }
  nextState() {
    return new GameReveal(this.state);
  }
}
