import { SignedDistanceFunction } from "../Abstractions";
import { Vector } from "../Vector";

export class SdfNormalCalculation {
  constructor(private epsilon: number) { }
  calculate(sdf: SignedDistanceFunction, position: Vector): Vector {
    const x1 = sdf.distance(
      new Vector(position.x - this.epsilon, position.y, position.z)
    );
    const x2 = sdf.distance(
      new Vector(position.x + this.epsilon, position.y, position.z)
    );
    const y1 = sdf.distance(
      new Vector(position.x, position.y - this.epsilon, position.z)
    );
    const y2 = sdf.distance(
      new Vector(position.x, position.y + this.epsilon, position.z)
    );
    const z1 = sdf.distance(
      new Vector(position.x, position.y, position.z - this.epsilon)
    );
    const z2 = sdf.distance(
      new Vector(position.x, position.y, position.z + this.epsilon)
    );

    const v = new Vector(x2 - x1, y2 - y1, z2 - z1);
    return v.normalize();
  }
}
