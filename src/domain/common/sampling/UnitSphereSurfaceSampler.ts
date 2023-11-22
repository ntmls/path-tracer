import { Random } from "../Abstractions";
import { Vector } from "../Vector";


export class UnitSphereSurfaceSampler {
  constructor(private readonly random: Random) { }

  sample(): Vector {
    let vector = new Vector(
      this.randomNegativeToPositiveOne(),
      this.randomNegativeToPositiveOne(),
      this.randomNegativeToPositiveOne()
    );
    while (vector.dot(vector) > 1) {
      vector = new Vector(
        this.randomNegativeToPositiveOne(),
        this.randomNegativeToPositiveOne(),
        this.randomNegativeToPositiveOne()
      );
    }
    return vector.normalize();
  }

  private randomNegativeToPositiveOne(): number {
    return this.random.random() * 2 - 1;
  }
}
