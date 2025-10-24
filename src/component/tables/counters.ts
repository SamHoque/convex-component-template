import { defineTable } from "convex/server";
import { v } from "convex/values";

export const Counters = defineTable({
	name: v.string(),
	value: v.number(),
	shard: v.number(),
});
