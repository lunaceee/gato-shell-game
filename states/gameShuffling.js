"use strict";

class GameShuffling extends GameState {
  constructor(gato, shells) {
    super();

    this.gato = gato;
    this.shells = shells;
  }

  isDone() {
    return this.elapsed > 5000;
  }

  onStart() {
    console.log("switched to shuffling");

    // TODO: message("Game on!");

    this.gato.defaultEyeFrame.hide();
    this.gato.eyeLeft.hide();
    this.gato.eyeRight.hide();
    this.gato.eyeDotsDefaultLeft.hide();
    this.gato.eyeDotsDefaultRight.hide();
    this.gato.shufflingEyeFrame.show();
    this.gato.eyeLeftDown.show();
    this.gato.eyeRightDown.show();
    this.gato.eyeDotsDownLeft.show();
    this.gato.eyeDotsDownRight.show();
  }

  onUpdate(dt) {
    // startButton.disabled = true; // TODO: disable button
    // state.tailDt = -1.2; // TODO: Stop swinging the tail

    // Calculate the points for two circles,
    // left and right, around which the shells
    // will orbit around when shuffling.

    const p0Shell0 = this.shells[0].p0;
    const p0Shell1 = this.shells[1].p0;
    const p0Shell2 = this.shells[2].p0;

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

      this.shells[0].move(posShell0);
      this.shells[1].move(posShell1);
      this.shells[2].move(p0Shell2);
    } else {
      let posShell1 = orbit(rightCenter, rightRadius, Math.PI + Math.PI * -t1);
      let posShell2 = orbit(rightCenter, rightRadius, Math.PI * -t1);

      this.shells[0].move(p0Shell0);
      this.shells[1].move(posShell1);
      this.shells[2].move(posShell2);
    }
  }

  nextState() {
    if (this.isDone()) {
      return "reveal";
    }
  }
}
