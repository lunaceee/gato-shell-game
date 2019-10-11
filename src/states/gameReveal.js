"use strict";

import GameState from "../util/gameState";
import GameIdle from "./gameIdle";
import { shells, shellData } from "../sprites/shells";
import { gato } from "../sprites/gato";
import { message } from "../util/message";

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

    const shellCount = `${this.state.winningShell + 1}`;

    if (this.state.winningShell === 0) {
      shells.shellOpen.move(shellData.shell1P0);
    } else if (this.state.winningShell === 1) {
      shells.shellOpen.move(shellData.shell2P0);
    } else {
      shells.shellOpen.move(shellData.shell3P0);
    }
    shells.shellOpen.show();

    gato.shufflingEyeFrame.hide();
    gato.shufflingEyes.hide();

    if (this.state.winningShell === this.state.catSelection) {
      this.state.numberOfConsecutiveWins++;
      this.state.numberOfConsecutiveLosses = 0;

      if (this.state.numberOfConsecutiveWins % 3 === 1) {
        gato.noseMouthDefault.hide();
        gato.showList("noseMouthSnarky innocentEyes shufflingEyeFrame");
        message(`Treat is under shell ${shellCount}. Gato found it!`);
      } else {
        gato.showList("funkyEyes funkyEyeFrame noseMouthSnarky");
        gato.noseMouthDefault.hide();
        message(
          `Treat is under shell ${shellCount}. Gato won and he is unstoppable!`
        );
      }
    } else {
      this.state.numberOfConsecutiveLosses++;
      this.state.numberOfConsecutiveWins = 0;

      if (this.state.numberOfConsecutiveLosses % 3 === 1) {
        gato.funkyEyes.show();
        gato.funkyEyeFrame.show();
        message(
          `Treat is under shell ${shellCount}. Gato lost and he is pissed!`
        );
      } else if (this.state.numberOfConsecutiveLosses % 3 === 2) {
        gato.shockedEyes.show();
        gato.shockedEyeFrame.show();
        message(`Treat is under shell ${shellCount}. Gato lost again?!`);
      } else {
        gato.shockedEyeFrame.show();
        gato.ultraShockedEyes.show();
        message(
          `Treat is under shell ${shellCount}. 
          Gato lost and he is speechless!@#$!@#$!@#!`
        );
      }
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
