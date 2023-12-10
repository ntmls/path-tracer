import { Bounds, SceneObject, SphereBounds, Unbounded } from "./SceneObject";
import {
  DirectLight,
  LightFactory,
  LightObject,
  SignedDistanceFunction,
} from "../Abstractions";
import { RgbColor } from "../RgbColor";
import { Material } from "../Material";
import { Vector } from "../Vector";
import { SphereSdf } from "../sdf/SphereSdf";

export class Scene {
  constructor(
    private readonly lightFactory: LightFactory,
    readonly backgroundColor: RgbColor
  ) {}

  private _objects: SceneObject[] = [];
  private _directLights: LightObject[] = [];

  get objects(): readonly SceneObject[] {
    return this._objects;
  }
  get directLights(): readonly LightObject[] {
    return this._directLights;
  }
  addObject(
    name: string,
    sdf: SignedDistanceFunction,
    material: Material, 
    bounds: Bounds = new Unbounded()
  ): SceneObject {
    const index = this.objects.length;
    const obj = new SceneObject(index, name, sdf, material, bounds);
    this._objects.push(obj);
    return obj;
  }

  addSphericalLight(
    name: string,
    position: Vector,
    radius: number,
    color: RgbColor,
    isDirectLightSource = true
  ) {
    const sdf = new SphereSdf(position, radius);
    const material = new Material(color, color);
    material.isDirectlySampledLight = isDirectLightSource;
    const visibleObject = this.addObject(name, sdf, material);
    if (isDirectLightSource) {
      const light = this.lightFactory.sphereLight(
        position,
        radius,
        color,
        visibleObject
      );
      this._directLights.push(light);
    }
  }
}
