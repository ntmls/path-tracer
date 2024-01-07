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

    const time =
      (this._centerX - rayOrigin.x) * rayDirection.x +
      (this._centerY - rayOrigin.y) * rayDirection.y +
      (this._centerZ - rayOrigin.z) * rayDirection.z;

    const projected = new Vector(
      rayDirection.x * time + rayOrigin.x,
      rayDirection.y * time + rayOrigin.y,
      rayDirection.z * time + rayOrigin.z
    );

    const distanceSquared = projected.distanceSquaredFrom(this.center);
    if (distanceSquared > this._radiusSquared) {
      return false; // sphere does not intersect the line at all
    } else {
      if (time > 0) {
        // We know that at least one of the intersections is in front of the origion.
        return true;
      } else {
        // the center of the intersection is behind the origion. We need to check if an actual intersection could be in frond of the origin.
        const halfIntersectionLengthSqr = this._radiusSquared - distanceSquared;
        const distFromOrigionToProjectedSqr =
          rayOrigin.distanceSquaredFrom(projected);
        if (distFromOrigionToProjectedSqr > halfIntersectionLengthSqr) {
          return true; // an intersection could be in front of the origion.
        } else {
          return false; // he spehre is far enough behind the origion that we know the ray does not
        }
      }
    }
  }
}
