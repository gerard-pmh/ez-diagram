import type { Rectangle } from "@/utils/shapes";

export interface DiagramItem extends Rectangle {
  id: number;
  seed: number;
  shape: "none" | "rectangle" | "circle";
  text: string;
  selected: boolean;
}

export function bounds(item: DiagramItem) {
  return {
    x1: item.x - item.width / 2,
    x2: item.x + item.width / 2,
    y1: item.y - item.height / 2,
    y2: item.y + item.height / 2,
  };
}

export type XPosition = "middle" | "left" | "right";
export type YPosition = "middle" | "top" | "bottom";

/**
 * Gives the item2 position relative to the item1
 */
export function relativePosition(
  item1: DiagramItem,
  item2: DiagramItem
): { xPos: XPosition; yPos: YPosition } {
  const item1Bounds = bounds(item1);
  const item2Bounds = bounds(item2);

  let xPos: XPosition = "middle";
  let yPos: YPosition = "middle";

  if (item1Bounds.x1 < item2Bounds.x1 && item1Bounds.x1 < item2Bounds.x2) {
    xPos = "right";
  } else if (
    item1Bounds.x1 > item2Bounds.x1 &&
    item1Bounds.x1 > item2Bounds.x2
  ) {
    xPos = "left";
  }

  if (item1Bounds.y1 < item2Bounds.y1 && item1Bounds.y1 < item2Bounds.y2) {
    yPos = "top";
  } else if (
    item1Bounds.y1 > item2Bounds.y1 &&
    item1Bounds.y1 > item2Bounds.y2
  ) {
    yPos = "bottom";
  }

  return { xPos, yPos };
}

export interface DiagramConnection {
  itemId1: number;
  itemId2: number;
  seed: number;
}

export class Diagram {
  nextId = 1;
  items: DiagramItem[] = [];
  connections: DiagramConnection[] = [];
}
