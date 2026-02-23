import { Command } from "commander";
import type { CLIContext } from "../../types.js";
import { getAgentsPullCommand } from "./pull.js";
import { getAgentsPushCommand } from "./push.js";

export function getAgentsCommand(context: CLIContext): Command {
  return new Command("agents")
    .description("Manage project agents")
    .addCommand(getAgentsPushCommand(context))
    .addCommand(getAgentsPullCommand(context));
}
