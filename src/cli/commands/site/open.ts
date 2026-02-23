import { Command } from "commander";
import open from "open";
import type { CLIContext } from "../../types.js";
import { runCommand } from "../../utils/index.js";
import type { RunCommandResult } from "../../utils/runCommand.js";
import { getSiteUrl } from "../../../core/site/index.js";

async function openAction(
  isNonInteractive: boolean,
): Promise<RunCommandResult> {
  const siteUrl = await getSiteUrl();

  if (!isNonInteractive) {
    await open(siteUrl);
  }

  return { outroMessage: `Site opened at ${siteUrl}` };
}

export function getSiteOpenCommand(context: CLIContext): Command {
  return new Command("open")
    .description("Open the published site in your browser")
    .action(async () => {
      await runCommand(
        () => openAction(context.isNonInteractive),
        { requireAuth: true },
        context,
      );
    });
}
