import { Vector } from "./Vector";

export class Vector2 {
  constructor(readonly x: number, readonly y: number) {}
  
  /*
  asFloat32(): Vector2 {
    return new Vector2(Math.fround(this.x), Math.fround(this.y));
  }
  assertFloat32(): void {
    const compare = this.asFloat32();
    if (!this.equals(compare)) {
      throw new Error("Expected this Vector2 to be float32 but found it is float64.")
    }
  }
  */ 
  get magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }
  scale(amount: number): Vector2 {
    return new Vector2(this.x * amount, this.y * amount);
  }
  negate(): Vector2 {
    return new Vector2(-this.x, -this.y);
  }
  normalize(): Vector2 {
    const l = this.magnitude;
    return new Vector2(this.x / l, this.y / l);
  }
  distanceFrom(other: Vector2): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  distanceSquaredFrom(other: Vector2): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return dx * dx + dy * dy;
  }
  minus(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }
  dot(other: Vector2): number {
    return this.x * other.x + this.y * other.y;
  }
  move(x: number, y: number): Vector2 {
    return new Vector2(this.x + x, this.y + y);
  }
  moveUp(y: number): Vector2 {
    return new Vector2(this.x, this.y + y);
  }
  moveLeft(x: number): Vector2 {
    return new Vector2(this.x - x, this.y);
  }
  moveDown(y: number): Vector2 {
    return new Vector2(this.x, this.y - y);
  }
  moveRight(x: number): Vector2 {
    return new Vector2(this.x + x, this.y);
  }
  equals(other: Vector2): boolean {
    if (this.x !== other.x) return false;
    if (this.y !== other.y) return false;
    return true;
  }
  to3d(z: number) {
    return new Vector(this.x, this.y, z);
  }
}
