
export class Functions {
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
