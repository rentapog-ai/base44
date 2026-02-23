import { Command } from "commander";
import { getAgentsCommand } from "./commands/agents/index.js";
import { getLoginCommand } from "./commands/auth/login.js";
import { getLogoutCommand } from "./commands/auth/logout.js";
import { getWhoamiCommand } from "./commands/auth/whoami.js";
import { getConnectorsCommand } from "./commands/connectors/index.js";
import { getDashboardCommand } from "./commands/dashboard/index.js";
import { getEntitiesPushCommand } from "./commands/entities/push.js";
import { getFunctionsDeployCommand } from "./commands/functions/deploy.js";
import { getCreateCommand } from "./commands/project/create.js";
import { getDeployCommand } from "./commands/project/deploy.js";
import { getLinkCommand } from "./commands/project/link.js";
import { getLogsCommand } from "./commands/project/logs.js";
import { getSiteCommand } from "./commands/site/index.js";
import { getTypesCommand } from "./commands/types/index.js";
import packageJson from "../../package.json";
import { getDevCommand } from "./commands/dev.js";
import { getEjectCommand } from "./commands/project/eject.js";
import type { CLIContext } from "./types.js";

export function createProgram(context: CLIContext): Command {
  const program = new Command();

  program
    .name("base44")
    .description(
      "Base44 CLI - Unified interface for managing Base44 applications",
    )
    .version(packageJson.version);

  program.configureHelp({
    sortSubcommands: true,
  });

  // Register authentication commands
  program.addCommand(getLoginCommand(context));
  program.addCommand(getWhoamiCommand(context));
  program.addCommand(getLogoutCommand(context));

  // Register project commands
  program.addCommand(getCreateCommand(context));
  program.addCommand(getDashboardCommand(context));
  program.addCommand(getDeployCommand(context));
  program.addCommand(getLinkCommand(context));
  program.addCommand(getEjectCommand(context));

  // Register entities commands
  program.addCommand(getEntitiesPushCommand(context));

  // Register agents commands
  program.addCommand(getAgentsCommand(context));

  // Register connectors commands
  program.addCommand(getConnectorsCommand(context));

  // Register functions commands
  program.addCommand(getFunctionsDeployCommand(context));

  // Register site commands
  program.addCommand(getSiteCommand(context));

  // Register types command
  program.addCommand(getTypesCommand(context));

  // Register development commands
  program.addCommand(getDevCommand(context), { hidden: true });

  // Register logs command
  program.addCommand(getLogsCommand(context), { hidden: true });

  return program;
}
