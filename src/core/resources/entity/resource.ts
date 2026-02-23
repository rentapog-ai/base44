import { readAllEntities } from "./config.js";
import { pushEntities } from "./deploy.js";
import type { Entity } from "./schema.js";
import type { Resource } from "../types.js";

export const entityResource: Resource<Entity> = {
  readAll: readAllEntities,
  push: pushEntities,
};
