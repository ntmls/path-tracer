import { Ray } from "../Ray";
import { Bounds } from "./Bounds";

export class Unbounded implements Bounds {
  inBounds(ray: Ray): boolean {
    return true;
  }
}
