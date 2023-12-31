
import { RayTracer } from "./Abstractions";
import { Ray } from "./Ray";
import { RayMarcher } from "./RayMarcher";
import { RgbColor } from "./RgbColor";
import { Scene } from "./SceneDefinition/Scene";

export class NormalsOnlyRayTracer implements RayTracer {
  constructor(private rayMarcher: RayMarcher) { }

  traceRay(ray: Ray, scene: Scene): RgbColor {
    const objectsInBounds = scene.objects.filter((x) => x.bounds.inBounds(ray));
    const result = this.rayMarcher.marchRay(objectsInBounds, ray);
    if (result.wasHit) {
      const color = new RgbColor(
        this.toRangeZeroToOne(result.normal.x),
        this.toRangeZeroToOne(result.normal.y),
        this.toRangeZeroToOne(result.normal.z)
      );
      return color;
    } else {
      return RgbColor.black;
    }
  }

  private toRangeZeroToOne(value: number): number {
    return (value + 1) * 0.5;
  }
}
