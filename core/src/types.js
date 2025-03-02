/**
 * Status enum for goals
 */
export var GoalStatus;
(function (GoalStatus) {
    GoalStatus["DONE"] = "DONE";
    GoalStatus["FAILED"] = "FAILED";
    GoalStatus["IN_PROGRESS"] = "IN_PROGRESS";
})(GoalStatus || (GoalStatus = {}));
/**
 * Model size/type classification
 */
export var ModelClass;
(function (ModelClass) {
    ModelClass["SMALL"] = "small";
    ModelClass["MEDIUM"] = "medium";
    ModelClass["LARGE"] = "large";
    ModelClass["EMBEDDING"] = "embedding";
    ModelClass["IMAGE"] = "image";
})(ModelClass || (ModelClass = {}));
/**
 * Available model providers
 */
export var ModelProviderName;
(function (ModelProviderName) {
    ModelProviderName["OPENAI"] = "openai";
    ModelProviderName["ETERNALAI"] = "eternalai";
    ModelProviderName["ANTHROPIC"] = "anthropic";
    ModelProviderName["GROK"] = "grok";
    ModelProviderName["GROQ"] = "groq";
    ModelProviderName["LLAMACLOUD"] = "llama_cloud";
    ModelProviderName["TOGETHER"] = "together";
    ModelProviderName["LLAMALOCAL"] = "llama_local";
    ModelProviderName["LMSTUDIO"] = "lmstudio";
    ModelProviderName["GOOGLE"] = "google";
    ModelProviderName["MISTRAL"] = "mistral";
    ModelProviderName["CLAUDE_VERTEX"] = "claude_vertex";
    ModelProviderName["REDPILL"] = "redpill";
    ModelProviderName["OPENROUTER"] = "openrouter";
    ModelProviderName["OLLAMA"] = "ollama";
    ModelProviderName["HEURIST"] = "heurist";
    ModelProviderName["GALADRIEL"] = "galadriel";
    ModelProviderName["FAL"] = "falai";
    ModelProviderName["GAIANET"] = "gaianet";
    ModelProviderName["ALI_BAILIAN"] = "ali_bailian";
    ModelProviderName["VOLENGINE"] = "volengine";
    ModelProviderName["NANOGPT"] = "nanogpt";
    ModelProviderName["HYPERBOLIC"] = "hyperbolic";
    ModelProviderName["VENICE"] = "venice";
    ModelProviderName["NVIDIA"] = "nvidia";
    ModelProviderName["NINETEEN_AI"] = "nineteen_ai";
    ModelProviderName["AKASH_CHAT_API"] = "akash_chat_api";
    ModelProviderName["LIVEPEER"] = "livepeer";
    ModelProviderName["LETZAI"] = "letzai";
    ModelProviderName["DEEPSEEK"] = "deepseek";
    ModelProviderName["INFERA"] = "infera";
    ModelProviderName["BEDROCK"] = "bedrock";
    ModelProviderName["ATOMA"] = "atoma";
})(ModelProviderName || (ModelProviderName = {}));
/**
 * Available client platforms
 */
export var Clients;
(function (Clients) {
    Clients["ALEXA"] = "alexa";
    Clients["DISCORD"] = "discord";
    Clients["DIRECT"] = "direct";
    Clients["TWITTER"] = "twitter";
    Clients["TELEGRAM"] = "telegram";
    Clients["TELEGRAM_ACCOUNT"] = "telegram-account";
    Clients["FARCASTER"] = "farcaster";
    Clients["LENS"] = "lens";
    Clients["AUTO"] = "auto";
    Clients["SLACK"] = "slack";
    Clients["GITHUB"] = "github";
    Clients["INSTAGRAM"] = "instagram";
    Clients["SIMSAI"] = "simsai";
    Clients["XMTP"] = "xmtp";
    Clients["DEVA"] = "deva";
})(Clients || (Clients = {}));
export var CacheStore;
(function (CacheStore) {
    CacheStore["REDIS"] = "redis";
    CacheStore["DATABASE"] = "database";
    CacheStore["FILESYSTEM"] = "filesystem";
})(CacheStore || (CacheStore = {}));
export class Service {
    static instance = null;
    static get serviceType() {
        throw new Error("Service must implement static serviceType getter");
    }
    static getInstance() {
        if (!Service.instance) {
            Service.instance = new this();
        }
        return Service.instance;
    }
    get serviceType() {
        return this.constructor.serviceType;
    }
}
export var IrysMessageType;
(function (IrysMessageType) {
    IrysMessageType["REQUEST"] = "REQUEST";
    IrysMessageType["DATA_STORAGE"] = "DATA_STORAGE";
    IrysMessageType["REQUEST_RESPONSE"] = "REQUEST_RESPONSE";
})(IrysMessageType || (IrysMessageType = {}));
export var IrysDataType;
(function (IrysDataType) {
    IrysDataType["FILE"] = "FILE";
    IrysDataType["IMAGE"] = "IMAGE";
    IrysDataType["OTHER"] = "OTHER";
})(IrysDataType || (IrysDataType = {}));
export var ServiceType;
(function (ServiceType) {
    ServiceType["IMAGE_DESCRIPTION"] = "image_description";
    ServiceType["TRANSCRIPTION"] = "transcription";
    ServiceType["VIDEO"] = "video";
    ServiceType["TEXT_GENERATION"] = "text_generation";
    ServiceType["BROWSER"] = "browser";
    ServiceType["SPEECH_GENERATION"] = "speech_generation";
    ServiceType["PDF"] = "pdf";
    ServiceType["INTIFACE"] = "intiface";
    ServiceType["AWS_S3"] = "aws_s3";
    ServiceType["BUTTPLUG"] = "buttplug";
    ServiceType["SLACK"] = "slack";
    ServiceType["VERIFIABLE_LOGGING"] = "verifiable_logging";
    ServiceType["IRYS"] = "irys";
    ServiceType["TEE_LOG"] = "tee_log";
    ServiceType["GOPLUS_SECURITY"] = "goplus_security";
    ServiceType["WEB_SEARCH"] = "web_search";
    ServiceType["EMAIL_AUTOMATION"] = "email_automation";
})(ServiceType || (ServiceType = {}));
export var LoggingLevel;
(function (LoggingLevel) {
    LoggingLevel["DEBUG"] = "debug";
    LoggingLevel["VERBOSE"] = "verbose";
    LoggingLevel["NONE"] = "none";
})(LoggingLevel || (LoggingLevel = {}));
/**
 * Available verifiable inference providers
 */
export var VerifiableInferenceProvider;
(function (VerifiableInferenceProvider) {
    VerifiableInferenceProvider["RECLAIM"] = "reclaim";
    VerifiableInferenceProvider["OPACITY"] = "opacity";
    VerifiableInferenceProvider["PRIMUS"] = "primus";
})(VerifiableInferenceProvider || (VerifiableInferenceProvider = {}));
export var TokenizerType;
(function (TokenizerType) {
    TokenizerType["Auto"] = "auto";
    TokenizerType["TikToken"] = "tiktoken";
})(TokenizerType || (TokenizerType = {}));
export var TranscriptionProvider;
(function (TranscriptionProvider) {
    TranscriptionProvider["OpenAI"] = "openai";
    TranscriptionProvider["Deepgram"] = "deepgram";
    TranscriptionProvider["Local"] = "local";
})(TranscriptionProvider || (TranscriptionProvider = {}));
export var ActionTimelineType;
(function (ActionTimelineType) {
    ActionTimelineType["ForYou"] = "foryou";
    ActionTimelineType["Following"] = "following";
})(ActionTimelineType || (ActionTimelineType = {}));
export var KnowledgeScope;
(function (KnowledgeScope) {
    KnowledgeScope["SHARED"] = "shared";
    KnowledgeScope["PRIVATE"] = "private";
})(KnowledgeScope || (KnowledgeScope = {}));
export var CacheKeyPrefix;
(function (CacheKeyPrefix) {
    CacheKeyPrefix["KNOWLEDGE"] = "knowledge";
})(CacheKeyPrefix || (CacheKeyPrefix = {}));
