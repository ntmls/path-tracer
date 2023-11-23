export class CellInput {
  worker = -1;
  start = new PixelPosition();
  end = new PixelPosition();
  sensor = new SensorDto();
}

export class PixelPosition {
  x = 0;
  y = 0;
}

export class SensorDto {
  width = 0;
  height = 0;
}

export class CellOutput {
  cell: CellInput;
  pixels: RgbDto[] = []
  timeTaken: number;
}

export class RgbDto {
  r: number;
  g: number; 
  b: number
}