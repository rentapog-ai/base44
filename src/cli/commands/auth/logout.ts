import { Command } from "commander";
import type { CLIContext } from "../../types.js";
import { runCommand } from "../../utils/index.js";
import type { RunCommandResult } from "../../utils/runCommand.js";
import { deleteAuth } from "../../../core/auth/index.js";

async function logout(): Promise<RunCommandResult> {
  await deleteAuth();
  return { outroMessage: "Logged out successfully" };
}

export function getLogoutCommand(context: CLIContext): Command {
  return new Command("logout")
    .description("Logout from current device")
    .action(async () => {
      await runCommand(logout, { requireAppConfig: false }, context);
    });
}
