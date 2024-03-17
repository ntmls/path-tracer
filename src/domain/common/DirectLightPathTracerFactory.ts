import { RayTracer, Random } from "./Abstractions";
import { RayMarcher } from "./RayMarcher";
import { RayTracerFactory } from "../../infrastructure/CanvasSensor";
import { HemisphereSurfaceSampler } from "./sampling/HemisphereSurfaceSampler";
import { DirectLightPathTracer } from "./DirectLightPathTracer";
import { Scene } from "./SceneDefinition/Scene";
import { RayMarcherFactory } from "./RayMarcherFactory";

export class DirectLightPathTracerFactory implements RayTracerFactory {
  constructor(
    private rayMarcherFactory: RayMarcherFactory,
    private hemisphereSampler: HemisphereSurfaceSampler,
    private random: Random
  ) {}

  createForScene(scene: Scene): RayTracer {
    const rayMarcher = this.rayMarcherFactory.createForScene(scene);
    return new DirectLightPathTracer(
      scene,
      rayMarcher,
      this.hemisphereSampler,
      this.random
    );
  }
}
