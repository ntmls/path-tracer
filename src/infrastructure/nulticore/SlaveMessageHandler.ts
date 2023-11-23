import { Vector2 } from "../../domain/common/Vector2";
import { Composer } from "../../root/composer";
import { CellInput, CellOutput, RgbDto } from "./MultiCoreDtos";

const composer = new Composer();
const slave = composer.composeSlave();

onmessage = (e) => {
  const region = e.data as CellInput;
  const scene = slave.sceneBuilder.build();
  slave.sensor.setRegion(
    new Vector2(region.start.x, region.start.y),
    new Vector2(region.end.x, region.end.y)
  );

  const startTime = Date.now();
  slave.sensor.takePicture(scene);
  const endTime = Date.now();
  const timeTaken = endTime - startTime;

  const result = new CellOutput();
  result.cell = region;
  result.pixels = slave.sensor.output.map((x) => {
    const rgb = new RgbDto();
    rgb.r = x.red;
    rgb.g = x.green;
    rgb.b = x.blue;
    return rgb;
  });
  result.timeTaken = timeTaken;

  postMessage(result);
};
