"use client";

import { useMutation, useQuery } from "convex/react";

// This is where React components / hooks go.

/**
 * Hook to use the sharded counter component in React apps.
 * Provides both the count query and add mutation with optimistic updates.
 *
 * @param api - The API wrapper from your Convex app that wraps the component (e.g., api.example)
 * @param name - The name of the counter to track
 *
 * @example
 * ```tsx
 * // In your convex/example.ts, create the API wrapper:
 * import { ShardedCounter } from "@samhoque/convex-component-template";
 * import { components } from "./_generated/api";
 *
 * const shardedCounter = new ShardedCounter(components.shardedCounter);
 * export const { add, count } = shardedCounter.api();
 *
 * // Then in your React component:
 * import { api } from "../convex/_generated/api";
 * import { useShardedCounter } from "@samhoque/convex-component-template/react";
 *
 * export function MyComponent() {
 *   const { count, add, isLoading } = useShardedCounter(api.example, "accomplishments");
 *
 *   return (
 *     <div>
 *       <p>Count: {count ?? "Loading..."}</p>
 *       <button onClick={() => add()} disabled={isLoading}>
 *         Increment
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
// biome-ignore lint/suspicious/noExplicitAny: The exported shardedCounter.api() object from consumer apps varies in structure, making strict typing impractical for a reusable component library. Consumers can optionally provide a type via the generic parameter.
export const useShardedCounter = <T = any>(api: T, name: string) => {
	// biome-ignore lint/suspicious/noExplicitAny: Cast to any for property access since T is generic
	const apiAny = api as any;

	// Get the current count
	const count = useQuery(apiAny.count, { name });

	// Create the add mutation with optimistic update
	const addMutation = useMutation(apiAny.add).withOptimisticUpdate(
		(localStore, args) => {
			// Get the current count from the local store
			const currentCount = localStore.getQuery(apiAny.count, {
				name: args.name,
			});

			// If the count is loaded, optimistically update it by adding 1
			if (currentCount !== undefined) {
				localStore.setQuery(
					apiAny.count,
					{ name: args.name },
					currentCount + 1,
				);
			}
		},
	);

	// Wrapper function to call the mutation with the counter name
	const add = () => {
		return addMutation({ name });
	};

	return {
		count,
		add,
		isLoading: count === undefined,
	};
};
