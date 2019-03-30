import {applyMiddleware, combineReducers, createStore} from 'redux';
import promiseMiddleware from 'redux-promise';
import createHistory from 'history/createBrowserHistory';
import {createMiddleware as beaconMiddleware} from 'redux-beacon';
import GoogleAnalyticsGtag, {trackPageView} from '@redux-beacon/google-analytics-gtag';
import {connectRouter, LOCATION_CHANGE, routerMiddleware} from 'connected-react-router';
import {reducer as accountCreate} from './AccountCreateReducer';
import {reducer as accountInfo} from './AccountInfoReducer';
import {reducer as accountRequestStatus} from './AccountRequestStatusReducer';
import {reducer as appState} from './AppStateReducer';
import {reducer as chartData} from './RamChartReducer';
import {reducer as landing} from './LandingReducer';
import {reducer as ramTransaction} from './RamTransactionReducer';
import {reducer as tradeRam} from './TradeRamReducer';
import {reducer as market} from './MarketReducer';
import {persistReducer, persistStore} from 'redux-persist';
import {composeWithDevTools} from 'redux-devtools-extension';
import ReduxPersist from '../Config/ReduxPersist';
import {Config} from '../Config';

export const history = createHistory();

const rootReducer = combineReducers({
  appState,
  accountInfo,
  accountCreate,
  accountRequestStatus,
  chartData,
  landing,
  market,
  ramTransaction,
  tradeRam
});

/* ------------- Reducers Configuration ------------- */

const middleware = [];

/* ------------- Thunk Middleware ------------- */
(function pushMiddleware() {
  middleware.push(promiseMiddleware);
  middleware.push(routerMiddleware(history));
  middleware.push(beaconMiddleware({
      [LOCATION_CHANGE]: trackPageView(action => ({page: action.payload.pathname})),
    },
    GoogleAnalyticsGtag(Config.googleAnalyticsTrackingID))
  );
})();


/* ------------- Assemble Middleware ------------- */
const enhancer = composeWithDevTools(
  applyMiddleware(...middleware)
);

/* ------------- History Reducer ------------- */
const historyReducer = connectRouter(history)(rootReducer);
/* ------------- Persist Reducer ------------- */
const persistedReducer = persistReducer(ReduxPersist.storeConfig, historyReducer);

/* ------------- export store and persistor ------------- */

export const store = createStore(persistedReducer, enhancer);
export const persistor = persistStore(store);
