import { Presenter } from "../application/Presenter";
import { View } from "../application/View";
import { BottleSceneBuilder } from "../domain/BottleSceneBuilder";
import { Sensor, Camera } from "../domain/common/Abstractions";
import { SdfVisualizer2d, Contours } from "../infrastructure/implementation";
import { HtmlView } from "../infrastructure/HtmlView";
import { MathRandom } from "../infrastructure/MathRandom";
import { SdfNormalCalculation } from "../domain/common/sdf/SdfNormalCalculation";
import { NormalsOnlyRayTracer } from "../domain/common/NormalsOnlyRayTracer";
import { RayMarcher } from "../domain/common/RayMarcher";
import { CanvasSensor } from "../infrastructure/CanvasSensor";
import { StratifiedPixelSampler } from "../infrastructure/StratifiedPixelSampler";
import { UnitSphereSurfaceSampler } from "../domain/common/sampling/UnitSphereSurfaceSampler";
import { HemisphereSurfaceSampler } from "../domain/common/sampling/HemisphereSurfaceSampler";
import { SimpleLightFactory } from "../domain/common/SceneDefinition/SimpleLightFactory";
import { DirectLightPathTracer } from "../domain/common/DirectLightPathTracer";
import { Film35mmCamera } from "../domain/common/cameras/film35mmCamera";
import { RegionSensor } from "../infrastructure/nulticore/RegionSensor";
import { Slave } from "../infrastructure/nulticore/Slave";
import { CanvasSensorMultiCore } from "../infrastructure/nulticore/CanvasSensorMultiCore";
import { Vector } from "../domain/common/Vector";

export class Composer {
  private random = new MathRandom();
  private normalCalculation = new SdfNormalCalculation(0.001);
  private rayMarcher = new RayMarcher(1000, this.normalCalculation);
  private normalsRayTracer = new NormalsOnlyRayTracer(this.rayMarcher);
  private sphereSamples = new UnitSphereSurfaceSampler(this.random);
  private hemiSphereSampler = new HemisphereSurfaceSampler(this.sphereSamples);
  private pathTracer = new DirectLightPathTracer(
    this.rayMarcher,
    this.hemiSphereSampler,
    this.random
  );
  private lightFactory = new SimpleLightFactory(this.sphereSamples);

  composePresenter(): Presenter {
    const sensor = this.composeFinalRenderSensor();
    const presenter = new Presenter(
      this.composeBottleSceneBuilder(),
      this.composeCompositionSensor(),
      sensor
    );
    sensor.events = presenter;
    presenter.registerViews(this.composeMainView(presenter));
    return presenter;
  }

  private composeMainView(presenter: Presenter): View {
    return new HtmlView(presenter, this.composeCapVisualization());
  }
  private composeBottleSceneBuilder(): BottleSceneBuilder {
    return new BottleSceneBuilder(this.lightFactory);
  }
  private composeCompositionSensor(): Sensor {
    const canvas = this.getCanvas("canvas-composition");
    const camera = this.createCamera();
    const sensor = new CanvasSensor(
      canvas,
      camera,
      this.normalsRayTracer,
      this.random,
      1
    );
    camera.initializeSensor(sensor);
    return sensor;
  }
  private composeFinalRenderSensor(): CanvasSensorMultiCore {
    const canvas = this.getCanvas("canvas-final-render");
    const camera = this.createCamera();
    const sensor = new CanvasSensorMultiCore(
      canvas,
      camera,
      this.pathTracer,
      this.random
    );
    camera.initializeSensor(sensor);
    return sensor;
  }
  composeSlave(): Slave {
    const camera = this.createCamera();
    
    /*
    const pixelSampler = new RandomPixelSampler(
      64,
      this.pathTracer,
      this.random,
      camera
    );
    */
    const pixelSampler = new StratifiedPixelSampler(
      8,
      this.pathTracer,
      this.random,
      camera
    );
    return new Slave(
      camera,
      new RegionSensor(pixelSampler),
      this.composeBottleSceneBuilder()
    );
  }
  private composeBottleBodyVisualization(): SdfVisualizer2d {
    const canvas = this.getCanvas("canvas-bottle-body");
    return new SdfVisualizer2d(canvas, new Contours(1, 0.1));
  }
  private composeCapVisualization(): SdfVisualizer2d {
    const canvas = this.getCanvas("canvas-visualize-sdf-2d");
    return new SdfVisualizer2d(canvas, new Contours(1, 0.1));
  }
  private getCanvas(id: string): HTMLCanvasElement {
    return document.getElementById(id) as HTMLCanvasElement;
  }
  private createCamera(): Camera {
    // return new FrontOrthoCamera(width, height, 50, 0, 3);
    const origin = new Vector(0, 3, -36);
    const lookAt = new Vector(0, 3, 0);
    return new Film35mmCamera(origin, lookAt, new Vector(0, 1, 0), 0.5, 100);
  }
}
