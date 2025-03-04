import { type Character, type HandlerCallback, type IAgentRuntime, type ICacheManager, type IDatabaseAdapter, type IMemoryManager, type IRAGKnowledgeManager, type IVerifiableInferenceAdapter, ModelProviderName, type Plugin, type Provider, type Service, type ServiceType, type State, type UUID, type Action, type Evaluator, type Memory } from "./types.ts";
export declare class AgentRuntime implements IAgentRuntime {
    #private;
    /**
     * The ID of the agent
     */
    agentId: UUID;
    /**
     * The base URL of the server where the agent's requests are processed.
     */
    serverUrl: string;
    /**
     * The database adapter used for interacting with the database.
     */
    databaseAdapter: IDatabaseAdapter;
    /**
     * Authentication token used for securing requests.
     */
    token: string | null;
    /**
     * Custom actions that the agent can perform.
     */
    actions: Action[];
    /**
     * Evaluators used to assess and guide the agent's responses.
     */
    evaluators: Evaluator[];
    /**
     * Context providers used to provide context for message generation.
     */
    providers: Provider[];
    plugins: Plugin[];
    /**
     * The model to use for generateText.
     */
    modelProvider: ModelProviderName;
    /**
     * The model to use for generateImage.
     */
    imageModelProvider: ModelProviderName;
    /**
     * The model to use for describing images.
     */
    imageVisionModelProvider: ModelProviderName;
    /**
     * Fetch function to use
     * Some environments may not have access to the global fetch function and need a custom fetch override.
     */
    fetch: typeof fetch;
    /**
     * The character to use for the agent
     */
    character: Character;
    /**
     * Store messages that are sent and received by the agent.
     */
    messageManager: IMemoryManager;
    /**
     * Store and recall descriptions of users based on conversations.
     */
    descriptionManager: IMemoryManager;
    /**
     * Manage the creation and recall of static information (documents, historical game lore, etc)
     */
    loreManager: IMemoryManager;
    /**
     * Hold large documents that can be referenced
     */
    documentsManager: IMemoryManager;
    /**
     * Searchable document fragments
     */
    knowledgeManager: IMemoryManager;
    ragKnowledgeManager: IRAGKnowledgeManager;
    private readonly knowledgeRoot;
    services: Map<ServiceType, Service>;
    memoryManagers: Map<string, IMemoryManager>;
    cacheManager: ICacheManager;
    clients: Record<string, any>;
    verifiableInferenceAdapter?: IVerifiableInferenceAdapter;
    registerMemoryManager(manager: IMemoryManager): void;
    getMemoryManager(tableName: string): IMemoryManager | null;
    getService<T extends Service>(service: ServiceType): T | null;
    registerService(service: Service): Promise<void>;
    /**
     * Creates an instance of AgentRuntime.
     * @param opts - The options for configuring the AgentRuntime.
     * @param opts.conversationLength - The number of messages to hold in the recent message cache.
     * @param opts.token - The JWT token, can be a JWT token if outside worker, or an OpenAI token if inside worker.
     * @param opts.serverUrl - The URL of the worker.
     * @param opts.actions - Optional custom actions.
     * @param opts.evaluators - Optional custom evaluators.
     * @param opts.services - Optional custom services.
     * @param opts.memoryManagers - Optional custom memory managers.
     * @param opts.providers - Optional context providers.
     * @param opts.model - The model to use for generateText.
     * @param opts.embeddingModel - The model to use for embedding.
     * @param opts.agentId - Optional ID of the agent.
     * @param opts.databaseAdapter - The database adapter used for interacting with the database.
     * @param opts.fetch - Custom fetch function to use for making requests.
     */
    constructor(opts: {
        conversationLength?: number;
        agentId?: UUID;
        character?: Character;
        token: string;
        serverUrl?: string;
        actions?: Action[];
        evaluators?: Evaluator[];
        plugins?: Plugin[];
        providers?: Provider[];
        modelProvider: ModelProviderName;
        services?: Service[];
        managers?: IMemoryManager[];
        databaseAdapter: IDatabaseAdapter;
        fetch?: typeof fetch | unknown;
        speechModelPath?: string;
        cacheManager: ICacheManager;
        logging?: boolean;
        verifiableInferenceAdapter?: IVerifiableInferenceAdapter;
    });
    initialize(): Promise<void>;
    stop(): Promise<void>;
    /**
     * Processes character knowledge by creating document memories and fragment memories.
     * This function takes an array of knowledge items, creates a document memory for each item if it doesn't exist,
     * then chunks the content into fragments, embeds each fragment, and creates fragment memories.
     * @param knowledge An array of knowledge items containing id, path, and content.
     */
    private processCharacterKnowledge;
    /**
     * Processes character knowledge by creating document memories and fragment memories.
     * This function takes an array of knowledge items, creates a document knowledge for each item if it doesn't exist,
     * then chunks the content into fragments, embeds each fragment, and creates fragment knowledge.
     * An array of knowledge items or objects containing id, path, and content.
     */
    private processCharacterRAGKnowledge;
    /**
     * Processes directory-based RAG knowledge by recursively loading and processing files.
     * @param dirConfig The directory configuration containing path and shared flag
     */
    private processCharacterRAGDirectory;
    getSetting(key: string): any;
    /**
     * Get the number of messages that are kept in the conversation buffer.
     * @returns The number of recent messages to be kept in memory.
     */
    getConversationLength(): number;
    /**
     * Register an action for the agent to perform.
     * @param action The action to register.
     */
    registerAction(action: Action): void;
    /**
     * Register an evaluator to assess and guide the agent's responses.
     * @param evaluator The evaluator to register.
     */
    registerEvaluator(evaluator: Evaluator): void;
    /**
     * Register a context provider to provide context for message generation.
     * @param provider The context provider to register.
     */
    registerContextProvider(provider: Provider): void;
    /**
     * Process the actions of a message.
     * @param message The message to process.
     * @param content The content of the message to process actions from.
     */
    processActions(message: Memory, responses: Memory[], state?: State, callback?: HandlerCallback): Promise<void>;
    /**
     * Evaluate the message and state using the registered evaluators.
     * @param message The message to evaluate.
     * @param state The state of the agent.
     * @param didRespond Whether the agent responded to the message.~
     * @param callback The handler callback
     * @returns The results of the evaluation.
     */
    evaluate(message: Memory, state: State, didRespond?: boolean, callback?: HandlerCallback): Promise<string[]>;
    /**
     * Ensure the existence of a participant in the room. If the participant does not exist, they are added to the room.
     * @param userId - The user ID to ensure the existence of.
     * @throws An error if the participant cannot be added.
     */
    ensureParticipantExists(userId: UUID, roomId: UUID): Promise<void>;
    /**
     * Ensure the existence of a user in the database. If the user does not exist, they are added to the database.
     * @param userId - The user ID to ensure the existence of.
     * @param userName - The user name to ensure the existence of.
     * @returns
     */
    ensureUserExists(userId: UUID, userName: string | null, name: string | null, email?: string | null, source?: string | null): Promise<void>;
    ensureParticipantInRoom(userId: UUID, roomId: UUID): Promise<void>;
    ensureConnection(userId: UUID, roomId: UUID, userName?: string, userScreenName?: string, source?: string): Promise<void>;
    /**
     * Ensure the existence of a room between the agent and a user. If no room exists, a new room is created and the user
     * and agent are added as participants. The room ID is returned.
     * @param userId - The user ID to create a room with.
     * @returns The room ID of the room between the agent and the user.
     * @throws An error if the room cannot be created.
     */
    ensureRoomExists(roomId: UUID): Promise<void>;
    /**
     * Compose the state of the agent into an object that can be passed or used for response generation.
     * @param message The message to compose the state from.
     * @returns The state of the agent.
     */
    composeState(message: Memory, additionalKeys?: {
        [key: string]: unknown;
    }): Promise<State>;
    updateRecentMessageState(state: State): Promise<State>;
    getVerifiableInferenceAdapter(): IVerifiableInferenceAdapter | undefined;
    setVerifiableInferenceAdapter(adapter: IVerifiableInferenceAdapter): void;
}
//# sourceMappingURL=runtime.d.ts.map