import React, {Component} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';
import UserBalanceModal from './UserBalanceModal';
import {TradeRamActions, TradeType} from '../../Reducers/TradeRamReducer';
import {AppStateActions} from '../../Reducers/AppStateReducer';
import logo from '../../Images/logo.png';
import './TopNav.scss';

class TopNav extends Component {
  render() {
    const {
      t,
      tradeType,
      activeBuyTab,
      activeSellTab,
      toggleUserBalanceModal,
      isShowUserBalanceModal
    } = this.props;
    const isBuying = tradeType !== TradeType.SELL_RAM;
    const buyClassName = isBuying ? 'color-text-blue semi-bold font-20' : 'color-text-secondary bold font-20';
    const sellClassName = isBuying ? 'color-text-secondary bold font-20' : 'color-text-blue semi-bold font-20';
    return (
      <section styleName="container">
        <div className="hide-gt-xs" styleName="logo">
          <img alt="logo" src={logo}/>
        </div>
        <div styleName='trade-tabs'>
          <div styleName='trade-tab' onClick={activeBuyTab}>
            <span className={buyClassName}>{
              t('buy')
            }</span>
          </div>
          <div styleName='trade-tab' onClick={activeSellTab}>
            <span className={sellClassName}>{
              t('sell')
            }</span>
          </div>
        </div>
        <LanguageSwitcher/>
        <div styleName="user-balance-tab" onClick={toggleUserBalanceModal}>
          <span>My Balance</span>
        </div>
        {isShowUserBalanceModal && <div className="hide-gt-sm" styleName="user-balance-modal">
          <UserBalanceModal/>
        </div>}
      </section>
    );
  }
}

const mapStateToProps = state => ({
  tradeType: state.tradeRam.tradeType,
  isShowUserBalanceModal: state.appState.isShowUserBalanceModal
});
const mapDispatchToProps = (dispatch) => ({
  activeBuyTab: () => dispatch(TradeRamActions.changeTradeType(TradeType.BUY_RAM_BYTES)),
  activeSellTab: () => dispatch(TradeRamActions.changeTradeType(TradeType.SELL_RAM)),
  toggleUserBalanceModal: () => dispatch(AppStateActions.toggleUserBalanceModal())
});
export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(TopNav));
