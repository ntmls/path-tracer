import { Functions } from "../common/Functions";
import { Vector } from "../common/Vector";

export class Pill {
  private readonly vect1: Vector;
  private readonly vect1Norm: Vector;
  private readonly vect1mag: number;

  constructor(readonly start: Vector, readonly end: Vector) {
    this.vect1 = this.end.minus(this.start);
    this.vect1Norm = this.vect1.normalize();
    this.vect1mag = this.vect1.magnitude;
  }

  distanceSquared(px: number, py: number, pz: number) {
    const deltaX = px - this.start.x;
    const deltaY = py - this.start.y;
    const deltaZ = pz - this.start.z;

    // let time = this.vect1Norm.dot(delta);
    let time =
      this.vect1Norm.x * deltaX +
      this.vect1Norm.y * deltaY +
      this.vect1Norm.z * deltaZ;
    if (time < 0) {
      time = 0;
    }
    if (time > this.vect1mag) {
      time = this.vect1mag;
    }
    const refX = this.vect1Norm.x * time;
    const refY = this.vect1Norm.y * time;
    const refZ = this.vect1Norm.z * time;

    return Functions.distanceSquared3(
      refX,
      refY,
      refZ,
      deltaX,
      deltaY,
      deltaZ
    );
  }
}
