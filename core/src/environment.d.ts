import { z } from "zod";
export declare const envSchema: any;
export type EnvConfig = z.infer<typeof envSchema>;
export declare function validateEnv(): EnvConfig;
export declare const CharacterSchema: any;
export type CharacterConfig = z.infer<typeof CharacterSchema>;
export declare function validateCharacterConfig(json: unknown): CharacterConfig;
//# sourceMappingURL=environment.d.ts.map