import type { Rectangle } from "@/utils/rectangle";
import rough from "roughjs";

export interface DiagramItem extends Rectangle {
  id: number;
  seed: number;
  shape: "none" | "rectangle" | "circle";
  text: string;
  selected: boolean;
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

  get selectedItems() {
    return this.items.filter((item) => item.selected);
  }

  getItemById(itemId: number) {
    return this.items.find((item) => item.id === itemId);
  }

  unselectAll() {
    this.items.forEach((item) => (item.selected = false));
  }

  selectItem(itemId: number) {
    this.unselectAll();
    const item = this.getItemById(itemId);
    if (item) {
      item.selected = true;
    }
  }

  moveSelectedItems(dX: number, dY: number) {
    this.selectedItems.forEach((item) => {
      item.x += dX;
      item.y += dY;
    });
  }

  resizeSelectedItems(dWidth: number, dHeight: number) {
    this.selectedItems.forEach((item) => {
      item.width += dWidth;
      item.height += dHeight;
    });
  }

  writeInSelectedItems(text: string, minWidth: number) {
    this.selectedItems.forEach((item) => {
      item.text = text;
      if (item.width < minWidth) {
        item.width = minWidth;
      }
    });
  }

  addItem(x: number, y: number) {
    this.unselectAll();
    const seed = rough.newSeed();
    const width = 100;
    const height = 40;
    const item: DiagramItem = {
      id: this.nextId++,
      x,
      y,
      width,
      height,
      seed,
      shape: "rectangle",
      text: "",
      selected: true,
    };
    this.items.push(item);
    return item;
  }

  connectItems(itemId1: number, itemId2: number) {
    const seed = rough.newSeed();
    this.connections.push({ itemId1, itemId2, seed });
  }
}
