import { Camera, Sensor } from "../Abstractions";
import { Ray } from "../Ray";
import { Vector } from "../Vector";
import { Vector2 } from "../Vector2";
import { OrthoBasis } from "./OrthoBasis";

export class Film35mmCamera implements Camera {
  private readonly filmSizeMillimeters: Vector2;
  private readonly filmSizeInches: Vector2;
  private readonly sensorCenter: Vector2;
  private pixels: Vector2;
  private pixelsPerMillimeter: number;
  private pixelsPerInch: number;
  private cameraBasis: OrthoBasis;
  private sensor: Sensor;
  private sensorScale: number;
  private readonly focalLengthInches: number;

  constructor(
    private origin: Vector,
    private lookAt: Vector,
    private up: Vector,
    private readonly megaPixels: number, 
    private readonly focalLengthMillimeters: number
  ) {
    this.filmSizeMillimeters = new Vector2(36, 24);
    this.filmSizeInches = this.filmSizeMillimeters.scale(1 / 25.4);
    this.focalLengthInches = this.focalLengthMillimeters * (1 /  25.4); 
    this.calcSensor(megaPixels);
    this.cameraBasis = OrthoBasis.fromLookAt(origin, lookAt, up);
    this.sensorCenter = this.pixels.scale(.5); 
    this.sensorScale = 1 / this.pixelsPerInch;
  }

  generateRay(x: number, y: number): Ray {
    const input = new Vector2(x, y);
    const sensorPosition = input.minus(this.sensorCenter).scale(this.sensorScale).to3d(this.focalLengthInches);
    const direction = this.cameraBasis.project(sensorPosition).normalize();
    return new Ray(this.origin, direction);
  }

  initializeSensor(sensor: Sensor): void {
    if (!sensor) throw new Error("Expected 'sensor' to be defined.");
    sensor.setSize(this.pixels.x, this.pixels.y); 
    this.sensor = sensor;
  }

  private calcSensor(megaPixels: number) {
    /*
    // given ration
    r = 36/24

    // two equations
    w / h = r
    w * h = m

    // solve for w using first equation
    w = r * h

    // substitute into second equation
    (r * h) * h = m
    r * h * h = m
    r * h^2 = m
     h^2 = m / r
    h = sqrt (m / r)

    // solve for w
     w = r * h

    */
    const ratio = this.filmSizeMillimeters.x / this.filmSizeMillimeters.y;
    const h = Math.sqrt((megaPixels * 1000000) / ratio);
    const w = ratio * h;

    this.pixels = new Vector2(Math.floor(w), Math.floor(h));
    this.pixelsPerMillimeter = this.pixels.x / this.filmSizeMillimeters.x;
    this.pixelsPerInch = this.pixelsPerMillimeter * 25.4;
  }

}


