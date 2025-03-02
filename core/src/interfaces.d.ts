export interface CharacterConfig {
    name: string;
    description: string;
    traits: string[];
    capabilities: string[];
    bio?: string[];
    style?: Record<string, string[]>;
    messageExamples?: any[];
    plugins?: string[];
    clients?: string[];
    modelProvider?: string;
    settings?: {
        secrets?: Record<string, string>;
        voice?: {
            model: string;
        };
    };
    tradingConfig?: {
        maxSlippageTolerance: number;
        riskParameters: {
            slippageWeight: number;
            sizeWeight: number;
            tokenWeight: number;
            sizeBenchmark: number;
        };
        majorTokens: string[];
        maxRiskScore: number;
    };
}
export interface CharacterResponse {
    text: string;
    action?: string;
    metadata?: Record<string, any>;
}
export interface MessageContent {
    text: string;
    action?: string;
}
export interface Message {
    user: string;
    content: MessageContent;
}
//# sourceMappingURL=interfaces.d.ts.map