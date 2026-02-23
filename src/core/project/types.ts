import type { ProjectConfig } from "./schema.js";
import type { AgentConfig } from "../resources/agent/index.js";
import type { ConnectorResource } from "../resources/connector/index.js";
import type { Entity } from "../resources/entity/index.js";
import type { BackendFunction } from "../resources/function/index.js";

interface ProjectWithPaths extends ProjectConfig {
  root: string;
  configPath: string;
}

export interface ProjectRoot {
  root: string;
  configPath: string;
}

export interface ProjectData {
  project: ProjectWithPaths;
  entities: Entity[];
  functions: BackendFunction[];
  agents: AgentConfig[];
  connectors: ConnectorResource[];
}
