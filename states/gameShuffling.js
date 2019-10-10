"use strict";

class GameShuffling extends GameState {
  constructor(state) {
    super();
    this.state = state;
  }

  isDone() {
    return this.elapsed > 5000;
  }

  onStart() {
    console.log("switched to shuffling");

    message("Game on!");

    this.state.startButton.innerText = "Shuffling";
    this.state.startButton.disabled = true;

    gato.hide();
    gato.showList(`body
    eyeBackground
    tail
    mustache
    noseMouthDefault
    legsDefault
    shufflingEyeFrame
    shufflingEyes`);
  }

  onUpdate(dt) {
    // startButton.disabled = true; // TODO: disable button
    // state.tailDt = -1.2; // TODO: Stop swinging the tail

    // Calculate the points for two circles,
    // left and right, around which the shells
    // will orbit around when shuffling.

    const p0Shell0 = shells.shell1.p0;
    const p0Shell1 = shells.shell2.p0;
    const p0Shell2 = shells.shell3.p0;

    const leftCenter = p0Shell0.add(p0Shell1).multiply(0.5);
    const leftRadius = p0Shell0.distance(p0Shell1) * 0.5;

    const rightCenter = p0Shell1.add(p0Shell2).multiply(0.5);
    const rightRadius = p0Shell1.distance(p0Shell2) * 0.5;

    const t = this.elapsed;
    const isLeftAnimationBranch = Math.floor(t / 500) % 2 === 0;

    // Since time is in milliseconds, t1 is gonna be a number from 0 to 1.
    const t1 = (t % 501) / 500;

    if (isLeftAnimationBranch) {
      let posShell0 = orbit(leftCenter, leftRadius, Math.PI + Math.PI * t1);
      let posShell1 = orbit(leftCenter, leftRadius, Math.PI * t1);

      shells.shell1.move(posShell0);
      shells.shell2.move(posShell1);
      shells.shell3.move(p0Shell2);
    } else {
      let posShell1 = orbit(rightCenter, rightRadius, Math.PI + Math.PI * -t1);
      let posShell2 = orbit(rightCenter, rightRadius, Math.PI * -t1);

      shells.shell1.move(p0Shell0);
      shells.shell2.move(posShell1);
      shells.shell3.move(posShell2);
    }
  }

  nextState() {
    return new GatoSelects(this.state);
  }
}
