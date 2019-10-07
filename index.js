(function(window) {
  "use strict";
  let gameState = {
    numberOfConsecutiveWins: 0,
    catSelection: null,
    numberOfConsecutiveLosses: 0,
    startPressed: false,
    startButton: document.querySelector(".start-button")
  };

  function stateFactory(name) {
    switch (name) {
      case "idle":
        return new GameIdle(gato, gameState.startButton);
      case "shuffling":
        return new GameShuffling(gato, shells, gameState.startButton);
      case "gatoSelects":
        gameState.catSelection = Math.floor(Math.random() * 3);
        return new GatoSelects(gato, gameState.catSelection);
      case "reveal":
        return new GameReveal(gato, shellOpen, gameState);
    }
  }

  let currentState = stateFactory("idle");

  function gameLoop(dt) {
    currentState.tick(dt);
    if (currentState.isDone()) {
      currentState.onEnd();
      currentState = stateFactory(currentState.nextState()); // TODO: create mext state.
    }
  }

  gameState.startButton.addEventListener("click", e => {
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
