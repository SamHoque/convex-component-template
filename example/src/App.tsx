import { useShardedCounter } from "@samhoque/convex-component-template/react";
import { api } from "../convex/_generated/api";
import "./index.css";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function App() {
	const { count, add, isLoading } = useShardedCounter(
		api.example,
		"accomplishments",
	);

	return (
		<main className="min-h-screen bg-background flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-3xl">Sharded Counter</CardTitle>
					<CardDescription>Powered by Convex Components</CardDescription>
				</CardHeader>

				<CardContent className="space-y-6 text-center">
					<Badge variant="secondary">Accomplishments</Badge>
					{count === undefined ? (
						<Skeleton className="h-4 w-4 mx-auto" />
					) : (
						<p className="text-5xl font-bold">{count}</p>
					)}
					<Button
						type="button"
						onClick={() => add()}
						disabled={isLoading}
						size="lg"
						className="w-full"
					>
						Increment Counter
					</Button>

					<Separator />

					<Alert>
						<AlertDescription className="text-center space-y-2">
							<code className="font-mono text-xs block">
								example/convex/example.ts
							</code>
							<span className="text-xs block">
								Check out the code to see all available features
							</span>
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		</main>
	);
}

export default App;
