import numeral from 'numeral';
import {createActions, createReducer} from 'reduxsauce';
import Immutable from 'seamless-immutable';
import {EosResource} from '../Resources/Eos';
import {chartTimeRangeOptions} from '../Services/Chart';
import {drawCandleData, drawLineData} from '../Services/HighStock';

export const CHART_TYPE = {
  candle: 'candle',
  line: 'line'
};
/* ------------- Types and Action Creators ------------- */
const actions = {
    changeChartTimeRange: ['chartTimeRange'],
    changeChartType: ['chartType'],
  toggleChartType: ({range, chartType, rawPriceData}) => {
    if (chartType === CHART_TYPE.candle) drawCandleData({rawData: rawPriceData, range});
    else if (chartType === CHART_TYPE.line) drawLineData({rawData: rawPriceData, range});
      return {
        type: Types.CHANGE_CHART_TYPE,
        chartType
      };
    },
    updateRamPriceData: ['rawPriceData', ' currentPrice', 'priceDifference', 'differencePercentage'],
  listRamPriceData: async ({range = chartTimeRangeOptions['1W'], chartType = CHART_TYPE.candle}) => {
    const ret = {
      type: Types.UPDATE_RAM_PRICE_DATA,
      rawPriceData: [],
      currentPrice: '-',
      priceDifference: '-',
      differencePercentage: '-'
    };
    const res = await EosResource.getPriceHistory({range});
    // handle no items return
    if (!res || !res.items || !res.items.length) return ret;
      const currentPrice = res.currentPrice;
      const initPrice = res.items[0].open;
      const priceDifference = numeral(currentPrice - initPrice).format('0.0000');
      const differencePercentage = numeral(priceDifference / initPrice).format('0.00%');
    if (chartType === CHART_TYPE.candle) drawCandleData({rawData: res.items, range});
    else if (chartType === CHART_TYPE.line) drawLineData({rawData: res.items, range});
    ret.rawPriceData = res.items;
    ret.currentPrice = currentPrice;
    ret.priceDifference = priceDifference;
    ret.differencePercentage = differencePercentage;
    return ret;
    },
  }
;
const {Types, Creators} = createActions(actions, {prefix: 'RamPriceChart'});

export const RamChartTypes: {
  CHANGE_CHART_TIME_RANGE: String,
  CHANGE_CHART_TYPE: String,
  UPDATE_RAM_PRICE_DATA: String,
  LIST_RAM_PRICE_DATA: String,
} = Types;

export const RamChartActions = Creators;

/* ------------- Initial State ------------- */

export const RamTransactionInitialState = Immutable({
  chartTimeRange: chartTimeRangeOptions['1W'],
  chartType: CHART_TYPE.candle,
  rawPriceData: null,
  currentPrice: '-',
  priceDifference: '-',
  differencePercentage: '-',
});

/* ------------- Reducers ------------- */
const changeChartTimeRange = (state: Object, {chartTimeRange}) => {
  return state.merge({chartTimeRange});
};
const changeChartType = (state: Object, {chartType}) => {
  return state.merge({chartType});
};

const updateRamPriceData = (state: Object, {rawPriceData, currentPrice, priceDifference, differencePercentage}) => {
  return state.merge({rawPriceData, currentPrice, priceDifference, differencePercentage});
};


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(RamTransactionInitialState, {
  [RamChartTypes.CHANGE_CHART_TIME_RANGE]: changeChartTimeRange,
  [RamChartTypes.UPDATE_RAM_PRICE_DATA]: updateRamPriceData,
  [RamChartTypes.CHANGE_CHART_TYPE]: changeChartType,
});


