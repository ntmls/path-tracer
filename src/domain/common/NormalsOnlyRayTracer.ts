import { RayTracer } from "./Abstractions";
import { Ray } from "./Ray";
import { RayMarcher } from "./RayMarcher";
import { RgbColor } from "./RgbColor";

export class NormalsOnlyRayTracer implements RayTracer {
  constructor(private rayMarcher: RayMarcher) {}

  traceRay(ray: Ray): RgbColor {
    const result = this.rayMarcher.marchRay(ray);
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
