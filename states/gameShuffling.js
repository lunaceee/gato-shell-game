"use strict";

class GameShuffling extends GameState {
  constructor(state) {
    super();
    this.state = state;

    this.duration = 500;
    const d = this.duration;
    const fx = easing.easeInOutQuad;

    {
      const t = new Tweener();
      t.add({ time: 0, value: 0 }); // 0 is left branch, 1 is right branch
      t.add({ time: d / 2, value: 0 });
      t.add({ time: d / 2, value: 1 });
      t.add({ time: d, value: 1 });
      this.side = t;
    }
    {
      const t = new Tweener();
      t.add({ time: (0 / 2) * d, value: 0 });
      t.add({ time: (1 / 2) * d, value: Math.PI, fx });
      t.add({ time: (2 / 2) * d, value: 0, fx });
      this.angle = t;
    }
  }

  isDone() {
    return this.elapsed >= this.duration * 5;
  }

  onStart() {
    console.log("switched to shuffling");

    message("Game on!");

    this.state.startButton.innerText = "Shuffling";
    this.state.startButton.disabled = true;

    gato.hide();
    gato.showList(`
      body
      eyeBackground
      tail
      mustache
      noseMouthDefault
      legsDefault
      shufflingEyeFrame
      shufflingEyes
    `);
  }

  onUpdate(dt) {
    const leftSide = this.side.value(this.elapsed % this.duration) === 0;
    const angle = this.angle.value(this.elapsed % this.duration);
    const { center1, center2, radius } = shellData;

    if (leftSide) {
      let shell1 = orbit(center1, radius, Math.PI + angle);
      let shell2 = orbit(center1, radius, angle);
      let fixed = orbit(center2, radius, 0);

      shells.shell1.move(shell1);
      shells.shell2.move(shell2);
      shells.shell3.move(fixed);
    } else {
      let shell1 = orbit(center2, radius, Math.PI + angle);
      let shell2 = orbit(center2, radius, angle);
      let fixed = orbit(center1, radius, Math.PI);

      shells.shell1.move(shell1);
      shells.shell2.move(shell2);
      shells.shell3.move(fixed);
    }
  }

  nextState() {
    return new GatoSelects(this.state);
  }
}
