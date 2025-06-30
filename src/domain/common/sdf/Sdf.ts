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
  distance(px: number, py: number): number {
    return Math.min(this.sdf1.distance(px, py), this.sdf2.distance(px, py));
  }
}

export class XPlaneSdf implements SignedDistanceFunction {
  private readonly halfThickness: number;
  constructor(private readonly x: number, private readonly thickness: number) {
    this.halfThickness = thickness / 2;
  }

  distance(px: number, py: number, pz: number): number {
    return Math.abs(px - this.x) - this.halfThickness;
  }
}

export class YPlaneSdf implements SignedDistanceFunction {
  private readonly halfThickness: number;
  constructor(private readonly y: number, private readonly thickness: number) {
    this.halfThickness = thickness / 2;
  }

  distance(px: number, py: number, pz: number): number {
    return Math.abs(py - this.y) - this.halfThickness;
  }
}

export class ZPlaneSdf implements SignedDistanceFunction {
  private readonly halfThickness: number;
  constructor(private readonly z: number, private readonly thickness: number) {
    this.halfThickness = thickness / 2;
  }

  distance(px: number, py: number, pz: number): number {
    return Math.abs(pz - this.z) - this.halfThickness;
  }
}

export class RevolutionSdf implements SignedDistanceFunction {
  constructor(private profile: SignedDistanceFunction2d) {}

  distance(px: number, py: number, pz: number): number {
    const xzMagnitude = Math.sqrt(px * px + pz * pz);
    return this.profile.distance(xzMagnitude, py);
  }
}

class InsideOffsetSdf2e implements SignedDistanceFunction2d {
  constructor(private sdf: SignedDistanceFunction2d, private offset: number) {}
  distance(px: number, py: number): number {
    const a = this.sdf.distance(px, py);
    const b = -a - this.offset;
    return Math.max(a, b);
  }
}
