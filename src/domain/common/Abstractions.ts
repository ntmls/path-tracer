import { Ray } from "./Ray";
import { RgbColor } from "./RgbColor";
import { Scene } from "./SceneDefinition/Scene";
import { SceneObject } from "./SceneDefinition/SceneObject";
import { Vector } from "./Vector";
import { Vector2 } from "./Vector2";

export interface Sensor {
  setSize(width: number, height: number): void;
  takePicture(scene: Scene): Promise<void>;
}

export interface Camera {
  generateRay(x: number, y: number): Ray;
  initializeSensor(sensor: Sensor): void;
}

export interface SignedDistanceFunction2d {
  distance(position: Vector2): number;
}

export interface SignedDistanceFunction {
  distance(position: Vector): number;
}

export interface SceneBuilder {
  build(): Scene;
}

export interface Random {
  random(): number;
  between(min: number, max: number): number;
}

export interface RayTracer {
  traceRay(ray: Ray, scene: Scene): RgbColor;
}

export interface DirectLight {
  sample(from: Vector): LightSample;
}

export class LightSample {
  constructor(
    readonly ray: Ray,
    readonly distance: number,
    readonly visibleArea: number
  ) {}
}

export interface LightObject extends DirectLight {
  get visibleObject(): SceneObject;
}

export interface LightFactory {
  sphereLight(position: Vector, radius: number, color: RgbColor): LightObject;
}

export enum Units {
  Millimeters = 0,
  Inches = 1,
}