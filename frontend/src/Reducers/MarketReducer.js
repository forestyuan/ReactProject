import {createActions, createReducer} from 'reduxsauce';
import Immutable from 'seamless-immutable';
import {EOSService} from '../Services/EOSService';
import {Toast} from '../Services/Toast';
import {EOSAPIService} from "../Services/EOSAPIService";

function parseName(name) {
  let rest = name;
  const result = [];
  while (rest) {
    result.push(String.fromCharCode(rest & 0xff));
    rest = rest >> 8;
  }
  return result.join('');
}

function parseSymbol(symbol) {
  const {value, contract} = symbol;
  const precision = value & 0xff;
  const name = parseName(value >> 8);
  return {
    precision,
    name,
    contract
  };
}

const PRICE_PRECISION = 10;
const PRICE_PRECISION_MUL = 10000000000;

/* ------------- Types and Action Creators ------------- */
const actions = {
  changeAmount: ['amount'],
  changePrice: ['price'],
  selectMarket: ['token'],
  cancelAllAsk: async ({token}) => {
    await EOSService.cancelAllAsk({token});
  },
  cancelAllBid: async ({token}) => {
    await EOSService.cancelAllBid({token});
  },
  loadOrders: async ({backer}) => {
    const [{rows: askRows}, {rows: bidRows}] = await Promise.all([
      EOSAPIService.listAskOrders({backer}),
      EOSAPIService.listBidOrders({backer}),
    ]);
    return {
      type: Types.LOAD_ORDERS,
      askOrders: askRows.map(order => Object.assign(order, {price: Number(order.price) / PRICE_PRECISION_MUL})),
      bidOrders: bidRows.map(order => Object.assign(order, {price: Number(order.price) / PRICE_PRECISION_MUL})),
    };
  },
  listTokens: async () => {
    const {rows} = await EOSAPIService.listTokens();
    const tokens = rows.map(row => ({
      user: row.user,
      symbol: parseSymbol(row.symbol),
    }));
    return {
      type: Types.LIST_TOKENS,
      tokens,
    };
  },
  bid: async ({amount, symbol, price}) => {
    const quantity = `${Number(amount).toFixed(symbol.precision)} ${symbol.name}@${symbol.contract}`;
    try {
      await EOSService.bid({quantity, price: `${Number(price).toFixed(PRICE_PRECISION)} PRI`});
      Toast.success();
    } catch (e) {
      const errorCode = parseInt(e.code, 10);
      Toast.failed({
        3050003: 'invalidAmount',
        3080001: 'lackOfResource',
        3080002: 'lackOfResource',
        3080004: 'lackOfResource',
      }[errorCode]);
    }
  },
  ask: async ({amount, symbol, price}) => {
    const quantity = `${Number(amount).toFixed(symbol.precision)} ${symbol.name}@${symbol.contract}`;
    try {
      await EOSService.ask({quantity, price: `${Number(price).toFixed(PRICE_PRECISION)} PRI`});
      Toast.success();
    } catch (e) {
      const errorCode = parseInt(e.code, 10);
      Toast.failed({
        3050003: 'invalidAmount',
        3080001: 'lackOfResource',
        3080002: 'lackOfResource',
        3080004: 'lackOfResource',
      }[errorCode]);
    }
  },
};
const {Types, Creators} = createActions(actions, {prefix: 'TRADE_RAM.'});

export const MarketTypes: {
  BID: String;
  ASK: String;
  CHANGE_AMOUNT: String;
  CHANGE_PRICE: String;
  LIST_TOKENS: String;
  SELECT_MARKET: String;
  LOAD_ORDERS: String;
} = Types;

export const MarketActions = Creators;

/* ------------- Initial State ------------- */

export const MarketState = Immutable({
  currentToken: null,
  tokens: [],
  askOrders: [],
  bidOrders: [],
  amount: 0,
  price: 0,
});

/* ------------- Reducers ------------- */
const changeAmount = (state: Object, {amount}) => state.merge({amount});
const changePrice = (state: Object, {price}) => state.merge({price});
const listTokens = (state: Object, {tokens}) => state.merge({tokens});
const selectMarket = (state: Object, {token}) => state.merge({currentToken: token});
const loadOrders = (state: Object, {askOrders, bidOrders}) => state.merge({askOrders, bidOrders});

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(MarketState, {
  [Types.CHANGE_AMOUNT]: changeAmount,
  [Types.CHANGE_PRICE]: changePrice,
  [Types.LIST_TOKENS]: listTokens,
  [Types.SELECT_MARKET]: selectMarket,
  [Types.LOAD_ORDERS]: loadOrders,
});
