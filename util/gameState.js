"use strict";

class GameState {
  constructor() {
    this.initialized = false;
    this.elapsed = 0;
  }

  /**
   * Returns whether there's anything else to do
   * in this state.
   */
  isDone() {
    return false;
  }

  /**
   * Whenever an input event happens,
   * active states should receive an input
   * call with the input data.
   * @param input data, for instance, which
   * key or button was pressed.
   */
  onInput(input) {}

  /**
   * Called only once, before first update.
   */
  onStart() {}

  /**
   * Called only once, before moving to the next state.
   */
  onEnd() {}

  /**
   * Called each tick to update the state of the object
   * @param dt is the numbers of milliseconds since
   * last update.
   */
  onUpdate(dt) {}

  /**
   * Should be called by the game loop to update the
   * state of the object.
   * @param dt is the numbers of milliseconds since
   * last update.
   */
  tick(dt) {
    if (!this.initialized) {
      this.onStart();
      this.initialized = true;
    }
    this.elapsed += dt;
    this.onUpdate(dt);
  }

  /**
   * Returns the name of the preferred next state.
   * May return empty string of there is no preferred
   * next state.
   */
  nextState() {
    return "";
  }
}
