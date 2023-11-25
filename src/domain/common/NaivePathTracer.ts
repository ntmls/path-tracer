import { RayMarchResult } from "../../infrastructure/implementation";
import { Random, RayTracer } from "./Abstractions";
import { Ray } from "./Ray";
import { RayMarcher } from "./RayMarcher";
import { RgbColor } from "./RgbColor";
import { Scene } from "./SceneDefinition/Scene";
import { Vector } from "./Vector";
import { HemisphereSurfaceSampler } from "./sampling/HemisphereSurfaceSampler";

export class NaivePathTracer implements RayTracer {
  private hemisphereArea = 2 * Math.PI;
  private hemispherePdf = 1 / (2 * Math.PI);
  private oneOverPi = 1 / Math.PI;

  constructor(
    private rayMarcher: RayMarcher,
    private hemisphereSampler: HemisphereSurfaceSampler,
    private random: Random
  ) {}

  traceRay(ray: Ray, scene: Scene): RgbColor {
    return this.tracePath(ray, scene, 0, false);
  }

  private tracePath(
    ray: Ray,
    scene: Scene,
    depth: number,
    wasSpecular: boolean
  ): RgbColor {
    const hitInfo = this.rayMarcher.marchRay(scene.objects, ray);
    if (!(hitInfo.wasHit && hitInfo.hitObject)) {
      return scene.backgroundColor;
    }

    // if it is a light return the light
    const material = hitInfo.hitObject.material;
    if (!material.emission.equals(RgbColor.black)) {
      return material.emission;
    }

    // max bounces
    const probNewRay = material.albedo.maxComponent();
    if (this.random.random() > probNewRay) {
      // terminate
      return RgbColor.black;
    }

    // back up a little
    const nextPosition = hitInfo.hitAt.add(ray.direction.scale(-0.01));

    // let directLight = RgbColor.black;

    /*
    if (material.reflect) {
      const reflectDirection = ray.direction.reflect(hitInfo.normal);
      const reflectRay = new Ray(nextPosition, reflectDirection);
      return this.tracePath(reflectRay, scene, depth + 1, throughput, true);
    } else {
      // DIRECT - Sample lights directly
      directLight = this.calculateDirect(scene, nextPosition, hitInfo);
    }
    */

    // INDIRECT = get incoming light incomingLight
    const newDirection = this.hemisphereSampler.sample(hitInfo.normal);
    const newRay = new Ray(nextPosition, newDirection);
    const cos = newRay.direction.dot(hitInfo.normal);
    /* testing - this should never happens
      if (cos < 0) {
        throw new Error("Unexpected, wrong side of hemisphere.");
      }
      */
    const incomingLight = this.tracePath(newRay, scene, depth + 1, false);
    const brdf = material.albedo.divideScalar(Math.PI); // Energy conservation
    const indirect = incomingLight
      .multiply(brdf)
      .scale(cos)
      .divideScalar(this.hemispherePdf * probNewRay);

    // COMBINED
    return indirect;
  }

  private calculateDirect(
    scene: Scene,
    nextPosition: Vector,
    hitInfo: RayMarchResult
  ) {
    const lightIndex = Math.floor(
      this.random.random() * scene.directLights.length
    );
    const light = scene.directLights[lightIndex];
    let direct: RgbColor;
    if (light) {
      const sample = light.sample(nextPosition);
      const directResult = this.rayMarcher.marchRay(scene.objects, sample.ray);
      let directLightColor: RgbColor;
      if (
        // if we hit the light
        directResult.wasHit &&
        directResult.hitObject === light.visibleObject &&
        directResult.hitObject.material.emission
      ) {
        // TODO: add isEmissive to avoid null color.
        directLightColor = directResult.hitObject.material.emission;
      } else {
        directLightColor = RgbColor.black;
      }
      const directCos = sample.ray.direction.dot(hitInfo.normal);
      const intensity =
        sample.visibleArea / (sample.distance * sample.distance);
      direct = directLightColor.scale(directCos * intensity);
    } else {
      direct = RgbColor.black;
    }
    return direct;
  }
}
