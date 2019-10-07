"use strict";

class GameIdle extends GameState {
  constructor(gameState) {
    super();
    this.state = gameState;

    this.startPressed = false;
    // Tweener for the tail
    {
      const t = new Tweener();
      const from = -0.5;
      const to = 0.3;
      this.tailAngle = t;
      t.add({ time: 0, value: from });
      t.add({ time: 2000, value: to, fx: easing.easeInOutQuart }); // Play w it
      t.add({ time: 4000, value: from, fx: easing.easeInOutQuart });
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
    this.state.startButton.innerText = "Start";
    this.state.startButton.disabled = false;
    gato.hide();
    gato.showList(`
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
    return this.startPressed;
  }

  onInput(input) {
    if (input.startPressed) {
      this.startPressed = true;
    }
  }

  onUpdate(dt) {
    let k = this.eyeMovement.value(this.elapsed % 5000);
    gato.eyeLeft.move(new Point(3 + k, 3.6));
    gato.eyeRight.move(new Point(7.5 + k, 3.6));
    gato.eyeDotsDefaultLeft.move(new Point(3.5 + k, 4.5));
    gato.eyeDotsDefaultRight.move(new Point(8.5 + k, 4.5));

    let k2 = this.tailAngle.value(this.elapsed % 4000);
    gato.tail.rotate(k2); // TODO: make cat tail movement more natural
  }

  nextState() {
    return new GameShuffling(this.state);
  }
}
