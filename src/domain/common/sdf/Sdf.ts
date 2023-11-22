import { Vector } from "../Vector";
import { Vector2 } from "../Vector2";
import { SignedDistanceFunction, SignedDistanceFunction2d } from "../Abstractions";


export class UnionSdf2 implements SignedDistanceFunction2d {
  constructor(
    private sdf1: SignedDistanceFunction2d,
    private sdf2: SignedDistanceFunction2d
  ) { }
  distance(position: Vector2): number {
    return Math.min(this.sdf1.distance(position), this.sdf2.distance(position));
  }
}

export class XPlaneSdf implements SignedDistanceFunction {
  constructor(private readonly x: number) { }

  distance(position: Vector): number {
    return -position.x + this.x;
  }
}

export class YPlaneSdf implements SignedDistanceFunction {
  constructor(private readonly y: number) { }

  distance(position: Vector): number {
    return -position.y + this.y;
  }
}

export class ZPlaneSdf implements SignedDistanceFunction {
  constructor(private readonly z: number) { }

  distance(position: Vector): number {
    return -position.z + this.z;
  }
}

export class RevolutionSdf implements SignedDistanceFunction {
  constructor(private profile: SignedDistanceFunction2d) {}

  distance(position: Vector): number {
    const v2d = new Vector2(position.xz.magnitude, position.y);
    return this.profile.distance(v2d);
  }
}

class InsideOffsetSdf2e implements SignedDistanceFunction2d {
  constructor(private sdf: SignedDistanceFunction2d, private offset: number) {}
  distance(position: Vector2): number {
    const a = this.sdf.distance(position);
    const b = -a - this.offset;
    return Math.max(a, b);
  }
}
