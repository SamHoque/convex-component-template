import { defineSchema } from "convex/server";
import { Counters } from "./tables/counters";

export default defineSchema({
	counters: Counters.index("name", ["name", "shard"]),
});
