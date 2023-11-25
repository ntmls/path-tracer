import {
  Camera,
  Random,
  RayTracer
} from "../domain/common/Abstractions";
import { RgbColor } from "../domain/common/RgbColor";
import { Scene } from "../domain/common/SceneDefinition/Scene";
import { PixelSampler } from "./nulticore/CellSensor";

export class StratifiedPixelSampler implements PixelSampler {
  constructor(
    readonly samplePattern: number,
    readonly rayTracer: RayTracer,
    readonly random: Random,
    readonly camera: Camera,
    readonly clampThreshold
  ) {
    this.subPixelSize = 1 / samplePattern;
    this.samplesPerPixel = samplePattern * samplePattern;
    this.sampleWeight = 1 / this.samplesPerPixel;
  }

  private samplesPerPixel: number;
  private subPixelSize: number;
  private sampleWeight: number;

  samplePixel(x: number, y: number, scene: Scene): RgbColor {
    let sum = RgbColor.black;
    for (let i = 0; i < this.samplePattern; i++) {
      const tempX = x + i * this.subPixelSize; // move outside thee inner loop for performance
      for (let j = 0; j < this.samplePattern; j++) {
        const subX = tempX + Math.random() * this.subPixelSize;
        const subY = y + j * this.subPixelSize + Math.random() * this.subPixelSize;
        const ray = this.camera.generateRay(subX, subY);
        const color = this.rayTracer.traceRay(ray, scene);
        sum = sum.add(color.clampAll(this.clampThreshold));
      }
    }
    const averageColor = sum.scale(this.sampleWeight);
    return averageColor;
  }
}
