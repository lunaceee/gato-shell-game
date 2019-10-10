"use strict";

class GameReveal extends GameState {
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
      shells.shellOpen.move(shellData.shell1P0);
    } else {
      shells.shellOpen.move(shellData.shell1P0);
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
        message(`Shell ${shellCount} has the treat. Gato found it!`);
      } else {
        gato.showList("funkyEyes funkyEyeFrame noseMouthSnarky");
        gato.noseMouthDefault.hide();
        message(`Shell ${shellCount} has the treat. Gato won again!`);
      }
    } else {
      this.state.numberOfConsecutiveLosses++;
      this.state.numberOfConsecutiveWins = 0;

      if (this.state.numberOfConsecutiveLosses % 3 === 1) {
        gato.funkyEyes.show();
        gato.funkyEyeFrame.show();
        message(
          `Shell ${shellCount} has the treat. Gato lost and he's pissed!`
        );
      } else if (this.state.numberOfConsecutiveLosses % 3 === 2) {
        gato.shockedEyes.show();
        gato.shockedEyeFrame.show();
        message(`Shell ${shellCount} has the treat. Gato lost again!`);
      } else {
        gato.shockedEyeFrame.show();
        gato.ultraShockedEyes.show();
        message(
          `Shell ${shellCount} has the treat. Gato is speechless!@#$!@#$!@#!`
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
