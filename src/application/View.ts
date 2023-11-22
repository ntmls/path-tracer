import { ProfileViewModel } from "./Presenter";

export interface View {
  showFinalRender(): void;
  showComposition(): void;
  hideProfiles(): void;
  hideFinalRender(): void;
  hideComposition(): void;
  showProfiles(): void;
  visualize2dSdf(profileViewModel: ProfileViewModel): void;
  populateProfileSelection(names: string[]): void;
  updateRenderStatistics(
    totalProcessingTime: number,
    totalElapsedTime: number,
    averageCellLProcessTime: number
  ): void;
}
