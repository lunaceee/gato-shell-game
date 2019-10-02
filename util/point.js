"use strict";

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  multiply(k) {
    return new Point(this.x * k, this.y * k);
  }

  add(other) {
    return new Point(this.x + other.x, this.y + other.y);
  }

  substract(other) {
    return new Point(this.x - other.x, this.y - other.y);
  }

  distance(other) {
    return Point.distance(this, other);
  }

  static distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
  }
}
