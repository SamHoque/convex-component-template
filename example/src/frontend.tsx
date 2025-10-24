/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const convexURL = process.env.CONVEX_URL;

if (!convexURL) {
	throw new Error("No convex URL provided!");
}

const convex = new ConvexReactClient(convexURL);

function start() {
	const rootElement = document.getElementById("root");

	if (!rootElement) {
		throw new Error("Could not find root");
	}

	const root = createRoot(rootElement);
	root.render(
		<ConvexProvider client={convex}>
			<App />
		</ConvexProvider>,
	);
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", start);
} else {
	start();
}
