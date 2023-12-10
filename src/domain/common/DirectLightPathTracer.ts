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
    containedSpecular: boolean,
    priorGlossAmount: number = 0
  ): RgbColor {
    const objectsInBounds = scene.objects.filter((x) => x.bounds.inBounds(ray));
    const hitInfo = this.rayMarcher.marchRay(objectsInBounds, ray);
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

    // russian roulette to limit bounces
    let probNewRay = 1;
    if (depth > 3) {
      // return RgbColor.black;
      probNewRay = material.albedo.maxComponent();
      if (this.random.random() > probNewRay) {
        // terminate
        return RgbColor.black;
      }
    }

    // back up a little
    const nextPosition = hitInfo.hitAt.add(ray.direction.scale(-0.01));

    // DIRECT - Sample lights directly
    // const direct = new RgbColor(.5, .5, .5);
    const direct = this.calculateDirect(
      scene,
      nextPosition,
      hitInfo,
      material
    ).divideScalar(probNewRay);

    // Pure specular
    if (material.specularAmount > 0) {
      if (this.random.random() < material.specularAmount) {
        if (material.glossyAmount === 0) {
          const reflectDirection = ray.direction.reflect(hitInfo.normal);
          const reflectRay = new Ray(nextPosition, reflectDirection);
          const brdf = new RgbColor(1, 1, 1).divideScalar(Math.PI);
          const reflected = this.tracePath(
            reflectRay,
            scene,
            depth + 1,
            true,
            0
          )
            .multiply(brdf)
            .divideScalar(probNewRay);
          return reflected.add(direct);
        } else {
          // GLOSSY
          const diffuseDirection = this.hemisphereSampler.sample(
            hitInfo.normal
          );
          const reflectDirection = ray.direction.reflect(hitInfo.normal);
          const blendedDirection = diffuseDirection
            .lerp(material.glossyAmount, reflectDirection)
            .normalize();
          const reflectRay = new Ray(nextPosition, blendedDirection);
          const cos = diffuseDirection.dot(hitInfo.normal);
          const brdf = new RgbColor(1, 1, 1).divideScalar(Math.PI);
          const pdf = Functions.lerp(
            material.glossyAmount,
            this.hemispherePdf,
            1
          );
          const blendedCos = Functions.lerp(material.glossyAmount, cos, 1);
          const reflected = this.tracePath(
            reflectRay,
            scene,
            depth + 1,
            true,
            material.glossyAmount
          )
            .multiply(brdf)
            .scale(blendedCos)
            .divideScalar(pdf * probNewRay);
          return reflected.add(direct.scale(material.glossyAmount));
        }
      }
    }

    // INDIRECT = get incoming light incomingLight
    const newDirection = this.hemisphereSampler.sample(hitInfo.normal);
    const newRay = new Ray(nextPosition, newDirection);
    const cos = newRay.direction.dot(hitInfo.normal);
    const incomingLight = this.tracePath(newRay, scene, depth + 1, false, 1);
    const brdf = material.albedo.divideScalar(Math.PI); // Energy conservation
    const indirect = incomingLight
      .multiply(brdf)
      .scale(cos)
      .divideScalar(this.hemispherePdf * probNewRay);
    return indirect.add(direct);
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
      const rayResult = this.rayMarcher.marchRay(scene.objects, sample.ray);
      if (
        // if we hit the light
        rayResult.wasHit &&
        rayResult.hitObject === light.visibleObject
      ) {
        const directLightColor = rayResult.hitObject.material.emission;
        const directCos = sample.ray.direction.dot(hitInfo.normal);
        const intensity =
          sample.visibleArea / (sample.distance * sample.distance);
        const brdf = material.albedo.divideScalar(Math.PI);
        return directLightColor
          .multiply(brdf)
          .scale(directCos)
          .scale(intensity);
      }
      return RgbColor.black;
    }
    return RgbColor.black;
  }
}
