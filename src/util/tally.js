// Tally the wins / loses.
export default class Tally {
    constructor(maxSize) {
      this.queue = new Array(maxSize);
    }
  
    push(item) {
      this.queue.unshift(item);
      this.queue.pop();
    }
  
    matches(string) {
      const list = string.split('')
      const start = this.queue.length - list.length;
      if (start < 0) return false;
      return !list.find((elem, index) => this.queue[start + index] !== elem);
    }
  }