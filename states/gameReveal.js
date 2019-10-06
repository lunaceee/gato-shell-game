"use strict";

class GameReveal extends GameState {
  constructor(gato, shellOpen, gameState) {
    super();
    this.gato = gato;
    this.shellOpen = shellOpen;
    this.state = {
      winningShell: Math.floor(Math.random() * 3),
      gameState
    };
    if (Math.random() > 0.1) {
      this.state.winningShell = this.state.gameState.catSelection;
    }
  }

  isDone() {
    return this.elapsed > 2000;
  }

  onStart() {
    let { winningShell, gameState } = this.state;
    const shellCount = `${winningShell + 1}`;
    if (winningShell === 0) {
      this.shellOpen.move(new Point(-8, 8));
    } else if (this.state.winningShell === 1) {
      this.shellOpen.move(new Point(1, 8));
    } else {
      this.shellOpen.move(new Point(10, 8));
    }
    this.shellOpen.show();

    // Hide shuffling eyes and eyeframes
    this.gato.shufflingEyeFrame.hide();
    this.gato.shufflingEyes.hide();
    if (winningShell === gameState.catSelection) {
      gameState.numberOfConsecutiveWins++;
      gameState.numberOfConsecutiveLosses = 0;
      if (gameState.numberOfConsecutiveWins % 3 === 1) {
        this.gato.noseMouthDefault.hide();
        this.gato.showList("noseMouthSnarky innocentEyes shockedEyeFrame");
        message(`Shell ${shellCount} has the treat. Gato found it!`);
      } else {
        this.gato.showList("funkyEyes funkyEyeFrame noseMouthSnarky");
        this.gato.noseMouthDefault.hide();
        message(`Shell ${shellCount} has the treat. Gato won again!`);
      }
    } else {
      gameState.numberOfConsecutiveLosses++;
      gameState.numberOfConsecutiveWins = 0;
      if (gameState.numberOfConsecutiveLosses % 3 === 1) {
        this.gato.funkyEyes.show();
        this.gato.funkyEyeFrame.show();
        message(
          `Shell ${shellCount} has the treat. Gato lost and he's pissed!`
        );
      } else if (gameState.numberOfConsecutiveLosses % 3 === 2) {
        this.gato.shockedEyes.show();
        this.gato.shockedEyeFrame.show();
        message(`Shell ${shellCount} has the treat. Gato lost again!`);
      } else {
        this.gato.shockedEyeFrame.show();
        this.gato.ultraShockedEyes.show();
        message(
          `Shell ${shellCount} has the treat. Gato is speechless!@#$!@#$!@#!`
        );
      }
    }
  }

  onEnd() {
    this.shellOpen.hide();
  }

  onUpdate(dt) {
    // TODO: stop tail;; this.state.tailDt = -1.2;
  }

  nextState() {
    return "idle";
  }
}
