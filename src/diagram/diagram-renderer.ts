import type { DiagramConnection, DiagramItem } from "@/diagram/diagram";
import { Diagram } from "@/diagram/diagram";
import { RenderingContext } from "@/diagram/rendering-context";
import { getArrowPath } from "@/utils/arrows";
import { doesIntersectRect, doesIntersectRectBorder } from "@/utils/rectangle";

export class DiagramRenderer {
  diagram: Diagram;
  context: RenderingContext;

  constructor(canvas: HTMLCanvasElement) {
    this.diagram = new Diagram();
    this.context = new RenderingContext(canvas);
  }

  render() {
    this.context.clear();
    this.diagram.items.forEach((item) => this.renderItem(item));
    this.diagram.connections.forEach((connection) =>
      this.renderConnection(connection)
    );
  }

  renderItem(item: DiagramItem) {
    const { rc, scale } = this.context;
    const { x, y, width, height, seed } = item;
    rc.rectangle(
      this.context.contextualizedX(x) - (width * scale) / 2,
      this.context.contextualizedY(y) - (height * scale) / 2,
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
    this.context.ctx.fillText(
      item.text,
      this.context.contextualizedX(x),
      this.context.contextualizedY(y)
    );
  }

  renderConnection(connection: DiagramConnection) {
    const item1 = this.diagram.getItemById(connection.itemId1);
    const item2 = this.diagram.getItemById(connection.itemId2);
    if (item1 && item2) {
      const path = getArrowPath(item1, item2);
      if (path) {
        this.context.rc.path(path, {
          seed: connection.seed,
          roughness: 2,
          bowing: 2,
          strokeWidth: 2 * this.context.scale,
        });
      }
    }
  }

  addItem(x: number, y: number) {
    this.diagram.addItem(
      this.context.unContextualizedX(x),
      this.context.unContextualizedY(y)
    );
  }

  writeInItem(text: string) {
    const minWidth = this.context.getItemMinWidth(text);
    this.diagram.writeInSelectedItems(text, minWidth);
  }

  intersectBorders(x: number, y: number): number | undefined {
    return this.diagram.items.find((item) =>
      doesIntersectRectBorder(
        this.context.unContextualizedX(x),
        this.context.unContextualizedY(y),
        item
      )
    )?.id;
  }

  intersect(x: number, y: number): number | undefined {
    return this.diagram.items.find((item) =>
      doesIntersectRect(
        this.context.unContextualizedX(x),
        this.context.unContextualizedY(y),
        item
      )
    )?.id;
  }

  moveSelectedItems(dX: number, dY: number) {
    this.diagram.moveSelectedItems(
      dX / this.context.scale,
      dY / this.context.scale
    );
  }
}
