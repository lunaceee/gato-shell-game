class GatoIdling extends GameState {
  constructor(gato) {
    super();
    this.gato = gato;
  }

  onStart() {
    this.state = {
      tailDt: -1,
      eyeX: -1
    };
  }

  onUpdate(dt) {
    this.state.eyeX = this.state.eyeX + dt / 1000;
    if (this.state.eyeX > 1) this.state.eyeX = -1;
    let k = Math.abs(this.state.eyeX);

    this.gato.eyeLeft.move(new Point(3.4 + k, 3.8));
    this.gato.eyeRight.move(new Point(9 + k, 3.8));
    this.gato.eyeDotsDefaultLeft.move(new Point(4.5 + k, 5));
    this.gato.eyeDotsDefaultRight.move(new Point(10.5 + k, 5));

    this.state.tailDt = this.state.tailDt + dt / 1000;
    if (this.state.tailDt > 1) {
      this.state.tailDt = -1;
    }
    let k2 = Math.abs(this.state.tailDt);
    this.gato.tailUp.rotate(-0.7 + 1 * k2 * k2); // TODO: make cat tail movement more natural
  }
}
