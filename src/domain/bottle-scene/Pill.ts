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

  distanceSquared(position: Vector) {
    const vect2 = position.minus(this.start);
    let time = this.vect1Norm.dot(vect2);
    if (time < 0) {
      time = 0;
    }
    if (time > this.vect1mag) {
      time = this.vect1mag;
    }
    const ref = this.vect1Norm.scale(time);
    return ref.distanceSquaredFrom(vect2);
  }
}
