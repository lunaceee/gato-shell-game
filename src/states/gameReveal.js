"use strict";

import GameState from "../util/gameState";
import GameIdle from "./gameIdle";
import { shells, shellData } from "../sprites/shells";
import { gato, gatoHappy, gatoPissed, gatoShocked, gatoSnarky, gatoSpeechless } from "../sprites/gato";

export default class GameReveal extends GameState {
  constructor(state) {
    super();
    this.state = state;
    this.state.winningShell = Math.floor(Math.random() * 3);
  }

  isDone() {
    return this.elapsed > 2000;
  }

  onStart() {
    this.state.startButton.innerText = "Start";

    shells.shellOpen.move(shellData[this.state.winningShell]);
    shells.shellOpen.show();

    gato.shufflingEyeFrame.hide();
    gato.shufflingEyes.hide();

    const winner = `${this.state.winningShell + 1}`;
    const catWon = this.state.winningShell === this.state.catSelection;
    const tally = this.state.tally = `${this.state.tally}${catWon ? 'w' : 'l'}`;

    if (tally.match(/www$/)) {
      gatoSnarky(winner);
    } else if (tally.match(/ww$/)) {
      gatoHappy(winner);
    } else if (tally.match(/w$/)) {
      gatoHappy(winner);
    } else if (tally.match(/lll$/)) {
      gatoPissed(winner);
    } else if (tally.match(/ll$/)) {
      gatoShocked(winner);
    } else if (tally.match(/l$/)) {
      gatoSpeechless(winner);
    }
  }

  onEnd() {
    shells.shellOpen.hide();
  }

  onUpdate(dt) {}

  nextState() {
    return new GameIdle(this.state);
  }
}
