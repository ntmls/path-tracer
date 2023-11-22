import { Vector } from "./Vector";


export class Ray {
  constructor(readonly position: Vector, readonly direction: Vector) { }
  move(distance: number): Ray {
    return new Ray(
      this.position.add(this.direction.scale(distance)),
      this.direction
    );
  }
}
