(function(window) {
  "use strict";

  const state = {
    shellOpen: new Sprite(".shell-open", new Point(0, 0)),
    lastBranch: "",
    shufflingTime: 0,
    shellX: -1,
    winningShell: 0, // 0, 1, or 2,
    catSelection: -1,
    selectionElapsed: 0,
    onStart: false
  };

  let gatoIdling = new GatoIdling(gato);

  /**
   * Prompt messages for different states.
   */
  const gatoStatus = document.querySelector(".status");
  function message(str) {
    gatoStatus.innerText = str;
  }

  message("Gato is ready to play");

  function orbit(center, radius, radians) {
    const orbitX = center.x + radius * Math.cos(radians);
    const orbitY = center.y + radius * Math.sin(radians);
    return new Point(orbitX, orbitY);
  }

  function moveShells() {}

  function commonUpdates(dt) {
    gatoIdling.tick(dt);
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
      state.shellOpen.move(new Point(-8, 8));
    } else if (state.winningShell === 1) {
      state.shellOpen.move(new Point(1, 8));
    } else {
      state.shellOpen.move(new Point(10, 8));
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

    message("Gato is ready to play");

    if (state.onStart) {
      state.onStart = false;
      return stateIdle;
    }

    return stateEnding;
  }

  function stateFactory(name) {
    switch (name) {
      case "idle":
        return new GameIdle();
      case "shuffling":
        return new GameShuffling(gato, shells);
      case "reveal":
        return new GameReveal();
    }
  }

  let currentState = stateFactory("idle");

  function gameLoop(dt) {
    commonUpdates(dt);
    currentState.tick(dt);
    if (currentState.isDone()) {
      currentState = stateFactory(currentState.nextState()); // TODO: create mext state.
    }
  }

  const startButton = document.querySelector(".start-button");
  startButton.addEventListener("click", e => {
    currentState.onInput({ startPressed: true });
  });

  // Kickstart Browser Game Loop.
  (function(callback) {
    let time0 = 0;
    function loop(time1) {
      let difference = time1 - time0;
      time0 = time1;
      callback(difference);
      window.requestAnimationFrame(loop);
    }
    loop(0);
  })(gameLoop);
})(window);
