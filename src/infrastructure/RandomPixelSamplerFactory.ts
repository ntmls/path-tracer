import {
  Camera,
  RayTracer,
  Random
} from "../domain/common/Abstractions";
import { RandomPixelSampler } from "./RandomPixelSampler";
import {
  PixelSampler,
  PixelSamplerFactory
} from "./nulticore/CellSensor";
import { Scene } from "../domain/common/SceneDefinition/Scene";


export class RandomPixelSamplerFactory implements PixelSamplerFactory {
  constructor(
    readonly samplesPerPixel: number,
    readonly random: Random,
    readonly camera: Camera,
    readonly clampThreshold: number
  ) { }
  createForScene(scene: Scene, rayTracer: RayTracer): PixelSampler {
    return new RandomPixelSampler(
      this.samplesPerPixel,
      rayTracer,
      this.random,
      this.camera,
      this.clampThreshold
    );
  }
}
