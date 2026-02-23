import { readAllFunctions } from "./config.js";
import { pushFunctions } from "./deploy.js";
import type { BackendFunction } from "./schema.js";
import type { Resource } from "../types.js";

export const functionResource: Resource<BackendFunction> = {
  readAll: readAllFunctions,
  push: pushFunctions,
};
