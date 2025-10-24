import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
	extends: ["gitmoji"],
	rules: {
		"header-max-length": [2, "always", 100],
		"subject-case": [0], // Allow any case in subject
	},
};

export default config;
