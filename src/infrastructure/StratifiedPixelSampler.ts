import {
  Camera,
  Random,
  RayTracer
} from "../domain/common/Abstractions";
import { RgbColor } from "../domain/common/RgbColor";
import { Scene } from "../domain/common/SceneDefinition/Scene";
import { PixelSampler } from "./RegionSensor";


export class StratifiedPixelSampler implements PixelSampler {
  constructor(
    readonly samplePattern: number,
    readonly rayTracer: RayTracer,
    readonly random: Random,
    readonly camera: Camera
  ) {
    this.subPixelSize = 1 / samplePattern;
    this.samplesPerPixel = samplePattern * samplePattern;
    this.sampleWeight = 1 / this.samplesPerPixel;
  }

  private samplesPerPixel: number;
  private subPixelSize: number;
  private sampleWeight: number;

  samplePixel(x: number, y: number, scene: Scene): RgbColor {
    let sum = new RgbColor(0, 0, 0);
    for (let i = 0; i < this.samplePattern; i++) {
      for (let j = 0; j < this.samplePattern; j++) {
        const subX = x + i * this.subPixelSize + Math.random() * this.subPixelSize;
        const subY = y + j * this.subPixelSize + Math.random() * this.subPixelSize;
        const ray = this.camera.generateRay(subX, subY);
        const color = this.rayTracer.traceRay(ray, scene);
        sum = sum.add(color);
      }
    }
    const averageColor = sum.scale(this.sampleWeight);
    return averageColor;
  }
}
