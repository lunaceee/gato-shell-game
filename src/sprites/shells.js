"use strict";
import Point from "../util/point";
import SpriteGroup from "../util/spriteGroup";

const shellData = {};
{
  const p0 = new Point(-9, 8);
  const radius = 5;

  shellData.radius = radius;

  shellData.center1 = p0.add(new Point(radius, 0));
  shellData.center2 = p0.add(new Point(radius * 3, 0));

  shellData.shell1P0 = p0.add(new Point(0, 0));
  shellData.shell2P0 = p0.add(new Point(radius * 2, 0));
  shellData.shell3P0 = p0.add(new Point(radius * 4, 0));
}

const shells = new SpriteGroup();
shells.add(".shell-1", shellData.shell1P0.x, shellData.shell1P0.y);
shells.add(".shell-2", shellData.shell2P0.x, shellData.shell2P0.y);
shells.add(".shell-3", shellData.shell3P0.x, shellData.shell3P0.y);
shells.add(".shell-open", 0, 0);

export { shells, shellData };
