import { zActionBuilder, zMutationBuilder, zQueryBuilder } from "zodvex";
import { action, mutation, query } from "./component/_generated/server";

export const zq = zQueryBuilder(query);
export const zm = zMutationBuilder(mutation);
export const za = zActionBuilder(action);
