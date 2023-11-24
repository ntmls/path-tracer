import {
  Sensor,
} from "../../domain/common/Abstractions";
import { RgbColor } from "../../domain/common/RgbColor";
import { Vector2 } from "../../domain/common/Vector2";
import { Scene } from "../../domain/common/SceneDefinition/Scene";

export class CellSensor implements Sensor {
  private start: Vector2;
  private end: Vector2;
  private _output: RgbColor[] = [];

  constructor(readonly pixelSampler: PixelSampler) {}

  setSize(width: number, height: number): void {
    // already handled by set region.
  }

  setRegion(start: Vector2, end: Vector2) {
    this.start = start;
    this.end = end;
  }
  takePicture(scene: Scene): Promise<void> {
    this._output = [];
    for (let y = this.start.y; y <= this.end.y; y++) {
      for (let x = this.start.x; x <= this.end.x; x++) {
        const color = this.pixelSampler.samplePixel(x, y, scene);
        const correctedColor = this.correctGamma(color);
        const rgb = new RgbColor(
          Math.floor(correctedColor.red * 255),
          Math.floor(correctedColor.green * 255),
          Math.floor(correctedColor.blue * 255)
        );
        this._output.push(rgb);
      }
    }
    return Promise.resolve();
  }

  get output(): readonly RgbColor[] {
    return this._output;
  }

  private correctGamma(color: RgbColor) {
    return new RgbColor(
      Math.sqrt(color.red),
      Math.sqrt(color.green),
      Math.sqrt(color.blue)
    );
  }
}

export interface PixelSampler {
  samplePixel(x: number, y: number, scene: Scene): RgbColor;
}
