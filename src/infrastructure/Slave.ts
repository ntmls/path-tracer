import { Camera, SceneBuilder } from "../domain/common/Abstractions";
import { RegionSensor } from "./RegionSensor";

export class Slave {
  constructor(
    readonly camera: Camera,
    readonly sensor: RegionSensor,
    readonly sceneBuilder: SceneBuilder
  ) {}
}
