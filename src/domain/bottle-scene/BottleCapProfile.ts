import { Vector2 } from "../common/Vector2";
import { SignedDistanceFunction2d } from "../common/Abstractions";
import { Polygon } from "../common/Polygon";

export class BottleCapProfile implements SignedDistanceFunction2d {
  private polygon = new Polygon();
  constructor() {
    let current = new Vector2(0, 0);
    current = current.move(0.4, 4.6);
    this.polygon.add(current);
    current = current.moveRight(0.1);
    this.polygon.add(current);
    current = current.moveUp(0.5);
    this.polygon.add(current);
    current = current.moveLeft(0.2);
    this.polygon.add(current);
    current = current.moveUp(0.2);
    this.polygon.add(current);
    current = current.moveLeft(0.2);
    this.polygon.add(current);
    current = current.moveUp(0.5);
    this.polygon.add(current);

    current = current.moveUp(0.1).moveRight(0.3);
    this.polygon.add(current);

    current = current.moveUp(0.25);
    this.polygon.add(current);

    current = current.moveUp(0.05).moveLeft(0.05);
    this.polygon.add(current);

    current = current.moveLeft(0.35);
    this.polygon.add(current);

    current = current.moveDown(1.2);
    this.polygon.add(current);

    current = current.moveRight(0.4);
    this.polygon.add(current);

    this.polygon.preCompute();
    
  }

  distance(position: Vector2): number {
    return this.polygon.distance(position);
  }
}
