import {Resource} from './Resource';

export const EosResource = new Resource({
  getPriceHistory: {
    method: Resource.GET,
    url: '/ram_price/history'
  },
  getPrice: {
    method: Resource.GET,
    url: '/ram_price/:timestamp'
  },
  getTokenPrice: {
    method: Resource.GET,
    url: '/token_price'
  },
  accountExists: {
    method: Resource.GET,
    url: '/account/:accountName'
  },
}, {base: 'eos'});
