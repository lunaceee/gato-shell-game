"use strict";

import GameState from "../util/gameState";
import GameIdle from "./gameIdle";
import { shells, shellData } from "../sprites/shells";
import { gato, gatoWins, gatoLost } from "../sprites/gato";

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
    const tally = (this.state.tally = `${this.state.tally}${
      catWon ? "w" : "l"
    }`);

    if (tally.match(/www$/)) {
      gatoWins(winner, 3);
    } else if (tally.match(/ww$/)) {
      gatoWins(winner, 2);
    } else if (tally.match(/w$/)) {
      gatoWins(winner, 1);
    } else if (tally.match(/lll$/)) {
      gatoLost(winner, 3);
    } else if (tally.match(/ll$/)) {
      gatoLost(winner, 2);
    } else if (tally.match(/l$/)) {
      gatoLost(winner, 1);
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
