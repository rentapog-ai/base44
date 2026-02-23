import type { KyResponse } from "ky";
import { getAppClient } from "../../clients/index.js";
import { ApiError, SchemaValidationError } from "../../errors.js";
import type {
  Entity,
  SyncEntitiesResponse,
} from "./schema.js";
import { SyncEntitiesResponseSchema } from "./schema.js";

export async function syncEntities(
  entities: Entity[],
): Promise<SyncEntitiesResponse> {
  const appClient = getAppClient();
  const schemaSyncPayload = Object.fromEntries(
    entities.map((entity) => [entity.name, entity]),
  );

  let response: KyResponse;
  try {
    response = await appClient.put("entity-schemas", {
      json: {
        entityNameToSchema: schemaSyncPayload,
      },
      timeout: 60_000,
    });
  } catch (error) {
    throw await ApiError.fromHttpError(error, "syncing entities");
  }

  const result = SyncEntitiesResponseSchema.safeParse(await response.json());

  if (!result.success) {
    throw new SchemaValidationError(
      "Invalid response from server",
      result.error,
    );
  }

  return result.data;
}
