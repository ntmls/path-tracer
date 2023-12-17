import { Vector } from "./common/Vector";
import { Vector2 } from "./common/Vector2";
import {
  SignedDistanceFunction2d,
  SceneBuilder,
  LightFactory,
  SignedDistanceFunction,
} from "./common/Abstractions";
import { Polygon } from "./common/Polygon";
import { RevolutionSdf, UnionSdf2, ZPlaneSdf } from "./common/sdf/Sdf";
import { Functions } from "./common/Functions";
import { Material } from "./common/Material";
import { RgbColor } from "./common/RgbColor";
import { Scene } from "./common/SceneDefinition/Scene";
import { SphereBounds } from "./common/bounds/SphereBounds";

export class BottleSceneBuilder implements SceneBuilder {
  constructor(private readonly lightFactory: LightFactory) {}
  build(): Scene {
    const backgroundColor = new RgbColor(0.17, 0.23, 0.24);
    const scene = new Scene(this.lightFactory, backgroundColor);

    const bottleMaterial = new Material(
      new RgbColor(0.9, 0.9, 0.9),
      RgbColor.black,
      0.25,
      0.6
    );
    const bottleCapMaterial = new Material(
      new RgbColor(0.1, 0.1, 0.1),
      RgbColor.black,
      0.5
    );
    const backgroundPlaneMaterial = new Material(
      new RgbColor(0.75, 0.75, 0.75),
      RgbColor.black
    );

    // build the back plane
    const backPlaneSdf = new ZPlaneSdf(2);
    scene.addObject("Back Wall", backPlaneSdf, backgroundPlaneMaterial);

    // build the bottle body
    let bottleProfile: SignedDistanceFunction2d = new BottleBodyProfileSdf();
    let bottleNeck: SignedDistanceFunction2d = new BottleNeck();
    const bottleBodyBounds = new SphereBounds(new Vector(0, 2.5, 0), 2.7);
    bottleProfile = new UnionSdf2(bottleProfile, bottleNeck);
    scene.addObject(
      "Bottle Body",
      new RevolutionSdf(bottleProfile),
      bottleMaterial
    );

    // bottle cap
    let bottleCapProfile = new BottleCapProfile();
    let bottleCap = new RevolutionSdf(bottleCapProfile);
    const bounds = new SphereBounds(new Vector(0, 5.4, 0), 1);
    scene.addObject("Bottle Cap", bottleCap, bottleCapMaterial, bounds);

    let bottleCapSpout = new BottleCapSpout();
    const bottleCapSpoutBounds = new SphereBounds(new Vector(.752, 5.984, 0), .87);
    scene.addObject("Bottle Cap Spout", bottleCapSpout, bottleCapMaterial, bottleCapSpoutBounds);

    // spherical light
    const lightPosition = new Vector(-40, 10.0, -80);
    const lightRadius = 10;
    const lightColor = new RgbColor(55, 53, 48);
    scene.addSphericalLight(
      "Sphirical Light",
      lightPosition,
      lightRadius,
      lightColor
    );
    return scene;
  }
}

export class BottleBodyProfileSdf implements SignedDistanceFunction2d {
  private bottleRadius = 1.5;
  private neckRadius = 0.25;
  private baseRadius = 0.75;
  private bottleHeight = 4.5;

  private l1 = this.bottleRadius - this.baseRadius;
  private l3 = this.bottleRadius - this.neckRadius;
  private l2 = this.bottleHeight + -this.l1 + -this.l3;

  private h1 = 0;
  private h2 = this.h1 + this.l1;
  private h3 = this.h2 + this.l2;
  private h4 = this.h3 + this.l3;

  distance(position: Vector2): number {
    position = new Vector2(Math.abs(position.x), position.y);
    if (position.y < this.h2) {
      if (position.x < this.baseRadius) {
        return this.h1 - position.y;
      } else {
        const tempx = position.x - this.baseRadius;
        const tempy = this.h2 - position.y;
        return Math.sqrt(tempx * tempx + tempy * tempy) - this.l1;
      }
    }
    if (position.y < this.h3) {
      if (position.x > this.bottleRadius) {
        return position.x - this.bottleRadius;
      } else {
        const a = position.x - this.bottleRadius;
        const b = this.h1 - position.y;
        const c = position.y - this.h4;
        return Math.max(Math.max(a, b), c);
      }
    }
    if (position.x < this.neckRadius) {
      return position.y - this.h4;
    } else {
      const tempx = position.x - this.neckRadius;
      const tempy = position.y - this.h3;
      return Math.sqrt(tempx * tempx + tempy * tempy) - this.l3;
    }
  }
}

export class BottleNeck implements SignedDistanceFunction2d {
  distance(position: Vector2): number {
    const xMax = 0.4;
    const xMin = -0.4;
    const yMax = 5;
    const yMin = 3;
    if (Functions.between(position.x, xMin, xMax)) {
      if (Functions.between(position.y, yMin, yMax)) {
        const a = position.x - xMax;
        const b = xMin - position.x;
        const c = position.y - yMax;
        const d = yMin - position.y;
        return Math.max(Math.max(a, b), Math.max(c, d));
      }
    }
    const ref = new Vector2(
      Functions.clamp(position.x, xMin, xMax),
      Functions.clamp(position.y, yMin, yMax)
    );
    return position.distanceFrom(ref);
  }
}

export class BottleCapProfile implements SignedDistanceFunction2d {
  private polygon = new Polygon();
  constructor() {
    let current = new Vector2(0, 0);
    current = current.move(0.4, 4.6);
    this.polygon.add(current);
    current = current.moveRight(0.1);
    this.polygon.add(current);
    current = current.moveUp(0.5);
    this.polygon.add(current);
    current = current.moveLeft(0.2);
    this.polygon.add(current);
    current = current.moveUp(0.2);
    this.polygon.add(current);
    current = current.moveLeft(0.2);
    this.polygon.add(current);
    current = current.moveUp(0.5);
    this.polygon.add(current);

    current = current.moveUp(0.1).moveRight(0.3);
    this.polygon.add(current);

    current = current.moveUp(0.25);
    this.polygon.add(current);

    current = current.moveUp(0.05).moveLeft(0.05);
    this.polygon.add(current);

    current = current.moveLeft(0.35);
    this.polygon.add(current);

    current = current.moveDown(1.2);
    this.polygon.add(current);

    current = current.moveRight(0.4);
    this.polygon.add(current);
  }

  distance(position: Vector2): number {
    return this.polygon.distance(position);
  }
}

export class SdfXY implements SignedDistanceFunction2d {
  constructor(private sdf3d: SignedDistanceFunction) {}
  distance(position: Vector2): number {
    return this.sdf3d.distance(new Vector(position.x, position.y, 0));
  }
}

export class BottleCapSpout implements SignedDistanceFunction {
  private pill1: Pill;
  private pill2: Pill;

  constructor() {
    const yOffset = 6.025;
    const p1 = new Vector(0, yOffset, 0);
    const p2 = new Vector(1.25, yOffset, 0);
    const p3 = new Vector(1.5, yOffset - 0.125, 0);
    this.pill1 = new Pill(p1, p2);
    this.pill2 = new Pill(p2, p3); 
  }
  distance(position: Vector): number {
    const dist1 = this.pill1.distanceSquared(position);
    const dist2 = this.pill2.distanceSquared(position);
    const dist = Math.sqrt(Math.min(dist1, dist2));
    return this.shell(dist, 0.05, 0.025);
  }

  private shell(value: number, radius1: number, radius2: number): number {
    return Math.abs(value - radius1) - radius2;
  }

  /*
  distance(position: Vector2): number {
    const center = new Vector2(1, 1);
    const up = new Vector2(0, 1);
    const vect = position.minus(center).normalize();
    const x = up.dot(vect); // cos
    const y = position.distanceFrom(center) - 1;
    const newPosition = new Vector2(x, Math.abs(y));
    return this.tubeProfile(newPosition);
  }
  */

  private tubeProfile(position: Vector2): number {
    // handle inside
    if (
      position.y < 0.2 &&
      position.y > 0.1 &&
      position.x < 1 &&
      position.x > -1
    ) {
      const v1 = 0.2 - position.y;
      const v2 = position.y - 0.1;
      const v3 = 1 - position.x;
      const v4 = position.x - -1;
      const m1 = Math.min(v1, v2);
      const m2 = Math.min(v3, v4);
      return -Math.min(m1, m2);
    }

    // handle outside
    let x = position.x;
    let y = position.y;

    if (x > 1) x = 1;
    if (x < -1) x = -1;
    if (y > 0.2) y = 0.2;
    if (y < 0.1) y = 0.1;

    const constrained = new Vector2(x, y);
    return position.distanceFrom(constrained);
  }
}

class Pill {
  private readonly vect1: Vector;
  private readonly vect1Norm: Vector;
  private readonly vect1mag: number;

  constructor(readonly start: Vector, readonly end: Vector) {
    this.vect1 = this.end.minus(this.start);
    this.vect1Norm = this.vect1.normalize();
    this.vect1mag = this.vect1.magnitude;
  }

  distanceSquared(position: Vector) {
    const vect2 = position.minus(this.start);
    let time = this.vect1Norm.dot(vect2);
    if (time < 0) {
      time = 0;
    }
    if (time > this.vect1mag) {
      time = this.vect1mag
    }
    const ref = this.vect1Norm.scale(time);
    return ref.distanceSquaredFrom(vect2);
  }
}
