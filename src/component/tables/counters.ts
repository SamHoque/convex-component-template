import { z } from "zod";
import { zodTable } from "zodvex";

export const Counters = zodTable("counters", {
	name: z.string(),
	value: z.number(),
	shard: z.number(),
});
