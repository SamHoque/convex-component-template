import component from "@slapinc/convex-component-template/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(component);

export default app;
