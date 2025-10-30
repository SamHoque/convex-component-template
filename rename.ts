#!/usr/bin/env bun

/**
 * Convex Component Setup Script
 * Run: bun rename.ts
 *
 * Purpose:
 * - Prompt user for component info
 * - Generate name variants
 * - Replace identifiers across files
 * - Optionally delete itself after setup
 */

import { basename } from "node:path";
import { Glob } from "bun";

// -----------------------------
// 🔤 Case Utilities
// -----------------------------
const Case = {
	pascal: (s: string) =>
		s
			.replaceAll(/[-_\s]+(.)?/g, (_, c) => c?.toUpperCase() || "")
			.replace(/^./, (c) => c.toUpperCase()),

	camel(s: string) {
		const p = this.pascal(s);
		return p === p.toUpperCase()
			? p.toLowerCase()
			: p[0]?.toLowerCase() + p.slice(1);
	},

	kebab: (s: string) =>
		s
			.replaceAll(/([a-z])([A-Z])/g, "$1-$2")
			.replaceAll(/[-_\s]+/g, "-")
			.toLowerCase(),

	snake: (s: string) =>
		s
			.replaceAll(/([a-z])([A-Z])/g, "$1_$2")
			.replaceAll(/[-_\s]+/g, "_")
			.toLowerCase(),

	space: (s: string) =>
		s
			.replaceAll(/([a-z])([A-Z])/g, "$1 $2")
			.replaceAll(/[-_]+/g, " ")
			.toLowerCase(),

	title(s: string) {
		if (s === s.toUpperCase()) return s;
		return this.space(s)
			.split(" ")
			.map((w) => w[0]?.toUpperCase() + w.slice(1))
			.join(" ");
	},
};

// -----------------------------
// 🧠 Prompt Utilities
// -----------------------------
// Create a single shared async iterator to avoid "ReadableStream is locked" error
const stdinIterator = console[Symbol.asyncIterator]();

const ask = async (msg: string, def = ""): Promise<string> => {
	process.stdout.write(`${msg}${def ? ` [${def}]` : ""}: `);
	const result = await stdinIterator.next();
	return result.value?.trim() || def;
};

const confirm = async (msg: string) => {
	process.stdout.write(`${msg} (y/N): `);
	const result = await stdinIterator.next();
	return result.value ? /^y(es)?$/i.test(result.value.trim()) : false;
};

// -----------------------------
// ⚙️ Main
// -----------------------------
const dir = basename(import.meta.dir);
console.log("🚀 Convex Component Setup\n");

const name = await ask("Enter your component name (e.g. document search)", dir);
if (!name) throw new Error("Component name is required.");

const defaultPkg = `@samhoque/${Case.kebab(name)}`;
const defaultRepo = `samhoque/${Case.kebab(name)}`;

const pkg = await ask("NPM package name", defaultPkg);
const repo = await ask("GitHub repository", defaultRepo);
if (!pkg || !repo)
	throw new Error("NPM package and repository names are required.");

// Generate case variants
const cases = {
	pascal: Case.pascal(name),
	camel: Case.camel(name),
	kebab: Case.kebab(name),
	snake: Case.snake(name),
	space: Case.space(name),
	title: Case.title(name),
};

console.log("\n🧩 Name Variants:");
for (const [k, v] of Object.entries(cases)) {
	console.log(`  ${k}: ${v}`);
}
console.log(`  npm: ${pkg}\n  repo: ${repo}\n`);

// -----------------------------
// 🧾 Update package.json
// -----------------------------
const pkgFile = Bun.file("package.json");
const pkgJson = await pkgFile.json();
if (pkgJson.name !== pkg) {
	pkgJson.name = pkg;
	await Bun.write("package.json", `${JSON.stringify(pkgJson, null, 2)}\n`);
	console.log(`📦 Updated package.json name → ${pkg}`);
}

// -----------------------------
// 🧬 Replacement Map
// -----------------------------
const replacements: [string, string][] = [
	// Package and repository
	["@samhoque/convex-component-template", pkg],
	["samhoque/convex-component-template", repo],
	["OWNER/REPO", repo],
	["@samhoque%2Fconvex-component-template", pkg.replace("/", "%2F")],

	// Component name variants
	["ShardedCounter", cases.pascal],
	["shardedCounter", cases.camel],
	["sharded-counter", cases.kebab],
	["sharded_counter", cases.snake],
	["sharded counter", cases.space],
	["Sharded Counter", cases.title],
];

// -----------------------------
// 🔄 File Processing
// -----------------------------
const glob = new Glob("**/*");
let updated = 0;

for await (const path of glob.scan({ cwd: ".", onlyFiles: true })) {
	if (/node_modules|\.git|\.cursor|_generated|rename\.(mjs|ts)/.test(path))
		continue;

	try {
		let content = await Bun.file(path).text();
		let changed = false;
		for (const [from, to] of replacements) {
			if (content.includes(from)) {
				content = content.replaceAll(from, to);
				changed = true;
			}
		}
		if (changed) {
			await Bun.write(path, content);
			updated++;
		}
	} catch {}
}

console.log(`✅ Updated ${updated} files.`);

// -----------------------------
// 🧹 Optional Self-Delete
// -----------------------------
if (await confirm("Delete rename.ts now?")) {
	try {
		await Bun.file("./rename.ts").delete();
		console.log("🗑️  Script deleted.");
	} catch (e) {
		console.error("❌ Failed to delete script:", e);
	}
} else console.log("📝 Script retained.");

console.log("\n✨ Setup complete! Check README.md for next steps.");
