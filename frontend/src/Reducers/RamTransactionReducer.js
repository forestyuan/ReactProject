import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';
import {EOSService} from '../Services/EOSService';
import {EOSAPIService} from '../Services/EOSAPIService';
import {EosResource} from "../Resources/Eos";

/* ------------- Types and Action Creators ------------- */

const ensurePrice = async (action) => {
  if (action.act.name === 'buyram') {
    const newVar = await EosResource.getPrice({timestamp: action.timestamp});
    const {price} = newVar;
    const {eos} = action;
    const kbPrice = price;
    action.bytes = (eos / kbPrice * 1024).toFixed(3);
    action.price = Math.max(kbPrice, 0.0001).toFixed(4);
  }
  return action;
};

const loadUserTransactions = async ({pos, offset}) => {
  const userActions = await EOSAPIService.getUserActions({account: EOSService.account.name, pos, offset});
  const hasMore = userActions.length !== 0;
  const ramActions = userActions
    .filter(({action_trace: {act: {name}}}) =>
      ['buyram', 'buyrambytes', 'sellram'].includes(name)
    );
  const userTransactionsOriginal = ramActions
    .map(EOSAPIService.extractRAMTransaction)
    .sort((p, n) => n.timestamp - p.timestamp);
  return {items: await Promise.all(userTransactionsOriginal.map(ensurePrice)), hasMore};
};
const PAGE_SIZE = 20;

const actions = {
  changeIsShowUserTransaction: ['isShowUserTransaction'],
  changeMarketTransactionLoading: ['loadingMarket'],
  changeUserTransactionLoading: ['loadingUser'],
  changeMarketTransactions: ['marketTransactions'],
  changeUserTransactions: ['userTransactions'],
  listMarketTransactions: async () => {
    const {actions} = await EOSAPIService.findPreviousRAMAction();
    const marketTransactions = await Promise.all(actions.map(ensurePrice));
    return {type: Types.CHANGE_MARKET_TRANSACTIONS, marketTransactions};
  },
  listUserTransactions: async () => {
    const {items: userTransactions, hasMore} = await loadUserTransactions({pos: -1, offset: -PAGE_SIZE});
    return {type: Types.CHANGE_USER_TRANSACTIONS, userTransactions, userMarker: -PAGE_SIZE, hasMoreUserTrans: hasMore};
  },
  moreUserTransactions: async ({userTransactions, userMarker}) => {
    const {items: moreTransactions, hasMore} = await loadUserTransactions({
      pos: userMarker,
      offset: -PAGE_SIZE
    });
    const fullTransactions = moreTransactions.concat(userTransactions);
    return {
      type: Types.CHANGE_USER_TRANSACTIONS,
      userTransactions: fullTransactions,
      userMarker: userMarker - PAGE_SIZE,
      hasMoreUserTrans: hasMore
    };
  }
};
const {Types, Creators} = createActions(actions, {prefix: 'RAM_TRANSACTION.'});

export const RamTransactionTypes: {
  CHANGE_IS_SHOW_USER_TRANSACTION: String,
  CHANGE_MARKET_TRANSACTION_LOADING: String,
  CHANGE_USER_TRANSACTION_LOADING: String,
  CHANGE_MARKET_TRANSACTIONS: String,
  CHANGE_USER_TRANSACTIONS: String,
} = Types;

export const RamTransactionActions = Creators;

/* ------------- Initial State ------------- */

export const RamTransactionInitialState = Immutable({
  isShowUserTransaction: false,
  loadingMarket: true,
  loadingUser: false,
  hasMoreUserTrans: true,
  hasMoreMarketTrans: true,
  userMarker: -1,
  marketMarker: -1,
  marketTransactions: [],
  userTransactions: []
});

/* ------------- Reducers ------------- */
const changeIsShowUserTransaction = (state: Object, {isShowUserTransaction}) => state.merge({isShowUserTransaction});
const changeMarketTransactionLoading = (state: Object, {loadingMarket}) => {
  return state.merge({loadingMarket});
};
const changeUserTransactionLoading = (state: Object, {loadingUser}) => {
  return state.merge({loadingUser});
};
const changeMarketTransactions = (state: Object, {marketTransactions}) => state.merge({marketTransactions});
const changeUserTransactions = (state: Object, {userTransactions, userMarker, hasMoreUserTrans}) =>
  state.merge({userTransactions, userMarker, hasMoreUserTrans});

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(RamTransactionInitialState, {
  [RamTransactionTypes.CHANGE_IS_SHOW_USER_TRANSACTION]: changeIsShowUserTransaction,
  [RamTransactionTypes.CHANGE_MARKET_TRANSACTION_LOADING]: changeMarketTransactionLoading,
  [RamTransactionTypes.CHANGE_USER_TRANSACTION_LOADING]: changeUserTransactionLoading,
  [RamTransactionTypes.CHANGE_MARKET_TRANSACTIONS]: changeMarketTransactions,
  [RamTransactionTypes.CHANGE_USER_TRANSACTIONS]: changeUserTransactions
});

/* ------------- Selectors ------------- */

