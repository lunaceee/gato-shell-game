"use strict";
import GameIdle from "./states/gameIdle";
import Tally from "./util/tally";

let gameState = {
  tally: new Tally(),
  startButton: document.querySelector(".start-button")
};

let currentState = new GameIdle(gameState);

function gameLoop(dt) {
  currentState.tick(dt);
  if (currentState.isDone()) {
    currentState.onEnd();
    currentState = currentState.nextState();
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
