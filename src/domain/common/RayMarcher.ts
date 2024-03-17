import { Vector } from "./Vector";
import { Ray } from "./Ray";
import {
  RayMarchResult,
  ClosestObject,
} from "../../infrastructure/implementation";
import { SdfNormalCalculation } from "./sdf/SdfNormalCalculation";
import { SceneObject } from "./SceneDefinition/SceneObject";
import { Scene } from "./SceneDefinition/Scene";

export interface IRayMarcherConfig {
  get maxSteps(): number;
  get minimumSurfaceDistance(): number;
  get maximumDistance(): number;
}

export interface RayMarcherSettings {
  get maxSteps(): number;
  get surfaceDistance(): number;
  get maxDistance(): number;
}

export class RayMarcher {
  constructor(
    private scene: Scene,
    private settings: RayMarcherSettings,
    private normalCalculator: SdfNormalCalculation
  ) {}

  marchRay(ray: Ray): RayMarchResult {
    const inBounds = this.scene.objects.filter((x) => x.bounds.inBounds(ray));
    const inBoundsCount = inBounds.length;
    const maxSteps = this.settings.maxSteps;
    const surfaceDistance = this.settings.surfaceDistance;
    const maxDistance = this.settings.maxDistance;

    let totalDistance = 0;
    let i = 0;
    let position = ray.origin;
    const ox = ray.origin.x;
    const oy = ray.origin.y;
    const oz = ray.origin.z;
    const dx = ray.direction.x;
    const dy = ray.direction.y;
    const dz = ray.direction.z;

    while (i < maxSteps) {
      const closest = this.findClosestObject(position, inBounds, inBoundsCount);
      const closestDistance = closest[0];
      const closestObject = closest[1];
      totalDistance += closestDistance;

      // hit
      if (closestDistance < surfaceDistance) {
        const normal = this.normalCalculator.calculate(
          closestObject.sdf,
          position
        );
        return new RayMarchResult(true, position, normal, closestObject);
      }

      // miss
      if (totalDistance > maxDistance) {
        return new RayMarchResult(false, Vector.zero, Vector.zero, null);
      }

      // keep going
      position = new Vector(
        ox + dx * totalDistance,
        oy + dy * totalDistance,
        oz + dz * totalDistance
      );
      i++;
    }
    return new RayMarchResult(false, Vector.zero, Vector.zero, null);
  }

  private findClosestObject(
    position: Vector,
    inBounds: SceneObject[],
    inBoundsCount: number
  ): [number, SceneObject] {
    let minDistance = Math.max(inBounds[0].sdf.distance(position), 0);
    let minObject = inBounds[0];
    let i = 1;
    while (i < inBoundsCount) {
      const obj = inBounds[i];
      const distance = Math.max(obj.sdf.distance(position), 0); // do not allow negatives
      if (distance < minDistance) {
        minDistance = distance;
        minObject = obj;
      }
      i++;
    }
    return [minDistance, minObject];
  }
}
