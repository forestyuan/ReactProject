import {AccountInfoActions, AccountSyncStage} from "../../Reducers/AccountInfoReducer";
import React from "react";
import {MarketActions} from "../../Reducers/MarketReducer";
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router-dom";
import {translate} from "react-i18next";
import './TradePanel.scss';

const TradePanel = (
  {
    accountSyncStage, amount, currentToken, price,
    ask, bid, cancelAllAsk, cancelAllBid, changeAmount, changePrice, login
  }
) => {
  console.log({accountSyncStage});
  return ({
    [AccountSyncStage.NOT_START]: <button onClick={login}>Login</button>,
    [AccountSyncStage.SYNCING]: <div>syncing</div>,
    [AccountSyncStage.SYNCED]: (<div styleName="action">
      <div>
        <label>
          Amount:
          <input name="amount" onChange={changeAmount}/>
        </label>
      </div>
      <div>
        <label>
          Price:
          <input name="price" onChange={changePrice}/>
        </label>
      </div>
      <div>
        <button onClick={() => ask({amount, token: currentToken, price})}>ASK</button>
      </div>
      <div>
        <button onClick={() => bid({amount, token: currentToken, price})}>BID</button>
      </div>
      <div>
        <button onClick={() => cancelAllAsk({token: currentToken})}>Cancel All ASK</button>
      </div>
      <div>
        <button onClick={() => cancelAllBid({token: currentToken})}>Cancel All BID</button>
      </div>
    </div>),
  }[accountSyncStage]) || null;
};

const mapStateToProps = ({accountInfo, market})=> ({
  accountSyncStage: accountInfo.accountSyncStage,
  currentToken: market.currentToken,
  tokens: market.tokens,
  askOrders: market.askOrders,
  bidOrders: market.bidOrders,
  amount: market.amount,
  price: market.price,
});
const mapDispatchToProps = (dispatch) => ({
  login: async () => {
    try {
      dispatch(AccountInfoActions.changeAccountSyncStage(AccountSyncStage.SYNCING));
      dispatch(await AccountInfoActions.login());
      dispatch(AccountInfoActions.changeAccountSyncStage(AccountSyncStage.SYNCED));
    } catch (e) {
      dispatch(AccountInfoActions.changeAccountSyncStage(AccountSyncStage.NOT_START));
    }
  },
  changeAmount: ({target: {value}}) => dispatch(MarketActions.changeAmount(value)),
  changePrice: ({target: {value}}) => dispatch(MarketActions.changePrice(value)),
  selectMarket: async ({token}) => {
    dispatch(MarketActions.selectMarket(token));
    dispatch(await MarketActions.loadOrders({backer: token.user}));
  },
  ask: async ({amount, token, price}) => {
    await MarketActions.ask({amount, symbol: token.symbol, price});
    dispatch(await MarketActions.loadOrders({backer: token.user}));
  },
  cancelAllAsk: async ({token}) => {
    await MarketActions.cancelAllAsk({token});
    dispatch(await MarketActions.loadOrders({backer: token.user}));
  },
  bid: async ({amount, token, price}) => {
    await MarketActions.bid({amount, symbol: token.symbol, price});
    dispatch(await MarketActions.loadOrders({backer: token.user}));
  },
  cancelAllBid: async ({token}) => {
    await MarketActions.cancelAllBid({token});
    dispatch(await MarketActions.loadOrders({backer: token.user}));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(translate('translations')(TradePanel)));
