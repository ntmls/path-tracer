import {
  BottleBodyProfileSdf,
  BottleCapProfile,
  BottleNeck,
} from "../domain/BottleSceneBuilder";
import {
  SceneBuilder,
  Sensor,
  SignedDistanceFunction2d,
} from "../domain/common/Abstractions";
import { Scene } from "../domain/common/SceneDefinition/Scene";
import { UnionSdf2 } from "../domain/common/sdf/Sdf";
import { MultiCoreEvents } from "../infrastructure/CanvasSensorMultiCore";
import { View } from "./View";

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

  cellRendered(
    totalProcessingTime: number,
    totalElapsedTime: number,
    averageCellLProcessTime: number
  ): void {
    this.view.updateRenderStatistics(
      totalProcessingTime,
      totalElapsedTime,
      averageCellLProcessTime
    );
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
