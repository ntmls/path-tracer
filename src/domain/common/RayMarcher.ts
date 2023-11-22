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
    for (let i = 0; i < this.maxSteps; i++) {
      const closest = this.minimumDistance(objects, ray.position);
      totalDistance += closest.distance;
      if (totalDistance < 0) {
        throw new Error("Expected positive distance.");
      }

      if (closest.distance < SURFACE_DISTANCE) {
        // hit
        const normal = this.normalCalculator.calculate(
          closest.closestObject.sdf,
          ray.position
        );
        return new RayMarchResult(
          true,
          ray.position,
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
        ray = ray.move(closest.distance);
      }
    }
    return new RayMarchResult(false, this.emptyVector, this.emptyVector, null);
  }

  private minimumDistance(
    objects: readonly SceneObject[],
    position: Vector
  ): ClosestObject {
    let minDistance = 0;
    let minObject!: SceneObject;
    let first = true;
    for (const obj of objects) {
      const distance = Math.max(obj.sdf.distance(position), 0); // do not allow negatives
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
    }
    return new ClosestObject(minDistance, minObject);
  }
}
