import { defineSchema } from "convex/server";
import { Counters } from "./tables/counters";

export default defineSchema({
	counters: Counters.table.index("name", ["name", "shard"]),
});
