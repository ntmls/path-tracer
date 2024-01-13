import {
  BottleBodyProfileSdf,
  BottleNeck,
  BottleCapProfile,
  BottleCapSpout as BottleCapSpout,
  SdfXY,
} from "../domain/BottleSceneBuilder";
import {
  SceneBuilder,
  Sensor,
  SignedDistanceFunction2d,
} from "../domain/common/Abstractions";
import { Scene } from "../domain/common/SceneDefinition/Scene";
import { UnionSdf2 } from "../domain/common/sdf/Sdf";
import {
  CellRenderedData,
  MultiCoreEvents,
} from "../infrastructure/nulticore/CanvasSensorMultiCore";
import { View } from "./View";
import { BoundsEstimator } from "../domain/common/BoundsEstimtor";
import { Vector2 } from "../domain/common/Vector2";

export class Presenter implements MultiCoreEvents {
  private view: View;
  private profiles: ProfileViewModel[] = [];
  private scene: Scene;

  constructor(
    private sceneBuilder: SceneBuilder,
    private compositionSensor: Sensor,
    private finalRenderSensor: Sensor
  ) {
    this.scene = this.sceneBuilder.build();
  }

  initialize() {
    this.displayComposition();

    let bottleProfile: SignedDistanceFunction2d = new BottleBodyProfileSdf();
    let bottleNeck: SignedDistanceFunction2d = new BottleNeck();

    bottleProfile = new UnionSdf2(bottleProfile, bottleNeck);
    this.profiles.push(
      new ProfileViewModel(bottleProfile, "Bottle - Body", 0, 1.75, 75)
    );

    let bottleCapSdf = new BottleCapProfile();
    this.profiles.push(
      new ProfileViewModel(bottleCapSdf, "Bottle - Cap", 0, 4, 75)
    );

    let bottleSpoutSdf = new SdfXY(new BottleCapSpout());
    this.profiles.push(
      new ProfileViewModel(bottleSpoutSdf, "Bottle - Spout", 0, 6, 75)
    );

    let displacementProfile = new TileDisplacement();
    this.profiles.push(
      new ProfileViewModel(displacementProfile, "Displacement", 0, 0, 50)
    );
  }

  displayProfiles(): void {
    this.view.hideComposition();
    this.view.hideFinalRender();
    this.view.populateProfileSelection(this.profiles.map((x) => x.name));
    this.view.visualize2dSdf(this.profiles[0]);
    this.view.showProfiles();
  }

  displayComposition(): void {
    this.view.hideProfiles();
    this.view.hideFinalRender();
    this.compositionSensor.takePicture(this.scene);
    this.view.showComposition();
    const sceneViewObjectsModel = this.buildSceneViewModel(this.scene);
    this.view.displaySceneObjects(sceneViewObjectsModel);
  }

  displayFinalRender(): void {
    this.view.hideProfiles();
    this.view.hideComposition();
    this.view.showFinalRender();
  }

  selectProfile(name: string): void {
    const profileViewModel = this.profiles.find((x) => x.name === name);
    if (!profileViewModel)
      throw new Error(`Profile with id '${name}' not found`);
    this.view.visualize2dSdf(profileViewModel);
  }

  renderFinalImage(): void {
    this.finalRenderSensor.takePicture(this.scene);
  }

  registerViews(view: View): void {
    this.view = view;
  }

  cellRendered(data: CellRenderedData): void {
    this.view.updateRenderStatistics(data);
  }

  estimateBounds(item: sceneObjectViewModel): void {
    const estimator = new BoundsEstimator();
    const obj = this.scene.objects[item.index];
    const bounds = estimator.estimate(obj.sdf);
  }

  private buildSceneViewModel(scene: Scene): sceneObjectsViewModel {
    const viewModel = new sceneObjectsViewModel();
    const len = scene.objects.length;
    for (const obj of scene.objects) {
      const item = new sceneObjectViewModel();
      item.index = obj.index;
      item.name = obj.name;
      item.type = obj.sdf.constructor.name;
      viewModel.items.push(item);
    }
    return viewModel;
  }
}

export class ProfileViewModel {
  constructor(
    readonly sdf: SignedDistanceFunction2d,
    readonly name: string,
    readonly xOffset: number,
    readonly yOffset: number,
    readonly pixelsPerUnit: number
  ) {}
}

export class sceneObjectsViewModel {
  items: sceneObjectViewModel[] = [];
}

export class sceneObjectViewModel {
  index = 0;
  type = "";
  name = "";
}

export class TileDisplacement implements SignedDistanceFunction2d {
  private _size = 2.5;
  distance(position: Vector2): number {
    return position.y - this.saw(this._size, position.x);
  }
  private saw(size: number, x: number): number {
    const slope = x / size;
    const index = Math.round(slope);
    const frac = -Math.abs(size * (slope - index)) + 0.5 * size;
    return frac;
  }
}
