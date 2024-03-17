import { RayTracer } from "./Abstractions";
import { NormalsOnlyRayTracer } from "./NormalsOnlyRayTracer";
import { RayTracerFactory } from "../../infrastructure/CanvasSensor";
import { Scene } from "./SceneDefinition/Scene";
import { RayMarcherFactory } from "./RayMarcherFactory";

export class NormalsOnlyRayTracerFactory implements RayTracerFactory {
  constructor(private rayMarcherFactory: RayMarcherFactory) {}

  createForScene(scene: Scene): RayTracer {
    const rayMarcher = this.rayMarcherFactory.createForScene(scene);
    return new NormalsOnlyRayTracer(rayMarcher);
  }
}
