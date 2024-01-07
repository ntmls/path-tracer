import { Vector } from "./Vector";
import { Ray } from "./Ray";
import {
  RayMarchResult,
  ClosestObject,
} from "../../infrastructure/implementation";
import { SdfNormalCalculation } from "./sdf/SdfNormalCalculation";
import { SceneObject } from "./SceneDefinition/SceneObject";

export class RayMarcher {
  private emptyVector = new Vector(0, 0, 0);
  constructor(
    private maxSteps = 1000,
    private normalCalculator: SdfNormalCalculation
  ) {}

  marchRay(objects: readonly SceneObject[], ray: Ray): RayMarchResult {
    const SURFACE_DISTANCE = 0.01;
    const MAX_DISTANCE = 2000;
    let totalDistance = 0;
    const objectCount = objects.length;
    let i = 0;
    while (i < this.maxSteps) {
      const closest = this.minimumDistance(objects, objectCount, ray);
      totalDistance += closest.distance;
      if (totalDistance < 0) {
        throw new Error("Expected positive distance.");
      }

      if (closest.distance < SURFACE_DISTANCE) {
        // hit
        const normal = this.normalCalculator.calculate(
          closest.closestObject.sdf,
          ray.origin
        );
        return new RayMarchResult(
          true,
          ray.origin,
          normal,
          closest.closestObject
        );
      } else if (totalDistance > MAX_DISTANCE) {
        // miss
        return new RayMarchResult(
          false,
          this.emptyVector,
          this.emptyVector,
          null
        );
      } else {
        ray = ray.shift(closest.distance);
      }
      i++;
    }
    return new RayMarchResult(false, this.emptyVector, this.emptyVector, null);
  }

  private minimumDistance(
    objects: readonly SceneObject[],
    objectCount: number,
    ray: Ray
  ): ClosestObject {
    let first = true;
    let minDistance = 0;
    let minObject!: SceneObject;
    let distance = 0;
    minDistance = distance;
    minObject = objects[0];
    let i = 0;
    while (i < objectCount) {
      const obj = objects[i];
      // This doesn't save enough distance checks to make the extra overhead worth it.
      // if (obj.bounds.inBounds(ray)) {
      distance = Math.max(obj.sdf.distance(ray.origin), 0); // do not allow negatives
      if (first) {
        minDistance = distance;
        minObject = obj;
        first = false;
      } else {
        if (distance < minDistance) {
          minDistance = distance;
          minObject = obj;
        }
      }
      // }
      i++;
    }
    return new ClosestObject(minDistance, minObject);
  }
}
