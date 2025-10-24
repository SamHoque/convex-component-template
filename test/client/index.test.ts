import { describe, expect, test } from "bun:test";
import { defineSchema } from "convex/server";
import { ShardedCounter } from "../../src/client";
import { components, initConvexTest } from "./setup.test.js";

// The schema for the tests
const schema = defineSchema({});

describe("ShardedCounter thick client", () => {
	test("should make thick client", async () => {
		const c = new ShardedCounter(components.shardedCounter);
		const t = initConvexTest(schema);
		await t.run(async (ctx) => {
			await c.add(ctx, "beans", 1);
			expect(await c.count(ctx, "beans")).toBe(1);
		});
	});

	test("should add multiple times", async () => {
		const c = new ShardedCounter(components.shardedCounter);
		const t = initConvexTest(schema);
		await t.run(async (ctx) => {
			await c.add(ctx, "apples", 5);
			await c.add(ctx, "apples", 3);
			await c.add(ctx, "apples", 2);
			expect(await c.count(ctx, "apples")).toBe(10);
		});
	});

	test("should handle different counters independently", async () => {
		const c = new ShardedCounter(components.shardedCounter);
		const t = initConvexTest(schema);
		await t.run(async (ctx) => {
			await c.add(ctx, "oranges", 7);
			await c.add(ctx, "bananas", 3);
			expect(await c.count(ctx, "oranges")).toBe(7);
			expect(await c.count(ctx, "bananas")).toBe(3);
		});
	});

	test("should use configured shards", async () => {
		const c = new ShardedCounter(components.shardedCounter, {
			shards: {
				friends: 2,
			},
		});
		const t = initConvexTest(schema);
		await t.run(async (ctx) => {
			await c.add(ctx, "friends", 10);
			await c.add(ctx, "friends", 5);
			expect(await c.count(ctx, "friends")).toBe(15);
		});
	});

	test("should use defaultShards when specific shard not configured", async () => {
		const c = new ShardedCounter(components.shardedCounter, {
			defaultShards: 4,
		});
		const t = initConvexTest(schema);
		await t.run(async (ctx) => {
			await c.add(ctx, "random", 8);
			await c.add(ctx, "random", 2);
			expect(await c.count(ctx, "random")).toBe(10);
		});
	});

	test("should work with api() helper - generates queries and mutations", () => {
		const c = new ShardedCounter(components.shardedCounter);
		const api = c.api();

		// Verify the API has the expected structure
		expect(api.add).toBeDefined();
		expect(api.count).toBeDefined();
		expect(typeof api.add).toBe("function");
		expect(typeof api.count).toBe("function");
	});

	test("should handle negative counts (decrement)", async () => {
		const c = new ShardedCounter(components.shardedCounter);
		const t = initConvexTest(schema);
		await t.run(async (ctx) => {
			await c.add(ctx, "credits", 100);
			await c.add(ctx, "credits", -30);
			expect(await c.count(ctx, "credits")).toBe(70);
		});
	});

	test("should return 0 for non-existent counter", async () => {
		const c = new ShardedCounter(components.shardedCounter);
		const t = initConvexTest(schema);
		await t.run(async (ctx) => {
			expect(await c.count(ctx, "nonexistent")).toBe(0);
		});
	});

	test("should handle multiple sharded counters with different shard counts", async () => {
		const c = new ShardedCounter(components.shardedCounter, {
			shards: {
				highTraffic: 16,
				lowTraffic: 1,
			},
		});
		const t = initConvexTest(schema);
		await t.run(async (ctx) => {
			// Add to high traffic counter
			await c.add(ctx, "highTraffic", 5);
			await c.add(ctx, "highTraffic", 3);
			expect(await c.count(ctx, "highTraffic")).toBe(8);

			// Add to low traffic counter
			await c.add(ctx, "lowTraffic", 2);
			expect(await c.count(ctx, "lowTraffic")).toBe(2);
		});
	});
});
