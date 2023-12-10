import { availableParallelism } from "os";
import { SignedDistanceFunction } from "./Abstractions";
import { Bounds, SphereBounds, Unbounded } from "./SceneDefinition/SceneObject";
import { Vector } from "./Vector";

export class BoundsEstimator {
  estimate(sdf: SignedDistanceFunction): Bounds {
    const tolerance = 0.05;
    let samples = this.sampleSignedDistanceField(sdf);
    samples = this.filterSamples(samples, tolerance);
    const center = this.fidnCenter(samples);
    const radius = this.findRadius(samples, center);
    alert(`${radius} ${center.x} ${center.y} ${center.z}`);
    return new SphereBounds(center, radius);
  }

  private findRadius(samples: SdfSample[], center: Vector) {
    let maxRadius = 0;
    for (const sample of samples) {
      const radius = center.distanceFrom(sample.point);
      if (radius > maxRadius) {
        maxRadius = radius;
      }
    }
    return maxRadius;
  }

  private fidnCenter(samples: SdfSample[]) {
    let xMin = samples[0].point.x;
    let yMin = samples[0].point.y;
    let zMin = samples[0].point.z;
    let xMax = samples[0].point.x;
    let yMax = samples[0].point.y;
    let zMax = samples[0].point.z;

    for (const sample of samples) {
      xMin = Math.min(xMin, sample.point.x);
      yMin = Math.min(yMin, sample.point.y);
      zMin = Math.min(zMin, sample.point.z);
      xMax = Math.max(xMax, sample.point.x);
      yMax = Math.max(yMax, sample.point.y);
      zMax = Math.max(zMax, sample.point.z);
    }

    const middle = new Vector(
      (xMin + xMax) * 0.5,
      (yMin + yMax) * 0.5,
      (zMin + zMax) * 0.5
    );
    return middle;
  }

  private filterSamples(samples: SdfSample[], tolerance: number): SdfSample[] {
    const results: SdfSample[] = [];
    for (const sample of samples) {
      if (sample.distance < tolerance) {
        results.push(sample);
      }
    }
    return results;
  }

  private sampleSignedDistanceField(sdf: SignedDistanceFunction): SdfSample[] {
    let accepted = 0;
    let rejected = 0;

    const samples: SdfSample[] = [];

    // let current = new Vector(-0.039451172,	4.99526303,	-0.032226507);
    let current = new Vector(0, 0, 0);
    let currentDist = sdf.distance(current);
    let currentProb = this.toProbability(currentDist);
    for (let i = 0; i < 10000; i++) {
      const proposal = this.createProposal(current);
      const proposedDist = sdf.distance(proposal);
      const proposedProb = this.toProbability(proposedDist);

      if (this.shouldAccept(proposedProb, currentProb)) {
        current = proposal;
        currentDist = proposedDist;
        currentProb = proposedProb;
        accepted += 1;
      } else {
        rejected += 1;
      }

      samples.push(new SdfSample(currentDist, current));
    }

    // extract for visualization
    this.visualizeMcmc(samples, accepted, rejected);

    return samples;
  }

  private visualizeMcmc(
    samples: SdfSample[],
    accepted: number,
    rejected: number
  ) {
    const len = samples.length;
    let data = "";
    const filtered: string[] = [];
    for (let i = 0; i < len; i++) {
      const sample = samples[i];
      data += `${sample.distance}, ${sample.point.x}, ${sample.point.y}, ${sample.point.z}\n`;
    }

    navigator.clipboard.writeText(data).then(
      () => {
        alert("Clipboard copy succeeded.");
      },
      () => {
        alert("Clipboard copy failed.");
      }
    );
    const acceptanceRate = accepted / (accepted + rejected);
    alert(
      `Acceptance Rate: ${acceptanceRate} Accepted: ${accepted} Rejected: ${rejected} `
    );
  }

  private shouldAccept(proposedProb: number, currentProb: number) {
    if (proposedProb <= 0) {
      return false;
    }
    const acceptProb = Math.min(1, proposedProb / currentProb);
    const u = Math.random();
    let shouldAccept = false;
    if (u < acceptProb) {
      return true;
    } else {
      return false;
    }
  }

  private createProposal(current: Vector) {
    const perturbAmount = 3;
    const direction = Math.random();
    // const amount = (Math.random() - 0.5) * perturbAmount;
    const amount = this.sampleApproximateNormal() * perturbAmount;
    let x = current.x;
    let y = current.y;
    let z = current.z;
    if (direction < 0.333) {
      x += amount;
    } else if (direction < 0.665) {
      y += amount;
    } else {
      z += amount;
    }
    return new Vector(x, y, z);
  }

  private sampleApproximateNormal() {
    const samples = 12;
    let sum = 0;
    for (let i = 0; i < samples; i++) {
      sum += Math.random();
    }
    const value = (sum - 6) / 6;
    return value;
  }

  private toProbability(value: number): number {
    const sharpness = 10;
    const result = Math.pow(Math.E, -Math.abs(value * sharpness));
    return result;
  }
}

class SdfSample {
  constructor(readonly distance: number, readonly point: Vector) {}
}
