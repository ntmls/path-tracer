import {
  Sensor,
  Camera,
  Random,
  RayTracer,
} from "../domain/common/Abstractions";
import { RgbColor } from "../domain/common/RgbColor";
import { Scene } from "../domain/common/SceneDefinition/Scene";

export class CanvasSensor implements Sensor {
  constructor(
    private canvas: HTMLCanvasElement,
    private camera: Camera,
    private rayTracer: RayTracer,
    private random: Random,
    private samplesPerPixel: number
  ) {}

  setSize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  takePicture(scene: Scene): Promise<void> {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const context = this.canvas.getContext("2d");
    if (context === null) throw new Error('"Context" not found');
    const imageData = context?.getImageData(0, 0, width, height);
    if (imageData === undefined) throw new Error('"ImageData" not found');
    const length = imageData.data.length;
    let x = 0;
    let y = 0;
    for (var i = 0; i < length; i += 4) {
      let v = 0;
      const color = this.samplePixel(x, y, scene);
      const correctedColor = this.correctGamma(color);
      imageData.data[i] = Math.floor(correctedColor.red * 255);
      imageData.data[i + 1] = Math.floor(correctedColor.green * 255);
      imageData.data[i + 2] = Math.floor(correctedColor.blue * 255);
      imageData.data[i + 3] = 255;
      x = x + 1;
      if (x >= width) {
        y = y + 1;
        x = 0;
      }
    }
    context.putImageData(imageData, 0, 0);
    return Promise.resolve();
  }

  private samplePixel(x: number, y: number, scene: Scene) {
    let sum = RgbColor.black;
    for (let j = 0; j < this.samplesPerPixel; j++) {
      const ray = this.camera.generateRay(
        this.random.between(x, x + 1),
        this.random.between(y, y + 1)
      );
      const color = this.rayTracer.traceRay(ray, scene);
      sum = sum.add(color);
    }
    const averageColor = sum.divideScalar(this.samplesPerPixel);
    return averageColor;
  }

  private correctGamma(color: RgbColor) {
    return new RgbColor(
      Math.sqrt(color.red),
      Math.sqrt(color.green),
      Math.sqrt(color.blue)
    );
  }
}


