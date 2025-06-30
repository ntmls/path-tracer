import { SignedDistanceFunction } from "../Abstractions";
import { Vector } from "../Vector";

export class SdfNormalCalculation {
  constructor(private epsilon: number) {}
  calculate(sdf: SignedDistanceFunction, position: Vector): Vector {
    const x1 = sdf.distance(position.x - this.epsilon, position.y, position.z);
    const x2 = sdf.distance(position.x + this.epsilon, position.y, position.z);
    const y1 = sdf.distance(position.x, position.y - this.epsilon, position.z);
    const y2 = sdf.distance(position.x, position.y + this.epsilon, position.z);
    const z1 = sdf.distance(position.x, position.y, position.z - this.epsilon);
    const z2 = sdf.distance(position.x, position.y, position.z + this.epsilon);

    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const deltaZ = z2 - z1;

    const length = Math.sqrt(
      deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ
    );
    if (length === 0) {
      return new Vector(0, 0, 0); // No normal can be calculated, return zero vector
    } else {
      return new Vector(deltaX / length, deltaY / length, deltaZ / length);
    }
  }
}
