import { validateApiKey, callOpenAiApi } from "./action";
export const transcribeAudioAction = {
    name: "transcribeAudio",
    description: "Transcribe audio using OpenAI Whisper",
    similes: [],
    async handler(_runtime, message, _state) {
        const file = message.content.file;
        if (!file) {
            throw new Error("No audio file provided");
        }
        const apiKey = validateApiKey();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("model", "whisper-1");
        const response = await callOpenAiApi("https://api.openai.com/v1/audio/transcriptions", formData, apiKey);
        return response.text;
    },
    validate: async (runtime, _message) => {
        return !!runtime.getSetting("OPENAI_API_KEY");
    },
    examples: [],
};
