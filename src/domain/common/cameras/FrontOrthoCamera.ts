import { Vector } from "../Vector";
import { Camera, Sensor } from "../Abstractions";
import { Ray } from "../Ray";


export class FrontOrthoCamera implements Camera {
  private halfWidth = 0;
  private halfHeight = 0;

  constructor(
    private sensorWidth: number,
    private sensorHeight: number,
    private pixelsPerUnit: number,
    private xOffset = 0,
    private yOffset = 0,
    private zStart = -10
  ) {
    this.preCalculate();
  }
  
  initializeSensor(sensor: Sensor): void {
    // throw new Error("Method not implemented.");
  }

  generateRay(x: number, y: number): Ray {
    const position = new Vector(
      this.xOffset + (x - this.halfWidth) / this.pixelsPerUnit,
      this.yOffset + -(y - this.halfHeight) / this.pixelsPerUnit,
      this.zStart
    );
    const direction = new Vector(0, 0, 1);
    return new Ray(position, direction);
  }

  private changeSize(width: number, height: number) {
    this.sensorWidth = width;
    this.sensorHeight = height;
    this.preCalculate();
  }

  private preCalculate(): void {
    this.halfHeight = this.sensorHeight / 2;
    this.halfWidth = this.sensorWidth / 2;
  }
}
