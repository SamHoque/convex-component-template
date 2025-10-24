import { useShardedCounter } from "@slapinc/convex-component-template/react";
import { api } from "../convex/_generated/api";
import "./index.css";

export function App() {
	const { count, add, isLoading } = useShardedCounter(
		api.example,
		"accomplishments",
	);

	return (
		<div className="min-h-screen bg-gray-50 w-full flex items-center justify-center">
			<div className="container mx-auto px-4">
				<div className="w-full max-w-md mx-auto">
					<div className="bg-white rounded-lg shadow border border-gray-200 p-8">
						<div className="text-center mb-8">
							<h1 className="text-3xl font-bold text-gray-900 mb-2">
								Sharded Counter
							</h1>
							<p className="text-gray-600 text-sm">
								Powered by Convex Components
							</p>
						</div>

						<div className="bg-gray-50 rounded-lg p-8 mb-6 text-center border border-gray-200">
							<div className="text-gray-500 text-sm uppercase tracking-wider mb-2">
								Accomplishments
							</div>
							<div className="text-5xl font-bold text-gray-900 mb-4">
								{count ?? "..."}
							</div>
							<button
								type="button"
								onClick={() => add()}
								disabled={isLoading}
								className="bg-blue-600 text-white font-medium px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Increment Counter
							</button>
						</div>

						<div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
							<p className="text-sm text-gray-700 text-center">
								<code className="text-blue-600 font-mono text-xs">
									example/convex/example.ts
								</code>
								<br />
								<span className="text-gray-500 text-xs">
									Check out the code to see all available features
								</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
