import { RayMarcher } from "./RayMarcher";
import { Scene } from "./SceneDefinition/Scene";


export interface RayMarcherFactory {
  createForScene(scene: Scene): RayMarcher;
}
