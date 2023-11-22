import { RgbColor } from "./RgbColor";

export class Material {
  private _isDirectlySampled = false;
  get isDirectlySampledLight(): boolean {
    return this._isDirectlySampled;
  }
  set isDirectlySampledLight(value: boolean) {
    if (this.isDirectlySampledLight && !value) {
      throw new Error("Cannot change 'isDirectlySampled' back to false once it is set.");
    }
    this._isDirectlySampled = value;
  }

  constructor(
    readonly albedo: RgbColor,
    readonly emission: RgbColor, 
    readonly specularAmount = 0.0, 
    readonly glossyAmount = 0.0
  ) {}
}
