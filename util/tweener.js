function clamp(value, min, max) {
  if (value > max) return max;
  if (value < min) return min;
  return value;
}

class Tweener {
  constructor() {
    this.values = [];
  }

  add({ time, value, fx }) {
    if (!fx) fx = x => x;
    this.values.push({ time, value, interpolator: fx });
  }

  value(time) {
    const [from, to] = this.findFromTo(time);

    if (!from) return 0;
    if (!to) return from.value;

    const valueDelta = to.value - from.value;
    const progress = (time - from.time) / (to.time - from.time);

    if (progress >= 1.0) {
      return to.value;
    } else {
      return from.value + to.interpolator(progress) * valueDelta;
    }
  }

  findFromTo(t) {
    const numTweens = this.values.length;

    if (numTweens === 0) return [undefined];
    if (numTweens === 1) return [this.values[0], undefined];

    // Heuristic: assume will be more efficient to start from first
    // index if time is small enough.
    if (t < 1) this.lastFromIdx = 0;

    // Otherwise, assume user has been polling the tweener.
    let searchIdx = clamp(this.lastFromIdx || 0, 0, numTweens);

    // Starting from the last index,
    // search for the first ween of time greater than t.
    for (; searchIdx < numTweens - 1; searchIdx++) {
      let val = this.values[searchIdx];
      if (val.time > t) break;
    }

    // Now we should be at an index of some tween of time greater than t,
    // so look for the first tween of time smaller than t going left.
    for (; searchIdx > 0; searchIdx--) {
      let val = this.values[searchIdx];
      if (val.time <= t) break;
    }

    // Save the index.
    this.lastFromIdx = searchIdx;

    return [this.getIndexed(searchIdx), this.getIndexed(searchIdx + 1)];
  }

  getIndexed(index) {
    if (index >= 0 && index < this.values.length) {
      return this.values[index];
    }
  }
}
