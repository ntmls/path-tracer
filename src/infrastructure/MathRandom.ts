import { Random } from "../domain/common/Abstractions";

export class MathRandom implements Random {
    random(): number {
        return Math.random();
    }
    between(min: number, max: number): number {
        return min + (max - min) * Math.random();
    }

}