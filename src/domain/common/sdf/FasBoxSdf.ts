import { SignedDistanceFunction } from "../Abstractions";
import { Vector } from "../Vector";


export class FasBoxSdf implements SignedDistanceFunction {
    constructor(
        private halfWidth: number,
        private halfHeight: number,
        private halfDepth: number
    ) { }

    /**
     * Returns the distance to the surface of the box.
     * The box is centered at the origin and has dimensions
     * 2 * halfWidth, 2 * halfHeight, and 2 * halfDepth.
     */
    distance(px: number, py: number, pz: number): number {
        const tempX = Math.abs(px) - this.halfWidth;
        const tempY = Math.abs(py) - this.halfHeight;
        const tempZ = Math.abs(pz) - this.halfDepth;
        const maxXY = tempX > tempY ? tempX : tempY;
        return maxXY > tempZ ? maxXY : tempZ;
    }
}
