import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { EOSService } from '../Services/EOSService';
import { EOSAPIService } from '../Services/EOSAPIService';
import { EosResource } from '../Resources/Eos';


/* ------------- Types and Action Creators ------------- */
export const AccountSyncStage = {
  NOT_START: 0,
  SYNCING: 1,
  SYNCED: 2
};
const actions = {
  changeAccountSyncStage: ['accountSyncStage'],
  changeAccountInfo: [
    'tokenPrice', 'accountName', 'eosQuota', 'eosStaked',
    'ramQuota', 'ramUsage', 'ramValue',
    'cpuQuota', 'cpuUsage',
    'netQuota', 'netUsage'
  ],
  autoLogin: async () => {
    await EOSService.autoLogin();
    return { type: Types.LOGIN, account: EOSService.account };
  },
  login: async () => {
    await EOSService.login();
    return { type: Types.LOGIN, account: EOSService.account };
  },
  syncAccount: async () => {
    try {
      const [userBalance, ramPrice] = await Promise.all([
        EOSAPIService.getCurrentBalance(EOSService.account.name),
        EOSAPIService.quoteRAMPrice()
      ]);
      const { eos: ramValue } = await EOSAPIService.bytesToEos(Object.assign(ramPrice
        , { bytes: userBalance.ramQuota * 1024 }));
      return { type: AccountInfoTypes.CHANGE_ACCOUNT_INFO, ramValue, ...userBalance };
    } catch (e) {
      return {
        type: AccountInfoTypes.CHANGE_ACCOUNT_INFO,
        eosQuota: 0, eosStaked: 0,
        ramQuota: 0, ramUsage: 0, ramValue: 0,
        cpuQuota: 0, cpuUsage: 0,
        netQuote: 0, netUsage: 0
      };
    }
  },
  changeTokenPrice: async () => {
    const { price } = await EosResource.getTokenPrice();
    return { type: Types.CHANGE_TOKEN_PRICE, tokenPrice: price };
  },
  logout: async () => {
    await EOSService.logout();
    return { type: Types.LOGIN, account: null };
  },
  stakeEOS: async ({ net, cpu }) => {
    await EOSService.stake({ net, cpu });
  },
  vote: async () => {
    await EOSService.voteProducer({});
  },
  toggleLogOut: ['showLogOut'],
  changeEosBean: ['eosBean'],
  fetchBP: async () => {
    const eosBean = await EOSAPIService.getBP({});
    return { type: AccountInfoTypes.CHANGE_EOS_BEAN, eosBean };
  }
};
const { Types, Creators } = createActions(actions, { prefix: 'ACCOUNT_INFO.' });

export const AccountInfoTypes: {
  LOGIN: String;
  CHANGE_ACCOUNT_SYNC_STAGE: String;
  CHANGE_ACCOUNT_INFO: String;
  SYNC_ACCOUNT: String;
  CHANGE_TOKEN_PRICE: String;
  TOGGLE_LOG_OUT: String;
  CHANGE_EOS_BEAN: String;
  FETCH_BP: String;
} = Types;

export const AccountInfoActions = Creators;

/* ------------- Initial State ------------- */

export const TradeRamInitialState = Immutable({
  account: null,
  accountSyncStage: AccountSyncStage.NOT_START,
  tokenPrice: 0,
  accountName: '',
  eosQuota: 0,
  eosStaked: 0,
  ramQuota: 0,
  ramUsage: 0,
  ramValue: 0,
  cpuQuota: 0,
  cpuUsage: 0,
  netQuota: 0,
  netUsage: 0,
  showLogOut: false,
  eosBean: {},
});

/* ------------- Reducers ------------- */
const changeAccountSyncStage = (state: Object, { accountSyncStage }) => state.merge({ accountSyncStage });
const changeAccountInfo = (state: Object, accountInfo) => state.merge(accountInfo);
const changeTokenPrice = (state: Object, tokenPrice) => state.merge(tokenPrice);
const changeEosBean = (state: Object, eosBean) => state.merge(eosBean);
const toggleLogOut = (state: Object, logOutInfo) => state.merge(logOutInfo);
const login = (state: Object, { account }) => state.merge({ account });
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(TradeRamInitialState, {
  [Types.CHANGE_ACCOUNT_SYNC_STAGE]: changeAccountSyncStage,
  [Types.CHANGE_TOKEN_PRICE]: changeTokenPrice,
  [Types.CHANGE_ACCOUNT_INFO]: changeAccountInfo,
  [Types.TOGGLE_LOG_OUT]: toggleLogOut,
  [Types.LOGIN]: login,
  [Types.CHANGE_EOS_BEAN]: changeEosBean,
});

/* ------------- Selectors ------------- */

