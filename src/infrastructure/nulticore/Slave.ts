import { Camera, SceneBuilder } from "../../domain/common/Abstractions";
import { CellSensor } from "./CellSensor";

export class Slave {
  constructor(
    readonly camera: Camera,
    readonly sensor: CellSensor,
    readonly sceneBuilder: SceneBuilder
  ) {}
}
