import { Vector } from "../Vector";
import { Vector2 } from "../Vector2";
import {
  SignedDistanceFunction,
  SignedDistanceFunction2d,
} from "../Abstractions";

export class UnionSdf2 implements SignedDistanceFunction2d {
  constructor(
    private sdf1: SignedDistanceFunction2d,
    private sdf2: SignedDistanceFunction2d
  ) {}
  distance(position: Vector2): number {
    return Math.min(this.sdf1.distance(position), this.sdf2.distance(position));
  }
}

export class XPlaneSdf implements SignedDistanceFunction {
  private readonly halfThickness: number;
  constructor(private readonly x: number, private readonly thickness: number) {
    this.halfThickness = thickness / 2;
  }

  distance(position: Vector): number {
    return Math.abs(position.x - this.x) - this.halfThickness;
  }
}

export class YPlaneSdf implements SignedDistanceFunction {
  private readonly halfThickness: number;
  constructor(private readonly y: number, private readonly thickness: number) {
    this.halfThickness = thickness / 2;
  }

  distance(position: Vector): number {
    return Math.abs(position.y - this.y) - this.halfThickness;
  }
}

export class ZPlaneSdf implements SignedDistanceFunction {
  private readonly halfThickness: number;
  constructor(private readonly z: number, private readonly thickness: number) {
    this.halfThickness = thickness / 2;
  }

  distance(position: Vector): number {
    return Math.abs(position.z - this.z) - this.halfThickness;
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
