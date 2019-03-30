import React, {Component} from 'react';
import {translate} from 'react-i18next';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import './MarketPairScreen.scss';
import {MarketActions} from "../Reducers/MarketReducer";
import {AccountInfoActions, AccountSyncStage} from "../Reducers/AccountInfoReducer";
import TradePanel from "../Components/MarketPair/TradePanel";

class MarketPairScreen extends Component {
  componentDidMount() {
    const {init} = this.props;
    init();
  }

  renderTrade() {
    const {initFinish} = this.props;
    if (!initFinish) return <div>loading</div>;
    return <TradePanel/>;
  }

  render() {
    const {currentToken, selectMarket, tokens, askOrders, bidOrders} = this.props;
    return (
      <div styleName="container">
        <div styleName="tokens-container">
          {tokens.map((token, index) => {
            const isActive = currentToken && currentToken.user === token.user;
            return (<div key={index} styleName={classNames('token', {active: isActive})}
                         onClick={() => selectMarket({token})}>
              <div>{token.symbol.precision} {token.symbol.name}</div>
              <div>@{token.symbol.contract}</div>
            </div>);
          })}
        </div>
        <div styleName="info-container">
          <div styleName="chart-container">
            <div>图表</div>
          </div>
          <div styleName="list-container">
            <div styleName="ask-list">
              {askOrders.map((order, index) => {
                return (<div key={index}>
                  <div>
                    {order.asset.quantity}
                  </div>
                  <div>
                    price: {order.price}
                  </div>
                </div>);
              })}
            </div>
            <div styleName="bid-list">
              {bidOrders.map((order, index) => {
                return (<div key={index}>
                  <div>
                    {order.asset.quantity}
                  </div>
                  <div>
                    price: {order.price}
                  </div>
                </div>);
              })}
            </div>
          </div>
        </div>
        <div styleName="action-container">
          {this.renderTrade()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  accountSyncStage: state.accountInfo.accountSyncStage,
  initFinish: state.appState.initFinish,
  currentToken: state.market.currentToken,
  tokens: state.market.tokens,
  askOrders: state.market.askOrders,
  bidOrders: state.market.bidOrders,
  amount: state.market.amount,
  price: state.market.price,
});
const mapDispatchToProps = (dispatch) => ({
  init() {
    dispatch(MarketActions.listTokens());
  },
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
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(translate('translations')(MarketPairScreen)));

