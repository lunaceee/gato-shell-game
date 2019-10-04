(function(window) {
  "use strict";
  let gameState = {
    gameShufflingCycle: 0,
    numberOfConsecutiveWins: 0,
    catSelection: null,
    numberOfConsecutiveLosses: 0
  };
  function stateFactory(name) {
    switch (name) {
      case "idle":
        return new GameIdle(gato);
      case "shuffling":
        return new GameShuffling(gato, shells);
      case "gatoSelects":
        gameState.catSelection = Math.floor(Math.random() * 3);
        return new GatoSelects(gato, gameState.catSelection);
      case "reveal":
        gameState.gameShufflingCycle++;
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
