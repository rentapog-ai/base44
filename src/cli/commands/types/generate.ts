import { Command } from "commander";
import type { CLIContext } from "../../types.js";
import { runCommand, runTask } from "../../utils/index.js";
import type { RunCommandResult } from "../../utils/runCommand.js";
import { readProjectConfig } from "../../../core/index.js";
import { generateTypesFile, updateProjectConfig } from "../../../core/types/index.js";

const TYPES_FILE_PATH = "base44/.types/types.d.ts";

async function generateTypesAction(): Promise<RunCommandResult> {
  const { entities, functions, agents, connectors, project } =
    await readProjectConfig();

  await runTask("Generating types", async () => {
    await generateTypesFile({ entities, functions, agents, connectors });
  });

  const tsconfigUpdated = await updateProjectConfig(project.root);

  return {
    outroMessage: tsconfigUpdated
      ? `Generated ${TYPES_FILE_PATH} and updated tsconfig.json`
      : `Generated ${TYPES_FILE_PATH}`,
  };
}

export function getTypesGenerateCommand(context: CLIContext): Command {
  return new Command("generate")
    .description(
      "Generate TypeScript declaration file (types.d.ts) from project resources",
    )
    .action(async () => {
      await runCommand(
        () => generateTypesAction(),
        { requireAuth: false },
        context,
      );
    });
}
