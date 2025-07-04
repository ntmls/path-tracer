import { Vector } from "../common/Vector";
import {
  SignedDistanceFunction2d,
  SceneBuilder,
  LightFactory,
} from "../common/Abstractions";
import {
  RevolutionSdf,
  UnionSdf2,
  XPlaneSdf,
  YPlaneSdf,
  ZPlaneSdf,
} from "../common/sdf/Sdf";
import { Material } from "../common/Material";
import { RgbColor } from "../common/RgbColor";
import { Scene } from "../common/SceneDefinition/Scene";
import { SphereBounds } from "../common/bounds/SphereBounds";
import { Kelvin } from "../common/Kelvin";
import { OffsetXSdf } from "./OffsetXSdf";
import { OffsetYSdf } from "./OffsetYSdf";
import { BottleBodyProfileSdf } from "./BottleBodyProfileSdf";
import { BottleNeck } from "./BottleNeck";
import { BottleCapProfile } from "./BottleCapProfile";
import { BottleCapSpout } from "./BottleCapSpout";
import { TileBackgroundSdf } from "./TileBackgroundSdf";
import { RoundedBox } from "./RoundedBox";
import { FastBoxSdf } from "../common/sdf/FasBoxSdf";
import { FastEstimateSdf } from "../common/sdf/FastEstimateSdf";

export class BottleSceneBuilder implements SceneBuilder {
  constructor(private readonly lightFactory: LightFactory) {}

  build(): Scene {
    const backgroundColor = Kelvin.k8000.scale(2);
    const scene = new Scene(this.lightFactory, backgroundColor);
    this.buildKeyLight(scene);
    this.buildRoom(backgroundColor, scene);
    this.buildTileWall(scene);
    this.buildBottles(scene);
    return scene;
  }

  private buildBottles(scene: Scene) {
    this.buildBottle(scene, -3.25);
    this.buildBottle(scene, 0);
    this.buildBottle(scene, 3.25);
  }

  private buildKeyLight(scene: Scene) {
    const lightPosition = new Vector(-40, 10.0, -80);
    const lightRadius = 10;
    const lightColor = Kelvin.k4000.scale(25);
    scene.addSphericalLight(
      "Sphirical Light",
      lightPosition,
      lightRadius,
      lightColor,
      true
    );
  }

  private buildRoom(backgroundColor: RgbColor, scene: Scene) {
    const windowMaterial = new Material(RgbColor.black, backgroundColor);
    const roomMaterial = new Material(
      new RgbColor(0.85, 0.85, 0.85),
      RgbColor.black
    );

    // room
    const back = new ZPlaneSdf(-122, 4);
    const right = new XPlaneSdf(62, 4);
    const left = new XPlaneSdf(-62, 4);
    const ceil = new YPlaneSdf(4 * 12 + 2, 4);
    const floor = new YPlaneSdf(-4 * 12 + 2, 4);
    scene.addObject("Plane behind camera", back, roomMaterial);
    scene.addObject("Plane left of camera", left, roomMaterial);
    scene.addObject("Plane right of camera", right, windowMaterial);
    scene.addObject("Ceiling", ceil, roomMaterial);
    scene.addObject("Floor", floor, roomMaterial);
  }

  private buildTileWall(scene: Scene) {
    const tileMaterial = new Material(
      new RgbColor(0.9, 0.9, 0.9),
      RgbColor.black,
      0.8,
      0.025
    );

    // build the back plane
    const tileWallSdf = new TileBackgroundSdf(4, 4);
    scene.addObject("Tile Wall", tileWallSdf, tileMaterial);

    // shelf
    const rawShelfSdf = new RoundedBox(11, 0.5, 6, 0.25);
    // const fastShelfSdf = new FastBoxSdf(11, 0.5, 6,); 
    // const approxShelfSdf = new FastEstimateSdf(fastShelfSdf, rawShelfSdf, 0.01);
    // const shelfSdf = new OffsetYSdf(-.25, approxShelfSdf);
    const shelfSdf = new OffsetYSdf(-.25, rawShelfSdf);
    const shelfBounds = new SphereBounds(new Vector(0.017, -0.25, 0), 6.2);
     scene.addObject("Shelf", shelfSdf, tileMaterial, shelfBounds);
  }

  private buildBottle(scene: Scene, offsetX: number) {
    const bottleMaterial = new Material(
      new RgbColor(0.9, 0.9, 0.9),
      RgbColor.black,
      0.4,
      0.5
    );
    const bottleCapMaterial = new Material(
      new RgbColor(0.1, 0.1, 0.1),
      RgbColor.black,
      0.5
    );

    // build the bottle body
    let bottleProfile: SignedDistanceFunction2d = new BottleBodyProfileSdf();
    let bottleNeck: SignedDistanceFunction2d = new BottleNeck();
    bottleProfile = new UnionSdf2(bottleProfile, bottleNeck);
    const bottleBodySdf = new OffsetXSdf(
      offsetX,
      new RevolutionSdf(bottleProfile)
    );
    const bottleBodyBounds = new SphereBounds(new Vector(offsetX, 2.5, 0), 2.7);
    scene.addObject(
      "Bottle Body",
      bottleBodySdf,
      bottleMaterial,
      bottleBodyBounds
    );

    // bottle cap
    let bottleCapProfile = new BottleCapProfile();
    const bottleCapSdf = new OffsetXSdf(
      offsetX,
      new RevolutionSdf(bottleCapProfile)
    );
    const bottleCapBounds = new SphereBounds(new Vector(offsetX, 5.4, 0), 1);
    scene.addObject(
      "Bottle Cap",
      bottleCapSdf,
      bottleCapMaterial,
      bottleCapBounds
    );

    // bottle cap spout
    let bottleCapSpout = new OffsetXSdf(offsetX, new BottleCapSpout());
    const bottleCapSpoutBounds = new SphereBounds(
      new Vector(0.752 + offsetX, 5.984, 0),
      0.87
    );
    scene.addObject(
      "Bottle Cap Spout",
      bottleCapSpout,
      bottleCapMaterial,
      bottleCapSpoutBounds
    );
  }
}
