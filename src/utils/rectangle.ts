import { hitBoxPadding } from "./constants";
import type { XRelativePosition, YRelativePosition } from "./positions";

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function doesIntersectRect(
  x: number,
  y: number,
  rect: Rectangle
): boolean {
  return (
    x > rect.x - rect.width / 2 &&
    x < rect.x + rect.width / 2 &&
    y > rect.y - rect.height / 2 &&
    y < rect.y + rect.height / 2
  );
}

export function doesIntersectRectBorder(x: number, y: number, rect: Rectangle) {
  return (
    doesIntersectRectTopLeftCorner(x, y, rect) ||
    doesIntersectRectTopRightCorner(x, y, rect) ||
    doesIntersectRectBottomLeftCorner(x, y, rect) ||
    doesIntersectRectBottomRightCorner(x, y, rect) ||
    doesIntersectRectLeftBorder(x, y, rect) ||
    doesIntersectRectRightBorder(x, y, rect) ||
    doesIntersectRectTopBorder(x, y, rect) ||
    doesIntersectRectBottomBorder(x, y, rect)
  );
}

export function doesIntersectRectTopLeftCorner(
  x: number,
  y: number,
  rect: Rectangle
) {
  return (
    x > rect.x - rect.width / 2 - hitBoxPadding &&
    x < rect.x - rect.width / 2 + hitBoxPadding &&
    y > rect.y - rect.height / 2 - hitBoxPadding &&
    y < rect.y - rect.height / 2 + hitBoxPadding
  );
}

export function doesIntersectRectTopRightCorner(
  x: number,
  y: number,
  rect: Rectangle
) {
  return (
    x > rect.x + rect.width / 2 - hitBoxPadding &&
    x < rect.x + rect.width / 2 + hitBoxPadding &&
    y > rect.y - rect.height / 2 - hitBoxPadding &&
    y < rect.y - rect.height / 2 + hitBoxPadding
  );
}

export function doesIntersectRectBottomLeftCorner(
  x: number,
  y: number,
  rect: Rectangle
) {
  return (
    x > rect.x - rect.width / 2 - hitBoxPadding &&
    x < rect.x - rect.width / 2 + hitBoxPadding &&
    y > rect.y + rect.height / 2 - hitBoxPadding &&
    y < rect.y + rect.height / 2 + hitBoxPadding
  );
}

export function doesIntersectRectBottomRightCorner(
  x: number,
  y: number,
  rect: Rectangle
) {
  return (
    x > rect.x + rect.width / 2 - hitBoxPadding &&
    x < rect.x + rect.width / 2 + hitBoxPadding &&
    y > rect.y + rect.height / 2 - hitBoxPadding &&
    y < rect.y + rect.height / 2 + hitBoxPadding
  );
}

export function doesIntersectRectLeftBorder(
  x: number,
  y: number,
  rect: Rectangle
) {
  return (
    x > rect.x - rect.width / 2 - hitBoxPadding &&
    x < rect.x - rect.width / 2 + hitBoxPadding &&
    y > rect.y - rect.height / 2 &&
    y < rect.y + rect.height / 2
  );
}

export function doesIntersectRectRightBorder(
  x: number,
  y: number,
  rect: Rectangle
) {
  return (
    x > rect.x + rect.width / 2 - hitBoxPadding &&
    x < rect.x + rect.width / 2 + hitBoxPadding &&
    y > rect.y - rect.height / 2 &&
    y < rect.y + rect.height / 2
  );
}

export function doesIntersectRectTopBorder(
  x: number,
  y: number,
  rect: Rectangle
) {
  return (
    x > rect.x - rect.width / 2 &&
    x < rect.x + rect.width / 2 &&
    y > rect.y - rect.height / 2 - hitBoxPadding &&
    y < rect.y - rect.height / 2 + hitBoxPadding
  );
}

export function doesIntersectRectBottomBorder(
  x: number,
  y: number,
  rect: Rectangle
) {
  return (
    x > rect.x - rect.width / 2 &&
    x < rect.x + rect.width / 2 &&
    y > rect.y + rect.height / 2 - hitBoxPadding &&
    y < rect.y + rect.height / 2 + hitBoxPadding
  );
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
