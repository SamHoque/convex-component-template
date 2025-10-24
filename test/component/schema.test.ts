import { describe, expect, test } from "bun:test";
import { api } from "../../src/component/_generated/api";
import schema from "../../src/component/schema";
import { convexTest } from "./setup.test.ts";

describe("Component Schema", () => {
	test("should export a schema object", () => {
		expect(schema).toBeDefined();
		expect(typeof schema).toBe("object");
	});

	test("should have tables property", () => {
		expect(schema).toHaveProperty("tables");
	});

	test("should have schemaValidation property", () => {
		expect(schema).toHaveProperty("schemaValidation");
	});

	test("schema should be valid convex schema", () => {
		// Verify the schema has the expected structure
		expect(schema.tables).toBeDefined();
		expect(typeof schema.tables).toBe("object");
	});

	test("should have counters table defined", () => {
		expect(schema.tables).toHaveProperty("counters");
	});
});

describe("counters table schema", () => {
	test("should accept valid counter data", async () => {
		const t = convexTest();

		// Add a counter using the mutation
		await t.mutation(api.lib.add, {
			name: "test-counter",
			count: 5,
		});

		// Verify we can query it back
		const result = await t.query(api.lib.count, { name: "test-counter" });
		expect(result).toBe(5);
	});

	test("should handle multiple shards correctly", async () => {
		const t = convexTest();

		// Add counters with sharding
		await t.mutation(api.lib.add, {
			name: "sharded-counter",
			count: 10,
			shards: 3,
		});
		await t.mutation(api.lib.add, {
			name: "sharded-counter",
			count: 20,
			shards: 3,
		});
		await t.mutation(api.lib.add, {
			name: "sharded-counter",
			count: 30,
			shards: 3,
		});

		// Total should be sum of all shards
		const result = await t.query(api.lib.count, { name: "sharded-counter" });
		expect(result).toBe(60);
	});

	test("should accumulate counts for same counter name", async () => {
		const t = convexTest();

		// Add to the same counter multiple times
		await t.mutation(api.lib.add, {
			name: "accumulator",
			count: 1,
		});
		await t.mutation(api.lib.add, {
			name: "accumulator",
			count: 2,
		});
		await t.mutation(api.lib.add, {
			name: "accumulator",
			count: 3,
		});

		// Should accumulate to 6
		const result = await t.query(api.lib.count, { name: "accumulator" });
		expect(result).toBe(6);
	});

	test("should handle negative counts", async () => {
		const t = convexTest();

		await t.mutation(api.lib.add, {
			name: "negative-counter",
			count: 10,
		});
		await t.mutation(api.lib.add, {
			name: "negative-counter",
			count: -3,
		});

		const result = await t.query(api.lib.count, { name: "negative-counter" });
		expect(result).toBe(7);
	});

	test("should handle zero count", async () => {
		const t = convexTest();

		await t.mutation(api.lib.add, {
			name: "zero-counter",
			count: 0,
		});

		const result = await t.query(api.lib.count, { name: "zero-counter" });
		expect(result).toBe(0);
	});

	test("should handle decimal counts", async () => {
		const t = convexTest();

		await t.mutation(api.lib.add, {
			name: "decimal-counter",
			count: 1.5,
		});
		await t.mutation(api.lib.add, {
			name: "decimal-counter",
			count: 2.3,
		});

		const result = await t.query(api.lib.count, { name: "decimal-counter" });
		expect(result).toBeCloseTo(3.8, 5);
	});

	test("should isolate different counter names", async () => {
		const t = convexTest();

		await t.mutation(api.lib.add, {
			name: "counter-a",
			count: 10,
		});
		await t.mutation(api.lib.add, {
			name: "counter-b",
			count: 20,
		});

		const resultA = await t.query(api.lib.count, { name: "counter-a" });
		const resultB = await t.query(api.lib.count, { name: "counter-b" });

		expect(resultA).toBe(10);
		expect(resultB).toBe(20);
	});

	test("should return 0 for non-existent counter", async () => {
		const t = convexTest();

		const result = await t.query(api.lib.count, {
			name: "non-existent-counter",
		});
		expect(result).toBe(0);
	});

	test("should handle special characters in counter names", async () => {
		const t = convexTest();

		await t.mutation(api.lib.add, {
			name: "counter:with:colons",
			count: 5,
		});
		await t.mutation(api.lib.add, {
			name: "counter-with-dashes",
			count: 10,
		});
		await t.mutation(api.lib.add, {
			name: "counter_with_underscores",
			count: 15,
		});

		expect(await t.query(api.lib.count, { name: "counter:with:colons" })).toBe(
			5,
		);
		expect(await t.query(api.lib.count, { name: "counter-with-dashes" })).toBe(
			10,
		);
		expect(
			await t.query(api.lib.count, { name: "counter_with_underscores" }),
		).toBe(15);
	});

	test("should handle unicode in counter names", async () => {
		const t = convexTest();

		await t.mutation(api.lib.add, {
			name: "カウンター",
			count: 42,
		});
		await t.mutation(api.lib.add, {
			name: "🎉counter🎉",
			count: 100,
		});

		expect(await t.query(api.lib.count, { name: "カウンター" })).toBe(42);
		expect(await t.query(api.lib.count, { name: "🎉counter🎉" })).toBe(100);
	});

	test("should handle large counter values", async () => {
		const t = convexTest();

		await t.mutation(api.lib.add, {
			name: "large-counter",
			count: 1_000_000,
		});
		await t.mutation(api.lib.add, {
			name: "large-counter",
			count: 2_000_000,
		});

		const result = await t.query(api.lib.count, { name: "large-counter" });
		expect(result).toBe(3_000_000);
	});
});
