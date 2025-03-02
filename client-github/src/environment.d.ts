import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";
export declare const githubEnvSchema: any;
export type GithubConfig = z.infer<typeof githubEnvSchema>;
export declare function validateGithubConfig(runtime: IAgentRuntime): Promise<GithubConfig>;
//# sourceMappingURL=environment.d.ts.map