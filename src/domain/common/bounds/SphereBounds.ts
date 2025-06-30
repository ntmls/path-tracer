import { Ray } from "../Ray";
import { Vector } from "../Vector";
import { Bounds } from "./Bounds";

export class SphereBounds implements Bounds {
  private _radiusSquared: number;
  private _centerX: number;
  private _centerY: number;
  private _centerZ: number;

  constructor(readonly center: Vector, radius: number) {
    this._radiusSquared = radius * radius;
    this._centerX = center.x;
    this._centerY = center.y;
    this._centerZ = center.z;
  }

  inBounds(ray: Ray): boolean {
    const rayOrigin = ray.origin;
    const rayDirection = ray.direction;

    const deltaX = this._centerX - rayOrigin.x;
    const deltaY = this._centerY - rayOrigin.y;
    const deltaZ = this._centerZ - rayOrigin.z;

    const distanceFromOriginSquared =
      deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;

    if (distanceFromOriginSquared <= this._radiusSquared) return true; // we are inside the sphere we might hit an object on our way out.

    // const time = delta.dot(ray.direction);
    const time =
      deltaX * rayDirection.x +
      deltaY * rayDirection.y +
      deltaZ * rayDirection.z;

    if (time < 0) return false; // we are not inside the sphere and the sphere is behind us.

    const toCenterX = rayDirection.x * time - deltaX;
    const toCenterY = rayDirection.y * time - deltaY;
    const toCenterZ = rayDirection.z * time - deltaZ;

    const distanceSquared =
      toCenterX * toCenterX + toCenterY * toCenterY + toCenterZ * toCenterZ;

    if (distanceSquared > this._radiusSquared) {
      return false; // Sphere does not intersect the ray at all. Ray will missed it entirely.
    } else {
      return true;
    }
  }
}
