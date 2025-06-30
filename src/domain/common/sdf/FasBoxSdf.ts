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
    distance(position: Vector): number {
        const px = Math.abs(position.x) - this.halfWidth;
        const py = Math.abs(position.y) - this.halfHeight;
        const pz = Math.abs(position.z) - this.halfDepth;
        const maxXY = px > py ? px : py;
        return maxXY > pz ? maxXY : pz;
    }
}
