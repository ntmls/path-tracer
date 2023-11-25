import {
  Camera,
  Random,
  RayTracer
} from "../domain/common/Abstractions";
import { RgbColor } from "../domain/common/RgbColor";
import { Scene } from "../domain/common/SceneDefinition/Scene";
import { PixelSampler } from "./nulticore/CellSensor";

export class RandomPixelSampler implements PixelSampler {
  constructor(
    readonly samplesPerPixel: number,
    readonly rayTracer: RayTracer,
    readonly random: Random,
    readonly camera: Camera, 
    readonly clampThreshold: number
  ) { }

  samplePixel(x: number, y: number, scene: Scene): RgbColor {
    let sum = RgbColor.black;
    for (let j = 0; j < this.samplesPerPixel; j++) {
      const ray = this.camera.generateRay(
        this.random.between(x, x + 1),
        this.random.between(y, y + 1)
      );
      const color = this.rayTracer.traceRay(ray, scene);
      sum = sum.add(color.clampAll(this.clampThreshold));
    }
    const averageColor = sum.divideScalar(this.samplesPerPixel);
    return averageColor;
  }
}
