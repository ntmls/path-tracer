import { Functions } from "./Functions";
import { Vector2 } from "./Vector2";


export class Polygon {
  private points: Vector2[] = [];
  private segments: PolySegment[] = [];
  private segmentsNeedRecompute = true;
  private _pointCount: number = 0;

  get count(): number {
    return this._pointCount;
  }
  add(point: Vector2) {
    this.points.push(point);
    this.segmentsNeedRecompute = true;
    this._pointCount++;
  }
  pointAt(index: number): Vector2 {
    return this.points[index];
  }
  segmentAt(index: number): PolySegment {
    if (this.segmentsNeedRecompute) {
      this.recomputeSegments();
    }
    return this.segments[index];
  }
  private recomputeSegments() {
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
    this.segmentsNeedRecompute = false;
  }

  distance(position: Vector2): number {
    let minSquared = 0;
    let first = true;
    let intersectEven = true;
    for (let i = 0; i < this._pointCount; i++) {
      const segment = this.segmentAt(i);
      const dps = position.minus(segment.start);
      let time = dps.dot(segment.vectorNormal) / segment.length;
      time = Functions.clamp(time, 0, 1);
      const pointAtTime = segment.vector.scale(time).add(segment.start);
      const vectToPosition = position.minus(pointAtTime);
      const distanceSquared = vectToPosition.dot(vectToPosition);
      if (first) {
        minSquared = distanceSquared;
        first = false;
      } else {
        if (distanceSquared < minSquared) {
          minSquared = distanceSquared;
        }
      }
      let modPosition = position;
      if (position.y === segment.start.y || position.y === segment.end.y) {
        modPosition = new Vector2(position.x, position.y + 0.00001);
      }
      if (Functions.between(modPosition.y, segment.start.y, segment.end.y)) {
        const dy = modPosition.y - segment.start.y;
        const t = dy / segment.vector.y;
        let intersect = segment.vector.scale(t);
        intersect = segment.start.add(intersect);
        if (intersect.x > modPosition.x) {
          intersectEven = !intersectEven;
        }
      }
    }
    const dist = Math.sqrt(minSquared);
    if (intersectEven) {
      return dist;
    } else {
      return -dist;
    }
  }
}

class PolySegment {
  readonly vector: Vector2;
  readonly vectorNormal: Vector2;
  readonly length: number;
  constructor(
    readonly previous: Vector2,
    readonly start: Vector2,
    readonly end: Vector2
  ) {
    this.vector = this.end.minus(this.start);
    this.vectorNormal = this.vector.normalize();
    this.length = this.vector.magnitude;
  }
}
