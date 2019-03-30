import Immutable from 'seamless-immutable';
import {createActions, createReducer} from 'reduxsauce';
import {AccountRequestResource} from '../Resources/AccountRequest';
import {EosResource} from '../Resources/Eos';
import {ScatterService} from '../Services/ScatterService';
import {Toast} from '../Services/Toast';
import {EOSService} from '../Services/EOSService';
import {EOSAPIService} from '../Services/EOSAPIService';
import {Config} from '../Config';

function randomAccountName() {
  const possible = 'abcdefghijklmnopqrstuvwxyz12345';
  const nameChars = Array.from({ length: 12 }, () => possible.charAt(Math.floor(Math.random() * possible.length)));
  return nameChars.join('');
}

async function accountExists({ accountName }) {
  const { exists } = await EosResource.accountExists({ accountName });
  return exists;
}

const ACCOUNT_REQUEST_STAGE = { INIT: 100, PAID: 200, CREATED: 300 };
export const STAGES = { name: 100, keyGen: 200, payment: 300, process: 400, done: 500 };
export const STAGES_SEQUENCE = [STAGES.name, STAGES.keyGen, STAGES.payment, STAGES.done];
export const SETUP_STAGES = { init: 100, loaded: 200, creating: 300, done: 400 };

const MAX_TEST_COUNT = 4;
/* ------------- Types and Action Creators ------------- */
const actions = {
  changeCharging: ['charging'],
  changeSetupStage: ['accountRequest', 'setupStage'],
  changeAccountName: ['accountName'],
  changeAccountNameValidation: ['accountNameValidation'],
  changeGeneratingName: ['generatingName'],
  changeCheckingName: ['checkingName'],
  changeOwnerPublicKey: ['ownerPublicKey'],
  changeActivePublicKey: ['activePublicKey'],
  changeStage: ['stage', 'eosAccount'],
  toggleTermsAndConditions: ['agree'],
  resetNameStage: [],
  generateAccountName: async () => {
    let accountName;
    let testCounter = MAX_TEST_COUNT;
    do {
      accountName = randomAccountName();
      const exists = await accountExists({ accountName });
      if (!exists) break;
      testCounter -= 1;
    } while (testCounter);

    return { type: AccountCreateTypes.CHANGE_ACCOUNT_NAME, accountName };
  },
  checkAccountName: async (accountName) => {
    const nameValid = (typeof accountName === 'string')
      && accountName.length === 12
      && /^[a-z12345]+$/.test(accountName);
    if (!nameValid) {
      return {
        type: AccountCreateTypes.CHANGE_ACCOUNT_NAME_VALIDATION,
        accountNameValidation: { valid: false, msg: 'Invalid !' }
      };
    }
    const exists = await accountExists({ accountName });
    if (exists) return {
      type: AccountCreateTypes.CHANGE_ACCOUNT_NAME_VALIDATION,
      accountNameValidation: { valid: true, available: false, msg: 'Occupied !' }
    };
    return {
      type: AccountCreateTypes.CHANGE_ACCOUNT_NAME_VALIDATION,
      accountNameValidation: { valid: true, available: true, msg: '' }
    };
  },
  fetchAccountRequest: async ({ requestId, history = null }) => {
    try {
      const { accountRequest, eosAccount } = await AccountRequestResource.find({ accountRequestId: requestId });
      const stage = {
        [ACCOUNT_REQUEST_STAGE.INIT]: STAGES.payment,
        [ACCOUNT_REQUEST_STAGE.PAID]: STAGES.process,
        [ACCOUNT_REQUEST_STAGE.CREATED]: STAGES.done
      }[accountRequest.stage];
      return {
        type: AccountCreateTypes.CHANGE_STAGE,
        stage,
        eosAccount
      };
    } catch (err) {
      if (history) history.replace('/account/create');
    }
  },
  toggleEmailFriend: ['showEmailFriendOverlay'],
  changeIsShowSaveKeysAlert: ['isShowSaveKeysAlert'],
  changeIsSelfImport: ['isSelfImport'],
  changeIsShowSendToFriend: ['isShowSendToFriend'],
  charge: async ({ token, accountRequestId }) => {
    await AccountRequestResource.checkout({ token: token.id, accountRequestId });
    return {
      type: AccountCreateTypes.CHANGE_STAGE,
      stage: STAGES.process
    };
  },
  shareLinkToFriend: async ({ to, shareUrl }) => {
    try {
      AccountRequestResource.shareToFriend({ to, shareUrl });
      return {
        type: AccountCreateTypes.TOGGLE_EMAIL_FRIEND,
        showEmailFriendOverlay: false,
      };
    } catch (err) {
    }
  },
  async importToScatter({ accountName, publicKey }) {
    try {
      await ScatterService.importToScatter({ publicKey, accountName });
      Toast.success('importScatterSuccess');
    } catch (err) {
      console.error(err);
      Toast.failed();
    }
  },
  updateAccountRequest: async ({ requestId }) => {
    const ret = { type: AccountCreateTypes.CHANGE_SETUP_STAGE };
    try {
      const [{ accountRequest }, { quote, base }] = await Promise.all([
        AccountRequestResource.find({ accountRequestId: requestId }),
        EOSAPIService.quoteRAMPrice(),
      ]);
      let newAccountRequest = Object.assign({ ramQuota: Config.accountResources.ramKB }, accountRequest);
      if (accountRequest.stage === ACCOUNT_REQUEST_STAGE.CREATED) {
        const { ramQuota, eosStaked, eosQuota } = await EOSAPIService.getCurrentBalance(accountRequest.accountName);
        newAccountRequest.ramQuota = ramQuota;
        newAccountRequest.staked = parseFloat(eosStaked).toFixed(4);
        newAccountRequest.unstaked = parseFloat((eosQuota - eosStaked) || 0).toFixed(4);
        ret.setupStage = SETUP_STAGES.done;
      } else {
        ret.setupStage = SETUP_STAGES.loaded;
      }
      const { eos: ramValue } = EOSAPIService.bytesToEos({ quote, base, bytes: newAccountRequest.ramQuota * 1024 });
      newAccountRequest.ramValue = ramValue;
      ret.accountRequest = newAccountRequest;
      return ret;
    } catch (err) {
      console.error(err);
      ret.setupStage = SETUP_STAGES.init;
      ret.accountRequest = {};
      return ret;
    }
  },
  startSetup: ({ accountRequest })=>{
    return {
      type: AccountCreateTypes.CHANGE_SETUP_STAGE,
      accountRequest,
      setupStage: SETUP_STAGES.creating
    };
  },
  setupAccount: async ({ accountRequest }) => {
    try {
      await EOSService.createAccount(accountRequest);
      return {
        type: AccountCreateTypes.CHANGE_SETUP_STAGE,
        accountRequest,
        setupStage: SETUP_STAGES.creating
      };
    } catch (e) {
      Toast.failed();
      return {
        type: AccountCreateTypes.CHANGE_SETUP_STAGE,
        accountRequest,
        setupStage: SETUP_STAGES.loaded
      };
    }
  },
  checkIsAccountCreated: async ({ accountRequest }) => {
    const exists = await accountExists(accountRequest);
    if (exists) {
      Toast.success();
      return {
        type: AccountCreateTypes.CHANGE_SETUP_STAGE,
        accountRequest,
        setupStage: SETUP_STAGES.done
      };
    } else {
      return {
        type: AccountCreateTypes.CHANGE_SETUP_STAGE,
        accountRequest,
        setupStage: SETUP_STAGES.creating
      };
    }
  }
};
const { Types, Creators } = createActions(actions, { prefix: 'ACCOUNT_REGISTRATION.' });

export const AccountCreateTypes: {
  CHANGE_CHARGING: String;
  CHANGE_SETUP_STAGE: String;
  CHANGE_ACCOUNT_NAME: String;
  CHANGE_ACCOUNT_NAME_VALIDATION: String;
  CHANGE_GENERATING_NAME: String;
  CHANGE_CHECKING_NAME: String;
  CHANGE_OWNER_PUBLIC_KEY: String;
  CHANGE_ACTIVE_PUBLIC_KEY: String;
  CHANGE_STAGE: String;
  TOGGLE_TERMS_AND_CONDITIONS: String;
  RESET_NAME_STAGE: String;
  GENERATE_KEY_PAIRS: String;
  CHECK_ACCOUNT_NAME: String;
  FETCH_ACCOUNT_REQUEST: String;
  TOGGLE_EMAIL_FRIEND: String;
  CHANGE_IS_SHOW_SAVE_KEYS_ALERT: String;
  CHANGE_IS_SELF_IMPORT: String;
  CHANGE_IS_SHOW_SEND_TO_FRIEND: String;
  CHARGE: String;
  SHARE_LINK_TO_FRIEND: String;
  IMPORT_TO_SCATTER: String;
  UPDATE_ACCOUNT_REQUEST: String;
  SETUP_ACCOUNT: String;
  CHECK_IS_ACCOUNT_CREATED: String;
} = Types;

export const AccountCreateActions = Creators;

/* ------------- Initial State ------------- */

export const AccountCreateState = Immutable({
  charging: false,
  generatingName: false,
  checkingName: false,
  setupStage: SETUP_STAGES.init,
  accountRequest: {},
  stage: null,
  agreeTermsAndConditions: false,
  accountName: '',
  accountNameValidation: { valid: true, available: false, msg: '' },
  ownerPublicKey: '',
  activePublicKey: '',
  eosAccount: null,
  showEmailFriendOverlay: false,
  isShowSaveKeysAlert: false,
  isSelfImport: true,
  isShowSendToFriend: false
});

/* ------------- Reducers ------------- */
const changeCharging = (state: Object, { charging }) => state.merge({ charging });
const changeSetupStage = (state: Object, { accountRequest, setupStage }) => state.merge({ accountRequest, setupStage });
const resetNameStage = (state: Object) => state.merge({
  accountName: '',
  accountNameValidation: { valid: true, available: false, msg: '' },
  agreeTermsAndConditions: false
});
const changeAccountName = (state: Object, { accountName }) => state.merge({
  accountName,
  accountNameValidation: { valid: true, available: false, msg: '' }
});
const changeAccountNameValidation = (state: Object, { accountNameValidation }) => state.merge({ accountNameValidation });
const changeGeneratingName = (state: Object, { generatingName }) => state.merge({ generatingName });
const changeCheckingName = (state: Object, { checkingName }) => state.merge({ checkingName });
const changeOwnerPublicKey = (state: Object, { ownerPublicKey }) => state.merge({ ownerPublicKey });
const changeActivePublicKey = (state: Object, { activePublicKey }) => state.merge({ activePublicKey });
const toggleTermsAndConditions = (state: Object, { agree }) => state.merge({
  agreeTermsAndConditions: agree
});
const changeStage = (state: Object, { stage, eosAccount }) => state.merge({ stage, eosAccount });
const changeShowEmailFriend = (state: Object, { showEmailFriendOverlay }) => state.merge({ showEmailFriendOverlay });
const changeIsShowSaveKeysAlert = (state: Object, { isShowSaveKeysAlert }) => state.merge({ isShowSaveKeysAlert });
const changeIsSelfImport = (state: Object, { isSelfImport }) => state.merge({ isSelfImport });
const changeIsShowSendToFriend = (state: Object) => state.merge({ isShowSendToFriend: !state.isShowSendToFriend });
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(AccountCreateState, {
  [AccountCreateTypes.CHANGE_CHARGING]: changeCharging,
  [AccountCreateTypes.CHANGE_SETUP_STAGE]: changeSetupStage,
  [AccountCreateTypes.CHANGE_ACCOUNT_NAME]: changeAccountName,
  [AccountCreateTypes.CHANGE_ACCOUNT_NAME_VALIDATION]: changeAccountNameValidation,
  [AccountCreateTypes.CHANGE_GENERATING_NAME]: changeGeneratingName,
  [AccountCreateTypes.CHANGE_CHECKING_NAME]: changeCheckingName,
  [AccountCreateTypes.CHANGE_OWNER_PUBLIC_KEY]: changeOwnerPublicKey,
  [AccountCreateTypes.CHANGE_ACTIVE_PUBLIC_KEY]: changeActivePublicKey,
  [AccountCreateTypes.CHANGE_STAGE]: changeStage,
  [AccountCreateTypes.TOGGLE_TERMS_AND_CONDITIONS]: toggleTermsAndConditions,
  [AccountCreateTypes.RESET_NAME_STAGE]: resetNameStage,
  [AccountCreateTypes.TOGGLE_EMAIL_FRIEND]: changeShowEmailFriend,
  [AccountCreateTypes.CHANGE_IS_SHOW_SAVE_KEYS_ALERT]: changeIsShowSaveKeysAlert,
  [AccountCreateTypes.CHANGE_IS_SELF_IMPORT]: changeIsSelfImport,
  [AccountCreateTypes.CHANGE_IS_SHOW_SEND_TO_FRIEND]: changeIsShowSendToFriend
});

/* ------------- Selectors ------------- */
export const isNameStageValid = state => state.accountNameValidation.valid
  && state.accountNameValidation.available
  && state.agreeTermsAndConditions
  && !state.generatingName;
