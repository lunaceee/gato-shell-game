"use strict";

class GameIdle extends GameState {
  constructor(gato, startButton) {
    super();
    this.gato = gato;
    this.startButton = startButton;
    this.state = {
      startPressed: false,
      tailDt: -1
    };
    // Tweener for the tail
    {
      const t = new Tweener();
      const from = -0.5;
      const to = 0.3;
      this.tailAngle = t;
      t.add({ time: 0, value: from });
      t.add({ time: 1000, value: to, fx: easing.easeInQuad }); // Play w it
      t.add({ time: 2000, value: from, fx: easing.easeInQuad });
    }
    // Tweener for the eyes
    {
      const t = new Tweener();
      t.add({ time: 0, value: -0.5 });
      t.add({ time: 500, value: 0.5, fx: easing.easeFrom }); // Play w it
      t.add({ time: 2500, value: 0.5 });
      t.add({ time: 3000, value: -0.5, fx: easing.easeFrom });
      t.add({ time: 5000, value: -0.5 });
      this.eyeMovement = t;
    }
  }

  onStart() {
    console.log("switched to idling");
    message("Gato is bored and ready to play");
    this.startButton.innerText = "Start";
    this.startButton.disabled = false;
    this.gato.hide();
    this.gato.showList(`
      eyeBackground
      mustache
      body 
      tail 
      legsDefault 
      noseMouthDefault 
      defaultEyeFrame 
      eyeLeft 
      eyeRight 
      eyeDotsDefaultLeft 
      eyeDotsDefaultRight
    `);
  }

  isDone() {
    return this.state.startPressed;
  }

  onInput(input) {
    if (input.startPressed) {
      this.state.startPressed = true;
    }
  }

  onUpdate(dt) {
    let k = this.eyeMovement.value(this.elapsed % 5000);
    this.gato.eyeLeft.move(new Point(3 + k, 3.6));
    this.gato.eyeRight.move(new Point(7.5 + k, 3.6));
    this.gato.eyeDotsDefaultLeft.move(new Point(3.5 + k, 4.5));
    this.gato.eyeDotsDefaultRight.move(new Point(8.5 + k, 4.5));

    let k2 = this.tailAngle.value(this.elapsed % 2000);
    this.gato.tail.rotate(k2); // TODO: make cat tail movement more natural
  }

  nextState() {
    if (this.isDone()) return "shuffling";
  }
}
