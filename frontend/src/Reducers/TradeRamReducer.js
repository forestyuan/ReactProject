import { createActions, createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { EOSService } from '../Services/EOSService';
import { EOSAPIService } from '../Services/EOSAPIService';
import { Toast } from '../Services/Toast';

export const TradeType = {
  BUY_RAM: 'buyram',
  BUY_RAM_BYTES: 'buyrambytes',
  SELL_RAM: 'sellram'
};

export const ByteUnits = {
  'Kilo Bytes': 1024,
  'Mega Bytes': 1024 * 1024
};

export const ByteUnitToLabel = {
  1024: 'KB',
  [1024 * 1024]: 'MB'
};

const RAM_FEE_RATE = 0.005;

/* ------------- Types and Action Creators ------------- */
const actions = {
  changeTradeType: ['tradeType'],
  changeInputMode: ['inputMode'],
  changeAmount: [
    'eos',
    'bytes',
    'unitByte'
  ],
  changeEos: ['eos'],
  calcByEos: async ({ eos, byteUnit }) => {
    const ret = { type: Types.CHANGE_AMOUNT, eos: eos || 0, bytes: 0, byteUnit };
    if (eos) {
      const fee = eos * RAM_FEE_RATE;
      const {quote, base} = await EOSAPIService.quoteRAMPrice();
      const {bytes} = EOSAPIService.eosToBytes({quote, base, eos: (eos - fee)});
      ret.bytes = bytes / byteUnit;
      ret.fee = fee;
    }
    return ret;
  },
  changeBytes: ['bytes'],
  setByteUnit: async ({ byteUnit }) => {
    return { type: Types.CHANGE_AMOUNT, byteUnit, bytes: 0, eos: 0 };
  },
  toggleUnitSelector: null,
  calcByBytes: async ({bytes: bytesIn, byteUnit}) => {
    const bytes = parseFloat(bytesIn);
    const ret = {type: Types.CHANGE_AMOUNT, bytes, eos: 0, byteUnit};
    if (bytes) {
      const { quote, base } = await EOSAPIService.quoteRAMPrice();
      const { eos } = EOSAPIService.bytesToEos({ quote, base, bytes: bytes * byteUnit });
      const total = eos / (1 - RAM_FEE_RATE);
      ret.eos = total;
      ret.fee = total - eos;
    }
    return ret;
  },
  buyRam: async ({eos, bytes, tradeType}: Object) => {
    const intBytes = Math.max(Math.floor(bytes), 1);
    let ret = {
      type: Types.CHANGE_AMOUNT,
      eos: 0,
      bytes: 0,
    };
    try {
      await EOSService.buyRAM({eos, bytes:intBytes, tradeType});
      Toast.success();
      return ret;
    } catch (e) {
      const errorCode = parseInt(e.code, 10);
      Toast.failed({
        3050003: 'invalidAmount',
        3080001: 'lackOfResource',
        3080002: 'lackOfResource',
        3080004: 'lackOfResource',
      }[errorCode]);
      return ret;
    }
  },
  sellRam: async ({ bytes }: Object) => {
    try {
      const intBytes = Math.max(Math.floor(bytes), 1);
      await EOSService.sellRAM({ bytes: intBytes });
      Toast.success();
      return {type: Types.CHANGE_AMOUNT, eos: 0, bytes: 0};
    } catch (e) {
      const errorCode = parseInt(e.code, 10);
      Toast.failed({
        3050003: 'invalidAmount',
        3080001: 'lackOfResource',
        3080002: 'lackOfResource',
        3080004: 'lackOfResource',
      }[errorCode]);
      return {type: Types.CHANGE_AMOUNT, eos: 0, bytes: 0};
    }
  }
};
const { Types, Creators } = createActions(actions, { prefix: 'TRADE_RAM.' });

export const TradeRamTypes: {
  CHANGE_TRADE_TYPE: String;
  CHANGE_INPUT_MODE: String;
  CHANGE_AMOUNT: String;
  CHANGE_EOS: String;
  CHANGE_BYTES: String;
  SET_BYTE_UNIT: String;
  TOGGLE_UNIT_SELECTOR: String;
  BUY_RAM: String;
  SELL_RAM: String;
} = Types;

export const TradeRamActions = Creators;

/* ------------- Initial State ------------- */

export const TradeRamInitialState = Immutable({
  tradeType: TradeType.BUY_RAM,
  inputMode: false,
  fee: 0,
  eos: 0,
  bytes: 0,
  byteUnit: ByteUnits['Kilo Bytes'],
  unitSelecting: false
});

/* ------------- Reducers ------------- */
const changeTradeType = (state: Object, { tradeType }) => state.merge({ tradeType });
const changeAmount = (state: Object, { fee = 0, eos = 0, bytes = 0, byteUnit = ByteUnits['Kilo Bytes'] }) =>
  state.merge({ fee, eos, bytes, byteUnit });
const changeInputMode = (state: Object, { inputMode }) => state.merge({ inputMode });
const changeEos = (state: Object, { eos }) => state.merge({ eos });
const changeBytes = (state: Object, { bytes }) => state.merge({ bytes });
const toggleUnitSelector = (state) => state.merge({ unitSelecting: !state.unitSelecting });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(TradeRamInitialState, {
  [Types.CHANGE_TRADE_TYPE]: changeTradeType,
  [Types.CHANGE_AMOUNT]: changeAmount,
  [Types.CHANGE_EOS]: changeEos,
  [Types.CHANGE_BYTES]: changeBytes,
  [Types.CHANGE_INPUT_MODE]: changeInputMode,
  [Types.TOGGLE_UNIT_SELECTOR]: toggleUnitSelector
});

/* ------------- Selectors ------------- */
export const byteInputMin = (state: Object) => {
  switch (state.byteUnit) {
    case ByteUnits['Mega Bytes']:
      return 0.0000;
    case ByteUnits['Kilo Bytes']:
      return 0.00;
    case ByteUnits.Bytes:
    default:
      return 0;
  }
};

export const byteInputStep = (state: Object) => {
  switch (state.byteUnit) {
    case ByteUnits['Mega Bytes']:
      return 0.0001;
    case ByteUnits['Kilo Bytes']:
      return 0.01;
    case ByteUnits.Bytes:
    default:
      return 1;
  }
};
export const amountValid = (state: Object) => (state.eos > 0);
