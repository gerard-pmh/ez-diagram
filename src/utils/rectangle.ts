import type { XRelativePosition, YRelativePosition } from "./positions";

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function rectXRelativePosition(
  rect1: Rectangle,
  rect2: Rectangle
): XRelativePosition {
  if (rect1.x + rect1.width / 2 < rect2.x - rect2.width / 2) {
    return "left";
  }
  if (rect2.x + rect2.width / 2 < rect1.x - rect1.width / 2) {
    return "right";
  }
  return "middle";
}

export function rectYRelativePosition(
  rect1: Rectangle,
  rect2: Rectangle
): YRelativePosition {
  if (rect1.y + rect1.height / 2 < rect2.y - rect2.height / 2) {
    return "top";
  }
  if (rect2.y + rect2.height / 2 < rect1.y - rect1.height / 2) {
    return "bottom";
  }
  return "middle";
}
