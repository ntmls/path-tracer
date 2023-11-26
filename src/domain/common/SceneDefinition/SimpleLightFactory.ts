import { RgbColor } from "../RgbColor";
import { Vector } from "../Vector";
import { UnitSphereSurfaceSampler } from "../sampling/UnitSphereSurfaceSampler";
import { LightFactory, LightObject, LightSample } from "../Abstractions";
import { Material } from "../Material";
import { Ray } from "../Ray";
import { SceneObject } from "./SceneObject";
import { SphereSdf } from "../sdf/SphereSdf";

export class SimpleLightFactory implements LightFactory {
  constructor(
    private readonly unitSphereSurfaceSampler: UnitSphereSurfaceSampler
  ) {}

  sphereLight(
    position: Vector,
    radius: number,
    color: RgbColor,
    visibleObject: SceneObject
  ): LightObject {
    return new SphereLight(
      this.unitSphereSurfaceSampler,
      position,
      radius,
      color,
      visibleObject
    );
  }
}

class SphereLight implements LightObject {
  private _visitableObject: SceneObject;
  isDirectlySampled = false;
  private _visibleArea: number;
  constructor(
    private sphereSampler: UnitSphereSurfaceSampler,
    private readonly position: Vector,
    private readonly radius: number,
    private readonly color: RgbColor,
    visibleObject: SceneObject
  ) {
    this._visitableObject = visibleObject;
    this._visibleArea = radius * radius * Math.PI;
  }
  sample(from: Vector): LightSample {
    const pointOnSphere = this.sphereSampler
      .sample()
      .scale(this.radius)
      .add(this.position);
    const direction = pointOnSphere.minus(from).normalize();
    return new LightSample(
      new Ray(from, direction),
      from.distanceFrom(this.position),
      this._visibleArea
    );
  }
  
  get visibleObject(): SceneObject {
    return this._visitableObject;
  }
}
