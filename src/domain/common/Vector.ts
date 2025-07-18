import { Vector2 } from "./Vector2";

export class Vector {
  constructor(readonly x: number, readonly y: number, readonly z: number) {}
  /*
  asFloat32() {
    return new Vector(
      Math.fround(this.x),
      Math.fround(this.y),
      Math.fround(this.z)
    );
  }
  assertFloat32(): void {
    const compare = this.asFloat32();
    if (!this.equals(compare)) {
      throw new Error(
        "Expected this Vector3 to be float32 but found it is float64."
      );
    }
  }
  */
  get magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  get xz(): Vector2 {
    return new Vector2(this.x, this.z);
  }
  add(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y, this.z + other.z);
  }
  scale(amount: number): Vector {
    return new Vector(this.x * amount, this.y * amount, this.z * amount);
  }
  negate(): Vector {
    return new Vector(-this.x, -this.y, -this.z);
  }
  abs(): Vector {
    return new Vector(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
  }
  maxComponent(): number {
    return Math.max(Math.max(this.x, this.y), this.z);
  }
  minComponent(): number {
    return Math.min(Math.min(this.x, this.y), this.z);
  }
  normalize(): Vector {
    const l = this.magnitude;
    return new Vector(this.x / l, this.y / l, this.z / l);
  }
  distanceFrom(other: Vector): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const dz = this.z - other.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  distanceSquaredFrom(other: Vector): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const dz = this.z - other.z;
    return dx * dx + dy * dy + dz * dz;
  }
  minus(other: Vector): Vector {
    return new Vector(this.x - other.x, this.y - other.y, this.z - other.z);
  }
  dot(other: Vector): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }
  cross(other: Vector): Vector {
    return new Vector(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }
  move(x: number, y: number, z: number): Vector {
    return new Vector(this.x + x, this.y + y, this.z + z);
  }
  reflect(normal: Vector) {
    const b = this.dot(normal);
    const x = normal.scale(2 * b);
    return this.minus(x);
  }
  lerp(amount: number, other: Vector): Vector {
    const invert = 1 - amount;
    return new Vector(
      this.x * amount + other.x * invert,
      this.y * amount + other.y * invert,
      this.z * amount + other.z * invert
    );
  }
  equals(other: Vector): boolean {
    if (this.x !== other.x) return false;
    if (this.y !== other.y) return false;
    if (this.z !== other.z) return false;
    return true;
  }

  static zero = new Vector(0, 0, 0);
}
