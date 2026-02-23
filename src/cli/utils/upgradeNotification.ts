import { log } from "@clack/prompts";
import { theme } from "./theme.js";
import type { UpgradeInfo } from "./version-check.js";
import { checkForUpgrade } from "./version-check.js";

function formatUpgradeMessage(info: UpgradeInfo): string {
  const { shinyOrange } = theme.colors;
  const { bold } = theme.styles;

  return `${shinyOrange("Update available!")} ${shinyOrange(`${info.currentVersion} → ${info.latestVersion}`)}  ${shinyOrange("Run:")} ${bold(shinyOrange("npm install -g base44@latest"))}`;
}

export async function printUpgradeNotificationIfAvailable(): Promise<void> {
  try {
    const upgradeInfo = await checkForUpgrade();
    if (upgradeInfo) {
      log.message(formatUpgradeMessage(upgradeInfo));
    }
  } catch {
    // Silently ignore errors
  }
}
