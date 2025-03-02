import { CacheManager, DbCacheAdapter } from "@elizaos/core";
export function initializeDbCache(character, db) {
    const cache = new CacheManager(new DbCacheAdapter(db, character.id));
    return cache;
}
