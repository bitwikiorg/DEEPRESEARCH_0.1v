import { validatePrompt, validateApiKey, callOpenAiApi, buildRequestData } from "./action";
export const moderateContentAction = {
    name: "moderateContent",
    description: "Moderate content using OpenAI",
    similes: [],
    async handler(_runtime, message, _state) {
        const input = message.content.text?.trim() || "";
        validatePrompt(input);
        const apiKey = validateApiKey();
        const requestData = buildRequestData("text-moderation-latest", input);
        const response = await callOpenAiApi("https://api.openai.com/v1/moderations", requestData, apiKey);
        return response.results;
    },
    validate: async (runtime, _message) => {
        return !!runtime.getSetting("OPENAI_API_KEY");
    },
    examples: [],
};
