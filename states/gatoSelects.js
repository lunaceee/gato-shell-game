"use strict";
class GatoSelects extends GameState {
  constructor(gato, catSelection) {
    super();
    this.gato = gato;
    this.state = { catSelection };
  }

  onStart() {
    const s = this.state.catSelection;
    if (s === 0) this.gato.legsLeft.show();
    this.gato.legsDefault.hide();
    if (s === 1) this.gato.legsCenter.show();
    this.gato.legsDefault.hide();
    if (s === 2) this.gato.legsRight.show();
    this.gato.legsDefault.hide();
  }
  isDone() {
    return this.elapsed > 1000;
  }
  nextState() {
    return "reveal";
  }
}
