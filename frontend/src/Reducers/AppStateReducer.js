import { createActions, createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { EOSService } from '../Services/EOSService';
import { ScatterService } from '../Services/ScatterService';
import { EOSAPIService } from '../Services/EOSAPIService';

/* ------------- Types and Action Creators ------------- */

const actions = {
  init: async () => {
    const scatter = await ScatterService.init();
    EOSService.init({ scatter });
    return { type: Types.INIT };
  },
  initApi: () => {
    EOSAPIService.init();
    return { type: Types.INIT_API };
  },
  toggleUserBalanceModal: null
};
const { Types, Creators } = createActions(actions);

export const AppStateTypes: {
  INIT: String;
  INIT_API: String;
  TOGGLE_USER_BALANCE_MODAL: String;
} = Types;

export const AppStateActions = Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  initFinish: false,
  initApiFinish: false,
  isShowUserBalanceModal: false
});

/* ------------- Reducers ------------- */

const init = (state: Object) => {
  return state.merge({ initFinish: true });
};

const initApi = (state: Object) => {
  return state.merge({ initApiFinish: true });
};

const toggleUserBalanceModal = (state: Object) => {
  return state.merge({
    isShowUserBalanceModal: !state.isShowUserBalanceModal
  });
};

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INIT]: init,
  [Types.INIT_API]: initApi,
  [Types.TOGGLE_USER_BALANCE_MODAL]: toggleUserBalanceModal
});


/* ------------- Selectors ------------- */

export const isInited = (state: Object) => state.initFinish;
