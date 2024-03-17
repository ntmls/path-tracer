import { SdfNormalCalculation } from "./sdf/SdfNormalCalculation";
import { RayMarcher, RayMarcherSettings } from "./RayMarcher";
import { Scene } from "./SceneDefinition/Scene";
import { RayMarcherFactory } from "./RayMarcherFactory";


export class DefaultRayMaregerFactory implements RayMarcherFactory {
  constructor(
    private settings: RayMarcherSettings,
    private normalCalculator: SdfNormalCalculation
  ) { }
  createForScene(scene: Scene): RayMarcher {
    return new RayMarcher(scene, this.settings, this.normalCalculator);
  }
}
