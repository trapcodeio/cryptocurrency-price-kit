# Cryptocurrency Price Kit 
###### STAGE: `DEVELOPMENT`
The best Nodejs price kit you need when working with cryptocurrencies with multiple providers support.

## Goal
 - To provide a simple and easy to use API for working with cryptocurrency prices.
 - To provide a simple API to support multiple data providers
 - To provide cache support, so you only send request to the provider once per minute.
 - To support as many providers as possible.


## Easy As

```js
const {Cpk} = require('cryptocurrency-price-kit');
const Livecoinwatch = require("cryptocurrency-price-kit/providers/livecoinwatch.com");

Cpk.useProviders([Livecoinwatch({apiKey: 'your-api-key'})])

// Initialize with config
const cpk = new Cpk('livecoinwatch.com');

// Get bitcoin Price and cache for 60 secs by default
const price = await cpk.get('BTC/USD');
// or with custom cache time
const price = await cpk.get('BTC/USD', 120); // seconds

console.log(price) // The current price of bitcoin in USD

// OR
// GET Many Prices and cache for 60 secs
const prices = await cpk.getMany(['BTC/USD', 'ETH/USD'], 60);
```

### What you should know.
- Default currency is `USD`
- `cache` is enabled by default (tll: 60 seconds)
- If currency is not defined, it will be `USD`
- Error is thrown if request is not successful, so you should catch all requests.
- We prefer `cache` over interval because it is more reliable. with `interval pulling` you may make unnecessary requests when not needed.

### Supported providers

- [livecoinwatch.com](https://livecoinwatch.com)
- [blockchain.info](https://blockchain.info)
- [coingecko.com](https://coingecko.com)
- [coinmarketcap.com](https://coinmarketcap.com)

#### Adding custom provider
This can be achieved in two ways.

- Create an issue on GitHub requesting a certain provider, and we will try to add it. (`Try` if the provider documentation is clear enough.)
- OR See how to create it yourself: [How to create a custom provider](#how-to-create-a-custom-provider)

### What may come in the future.
- Fallback to other providers if the first one fails.
- Command line support: E.g. `npx cpk update-supported-data` should update the providers supported coins and currency array. 
      This is considered important because the majority of the providers have an endpoint where your can get the coins and currency they support.
      <br> if supported coins and currency are updated frequently, it will reduce the amount of error requests that may cost you depending on your provider.



### How to create a custom provider
Creating a custom provider is as easy as.

```js
const {defineCpkProvider} = require("cryptocurrency-price-kit/src/provider");

// Define a provider
// `config` is an object that contains the configuration passed for the provider.
const CustomProvider = defineCpkProvider((config) => {
    return {
       name: 'provider-domain.com',
       coinsSupported: ['BTC', 'ETH'] || "any", // if any no validation is done
       currenciesSupported: ['USD', 'EUR'] || "any", // if any no validation is done
       
       // This is the function that will be called to get the price
       // It will be called with the coin and currency as arguments
       // The async function should return the price
       async getPrice(coin, currency) {
           // return the price
           return 0;
       },
       
       // This is the function that will be called to get multiple prices
       // It will be called with array of coins and currency as arguments
       // The async function should return the prices as object
       // The object should have the coin/key and the price as value
       // E.g. {"BTC/USD": 0, "ETH/EUR": 0}
       async getPrices(pairs) {
           // return the prices
           for (const pair of pairs) {
               // pair.coin, pair.currency
           }
           return {};
       }
   }
})

module.exports = CustomProvider;
```
That's all 😁, all cache function is handled by the package, so you don't need to worry about it.
Only return the values, and we will handle the rest.
