import { UnitSphereSurfaceSampler } from "./UnitSphereSurfaceSampler";
import { Vector } from "../Vector";


export class HemisphereSurfaceSampler {
  constructor(private sphereSamples: UnitSphereSurfaceSampler) { }
  sample(normal: Vector): Vector {
    const sample = this.sphereSamples.sample();
    const dot = sample.dot(normal);
    if (dot < 0) {
      return sample.negate();
    }
    return sample;
  }
}
