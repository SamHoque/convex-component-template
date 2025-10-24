import { describe, expect, test } from "bun:test";
import { api } from "../../src/component/_generated/api";
import { convexTest } from "./setup.test.ts";

describe("component lib", () => {
	test("add and subtract", async () => {
		const t = convexTest();
		await t.mutation(api.lib.add, { name: "beans", count: 10 });
		expect(await t.query(api.lib.count, { name: "beans" })).toEqual(10);
	});

	test("add multiple times to same counter", async () => {
		const t = convexTest();
		await t.mutation(api.lib.add, { name: "apples", count: 5 });
		await t.mutation(api.lib.add, { name: "apples", count: 3 });
		await t.mutation(api.lib.add, { name: "apples", count: 2 });
		expect(await t.query(api.lib.count, { name: "apples" })).toEqual(10);
	});

	test("different counters are independent", async () => {
		const t = convexTest();
		await t.mutation(api.lib.add, { name: "oranges", count: 7 });
		await t.mutation(api.lib.add, { name: "bananas", count: 3 });
		expect(await t.query(api.lib.count, { name: "oranges" })).toEqual(7);
		expect(await t.query(api.lib.count, { name: "bananas" })).toEqual(3);
	});

	test("count returns 0 for non-existent counter", async () => {
		const t = convexTest();
		expect(await t.query(api.lib.count, { name: "nonexistent" })).toEqual(0);
	});

	test("add with negative count works", async () => {
		const t = convexTest();
		await t.mutation(api.lib.add, { name: "credits", count: 100 });
		await t.mutation(api.lib.add, { name: "credits", count: -30 });
		expect(await t.query(api.lib.count, { name: "credits" })).toEqual(70);
	});

	test("add with shards parameter", async () => {
		const t = convexTest();
		await t.mutation(api.lib.add, { name: "sharded", count: 5, shards: 3 });
		await t.mutation(api.lib.add, { name: "sharded", count: 3, shards: 3 });
		await t.mutation(api.lib.add, { name: "sharded", count: 2, shards: 3 });
		// The count query should sum across all shards
		const total = await t.query(api.lib.count, { name: "sharded" });
		expect(total).toEqual(10);
	});
});
