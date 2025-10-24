import { describe, expect, test } from "bun:test";
import { convexTest } from "../setup.test.ts";

describe("organizations table schema", () => {
	test("should create and retrieve organization", async () => {
		const t = convexTest();
		const now = Date.now();

		const orgId = await t.run(async (ctx) => {
			return await ctx.db.insert("organizations", {
				name: "Test Organization",
				color: "#FF5733",
				createdBy: "user_123",
				createdAt: now,
			});
		});

		const org = await t.run(async (ctx) => {
			return await ctx.db.get(orgId);
		});

		expect(org?.name).toBe("Test Organization");
		expect(org?.color).toBe("#FF5733");
		expect(org?.createdBy).toBe("user_123");
		expect(org?.createdAt).toBe(now);
	});

	test("should support optional image and metadata fields", async () => {
		const t = convexTest();

		const storageId = await t.run(async (ctx) => {
			return await ctx.storage.store(new Blob(["test"]));
		});

		const orgId = await t.run(async (ctx) => {
			return await ctx.db.insert("organizations", {
				name: "Test Org",
				color: "#000000",
				createdBy: "user_123",
				createdAt: Date.now(),
				image: storageId,
				metadata: { test: "data" } as any,
			});
		});

		const org = await t.run(async (ctx) => {
			return await ctx.db.get(orgId);
		});

		expect(org?.image).toBe(storageId);
		expect(org?.metadata).toEqual({ test: "data" });
	});

	test("should update and delete organizations", async () => {
		const t = convexTest();

		const orgId = await t.run(async (ctx) => {
			return await ctx.db.insert("organizations", {
				name: "Original",
				color: "#AAAAAA",
				createdBy: "user_123",
				createdAt: Date.now(),
			});
		});

		await t.run(async (ctx) => {
			await ctx.db.patch(orgId, { name: "Updated" });
		});

		const updated = await t.run(async (ctx) => {
			return await ctx.db.get(orgId);
		});

		expect(updated?.name).toBe("Updated");

		await t.run(async (ctx) => {
			await ctx.db.delete(orgId);
		});

		const deleted = await t.run(async (ctx) => {
			return await ctx.db.get(orgId);
		});

		expect(deleted).toBeNull();
	});
});
