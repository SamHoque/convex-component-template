import { z } from "zod";
import { zm, zq } from "../utils.js";

export const add = zm({
	args: z.object({
		name: z.string(),
		count: z.number(),
		shards: z.number().optional(),
	}),
	returns: z.void(),
	handler: async (ctx, args) => {
		const shard = Math.floor(Math.random() * (args.shards ?? 1));
		const counter = await ctx.db
			.query("counters")
			.withIndex("name", (q) => q.eq("name", args.name).eq("shard", shard))
			.unique();
		if (counter) {
			await ctx.db.patch(counter._id, {
				value: counter.value + args.count,
			});
		} else {
			await ctx.db.insert("counters", {
				name: args.name,
				value: args.count,
				shard,
			});
		}
	},
});

export const count = zq({
	args: { name: z.string() },
	returns: z.number(),
	handler: async (ctx, args) => {
		const counters = await ctx.db
			.query("counters")
			.withIndex("name", (q) => q.eq("name", args.name))
			.collect();
		return counters.reduce((sum, counter) => sum + counter.value, 0);
	},
});
