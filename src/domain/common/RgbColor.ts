export class RgbColor {
  constructor(
    readonly red: number,
    readonly green: number,
    readonly blue: number
  ) {}
  mix(other: RgbColor, amount: number): RgbColor {
    const t = 1 - amount;
    return new RgbColor(
      this.red * amount + other.red * t,
      this.green * amount + other.green * t,
      this.blue * amount + other.blue * t
    );
  }
  add(color: RgbColor): RgbColor {
    return new RgbColor(
      this.red + color.red,
      this.green + color.green,
      this.blue + color.blue
    );
  }
  divideScalar(value: number) {
    return new RgbColor(
      this.red / value,
      this.green / value,
      this.blue / value
    );
  }
  multiply(other: RgbColor): RgbColor {
    return new RgbColor(
      this.red * other.red,
      this.green * other.green,
      this.blue * other.blue
    );
  }
  scale(value: number) {
    return new RgbColor(
      this.red * value,
      this.green * value,
      this.blue * value
    );
  }

  equals(other: RgbColor) {
    if (this.red !== other.red) return false;
    if (this.green !== other.green) return false;
    if (this.blue !== other.blue) return false;
    return true;
  }
  maxComponent(): number {
    return Math.max(this.red, Math.max(this.green, this.blue));
  }

  static readonly black = new RgbColor(0,0,0);

}
