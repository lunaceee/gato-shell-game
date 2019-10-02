(function(window) {
  "use strict";

  const gatoStatus = document.querySelector(".status");
  function message(str) {
    gatoStatus.innerText = str;
  }

  message("Gato is ready to play");

  function stateFactory(name) {
    switch (name) {
      case "idle":
        return new GameIdle();
      case "shuffling":
        return new GameShuffling(gato, shells);
      case "reveal":
        return new GameReveal(gato, shellOpen);
    }
  }

  let currentState = stateFactory("idle");

  // TODO: remove common updates.
  let gatoIdling = new GatoIdling(gato);
  function commonUpdates(dt) {
    gatoIdling.tick(dt);
  }

  function gameLoop(dt) {
    commonUpdates(dt);
    currentState.tick(dt);
    if (currentState.isDone()) {
      currentState.onEnd();
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
