import Sprite from "./sprite";
import { camelize } from "../util/strings";
import Point from "./point";

export default class SpriteGroup {
  constructor() {
    this.keys = [];
  }

  /**
   * Converted class names into gato parts
   * @param {} cssClass
   * @param {*} x
   * @param {*} y
   */
  add(cssClass, x, y) {
    const key = camelize(cssClass.replace(".", "").split("-"));
    this.keys.push(key);
    this[key] = new Sprite(cssClass, new Point(x, y));
  }

  /**
   * Hides all the sprites on the SpriteGroup
   */
  hide() {
    for (const key of this.keys) {
      this[key].hide();
    }
  }

  showList(spaceSeparatedNames) {
    for (let name of spaceSeparatedNames.split(new RegExp("\n|\\s+"))) {
      const sprite = this[name];

      if (sprite) sprite.show();
    }
  }

  showOnly(stringList) {
    this.hide();
    this.showList(stringList);
  }
}
