import type { DiagramConnection, DiagramItem } from "@/diagram/diagram";
import { bounds, Diagram, relativePosition } from "@/diagram/diagram";
import { RenderingContext } from "@/diagram/rendering-context";
import rough from "roughjs";
import {
  pointIntersectRect,
  pointIntersectRectBorder,
  pointIntersectRectCorner,
} from "@/utils/shapes";

const intersectPadding = 16;

export class DiagramRenderer {
  diagram: Diagram;
  context: RenderingContext;

  constructor(canvas: HTMLCanvasElement) {
    this.diagram = new Diagram();
    this.context = new RenderingContext(canvas);
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.context.canvas.width = window.innerWidth;
    this.context.canvas.height = window.innerHeight;
    this.render();
  }

  render() {
    this.context.ctx.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
    this.diagram.items.forEach((item) => this.renderItem(item));
    this.diagram.connections.forEach((connection) =>
      this.renderConnection(connection)
    );
  }

  renderItem(item: DiagramItem) {
    const { rc, scale } = this.context;
    const { x, y, width, height, seed } = item;
    rc.rectangle(
      this.context.contextualizeX(x),
      this.context.contextualizeY(y),
      width * scale,
      height * scale,
      {
        stroke: item.selected ? "red" : "black",
        strokeWidth: 2 * scale,
        seed,
        roughness: 2,
        bowing: 2,
      }
    );
    this.context.ctx.font = "normal normal 400 24px Gloria Hallelujah";
    this.context.ctx.textBaseline = "middle";
    this.context.ctx.textAlign = "center";
    this.context.ctx.fillText(
      item.text,
      this.context.contextualizeX(x),
      this.context.contextualizeY(y)
    );
  }

  renderConnection(connection: DiagramConnection) {
    const item1 = this.diagram.items.find(
      (item) => item.id === connection.itemId1
    );
    const item2 = this.diagram.items.find(
      (item) => item.id === connection.itemId2
    );
    /*
    Cases to handle:
    1. overlap: no arrows ?
    2. (top bottom middle)(left right middle)
    */
    if (item1 && item2) {
      const { xPos, yPos } = relativePosition(item1, item2);
      const x1 = this.context.contextualizeX(item1.x);
      const x2 = this.context.contextualizeX(item2.x);
      const y1 = this.context.contextualizeY(item1.y);
      const y2 = this.context.contextualizeY(item2.y);
      const begin =
        xPos === "right"
          ? { x: x1 + (item1.width / 2) * this.context.scale, y: y1 }
          : { x: x1 - (item1.width / 2) * this.context.scale, y: y1 };
      const end =
        yPos === "top"
          ? { x: x2, y: y2 - (item2.height / 2) * this.context.scale }
          : { x: x2, y: y2 + (item2.height / 2) * this.context.scale };
      this.context.rc.path(
        `M ${begin.x} ${begin.y} Q ${end.x} ${begin.y} ${end.x} ${end.y}`,
        {
          seed: connection.seed,
          roughness: 2,
          bowing: 2,
          strokeWidth: 2 * this.context.scale,
        }
      );
    }
  }

  addItem(x: number, y: number): DiagramItem {
    this.unselectAll();
    const seed = rough.newSeed();
    const width = 100;
    const height = 40;
    const item: DiagramItem = {
      id: this.diagram.nextId++,
      x: this.context.unContextualizeX(x) - width / (2 * this.context.scale),
      y: this.context.unContextualizeY(y) - height / (2 * this.context.scale),
      width,
      height,
      seed,
      shape: "rectangle",
      text: "",
      selected: true,
    };
    this.diagram.items.push(item);
    return item;
  }

  resizeItem(resizeX: number, resizeY: number) {
    this.diagram.items
      .filter((item) => item.selected)
      .forEach((item) => {
        item.x -= resizeX / 2;
        item.y -= resizeY / 2;
        item.width += resizeX;
        item.height += resizeY;
      });
  }

  writeInItem(text: string) {
    this.context.ctx.font = "normal normal 400 24px Gloria Hallelujah";
    const padding = 16;
    this.diagram.items
      .filter((item) => item.selected)
      .forEach((item) => {
        item.text = text;
        const minWidth = this.context.ctx.measureText(text).width + padding * 2;
        if (minWidth > item.width) {
          item.width = minWidth;
        }
      });
  }

  unselectAll() {
    this.diagram.items.forEach((item) => (item.selected = false));
  }

  intersectBorders(x: number, y: number): number | undefined {
    return this.diagram.items.find((item) =>
      pointIntersectRectBorder(
        {
          x: this.context.unContextualizeX(x),
          y: this.context.unContextualizeY(y),
        },
        item,
        16
      )
    )?.id;
  }

  intersectCorners(x: number, y: number): number | undefined {
    return this.diagram.items.find((item) =>
      pointIntersectRectCorner(
        {
          x: this.context.unContextualizeX(x),
          y: this.context.unContextualizeY(y),
        },
        item,
        16
      )
    )?.id;
  }

  intersect(x: number, y: number): number | undefined {
    return this.diagram.items.find((item) =>
      pointIntersectRect(
        {
          x: this.context.unContextualizeX(x),
          y: this.context.unContextualizeY(y),
        },
        item
      )
    )?.id;
  }

  connect(itemId1: number, itemId2: number) {
    const seed = rough.newSeed();
    this.diagram.connections.push({ itemId1, itemId2, seed });
  }

  select(itemId: number) {
    const item = this.diagram.items.find((item) => item.id === itemId);
    if (item) {
      item.selected = true;
    }
  }

  translate(dX: number, dY: number) {
    this.context.translateX += dX / this.context.scale;
    this.context.translateY += dY / this.context.scale;
  }

  moveItem(dX: number, dY: number) {
    const item = this.diagram.items.find((item) => item.selected);
    if (item) {
      item.x += dX / this.context.scale;
      item.y += dY / this.context.scale;
    }
  }
}
