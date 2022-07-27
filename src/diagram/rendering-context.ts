import type { RoughCanvas } from "roughjs/bin/canvas";
import rough from "roughjs";

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
  }

  contextualizeX(x: number) {
    return (x + this.translateX) * this.scale;
  }

  unContextualizeX(x: number) {
    return x / this.scale - this.translateX;
  }

  contextualizeY(y: number) {
    return (y + this.translateY) * this.scale;
  }

  unContextualizeY(y: number) {
    return y / this.scale - this.translateY;
  }
}
