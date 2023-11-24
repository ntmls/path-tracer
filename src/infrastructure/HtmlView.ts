import { Presenter, ProfileViewModel } from "../application/Presenter";
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
    const totalProcessingTimeElement = document.getElementById(
      "final-render-total-processing-time"
    );
    if (totalProcessingTimeElement) {
      totalProcessingTimeElement.innerHTML =
        data.totalProcessingTime.toString();
    }

    const totalElapsedTimeElement = document.getElementById(
      "final-render-total-elapsed-time"
    );
    if (totalElapsedTimeElement) {
      totalElapsedTimeElement.innerHTML = data.totalElapsedTime.toString();
    }

    const averageProcessingTimePerCellElement = document.getElementById(
      "final-render-average-cell-processing-time"
    );
    if (averageProcessingTimePerCellElement) {
      averageProcessingTimePerCellElement.innerHTML =
        data.averageCellLProcessTime.toString();
    }

    const parallelizationRationElement = document.getElementById(
      "final-render-average-parallelization-ratio"
    );
    if (parallelizationRationElement) {
      let value = 0;
      if (data.totalElapsedTime > 0) {
        value = data.totalProcessingTime / data.totalElapsedTime;
      }
      parallelizationRationElement.innerHTML = value.toString();
    }
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
