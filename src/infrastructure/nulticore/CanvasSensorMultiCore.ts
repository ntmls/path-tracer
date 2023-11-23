import { Sensor, Camera, RayTracer, Random } from "../../domain/common/Abstractions";
import { Scene } from "../../domain/common/SceneDefinition/Scene";
import { CellInput, CellOutput } from "./MultiCoreDtos";

export class CanvasSensorMultiCore implements Sensor {
  private _statistics = MultiCoreStatistics.initialize();
  constructor(
    private canvas: HTMLCanvasElement,
    private camera: Camera,
    private rayTracer: RayTracer,
    private random: Random
  ) { }

  // need to inject via property rather than constructor.
  private _events: MultiCoreEvents;
  set events(value: MultiCoreEvents) {
    this._events = value;
  }

  setSize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  async takePicture(scene: Scene): Promise<void> {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const cores = 6;
    const cellSize = 50;

    const cells = this.initializeCells(cellSize, width, height);
    await this.processCells(cores, cells);
  }

  private initializeCells(
    cellSize: number,
    width: number,
    height: number
  ): CellInput[] {
    const cells: CellInput[] = [];
    let xs = 0;
    let ys = 0;
    let xe = cellSize - 1;
    let ye = cellSize - 1;
    while (xs < width && ys < height) {
      const regionTask = new CellInput();
      regionTask.start.x = xs;
      regionTask.start.y = ys;
      regionTask.end.x = xe;
      regionTask.end.y = ye;
      regionTask.sensor.width = width;
      regionTask.sensor.height = height;
      cells.push(regionTask);
      xs += cellSize;
      xe += cellSize;
      if (xe >= width) {
        xe = width - 1;
      }
      if (ye >= height) {
        ye = height - 1;
      }
      if (xs >= width) {
        xs = 0;
        xe = cellSize - 1;
        ys += cellSize;
        ye += cellSize;
      }
    }
    return cells;
  }

  private processCells(cores: number, cells: CellInput[]) {
    this._statistics = this._statistics.start();
    const inProgress: CellInput[] = [];
    const promise = new Promise<void>((resolve, reject) => {
      const workers: Worker[] = [];
      for (let i = 0; i < cores; i++) {
        const worker = new Worker(
          new URL('SlaveMessageHandler.ts', import.meta.url),
          {type: 'module'}
        );
        workers.push(worker);
        worker.onmessage = (e: MessageEvent<CellOutput>) => {
          this._statistics = this._statistics.afterCellRendered(
            e.data.timeTaken
          );
          this._events.cellRendered(
            this._statistics.totalProcessTime,
            this._statistics.renderElapsedTime,
            this._statistics.averageCellLProcessTime
          );
          this.copyCellDataToImage(e.data);
          inProgress.shift(); // remove from the inprogress stack
          const nextCell = cells.shift();
          if (nextCell) {
            inProgress.push(nextCell);
            nextCell.worker = i;
            worker.postMessage(nextCell);
          }
          // when there are no more cells to process and the inprogress stack is depleted then stop.
          if (cells.length === 0 && inProgress.length === 0) {
            for (const w of workers) {
              w.terminate();
            }
            resolve();
          }
        };
        const region = cells.shift();
        if (region) {
          inProgress.push(region);
          region.worker = i;
          worker.postMessage(region);
        }
      }
    });
    return promise;
  }

  private copyCellDataToImage(data: CellOutput) {
    const context = this.canvas.getContext("2d");
    if (context === null) throw new Error('"Context" not found');
    const width = data.cell.end.x - data.cell.start.x + 1;
    const height = data.cell.end.y - data.cell.start.y + 1;
    const imageData = context?.getImageData(
      data.cell.start.x,
      data.cell.start.y,
      width,
      height
    );
    if (imageData === undefined) throw new Error('"ImageData" not found');
    const length = imageData.data.length;
    let count = 0;
    for (var i = 0; i < length; i += 4) {
      imageData.data[i] = data.pixels[count].r;
      imageData.data[i + 1] = data.pixels[count].g;
      imageData.data[i + 2] = data.pixels[count].b;
      imageData.data[i + 3] = 255;
      count += 1;
    }
    context.putImageData(imageData, data.cell.start.x, data.cell.start.y);
  }
}

export interface MultiCoreEvents {
  cellRendered(
    totalProcessingTime: number,
    totalElapsedTime: number,
    averageCellLProcessTime: number
  ): void;
}

class MultiCoreStatistics {
  private constructor(
    readonly renderStartTime: number,
    readonly renderElapsedTime: number,
    readonly cellsProcessed: number,
    readonly totalProcessTime: number
  ) { }

  get averageCellLProcessTime(): number {
    if (this.cellsProcessed === 0) return 0;
    return this.totalProcessTime / this.cellsProcessed;
  }

  static initialize(): MultiCoreStatistics {
    return new MultiCoreStatistics(0, 0, 0, 0);
  }

  start(): MultiCoreStatistics {
    return new MultiCoreStatistics(Date.now(), 0, 0, 0);
  }

  afterCellRendered(timeTaken: number): MultiCoreStatistics {
    return new MultiCoreStatistics(
      this.renderStartTime,
      Date.now() - this.renderStartTime,
      this.cellsProcessed + 1,
      this.totalProcessTime + timeTaken
    );
  }
}
