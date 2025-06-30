export class Functions {
  static distance2(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static distance3(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number
  ): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  static distanceSquared3(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number
  ) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    return dx * dx + dy * dy + dz * dz;
  }

  static clamp(value: number, min: number, max: number): number {
    if (value > max) return max;
    if (value < min) return min;
    return value;
  }

  static between(value: number, min: number, max: number): boolean {
    if (max < min) {
      const temp = min;
      min = max;
      max = temp;
    }
    if (value > max) return false;
    if (value < min) return false;
    return true;
  }

  static lerp(amount: number, a: number, b: number): number {
    return amount * a + (1 - amount) * b;
  }
}
