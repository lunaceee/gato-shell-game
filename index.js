(function(window) {
  "use strict";

  class Sprite {
    constructor(cssSelector, p0) {
      this.cssSelector = cssSelector;
      this.element = document.querySelector(cssSelector);
      this.p0 = p0;

      // Move to the initial position.
      this.move(this.p0);
    }

    move(pos) {
      this.element.style.left = `${pos.x}rem`;
      this.element.style.top = `${pos.y}rem`;
    }
  }

  const input = {
    startPressed: false
  };

  const shellParts = getSelectors({
    shellOpen: ".shell-open",
    treat: ".treat"
  });

  const state = {
    shells: [
      new Sprite(".shell-1", new Point(0, 0.25)),
      new Sprite(".shell-2", new Point(10, 0.25)),
      new Sprite(".shell-3", new Point(20, 0.25))
    ],
    lastBranch: "",
    shufflingTime: 0,
    eyeX: -1,
    shellX: -1,
    winningShell: 0, // 0, 1, or 2
    catWins: false
  };

  const startButton = document.querySelector(".start-button");
  startButton.addEventListener("click", ev => {
    input.startPressed = true;
  });

  /**
   * Returns an object of the DOM elements of the gato.
   */
  function getSelectors(parts) {
    let gatoBodyParts = {};
    for (const [name, selector] of Object.entries(parts)) {
      gatoBodyParts[name] = document.querySelector(selector);
    }
    return gatoBodyParts;
  }

  /**
   * Prompt messages for different states.
   */
  const gatoStatus = document.querySelector(".status");
  function message(str) {
    gatoStatus.innerText = str;
  }

  message("start!");

  const gato = getSelectors({
    body: ".gato-body",
    eyeFrame: ".gato-eye-frame",
    eyeLeft: ".gato-eye-left",
    eyeRight: ".gato-eye-right",
    eyeWhiteLeft: ".gato-eye-white-left",
    eyeWhiteRight: ".gato-eye-white-right",
    eyeBg: ".gato-eye-background"
  });

  function move(element, x, y) {
    element.style.top = y + "rem";
    element.style.left = x + "rem";
  }

  function initGato() {
    move(gato.eyeLeft, 5.6 + 1, 6.6);
    move(gato.eyeRight, 13.8, 6.6);
    move(gato.eyeFrame, 3, 5);
    move(gato.eyeBg, 4, 6);
    move(gato.eyeWhiteLeft, 7, 7.5);
    move(gato.eyeWhiteRight, 15.5, 7.5);
  }

  initGato();

  // helper function to position different parts of the gato body
  //   document.body.addEventListener('mousemove', e => {
  //     const x = e.clientX / 16;
  //     const y = e.clientY / 16;
  //     console.log(`${x} ${y}`);
  //     move(gatoEyeRight, x, y);
  //   });

  function updateCatEyes(dt) {
    state.eyeX = state.eyeX + (2 * dt) / 1000;
    if (state.eyeX > 1) state.eyeX = -1;
    let k = Math.abs(state.eyeX);
    move(gato.eyeLeft, 5.6 + k, 6.6);
    move(gato.eyeRight, 13.8 + k, 6.6);
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
    updateCatEyes(dt);
  }

  function stateIdle(dt) {
    if (input.startPressed) {
      input.startPressed = false;
      state.shufflingTime = 0;
      state.winningShell = Math.floor(Math.random() * 3);
      state.catWins = Math.random() > 0.5;
      return stateShuffleShells;
    }

    return stateIdle;
  }

  function stateShuffleShells(dt) {
    message("Shuffling!");

    if (state.shufflingTime >= 5000) {
      state.revealingTime = 0;
      return stateRevealShell;
    } else {
      state.shufflingTime += dt;

      moveShells();
    }

    return stateShuffleShells;
  }

  function stateRevealShell(dt) {
    message(`Winning shell is ${state.winningShell}`);

    if (state.revealingTime >= 3000) {
      return stateEnding;
    } else {
      state.revealingTime += dt;
    }

    return stateRevealShell;
  }

  function stateEnding(dt) {
    if (state.catWins) {
      message("Gato smiles snarkly!");
    } else {
      message("Gato is pissed!");
    }

    if (input.startPressed) {
      input.startPressed = false;
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
