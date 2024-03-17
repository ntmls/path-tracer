import { Pane } from "tweakpane";

export interface Panel {}

export class HtmlPanel implements Panel {
  initialize(): void {
    globalThis.pane = new Pane();
    const PARAMS = {
      factor: 123,
      title: "hello",
      color: "#ff0055",
    };
    globalThis.pane.addBinding(PARAMS, "factor");
    globalThis.pane.addBinding(PARAMS, "title");
    globalThis.pane.addBinding(PARAMS, "color");
  }
}

export class WorkerPanel implements Panel {

}
