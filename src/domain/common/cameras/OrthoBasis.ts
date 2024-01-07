import { Vector } from "../Vector";

export class OrthoBasis {
  private constructor(
    readonly right: Vector,
    readonly up: Vector,
    readonly forward: Vector
  ) { }

  static fromLookAt(origin: Vector, lookAt: Vector, up: Vector): OrthoBasis {
    // calculate the forward vector
    up = up.normalize();
    const forward = lookAt.minus(origin).normalize();
    const right = up.cross(forward);
    const newUp = right.cross(forward);
    return new OrthoBasis(right, newUp, forward);
  }

  project(input: Vector): Vector {
    const a = this.right.scale(input.x);
    const b = this.up.scale(input.y);
    const c = this.forward.scale(input.z);
    return a.add(b).add(c);
  }

}
