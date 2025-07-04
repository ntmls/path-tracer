import { Presenter } from "../application/Presenter";
import { View } from "../application/View";
import { Sensor, Camera } from "../domain/common/Abstractions";
import { SdfVisualizer2d, Contours } from "../infrastructure/implementation";
import { HtmlView } from "../infrastructure/HtmlView";
import { MathRandom } from "../infrastructure/MathRandom";
import { SdfNormalCalculation } from "../domain/common/sdf/SdfNormalCalculation";
import { CanvasSensor } from "../infrastructure/CanvasSensor";
import { UnitSphereSurfaceSampler } from "../domain/common/sampling/UnitSphereSurfaceSampler";
import { HemisphereSurfaceSampler } from "../domain/common/sampling/HemisphereSurfaceSampler";
import { SimpleLightFactory } from "../domain/common/SceneDefinition/SimpleLightFactory";
import { Film35mmCamera } from "../domain/common/cameras/Film35mmCamera";
import { CanvasSensorMultiCore } from "../infrastructure/nulticore/CanvasSensorMultiCore";
import { Vector } from "../domain/common/Vector";
import { CellSensor } from "../infrastructure/nulticore/CellSensor";
import { Slave } from "../infrastructure/nulticore/Slave";
import { BottleSceneBuilder } from "../domain/bottle-scene/BottleSceneBuilder";
import { HtmlPanel, Panel, WorkerPanel } from "../infrastructure/Panel";
import { RandomPixelSamplerFactory } from "../infrastructure/RandomPixelSamplerFactory";
import { NormalsOnlyRayTracerFactory } from "../domain/common/NormalsOnlyRayTracerFactory";
import { DirectLightPathTracerFactory } from "../domain/common/DirectLightPathTracerFactory";
import { RayMarcherFactory } from "../domain/common/RayMarcherFactory";
import { DefaultRayMaregerFactory } from "../domain/common/DefaultRayMaregerFactory";

export class Composer {
  private random = new MathRandom();
  private normalCalculation = new SdfNormalCalculation(0.001);
  private rayMarcherFactory: RayMarcherFactory = new DefaultRayMaregerFactory(
    {
      maxDistance: 150.0,
      maxSteps: 200,
      surfaceDistance: 0.01,
    },
    this.normalCalculation
  );
  private normalsRayTracerFactory = new NormalsOnlyRayTracerFactory(
    this.rayMarcherFactory
  );
  private sphereSamples = new UnitSphereSurfaceSampler(this.random);
  private hemiSphereSampler = new HemisphereSurfaceSampler(this.sphereSamples);
  private pathTracerFactory = new DirectLightPathTracerFactory(
    this.rayMarcherFactory,
    this.hemiSphereSampler,
    this.random
  );
  private lightFactory = new SimpleLightFactory(this.sphereSamples);
  private panel: Panel;

  constructor() {
    if (globalThis.document) {
      const htmlPanel = new HtmlPanel();
      htmlPanel.initialize();
      this.panel = htmlPanel;
    } else {
      this.panel = new WorkerPanel();
    }
  }

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
      this.normalsRayTracerFactory,
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
      // this.pathTracerFactory,
      this.random
    );
    camera.initializeSensor(sensor);
    return sensor;
  }
  composeSlave(): Slave {
    const camera = this.createCamera();

    const pixelSamplerFactory = new RandomPixelSamplerFactory(
      32, // number of samples per pixel
      this.random,
      camera,
      30.0 // clamp threshol
    );

    return new Slave(
      camera,
      new CellSensor(pixelSamplerFactory, this.pathTracerFactory),
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


