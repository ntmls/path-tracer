import { Functions } from "./Functions";
import { Vector2 } from "./Vector2";

export class Polygon {
  private points: Vector2[] = [];
  private segments: PolySegment[] = [];
  private segmentsComputed = false;
  private _pointCount: number = 0;
  private tinyAmount = 0.00001;

  get count(): number {
    return this._pointCount;
  }

  add(point: Vector2) {
    this.points.push(point);
    this.segmentsComputed = false;
    this._pointCount++;
  }

  pointAt(index: number): Vector2 {
    return this.points[index];
  }

  public preCompute() {
    this.segments = [];
    for (let i = 0; i < this._pointCount; i++) {
      const start = this.points[i];
      let previous: Vector2;
      let end: Vector2;
      if (i === this._pointCount - 1) {
        end = this.points[0];
      } else {
        end = this.points[i + 1];
      }
      if (i === 0) {
        previous = this.points[this._pointCount - 1];
      } else {
        previous = this.points[i - 1];
      }
      this.segments.push(new PolySegment(previous, start, end));
    }
    // this.assertFloat32();
    this.segmentsComputed = true;
  }

  distance(px: number, py: number): number {
    if (!this.segmentsComputed) {
      throw new Error("preCompute() must be called before accessing segments.");
    }
    let intersectEven = true;
    let segment = this.segments[0];
    let distanceSquared = segment.distanceSquared(px, py);
    let minSquared = distanceSquared;
    intersectEven = this.isIntersectionsEven(px, py, segment, intersectEven);

    let i = 1;
    while (i < this._pointCount) {
      segment = this.segments[i];
      distanceSquared = segment.distanceSquared(px, py);
      if (distanceSquared < minSquared) {
        minSquared = distanceSquared;
      }
      intersectEven = this.isIntersectionsEven(px, py, segment, intersectEven);
      i++;
    }

    const dist = Math.sqrt(minSquared);
    if (intersectEven) {
      return dist;
    } else {
      return -dist;
    }
  }

  /*
  asFloat32() {
    const newPoints: Vector2[] = [];
    for (const point of this.points) {
      const newPoint = point.asFloat32();
      newPoints.push(newPoint);
    }
    this.points = newPoints;
    this.segmentsComputed = false; // Segments need to be recomputed.
  }
  */

  /*
  assertFloat32(): void {
    for (const point of this.points) {
      point.assertFloat32();
    }
    for (const segment of this.segments) {
      segment.previous.assertFloat32();
      segment.start.assertFloat32();
      segment.end.assertFloat32();
      if (segment.length !== Math.fround(segment.length)) {
        throw new Error(
          "Expected segment length to be float32 but was float64 instead."
        );
      }
      if (segment.inverseLength !== Math.fround(segment.inverseLength)) {
        throw new Error(
          "Expected segment inverseLength to be float32 but was float64 instead."
        );
      }
      if (segment.inverseVectorY !== Math.fround(segment.inverseVectorY)) {
        throw new Error(
          "Expected segment inverseVectorY to be float32 but was float64 instead."
        );
      }
    }
  }
  */

  private isIntersectionsEven(
    px: number, 
    py: number,
    segment: PolySegment,
    intersectEven: boolean
  ) {
    let modPositionX = px;
    let modPositionY = py;
    if (py === segment.start.y || py === segment.end.y) {
      modPositionX = px;
      modPositionY =  py + this.tinyAmount;
    }
    if (Functions.between(modPositionY, segment.start.y, segment.end.y)) {
      const dy = modPositionY - segment.start.y;
      const t = dy * segment.inverseVectorY; // / segment.vector.y;
      const xIntersect = segment.start.x + segment.vector.x * t;
      if (xIntersect > modPositionX) {
        intersectEven = !intersectEven;
      }
    }
    return intersectEven;
  }
}

export class PolySegment {
  readonly vector: Vector2;
  readonly vectorNormalTimesInvLengh: Vector2;
  readonly length: number;
  readonly inverseLength: number;
  readonly inverseVectorY: number;

  constructor(
    readonly previous: Vector2,
    readonly start: Vector2,
    readonly end: Vector2
  ) {
    this.vector = this.end.minus(this.start);
    this.length = this.vector.magnitude;
    if (this.length > 0) {
      this.inverseLength = 1 / this.length;
    } else {
      this.inverseLength = 0;
    }
    if (this.vector.y > 0) {
      this.inverseVectorY = 1 / this.vector.y;
    } else {
      this.inverseVectorY = 0;
    }
    this.vectorNormalTimesInvLengh = this.vector
      .normalize()
      .scale(this.inverseLength);
  }

  distanceSquared(px: number, py: number): number {
    const time = this.getTime(px, py);
    const localX = px - (this.vector.x * time + this.start.x);
    const localY = py - (this.vector.y * time + this.start.y);
    return localX * localX + localY * localY;
  }

  private getTime(px: number, py: number): number {
    const deltaX = px - this.start.x;
    const deltaY = py - this.start.y;
    const time =
      deltaX * this.vectorNormalTimesInvLengh.x +
      deltaY * this.vectorNormalTimesInvLengh.y;
    if (time < 0) return 0;
    if (time > 1) return 1;
    return time;
  }

  /*
  private assertFloat32(value: number): void {
    if (value !== Math.fround(value))
      throw new Error("Expected float32 but got float64 instead.");
  }
  */
}
