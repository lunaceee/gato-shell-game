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
  }

  isDone() {
    return this.elapsed > 2000;
  }

  onStart() {
    let { winningShell, gameState } = this.state;
    if (winningShell === 0) {
      this.shellOpen.move(new Point(-8, 8));
    } else if (this.state.winningShell === 1) {
      this.shellOpen.move(new Point(1, 8));
    } else {
      this.shellOpen.move(new Point(10, 8));
    }
    this.shellOpen.show();

    // this.gato.funkyEyeFrame.show();
    // this.gato.funkyEyes.show();

    // Hide shuffling eyes and eyeframes
    this.gato.shufflingEyeFrame.hide();
    this.gato.eyeLeftDown.hide();
    this.gato.eyeRightDown.hide();
    this.gato.eyeDotsDownLeft.hide();
    this.gato.eyeDotsDownRight.hide();

    console.log(this.gato.innocentEyes);
    console.log(gameState.gameShufflingCycle);

    //   if (gameShufflingCycle === 1 && winningShell === catSelection) {
    //     this.gato.innocentEyes.show();
    //     this.gato.shockedEyeFrame.show();
    //     this.gato.funkyEyes.hide();
    //     this.gato.noseMouthSnarky.show();
    //     this.gato.noseMouthDefault.hide();
    //     message(`Winning shell is ${winningShell + 1}, gato wins for 1`);
    //   } else if (gameShufflingCycle === 1 && winningShell !== catSelection) {
    //     this.gato.funkyEyeFrame.show();
    //     this.gato.funkyEyes.show();
    //     this.gato.innocentEyes.hide();
    //     message(`Winning shell is ${winningShell + 1}, gato lost for 1`);
    //   } else if (gameShufflingCycle % 2 === 0 && winningShell === catSelection) {
    //     this.gato.funkyEyes.show();
    //     this.gato.funkyEyeFrame.show();
    //     this.gato.noseMouthSnarky.show();
    //     this.gato.noseMouthDefault.hide();
    //     message(`Winning shell is ${winningShell + 1}, gato wins for 2`);
    //   } else if (gameShufflingCycle % 2 === 0 && winningShell !== catSelection) {
    //     this.gato.shockedEyeFrame.show();
    //     this.gato.shockedEyes.show();
    //     message(`Winning shell is ${winningShell + 1}, gato lost for 2`);
    //   } else if (gameShufflingCycle % 3 === 0 && winningShell === catSelection) {
    //     this.gato.funkyEyes.show();
    //     this.gato.funkyEyeFrame.show();
    //     this.gato.noseMouthSnarky.show();
    //     this.gato.noseMouthDefault.hide();
    //     message(`Winning shell is ${winningShell + 1}, gato wins for 3`);
    //   } else if (gameShufflingCycle % 3 === 0 && winningShell !== catSelection) {
    //     this.gato.ultraShockedEyes.show();
    //     this.gato.shockedEyeFrame.show();
    //     message(`Winning shell is ${winningShell + 1}, gato lost for 3`);
    //   }
    // }

    if (winningShell === gameState.catSelection) {
      gameState.numberOfConsecutiveWins++;
      gameState.numberOfConsecutiveLosses = 0;
      if (gameState.numberOfConsecutiveWins % 3 === 1) {
        this.gato.noseMouthSnarky.show();
        this.gato.noseMouthDefault.hide();
        this.gato.innocentEyes.show();
        this.gato.shockedEyeFrame.show();
      } else {
        this.gato.funkyEyes.show();
        this.gato.funkyEyeFrame.show();
        this.gato.noseMouthSnarky.show();
        this.gato.noseMouthDefault.hide();
      }
    } else {
      gameState.numberOfConsecutiveLosses++;
      gameState.numberOfConsecutiveWins = 0;
      if (gameState.numberOfConsecutiveLosses % 3 === 1) {
        this.gato.funkyEyes.show();
        this.gato.funkyEyeFrame.show();
      } else if (gameState.numberOfConsecutiveLosses % 3 === 2) {
        this.gato.shockedEyes.show();
        this.gato.shockedEyeFrame.show();
      } else {
        this.gato.shockedEyeFrame.show();
        this.gato.ultraShockedEyes.show();
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
