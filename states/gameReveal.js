"use strict";

class GameReveal extends GameState {
  constructor(gato, shellOpen) {
    super();
    this.gato = gato;
    this.shellOpen = shellOpen;
  }

  isDone() {
    return this.elapsed > 5000;
  }

  onStart() {
    this.shellOpen.show();

    this.state = {
      winningShell: Math.floor(Math.random() * 3)
    };

    if (this.state.winningShell === 0) {
      this.shellOpen.move(new Point(-8, 8));
    } else if (this.state.winningShell === 1) {
      this.shellOpen.move(new Point(1, 8));
    } else {
      this.shellOpen.move(new Point(10, 8));
    }

    this.gato.funkyEyeFrame.show();
    this.gato.funkyEyes.show();
    this.gato.shufflingEyeFrame.hide();
    this.gato.eyeLeftDown.hide();
    this.gato.eyeRightDown.hide();
    this.gato.eyeDotsDownLeft.hide();
    this.gato.eyeDotsDownRight.hide();

    if (this.state.winningShell === this.state.catSelection) {
      this.gato.noseMouthSnarky.show();
      this.gato.noseMouthDefault.hide();
      // message(
      //   `Winning shell is ${this.state.winningShell +
      //     1}, this.gato won and smiles snarkly!`
      // );
    } else {
      // message(
      //   `Winning shell is ${this.state.winningShell +
      //     1}, this.gato lost and he is pissed!`
      // );
    }
  }

  onEnd() {
    this.shellOpen.hide();
  }

  onUpdate(dt) {
    // TODO: stop tail;; this.state.tailDt = -1.2;
  }

  nextState() {
    return "idle";
  }
}
