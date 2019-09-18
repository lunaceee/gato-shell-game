(function(window) {
  "use strict";

  class Sprite {
    constructor(cssSelector, p0) {
      this.cssSelector = cssSelector;
      this.element = document.querySelector(cssSelector);
      this.element.classList.add("sprite");
      this.p0 = p0;

      // Move to the initial position.
      this.move(this.p0);
    }

    rotate(radians) {
      this.element.style.transform = `rotate(${radians}rad)`;
    }

    hide() {
      this.element.classList.add("hide");
    }

    show() {
      this.element.classList.remove("hide");
    }
    isVisible() {
      return !new Set(this.element.classList).has("hide");
    }
    toggle() {
      if (this.isVisible()) this.hide();
      else this.show();
    }

    move(pos) {
      this.element.style.left = `${pos.x}rem`;
      this.element.style.top = `${pos.y}rem`;
    }
  }

  const input = {
    onStart: false
  };

  // const shellVariations = getSelectors({
  //   shellOpen: ".shell-open",
  //   treat: ".treat"
  // });

  const state = {
    shells: [
      new Sprite(".shell-1", new Point(3, 0.25)),
      new Sprite(".shell-2", new Point(13, 0.25)),
      new Sprite(".shell-3", new Point(23, 0.25))
    ],
    tailDt: -1,
    lastBranch: "",
    shufflingTime: 0,
    eyeX: -1,
    shellX: -1,
    winningShell: 0, // 0, 1, or 2,
    catSelection: -1,
    selectionElapsed: 0,
    catWins: false
  };

  /**
   * Prompt messages for different states.
   */
  const gatoStatus = document.querySelector(".status");
  function message(str) {
    gatoStatus.innerText = str;
  }

  message("start!");

  const gato = {
    body: new Sprite(".gato-body", new Point(7, 9)),
    defaultNoseMouth: new Sprite(".nose-mouth-default", new Point(14, 16)),
    snarkyNoseMouth: new Sprite(".nose-mouth-snarky", new Point(14, 16)),
    mushtache: new Sprite(".gato-mustache", new Point(6, 16)),
    tailUp: new Sprite(".gato-tail-up", new Point(17, 18)),
    defaultLegs: new Sprite(".legs-default", new Point(11.5, 23.5)),
    legsLeft: new Sprite(".legs-left", new Point(11.5, 23.5)),
    legsCenter: new Sprite(".legs-center", new Point(11.5, 23.5)),
    legsRight: new Sprite(".legs-right", new Point(11.5, 23.5)),
    defaultEyeFrame: new Sprite(".default-eyeframe", new Point(9, 11.5)),
    shufflingEyeframe: new Sprite(".shuffling-eyeframe", new Point(9, 11.5)),
    funkyEyeframe: new Sprite(".funky-eyeframe", new Point(9, 11.5)),
    funkyEyes: new Sprite(".funky-eyes", new Point(10.8, 12.7)),
    eyeLeft: new Sprite(".eyeball-default-left", new Point(0, 0)),
    eyeRight: new Sprite(".eyeball-default-right", new Point(0, 0)),
    eyeLeftDown: new Sprite(".eyeball-down-left", new Point(11, 13.1)),
    eyeRightDown: new Sprite(".eyeball-down-right", new Point(15.5, 13.1)),
    eyeDotsLeftDown: new Sprite(
      ".eyeball-dots-down-left",
      new Point(12.3, 14.2)
    ),
    eyeDotsRightDown: new Sprite(
      ".eyeball-dots-down-right",
      new Point(16, 14.2)
    ),

    eyeDotsDefaultLeft: new Sprite(
      ".eyeball-dots-default-left",
      new Point(7, 7.5)
    ),
    eyeDotsDefaultRight: new Sprite(
      ".eyeball-dots-default-right",
      new Point(15.5, 7.5)
    ),
    eyeBg: new Sprite(".eye-background", new Point(9, 11.5))
  };

  const startButton = document.querySelector(".start-button");
  startButton.addEventListener("click", e => {
    input.onStart = true;
  });

  function updateGato(dt) {
    state.eyeX = state.eyeX + (2 * dt) / 2000;
    if (state.eyeX > 1) state.eyeX = -1;
    let k = Math.abs(state.eyeX);
    gato.eyeLeft.move(new Point(9.5 + k, 12.5));
    gato.eyeRight.move(new Point(15 + k, 12.5));
    gato.eyeDotsDefaultLeft.move(new Point(11 + k, 13.3));
    gato.eyeDotsDefaultRight.move(new Point(16.5 + k, 13.3));

    state.tailDt = state.tailDt + dt / 1000;
    if (state.tailDt > 1) {
      state.tailDt = -1;
    }
    let k2 = Math.abs(state.tailDt);
    gato.tailUp.rotate(-0.7 + 1 * k2 * k2); // TODO: make cat tail movement more natural
  }

  function orbit(center, radius, radians) {
    const orbitX = center.x + radius * Math.cos(radians);
    const orbitY = center.y + radius * Math.sin(radians);
    return new Point(orbitX, orbitY);
  }

  function moveShells() {
    const t = state.shufflingTime;

    // Calculate the points for two circles,
    // left and right, around which the shells
    // will orbit around when shuffling.

    const p0Shell0 = state.shells[0].p0;
    const p0Shell1 = state.shells[1].p0;
    const p0Shell2 = state.shells[2].p0;

    const leftCenter = p0Shell0.add(p0Shell1).multiply(0.5);
    const leftRadius = p0Shell0.distance(p0Shell1) * 0.5;

    const rightCenter = p0Shell1.add(p0Shell2).multiply(0.5);
    const rightRadius = p0Shell1.distance(p0Shell2) * 0.5;

    /*
    const isLeftAnimationBranch =
      Math.floor(t / 1000) // * t (time) goes from 0 to 5000 milliseconds,
                           // so this expression returns either: 0, 1, 2, 3, 4 or 5.
      % 2                  // * Modulus 2: returns the reminder of diving by 2.
                           // Applied to a number from 0 to 5 it will return:
                           // for 0: 0, for 1: 1, for 2: 0, for 3: 1, for 4: 0, for 5: 1.
      === 0;               // * We check if the expression is 0, we animate the leftmost
                           // shells, otherwise we animate the rigthmost ones.
    */
    const isLeftAnimationBranch = Math.floor(t / 500) % 2 === 0;

    // Since time is in milliseconds, t1 is gonna be a number from 0 to 1.
    const t1 = (t % 501) / 500;

    if (isLeftAnimationBranch) {
      let posShell0 = orbit(leftCenter, leftRadius, Math.PI + Math.PI * t1);
      let posShell1 = orbit(leftCenter, leftRadius, Math.PI * t1);

      state.shells[0].move(posShell0);
      state.shells[1].move(posShell1);
      state.shells[2].move(p0Shell2);
    } else {
      let posShell1 = orbit(rightCenter, rightRadius, Math.PI + Math.PI * -t1);
      let posShell2 = orbit(rightCenter, rightRadius, Math.PI * -t1);

      state.shells[0].move(p0Shell0);
      state.shells[1].move(posShell1);
      state.shells[2].move(posShell2);
    }
  }

  function commonUpdates(dt) {
    updateGato(dt);
  }

  function stateIdle(dt) {
    if (input.onStart) {
      input.onStart = false;
      state.shufflingTime = 0;
      state.winningShell = Math.floor(Math.random() * 3);
      state.catWins = Math.random() > 0.5;
      return stateShuffleShells;
    }

    return stateIdle;
  }

  function stateShuffleShells(dt) {
    message("Shuffling!");

    gato.defaultEyeFrame.hide();
    gato.eyeLeft.hide();
    gato.eyeRight.hide();
    gato.eyeDotsDefaultLeft.hide();
    gato.eyeDotsDefaultRight.hide();
    gato.shufflingEyeframe.show();
    gato.eyeLeftDown.show();
    gato.eyeRightDown.show();
    gato.eyeDotsLeftDown.show();
    gato.eyeDotsRightDown.show();

    state.tailDt = -1.2; // Stop swinging the tail

    if (state.shufflingTime >= 5000) {
      state.selectionElapsed = 0;
      const s = (state.catSelection = Math.floor(Math.random() * 3));
      if (s === 0) gato.legsLeft.show();
      gato.defaultLegs.hide();
      if (s === 1) gato.legsCenter.show();
      gato.defaultLegs.hide();
      if (s === 2) gato.legsRight.show();
      gato.defaultLegs.hide();
      return stateSelectShells;
    } else {
      state.shufflingTime += dt;

      moveShells();
    }

    return stateShuffleShells;
  }

  function stateSelectShells(dt) {
    if (state.selectionElapsed >= 1000) {
      state.revealingTime = 0;
      return stateRevealShell;
    } else {
      state.selectionElapsed += dt;
    }

    return stateSelectShells;
  }

  function stateRevealShell(dt) {
    message(`Winning shell is ${state.winningShell}`);

    gato.funkyEyeframe.show();
    gato.funkyEyes.show();
    gato.shufflingEyeframe.hide();
    gato.eyeLeftDown.hide();
    gato.eyeRightDown.hide();
    gato.eyeDotsLeftDown.hide();
    gato.eyeDotsRightDown.hide();

    if (state.revealingTime >= 3000) {
      return stateEnding;
    } else {
      state.revealingTime += dt;
    }

    return stateRevealShell;
  }

  function stateEnding(dt) {
    gato.defaultLegs.show();
    gato.legsCenter.hide();
    gato.legsLeft.hide();
    gato.legsRight.hide();
    gato.defaultEyeFrame.show();
    gato.eyeLeft.show();
    gato.eyeRight.show();
    gato.eyeDotsDefaultLeft.show();
    gato.eyeDotsDefaultRight.show();
    gato.shufflingEyeframe.hide();
    gato.eyeLeftDown.hide();
    gato.eyeRightDown.hide();
    gato.eyeDotsLeftDown.hide();
    gato.eyeDotsRightDown.hide();

    gato.funkyEyeframe.hide();
    gato.funkyEyes.hide();

    if (state.catWins) {
      message("Gato smiles snarkly!");
    } else {
      message("Gato is pissed!");
    }

    if (input.onStart) {
      input.onStart = false;
      return stateIdle;
    }

    return stateEnding;
  }

  // Start game loop.
  (function() {
    console.log("Starting..");

    let nextState = stateIdle;

    let time0 = 0;
    function loop(time1) {
      let difference = time1 - time0;
      time0 = time1;
      commonUpdates(difference);
      nextState = nextState(difference);
      window.requestAnimationFrame(loop);
    }
    loop(0);
  })();
})(window);
