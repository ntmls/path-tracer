import { Vector } from "../domain/common/Vector";
import { Vector2 } from "../domain/common/Vector2";
import {
  SignedDistanceFunction,
  SignedDistanceFunction2d,
} from "../domain/common/Abstractions";
import { RgbColor } from "../domain/common/RgbColor";
import { SceneObject } from "../domain/common/SceneDefinition/SceneObject";

export class ClosestObject {
  constructor(readonly distance: number, readonly closestObject: SceneObject) {}
}

export class RayMarchResult {
  constructor(
    readonly wasHit: boolean,
    readonly hitAt: Vector,
    readonly normal: Vector,
    readonly hitObject: SceneObject | null
  ) {}
}

export class Translation implements SignedDistanceFunction {
  private offset: Vector;
  constructor(private sdf: SignedDistanceFunction, offset: Vector) {
    this.offset = offset.negate();
  }
  distance(position: Vector): number {
    return this.sdf.distance(position.add(this.offset));
  }
}

export class SdfVisualizer2d {
  private xOffset = 0;
  private yOffset = 0;
  private pixelsPerUnit = 100;
  private readonly red = new RgbColor(1, 0, 0);
  private readonly green = new RgbColor(0, 1, 0);
  private readonly black = new RgbColor(0, 0, 0);
  private readonly blue = new RgbColor(0, 0, 1);
  private readonly darkGreen = this.green.mix(this.black, 0.25);
  private readonly darkBlue = this.blue.mix(this.black, 0.25);
  private halfWidth: number;
  private halfHeight: number;

  constructor(private canvas: HTMLCanvasElement, private contours: Contours) {
    // this.contourFunction = new Contours(1, .1);
    this.halfHeight = this.canvas.height / 2;
    this.halfWidth = this.canvas.width / 2;
  }

  setView(xOffset: number, yOffset: number, pixelsPerUnit: number) {
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.pixelsPerUnit = pixelsPerUnit;
  }

  visualize(sdf: SignedDistanceFunction2d): void {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const context = this.canvas.getContext("2d");
    if (context === null) throw new Error('"Context" not found');
    const imageData = context?.getImageData(0, 0, width, height);
    if (imageData === undefined) throw new Error('"ImageData" not found');
    const length = imageData.data.length;
    let x = 0;
    let y = 0;
    for (var i = 0; i < length; i += 4) {
      let v = 0;
      const color = this.onPixel(x, y, sdf);
      imageData.data[i] = Math.floor(color.red * 255);
      imageData.data[i + 1] = Math.floor(color.green * 255);
      imageData.data[i + 2] = Math.floor(color.blue * 255);
      imageData.data[i + 3] = 255;
      x = x + 1;
      if (x >= width) {
        y = y + 1;
        x = 0;
      }
    }
    context.putImageData(imageData, 0, 0);
  }

  private onPixel(
    x: number,
    y: number,
    sdf: SignedDistanceFunction2d
  ): RgbColor {
    const v = new Vector2(
      this.xOffset + (x - this.halfWidth) / this.pixelsPerUnit,
      this.yOffset + -(y - this.halfHeight) / this.pixelsPerUnit
    );
    const color = this.annotate(v.x, v.y);
    if (color !== null) return color;
    const dist = sdf.distance(v);
    const t = this.contours.eval(dist);
    if (dist < 0) {
      return this.green.mix(this.darkGreen, t);
    } else {
      return this.blue.mix(this.darkBlue, t);
    }
  }

  private annotate(x: number, y: number): RgbColor | null {
    if (Math.abs(x) < 0.005) return this.red;
    if (Math.abs(y) < 0.005) return this.red;
    return null;
  }
}

export class Contours {
  readonly minorTickCount: number;
  readonly minorTickSize: number;
  readonly majorTick: number;

  constructor(majorTickSize: number, minorTickSize: number) {
    this.majorTick = majorTickSize;
    this.minorTickSize = minorTickSize;
    this.minorTickCount = majorTickSize / minorTickSize;
  }

  eval(x: number): number {
    const major = this.majorFunction(x);
    const minor = this.minorFunction(x);
    return Math.max(this.majorFunction(x), this.minorFunction(x));
  }

  private majorFunction(x: number) {
    const a = x * (1 / this.majorTick);
    const frac = a - Math.floor(a);
    return Math.max(1 - Math.min(1 - frac, frac) * 2 * this.minorTickCount, 0);
  }

  private minorFunction(x: number) {
    const a = x * (1 / this.minorTickSize);
    const frac = a - Math.floor(a);
    return Math.max(1 - Math.min(1 - frac, frac) * 2, 0) * 0.5;
  }
}
