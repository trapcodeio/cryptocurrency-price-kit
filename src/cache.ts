import BraveCache from "brave-cache";
import LRUCacheProvider from "brave-cache/providers/lru-cache";

// register providers
BraveCache.registerProvider(LRUCacheProvider());

// Set Default Provider
BraveCache.setDefaultProvider("lru-cache");

// Initialize Cache
const cache = new BraveCache();

// Export Cache
export default cache;
