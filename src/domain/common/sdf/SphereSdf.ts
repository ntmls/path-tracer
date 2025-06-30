import { Vector } from "../Vector";
import { SignedDistanceFunction } from "../Abstractions";

export class SphereSdf implements SignedDistanceFunction {
  private readonly lx: number;
  private readonly ly: number;
  private readonly lz: number;

  constructor(readonly location: Vector, readonly radius: number) {
    this.lx = location.x;
    this.ly = location.y;
    this.lz = location.z;
  }

  distance(px: number, py: number, pz: number): number {
    const dx = px - this.lx;
    const dy = py - this.ly;
    const dz = pz - this.lz;
    return Math.sqrt(dx * dx + dy * dy + dz * dz) - this.radius;
  }
}
