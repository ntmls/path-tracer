import { Ray } from "../Ray";

export interface Bounds {
  inBounds(ray: Ray): boolean;
}
