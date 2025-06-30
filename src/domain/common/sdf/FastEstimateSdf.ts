import { SignedDistanceFunction } from "../Abstractions";
import { Vector } from "../Vector";

export class FastEstimateSdf implements SignedDistanceFunction {
  constructor(
    private readonly estimate: SignedDistanceFunction,
    private readonly exact: SignedDistanceFunction, 
    private threshold: number = 0.01;
  ) {}
  
  /**
   * Returns the distance to the surface of the object.
   * If the estimate is less than threshold, it returns the exact distance.
   * Otherwise, it returns the estimate.
   */
  distance(position: Vector): number {
    const estimatedDistance = this.estimate.distance(position);
    if (estimatedDistance < this.threshold) {
        return this.exact.distance(position);
    }
    return estimatedDistance;
  }
}
