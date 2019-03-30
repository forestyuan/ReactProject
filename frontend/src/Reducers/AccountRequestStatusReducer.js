import { createActions, createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { AccountRequestResource } from '../Resources/AccountRequest';

/* ------------- Types and Action Creators ------------- */
const actions = {
  changeAccountName: ['accountName'],
  changePublicKey: ['publicKey'],
  changeAccountRequestId: ['accountRequestId'],
  changeAccountRequest: ['accountRequest'],
  checkByAccountName: async ({ accountName }) => {
    try {
      const { _id: accountRequestId } = await AccountRequestResource.findByAccountName({ accountName });
      return {
        type: AccountRequestStatusTypes.CHANGE_ACCOUNT_REQUEST_ID,
        accountRequestId
      };
    } catch (err) {
      return {
        type: AccountRequestStatusTypes.CHANGE_ACCOUNT_REQUEST_ID,
        accountRequestId: null
      };
    }
  },
  checkByPublicKey: async ({ publicKey }) => {
    const { _id: accountRequestId } = await AccountRequestResource.findByPublicKey({ publicKey });
    return {
      type: AccountRequestStatusTypes.CHANGE_ACCOUNT_REQUEST_ID,
      accountRequestId
    };
  },
};
const { Types, Creators } = createActions(actions, { prefix: 'ACCOUNT_REQUEST_STATUS.' });

export const AccountRequestStatusTypes: {
  CHECK_BY_ACCOUNT_NAME: String;
  CHECK_BY_PUBLIC_KEY: String;
  CHANGE_ACCOUNT_NAME: String;
  CHANGE_PUBLIC_KEY: String;
  CHANGE_ACCOUNT_REQUEST: String;
  CHANGE_ACCOUNT_REQUEST_ID: String;
} = Types;

export const AccountRequestStatusActions = Creators;

/* ------------- Initial State ------------- */

export const AccountRequestStatusState = Immutable({
  accountName: '',
  publicKey: '',
});

/* ------------- Reducers ------------- */
const changeAccountName = (state: Object, { accountName }) => state.merge({ accountName });
const changePublicKey = (state: Object, { publicKey }) => state.merge({ publicKey });
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(AccountRequestStatusState, {
  [AccountRequestStatusTypes.CHANGE_ACCOUNT_NAME]: changeAccountName,
  [AccountRequestStatusTypes.CHANGE_PUBLIC_KEY]: changePublicKey
});

/* ------------- Selectors ------------- */
export const isAccountRequestValid = state => !!state.accountRequestId;
