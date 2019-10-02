class GameIdle extends GameState {
  onStart() {
    console.log("switched to idling");
    this.state = {
      startPressed: false
    };
  }

  isDone() {
    return this.state.startPressed;
  }

  onInput(input) {
    if (input.startPressed) {
      this.state.startPressed = true;
    }
  }

  onUpdate(dt) {
    // Do nothing for now,
  }

  nextState() {
    if (this.isDone()) return "shuffling";
  }
}
