"use strict";

class GameIdle extends GameState {
  constructor(gato, startButton) {
    super();
    this.gato = gato;
    this.startButton = startButton;
    this.state = {
      startPressed: false,
      tailDt: -1,
      eyeX: -1
    };
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
    this.state.eyeX = this.state.eyeX + dt / 1000;
    if (this.state.eyeX > 1) this.state.eyeX = -1;
    let k = Math.abs(this.state.eyeX);

    this.gato.eyeLeft.move(new Point(3 + k, 3.6));
    this.gato.eyeRight.move(new Point(7.5 + k, 3.6));
    this.gato.eyeDotsDefaultLeft.move(new Point(3.5 + k, 4.5));
    this.gato.eyeDotsDefaultRight.move(new Point(8.5 + k, 4.5));

    this.state.tailDt = this.state.tailDt + dt / 1000;
    if (this.state.tailDt > 1) {
      this.state.tailDt = -1;
    }
    let k2 = Math.abs(this.state.tailDt);
    this.gato.tail.rotate(-0.7 + 1 * k2 * k2); // TODO: make cat tail movement more natural
  }

  nextState() {
    if (this.isDone()) return "shuffling";
  }
}
