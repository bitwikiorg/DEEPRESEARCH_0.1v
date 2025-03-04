import { embed, MemoryManager, formatMessages, } from "@elizaos/core";
import { formatFacts } from "../evaluators/fact.ts";
const factsProvider = {
    get: async (runtime, message, state) => {
        const recentMessagesData = state?.recentMessagesData?.slice(-10);
        const recentMessages = formatMessages({
            messages: recentMessagesData,
            actors: state?.actorsData,
        });
        const _embedding = await embed(runtime, recentMessages);
        const memoryManager = new MemoryManager({
            runtime,
            tableName: "facts",
        });
        const relevantFacts = [];
        //  await memoryManager.searchMemoriesByEmbedding(
        //     embedding,
        //     {
        //         roomId: message.roomId,
        //         count: 10,
        //         agentId: runtime.agentId,
        //     }
        // );
        const recentFactsData = await memoryManager.getMemories({
            roomId: message.roomId,
            count: 10,
            start: 0,
            end: Date.now(),
        });
        // join the two and deduplicate
        const allFacts = [...relevantFacts, ...recentFactsData].filter((fact, index, self) => index === self.findIndex((t) => t.id === fact.id));
        if (allFacts.length === 0) {
            return "";
        }
        const formattedFacts = formatFacts(allFacts);
        return "Key facts that {{agentName}} knows:\n{{formattedFacts}}"
            .replace("{{agentName}}", runtime.character.name)
            .replace("{{formattedFacts}}", formattedFacts);
    },
};
export { factsProvider };
