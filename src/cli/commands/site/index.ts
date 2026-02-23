import { Command } from "commander";
import type { CLIContext } from "../../types.js";
import { getSiteDeployCommand } from "./deploy.js";
import { getSiteOpenCommand } from "./open.js";

export function getSiteCommand(context: CLIContext): Command {
  return new Command("site")
    .description("Manage app site (frontend app)")
    .addCommand(getSiteDeployCommand(context))
    .addCommand(getSiteOpenCommand(context));
}
