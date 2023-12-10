import {
  Presenter,
  ProfileViewModel,
  sceneObjectsViewModel,
} from "../application/Presenter";
import { View } from "../application/View";
import { SdfVisualizer2d } from "./implementation";
import { CellRenderedData } from "./nulticore/CanvasSensorMultiCore";

export class HtmlView implements View {
  private linkProfiles: HTMLAnchorElement;
  private linkComposition: HTMLAnchorElement;
  private linkFinalRender: HTMLAnchorElement;
  private divViewProfiles: HTMLDivElement;
  private divViewComposition: HTMLDivElement;
  private divFinalRender: HTMLDivElement;
  private profileSelect: HTMLSelectElement;
  private renderButton: HTMLButtonElement;

  constructor(
    private presenter: Presenter,
    private sdfVisualizer2d: SdfVisualizer2d
  ) {
    this.linkProfiles = this.assertElementExists(
      document.getElementById("top-nav-profiles")
    ) as HTMLAnchorElement;
    this.linkComposition = this.assertElementExists(
      document.getElementById("top-nav-composition")
    ) as HTMLAnchorElement;
    this.linkFinalRender = this.assertElementExists(
      document.getElementById("top-nav-final-render")
    ) as HTMLAnchorElement;
    this.divViewProfiles = this.assertElementExists(
      document.getElementById("view-profiles")
    ) as HTMLDivElement;
    this.divViewComposition = this.assertElementExists(
      document.getElementById("view-composition")
    ) as HTMLDivElement;
    this.divFinalRender = this.assertElementExists(
      document.getElementById("view-final-render")
    ) as HTMLDivElement;
    this.profileSelect = this.assertElementExists(
      document.getElementById("select-profile")
    ) as HTMLSelectElement;
    this.renderButton = this.assertElementExists(
      document.getElementById("button-render")
    ) as HTMLButtonElement;

    this.attachEventHandlers();
  }
  showFinalRender(): void {
    this.divFinalRender.hidden = false;
  }
  showComposition(): void {
    this.divViewComposition.hidden = false;
  }
  showProfiles(): void {
    this.divViewProfiles.hidden = false;
  }
  hideFinalRender(): void {
    this.divFinalRender.hidden = true;
  }
  hideComposition(): void {
    this.divViewComposition.hidden = true;
  }
  hideProfiles(): void {
    this.divViewProfiles.hidden = true;
  }
  visualize2dSdf(profileViewModel: ProfileViewModel): void {
    this.sdfVisualizer2d.setView(
      profileViewModel.xOffset,
      profileViewModel.yOffset,
      profileViewModel.pixelsPerUnit
    );
    this.sdfVisualizer2d.visualize(profileViewModel.sdf);
  }

  populateProfileSelection(names: string[]): void {
    this.profileSelect.innerHTML = "";
    for (const item of names) {
      const option = document.createElement("option") as HTMLOptionElement;
      option.textContent = item;
      this.profileSelect.appendChild(option);
    }
  }

  updateRenderStatistics(data: CellRenderedData): void {
    this.dispplayTotalProcessTime(data);
    this.displayTotalElapsedTime(data);
    this.displayAverageProcessingTimeperCell(data);
    this.displayCellsProcessed(data);
    this.displayCellsPerSecond(data);
  }

  displaySceneObjects(viewModel: sceneObjectsViewModel): void {
    const tableElement = document.getElementById(
      "view-composition-scene-objects"
    ) as HTMLTableElement;
    const tbody = tableElement.tBodies[0];

    // delete all the rows
    for (let i = tbody.rows.length - 1; i >= 0; i--) {
      const row = tbody.rows.item(i);
      if (row) {
        for (let j = 0; j < row.cells.length; j++) {
          const cell = row?.cells.item(j);
          cell?.firstChild?.removeEventListener("click", null);
        }
      }
      tbody.deleteRow(i);
    }

    // build the table rows form the view model
    for (const item of viewModel.items) {
      const row = tbody.insertRow();
      let cell = row.insertCell();
      cell.innerHTML = item.index.toString();

      cell = row. insertCell();
      cell.innerHTML = item.name;

      cell = row.insertCell();
      cell.innerHTML = item.type;

      cell = row.insertCell();
      const button = cell.appendChild(document.createElement("button"));
      button.innerHTML = "Estimate Bounds";
      button.addEventListener('click', () => this.presenter.estimateBounds(item));
    }
  }

  private dispplayTotalProcessTime(data: CellRenderedData) {
    const element = document.getElementById(
      "final-render-total-processing-time"
    );
    if (element) {
      element.innerHTML = this.formatDurationFromMs(data.totalProcessingTime);
    }
  }

  private displayTotalElapsedTime(data: CellRenderedData) {
    const element = document.getElementById("final-render-total-elapsed-time");
    if (element) {
      element.innerHTML = this.formatDurationFromMs(data.totalElapsedTime);
    }
  }

  private displayAverageProcessingTimeperCell(data: CellRenderedData) {
    const element = document.getElementById(
      "final-render-average-cell-processing-time"
    );
    if (element) {
      element.innerHTML = this.formatDurationFromMs(
        data.averageCellLProcessTime
      );
    }
  }

  private displayCellsProcessed(data: CellRenderedData) {
    const element = document.getElementById("final-render-cells-processed");
    if (element) {
      element.innerHTML = data.cellsProcessed.toString();
    }
  }

  private displayCellsPerSecond(data: CellRenderedData) {
    const element = document.getElementById("final-render-cells-per-second");
    if (element) {
      element.innerHTML = data.cellsPerSecond.toString();
    }
  }

  private formatDurationFromMs(milliseconds: number): string {
    const seconds = milliseconds / 1000;
    const rounded = Math.round(seconds * 10) / 10;
    return rounded.toString();
  }

  private assertElementExists(element: HTMLElement | null): HTMLElement {
    if (element) return element;
    throw new Error("Element not found.");
  }

  private attachEventHandlers(): void {
    this.linkProfiles?.addEventListener(
      "click",
      this.presenter.displayProfiles.bind(this.presenter)
    );
    this.linkComposition?.addEventListener(
      "click",
      this.presenter.displayComposition.bind(this.presenter)
    );
    this.linkFinalRender?.addEventListener(
      "click",
      this.presenter.displayFinalRender.bind(this.presenter)
    );
    this.renderButton?.addEventListener(
      "click",
      this.presenter.renderFinalImage.bind(this.presenter)
    );
    this.profileSelect?.addEventListener("change", (e) => {
      this.presenter.selectProfile((e.target as HTMLSelectElement).value);
    });
  }
}
