import type { RoughCanvas } from "roughjs/bin/canvas";
import rough from "roughjs";
import { diagramItemPadding, defaultFont } from "@/utils/constants";

export class RenderingContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  rc: RoughCanvas;
  scale = 1;
  translateX = 0;
  translateY = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.ctx = canvas.getContext("2d")!;
    this.rc = rough.canvas(canvas);

    this.updateSize();
    window.addEventListener("resize", () => this.updateSize());
  }

  updateSize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.resetFont();
  }

  resetFont() {
    this.ctx.font = defaultFont;
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  translate(dX: number, dY: number) {
    this.translateX += dX / this.scale;
    this.translateY += dY / this.scale;
  }

  contextualizedX(x: number) {
    return (x + this.translateX) * this.scale;
  }

  unContextualizedX(x: number) {
    return x / this.scale - this.translateX;
  }

  contextualizedY(y: number) {
    return (y + this.translateY) * this.scale;
  }

  unContextualizedY(y: number) {
    return y / this.scale - this.translateY;
  }

  getItemMinWidth(text: string) {
    return this.ctx.measureText(text).width + diagramItemPadding * 2;
  }
}
