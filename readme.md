# Cryptocurrency Price Kit 
###### STAGE: `DEVELOPMENT`
The best price kit you need when working with cryptocurrencies with multiple useProviders support.

## Goal
 - To provide a simple and easy to use API for working with cryptocurrency prices.
 - To provide a simple API to support multiple data useProviders
 - To provide useCache support and interval data fetching.
 - To support as many providers as possible.


## Easy As

```typescript
import {Cpk} from 'cryptocurrency-price-kit';
import Livecoinwatch from "cryptocurrency-price-kit/providers/livecoinwatch.com";

Cpk.useProviders([
    Livecoinwatch({apiKey: 'your-api-key'})
])

// Initialize with config
const cpk = new Cpk('livecoinwatch.com');

// Get bitcoin Price and useCache for 60 secs
const price = await cpk.get('BTC/USD', 60);

console.log(price) // The current price of bitcoin in USD

// OR
// GET Many Prices and useCache for 60 secs
const prices = await cpk.getMany(['BTC/USD', 'ETH/USD'], 60);

// Or 
// Get Many prices and useCache independently
const prices2 = await cpk.getMany({
    "BTC/USD": 60, // Cache for 60 secs
    "ETH/USD": 120, // Cache for 120 secs
});
```


### With Events Support
```typescript
cpk.on('BTC/USD', (value) => {
    console.log(`BTC/USD price changed to: ${value}`)
})
```