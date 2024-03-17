import { RayMarchResult } from "../../infrastructure/implementation";
import { Random, RayTracer } from "./Abstractions";
import { Functions } from "./Functions";
import { Material } from "./Material";
import { Ray } from "./Ray";
import { RayMarcher } from "./RayMarcher";
import { RgbColor } from "./RgbColor";
import { Scene } from "./SceneDefinition/Scene";
import { Vector } from "./Vector";
import { HemisphereSurfaceSampler } from "./sampling/HemisphereSurfaceSampler";

export class DirectLightPathTracer implements RayTracer {
  private hemisphereArea = 2 * Math.PI;
  private hemispherePdf = 1 / (2 * Math.PI);
  private oneOverPi = 1 / Math.PI;

  constructor(
    private scene: Scene, 
    private rayMarcher: RayMarcher,
    private hemisphereSampler: HemisphereSurfaceSampler,
    private random: Random
  ) {}

  traceRay(ray: Ray): RgbColor {
    return this.tracePath(ray, 0, false);
  }

  private tracePath(
    ray: Ray,
    depth: number,
    containedSpecular: boolean,
    priorGlossAmount: number = 0
  ): RgbColor {
    const scene = this.scene;
    // const objectsInBounds = scene.objects.filter((x) => x.bounds.inBounds(ray));
    const hitInfo = this.rayMarcher.marchRay(ray);
    if (!(hitInfo.wasHit && hitInfo.hitObject)) {
      return scene.backgroundColor;
    }

    // if it is a light return the light
    const material = hitInfo.hitObject.material;
    if (!material.emission.equals(RgbColor.black)) {
      if (material.isDirectlySampledLight) {
        if (depth === 0 || containedSpecular) {
          return material.emission.scale(1 - priorGlossAmount);
        } else {
          return RgbColor.black;
        }
      } else {
        return material.emission;
      }
    }

    let probNewRay = 1;

    /*
    // russian roulette termination strategy
    if (depth > 3) {
      probNewRay = material.albedo.maxComponent();
      if (this.random.random() > probNewRay) {
        return RgbColor.black;
      }
    }
    */

    // termination strategy
    if (depth > 3) return RgbColor.black;

    // back up a little
    // const nextPosition = hitInfo.hitAt.add(ray.direction.scale(-0.01));
    const nextPosition = new Vector(
      hitInfo.hitAt.x + ray.direction.x * -0.01,
      hitInfo.hitAt.y + ray.direction.y * -0.01,
      hitInfo.hitAt.z + ray.direction.z * -0.01
    );

    // DIRECT - Sample lights directly
    // const direct = new RgbColor(.5, .5, .5);
    const direct = this.calculateDirect(
      scene,
      nextPosition,
      hitInfo,
      material
    ).divideScalar(probNewRay);

    if (material.specularAmount > 0) {
      if (this.random.random() < material.specularAmount) {
        if (material.glossyAmount === 0) {
          const reflected = this.getPerfectReflection(
            ray,
            hitInfo,
            nextPosition,
            depth,
            probNewRay
          );
          return reflected;
        } else {
          const reflected = this.getGlossyReflection(
            hitInfo,
            ray,
            material,
            nextPosition,
            scene,
            depth,
            probNewRay
          );
          return reflected;
        }
      }
    }

    const indirect = this.sampleIndirect(
      hitInfo,
      nextPosition,
      scene,
      depth,
      material,
      probNewRay
    );
    return indirect.add(direct);
  }

  private getPerfectReflection(
    ray: Ray,
    hitInfo: RayMarchResult,
    nextPosition: Vector,
    depth: number,
    probNewRay: number
  ) {
    const reflectDirection = ray.direction.reflect(hitInfo.normal);
    const reflectRay = new Ray(nextPosition, reflectDirection);
    const brdf = new RgbColor(1, 1, 1).divideScalar(Math.PI);
    const reflected = this.tracePath(reflectRay, depth + 1, true, 0)
      .multiply(brdf)
      .divideScalar(probNewRay);
    return reflected;
  }

  private getGlossyReflection(
    hitInfo: RayMarchResult,
    ray: Ray,
    material: Material,
    nextPosition: Vector,
    scene: Scene,
    depth: number,
    probNewRay: number
  ) {
    const diffuseDirection = this.hemisphereSampler.sample(hitInfo.normal);
    const reflectDirection = ray.direction.reflect(hitInfo.normal);
    const blendedDirection = diffuseDirection
      .lerp(material.glossyAmount, reflectDirection)
      .normalize();
    const reflectRay = new Ray(nextPosition, blendedDirection);
    const cos = diffuseDirection.dot(hitInfo.normal);
    const brdf = new RgbColor(1, 1, 1).divideScalar(Math.PI);
    const pdf = Functions.lerp(material.glossyAmount, this.hemispherePdf, 1);
    const blendedCos = Functions.lerp(material.glossyAmount, cos, 1);
    const reflected = this.tracePath(
      reflectRay, 
      depth + 1,
      true,
      material.glossyAmount
    );

    const multiplier = blendedCos * (1 / (pdf * probNewRay));
    const contribution = new RgbColor(
      reflected.red * brdf.red * multiplier,
      reflected.green * brdf.green * multiplier,
      reflected.blue * brdf.blue * multiplier
    );
    return contribution;
  }

  private sampleIndirect(
    hitInfo: RayMarchResult,
    nextPosition: Vector,
    scene: Scene,
    depth: number,
    material: Material,
    probNewRay: number
  ) {
    const newDirection = this.hemisphereSampler.sample(hitInfo.normal);
    const newRay = new Ray(nextPosition, newDirection);
    const cos = newRay.direction.dot(hitInfo.normal);
    const bounce = this.tracePath(newRay, depth + 1, false, 1);
    const multiplier =
      cos * (1 / (this.hemispherePdf * probNewRay)) * this.oneOverPi;
    const indirect = new RgbColor(
      bounce.red * material.albedo.red * multiplier,
      bounce.green * material.albedo.green * multiplier,
      bounce.blue * material.albedo.blue * multiplier
    );
    return indirect;
  }

  private calculateDirect(
    scene: Scene,
    position: Vector,
    hitInfo: RayMarchResult,
    material: Material
  ): RgbColor {
    const lightIndex = Math.floor(
      this.random.random() * scene.directLights.length
    );
    const light = scene.directLights[lightIndex];
    if (light) {
      const sample = light.sample(position);
      const rayResult = this.rayMarcher.marchRay(sample.ray);
      if (
        // if we hit the light
        rayResult.wasHit &&
        rayResult.hitObject === light.visibleObject
      ) {
        const directLightColor = rayResult.hitObject.material.emission;
        const directCos = sample.ray.direction.dot(hitInfo.normal);
        const intensity =
          sample.visibleArea / (sample.distance * sample.distance);
        const multiplier = intensity * this.oneOverPi * directCos;
        return new RgbColor(
          directLightColor.red * material.albedo.red * multiplier,
          directLightColor.green * material.albedo.green * multiplier,
          directLightColor.blue * material.albedo.blue * multiplier,
        );
      }
      return RgbColor.black;
    }
    return RgbColor.black;
  }
}
