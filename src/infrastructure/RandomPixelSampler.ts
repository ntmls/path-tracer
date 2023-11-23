import {
  Camera,
  Random,
  RayTracer
} from "../domain/common/Abstractions";
import { RgbColor } from "../domain/common/RgbColor";
import { Scene } from "../domain/common/SceneDefinition/Scene";
import { PixelSampler } from "./nulticore/RegionSensor";

export class RandomPixelSampler implements PixelSampler {
  constructor(
    readonly samplesPerPixel: number,
    readonly rayTracer: RayTracer,
    readonly random: Random,
    readonly camera: Camera
  ) { }

  samplePixel(x: number, y: number, scene: Scene): RgbColor {
    let sum = new RgbColor(0, 0, 0);
    for (let j = 0; j < this.samplesPerPixel; j++) {
      const ray = this.camera.generateRay(
        this.random.between(x, x + 1),
        this.random.between(y, y + 1)
      );
      const color = this.rayTracer.traceRay(ray, scene);
      sum = sum.add(color);
    }
    const averageColor = sum.divideScalar(this.samplesPerPixel);
    return averageColor;
  }
}
