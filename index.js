(function(window) {
  "use strict";

  const state = {
    shells: [
      new Sprite(".shell-1", new Point(6, 0.25)),
      new Sprite(".shell-2", new Point(13, 0.25)),
      new Sprite(".shell-3", new Point(20, 0.25))
    ],
    shellOpen: new Sprite(".shell-open", new Point(0, 0)),
    tailDt: -1,
    lastBranch: "",
    shufflingTime: 0,
    eyeX: -1,
    shellX: -1,
    winningShell: 0, // 0, 1, or 2,
    catSelection: -1,
    selectionElapsed: 0,
    onStart: false
  };

  /**
   * Prompt messages for different states.
   */
  const gatoStatus = document.querySelector(".status");
  function message(str = "Gato is ready") {
    gatoStatus.innerText = str;
  }

  message("Gato is ready");

  const gato = new SpriteGroup();
  gato.add(".default-eye-frame", 6.3, 5, 7, 3.3);
  gato.add(".eye-background", 6.5, 5, 7, 2.8);
  gato.add(".eye-left", 0, 0, 2.5, 2);
  gato.add(".eye-right", 0, 0, 2.5, 2);
  gato.add(".eye-dots-default-left", 7, 7.5, 1, 0.7);
  gato.add(".eye-dots-default-right", 15.5, 7.5, 1, 0.7);
  gato.add(".eye-dots-down-left", 8.5, 6.7, 0.8, 0.6);
  gato.add(".eye-dots-down-right", 11, 6.7, 0.8, 0.6);
  gato.add(".eye-left-down", 7.6, 5.8, 1.65, 1.5);
  gato.add(".eye-right-down", 10.7, 5.8, 1.65, 1.6);
  gato.add(".funky-eye-frame", 6.3, 5, 7, 2.8);
  gato.add(".funky-eyes", 7.4, 5.8, 5, 1.2);
  gato.add(".gato-body", 5, 3, 9.5, 10.5);
  gato.add(".tail-up", 10.5, 9.5, 6, 3.6);
  gato.add(".legs-center", 8, 12.5, 5, 3.5);
  gato.add(".legs-default", 8, 12, 4.5, 2.3);
  gato.add(".legs-left", 6, 11.8, 7.2, 3.5);
  gato.add(".legs-right", 7.3, 12.5, 6.3, 3.3);
  gato.add(".mustache", 4, 8, 11.25, 2.25);
  gato.add(".nose-mouth-default", 9.3, 8, 1.2, 1.2);
  gato.add(".nose-mouth-snarky", 9.2, 8, 1.3, 1.2);
  gato.add(".shuffling-eye-frame", 6.3, 5, 7, 2.8);

  const startButton = document.querySelector(".start-button");

  startButton.addEventListener("click", e => {
    state.onStart = true;
  });

  function updateGato(dt) {
    state.eyeX = state.eyeX + dt / 1000;
    if (state.eyeX > 1) state.eyeX = -1;
    let k = Math.abs(state.eyeX);
    gato.eyeLeft.move(new Point(6.6 + k, 5.5));
    gato.eyeRight.move(new Point(9.7 + k, 5.5));
    gato.eyeDotsDefaultLeft.move(new Point(7 + k, 6));
    gato.eyeDotsDefaultRight.move(new Point(11 + k, 6));

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
    if (state.onStart) {
      state.onStart = false;
      state.shufflingTime = 0;
      state.winningShell = Math.floor(Math.random() * 3);

      return stateShuffleShells;
    }

    return stateIdle;
  }

  function stateShuffleShells(dt) {
    message("Game on!");

    gato.defaultEyeFrame.hide();
    gato.eyeLeft.hide();
    gato.eyeRight.hide();
    gato.eyeDotsDefaultLeft.hide();
    gato.eyeDotsDefaultRight.hide();
    gato.shufflingEyeFrame.show();
    gato.eyeLeftDown.show();
    gato.eyeRightDown.show();
    gato.eyeDotsDownLeft.show();
    gato.eyeDotsDownRight.show();
    startButton.disabled = true;

    state.tailDt = -1.2; // Stop swinging the tail

    if (state.shufflingTime >= 5000) {
      state.selectionElapsed = 0;
      const s = (state.catSelection = Math.floor(Math.random() * 3));
      if (s === 0) gato.legsLeft.show();
      gato.legsDefault.hide();
      if (s === 1) gato.legsCenter.show();
      gato.legsDefault.hide();
      if (s === 2) gato.legsRight.show();
      gato.legsDefault.hide();
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

    state.tailDt = -1.2;

    return stateSelectShells;
  }

  function stateRevealShell(dt) {
    state.shellOpen.show();
    if (state.winningShell === 0) {
      state.shellOpen.move(new Point(6, 0.25));
    } else if (state.winningShell === 1) {
      state.shellOpen.move(new Point(13, 0.25));
    } else {
      state.shellOpen.move(new Point(20, 0.25));
    }
    gato.funkyEyeFrame.show();
    gato.funkyEyes.show();
    gato.shufflingEyeFrame.hide();
    gato.eyeLeftDown.hide();
    gato.eyeRightDown.hide();
    gato.eyeDotsDownLeft.hide();
    gato.eyeDotsDownRight.hide();

    state.tailDt = -1.2;

    if (state.winningShell === state.catSelection) {
      gato.noseMouthSnarky.show();
      gato.noseMouthDefault.hide();
      message(
        `Winning shell is ${state.winningShell +
          1}, Gato won and smiles snarkly!`
      );
    } else {
      message(
        `Winning shell is ${state.winningShell +
          1}, Gato lost and he is pissed!`
      );
    }

    if (state.revealingTime >= 3000) {
      return stateEnding;
    } else {
      state.revealingTime += dt;
    }

    return stateRevealShell;
  }

  function stateEnding(dt) {
    gato.legsDefault.show();
    gato.noseMouthSnarky.hide();
    gato.noseMouthDefault.show();
    gato.legsCenter.hide();
    gato.legsLeft.hide();
    gato.legsRight.hide();
    gato.defaultEyeFrame.show();
    gato.eyeLeft.show();
    gato.eyeRight.show();
    gato.eyeDotsDefaultLeft.show();
    gato.eyeDotsDefaultRight.show();
    gato.shufflingEyeFrame.hide();
    gato.eyeLeftDown.hide();
    gato.eyeRightDown.hide();
    gato.eyeDotsDownLeft.hide();
    gato.eyeDotsDownRight.hide();
    gato.funkyEyeFrame.hide();
    gato.funkyEyes.hide();
    state.shellOpen.hide();
    startButton.disabled = false;

    message("Gato is ready");

    if (state.onStart) {
      state.onStart = false;
      return stateIdle;
    }

    return stateEnding;
  }

  // Start game loop.
  (function() {
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
