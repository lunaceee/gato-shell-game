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
      new Sprite(".shell-1", new Point(0, 0.25)),
      new Sprite(".shell-2", new Point(10, 0.25)),
      new Sprite(".shell-3", new Point(20, 0.25))
    ],
    tailDt: -1,
    lastBranch: "",
    shufflingTime: 0,
    eyeX: -1,
    shellX: -1,
    winningShell: 0, // 0, 1, or 2
    catWins: false
  };

  const startButton = document.querySelector(".start-button");
  startButton.addEventListener("click", ev => {
    input.onStart = true;
  });

  /**
   * Prompt messages for different states.
   */
  const gatoStatus = document.querySelector(".status");
  function message(str) {
    gatoStatus.innerText = str;
  }

  message("start!");

  const gato = {
    body: new Sprite(".gato-body", new Point(0, 0)),
    noseMouth: new Sprite(".gato-nose-mouth", new Point(10.2, 12)),
    mushtache: new Sprite(".gato-mustache", new Point(-2, 12)),
    tailUp: new Sprite(".gato-tail-up", new Point(14, 14)),
    legsDefault: new Sprite(".gato-legs-default", new Point(6.5, 21.5)),
    eyeFrame: new Sprite(".gato-eye-frame", new Point(3, 5)),
    eyeLeft: new Sprite(".gato-eye-left", new Point(6.6, 6.6)),
    eyeRight: new Sprite(".gato-eye-right", new Point(13.8, 6.6)),
    eyeWhiteLeft: new Sprite(".gato-eye-white-left", new Point(7, 7.5)),
    eyeWhiteRight: new Sprite(".gato-eye-white-right", new Point(15.5, 7.5)),
    eyeBg: new Sprite(".gato-eye-background", new Point(4, 6))
  };

  // gato.tailUp.hide();

  // helper function to position different parts of the gato body
  //   document.body.addEventListener('mousemove', e => {
  //     const x = e.clientX / 16;
  //     const y = e.clientY / 16;
  //     console.log(`${x} ${y}`);
  //     move(gatoEyeRight, x, y);
  //   });

  function updateGato(dt) {
    state.eyeX = state.eyeX + (2 * dt) / 1000;
    if (state.eyeX > 1) state.eyeX = -1;
    let k = Math.abs(state.eyeX);
    gato.eyeLeft.move(new Point(5.6 + k, 6.6));
    gato.eyeRight.move(new Point(13.8 + k, 6.6));

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
