import type { Rectangle } from "./rectangle";

import { rectXRelativePosition, rectYRelativePosition } from "./rectangle";

export function getArrowPath(
  rect1: Rectangle,
  rect2: Rectangle
): string | undefined {
  const xRelativePosition = rectXRelativePosition(rect1, rect2);
  const yRelativePosition = rectYRelativePosition(rect1, rect2);

  if (xRelativePosition === "middle" && yRelativePosition === "middle") {
    // rect1 and rect2 are overlapping, no arrows
    return;
  }
  if (xRelativePosition === "middle" && yRelativePosition === "top") {
    return verticalLinkPath(
      rect1.x,
      rect1.y + rect1.height / 2,
      rect2.x,
      rect2.y - rect2.height / 2
    );
  }
  if (xRelativePosition === "middle" && yRelativePosition === "bottom") {
    return verticalLinkPath(
      rect1.x,
      rect1.y - rect1.height / 2,
      rect2.x,
      rect2.y + rect2.height / 2
    );
  }
  if (xRelativePosition === "left" && yRelativePosition === "middle") {
    return horizontalLinkPath(
      rect1.x + rect1.width / 2,
      rect1.y,
      rect2.x - rect2.width / 2,
      rect2.y
    );
  }
  if (xRelativePosition === "left" && yRelativePosition === "top") {
    return concaveLinkPath(
      rect1.x + rect1.width / 2,
      rect1.y,
      rect2.x,
      rect2.y - rect2.height / 2
    );
  }
  if (xRelativePosition === "left" && yRelativePosition === "bottom") {
    return convexLinkPath(
      rect1.x,
      rect1.y - rect1.height / 2,
      rect2.x - rect2.width / 2,
      rect2.y
    );
  }
  if (xRelativePosition === "right" && yRelativePosition === "middle") {
    return horizontalLinkPath(
      rect1.x - rect1.width / 2,
      rect1.y,
      rect2.x + rect2.width / 2,
      rect2.y
    );
  }
  if (xRelativePosition === "right" && yRelativePosition === "top") {
    return convexLinkPath(
      rect1.x,
      rect1.y + rect1.height / 2,
      rect2.x + rect2.width / 2,
      rect2.y
    );
  }
  if (xRelativePosition === "right" && yRelativePosition === "bottom") {
    return concaveLinkPath(
      rect1.x - rect1.width / 2,
      rect1.y,
      rect2.x,
      rect2.y + rect2.height / 2
    );
  }
}

function horizontalLinkPath(x1: number, y1: number, x2: number, y2: number) {
  return `
  M ${x1} ${y1} 
  Q ${x1 + (x2 - x1) / 4} ${y1} 
  , ${x1 + (x2 - x1) / 2} ${y1 + (y2 - y1) / 2} 
  T ${x2} ${y2}`;
}

function verticalLinkPath(x1: number, y1: number, x2: number, y2: number) {
  return `
  M ${x1} ${y1} 
  Q ${x1} ${y1 + (y2 - y1) / 4} 
  , ${x1 + (x2 - x1) / 2} ${y1 + (y2 - y1) / 2} 
  T ${x2} ${y2}`;
}

function convexLinkPath(x1: number, y1: number, x2: number, y2: number) {
  return `M ${x1} ${y1} Q ${x1} ${y2} ${x2} ${y2}`;
}

function concaveLinkPath(x1: number, y1: number, x2: number, y2: number) {
  return `M ${x1} ${y1} Q ${x2} ${y1} ${x2} ${y2}`;
}
