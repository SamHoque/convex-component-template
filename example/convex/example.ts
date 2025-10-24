import { ShardedCounter } from "@samhoque/convex-component-template";
import { components } from "./_generated/api";

/**
 * Initialize the ShardedCounter client with the mounted component.
 * This provides a type-safe interface to the sharded counter component.
 */
const shardedCounter = new ShardedCounter(components.shardedCounter);

/**
 * Export the API functions for use in the React app.
 * This creates query and mutation wrappers around the component.
 */
export const { add, count } = shardedCounter.api();
