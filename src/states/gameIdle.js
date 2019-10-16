"use strict";
import GameState from "../util/gameState";
import Tweener from "../util/tweener";
import { easing } from "../util/easing";
import { message } from "../util/message";
import { gato } from "../sprites/gato";
import Point from "../util/point";
import GameShuffling from "./gameShuffling";

export default class GameIdle extends GameState {
  constructor(gameState) {
    console.log("dd");
    super();
    this.state = gameState;

    this.startPressed = false;

    // Tweener for the tail
    {
      const from = -0.5;
      const to = 0.3;

      this.tailAngle = new Tweener();
      this.tailAngle.add({ time: 0, value: from });
      this.tailAngle.add({ time: 2000, value: to, fx: easing.easeInOutQuart }); // Play w it
      this.tailAngle.add({
        time: 4000,
        value: from,
        fx: easing.easeInOutQuart
      });
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
    message("Gato is bored and ready to play");

    this.state.startButton.innerText = "Start";
    this.state.startButton.disabled = false;

    gato.showOnly(`
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

  onEnd() {
    gato.tail.rotate(0.8);
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
    let eyeOffset = new Point(this.eyeMovement.value(this.elapsed % 5000), 0);

    gato.eyeLeft.move(eyeOffset.add(new Point(3, 3.6)));
    gato.eyeRight.move(eyeOffset.add(new Point(7.5, 3.6)));
    gato.eyeDotsDefaultLeft.move(eyeOffset.add(new Point(4, 4.5)));
    gato.eyeDotsDefaultRight.move(eyeOffset.add(new Point(9, 4.5)));

    let angle = this.tailAngle.value(this.elapsed % 4000);
    gato.tail.rotate(angle);
  }

  nextState() {
    return new GameShuffling(this.state);
  }
}
