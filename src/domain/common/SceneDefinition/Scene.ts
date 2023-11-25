import { SceneObject } from "./SceneObject";
import { DirectLight, LightObject } from "../Abstractions";
import { RgbColor } from "../RgbColor";

export class Scene {
  private _objects: SceneObject[] = [];
  private _directLights: LightObject[] = [];
  backgroundColor = RgbColor.black;;

  get objects(): readonly SceneObject[] {
    return this._objects;
  }
  get directLights(): readonly LightObject[] {
    return this._directLights;
  }
  addObject(obj: SceneObject): void {
    this._objects.push(obj);
  }
  addDirectLight(light: LightObject): void {
    light.visibleObject.material.isDirectlySampledLight = true;
    this._directLights.push(light);
  }
}
