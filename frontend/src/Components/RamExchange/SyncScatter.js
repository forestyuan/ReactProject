import React, {Component} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import UserTransaction from './UserTransactionModal';
import {AccountInfoActions, AccountSyncStage} from '../../Reducers/AccountInfoReducer';
import {AppStateActions} from '../../Reducers/AppStateReducer';
import {RamTransactionActions} from '../../Reducers/RamTransactionReducer';
import loading from '../../Images/loading.gif';
import {Link} from 'react-router-dom';
import {Overlay} from '../Overlay';
import './SyncScatter.scss';

class SyncScatter extends Component {
  async componentDidMount() {
    const {init, login} = this.props;
    await init();
    await login({auto: true});
  }

  renderInfo() {
    const {
      t,
      toggleUserTransaction,
      toggleUserBalanceModal,
      toggleLogOut,
      accountSyncStage,
      tokenPrice, eosQuota, eosStaked,
      ramQuota, ramUsage, ramValue,
      cpuQuota, cpuUsage,
      netQuota, netUsage, showLogOut,
    } = this.props;
    const synced = accountSyncStage === AccountSyncStage.SYNCED;
    if (!synced) return null;
    return (
      <div styleName="info">
        <div styleName="header">
          <div styleName="header-left">
            <span className="font-16 bold color-text-white">{t('balance')}</span>
            <i className="icon-cog-outline color-text-white cursor-pointer" onClick={() => toggleLogOut(!showLogOut)}/>
          </div>
          <div className="hide-lt-md cursor-pointer" onClick={toggleUserTransaction}>
            <i className="icon-back-in-time color-text-white"/>
            <span className="font-12 bold color-text-white">{t('userHistory')}</span>
          </div>
          <div className="hide-gt-sm cursor-pointer" onClick={toggleUserBalanceModal}>
            <span className="font-12 bold color-text-white">{t('close')}</span>
          </div>
        </div>
        <div styleName="content">
          <div>
            <p className="font-32">{ramQuota.toFixed(2)} KB</p>
            <p className="font-14 opacity-_6">{t('equal')} {ramValue} EOS</p>
          </div>
          <div>
            <p className="font-16">{ramUsage.toFixed(2)} KB</p>
            <p className="font-12">{t('used')}</p>
            <div styleName="progress-container">
              <div styleName="progress-bar">
                <div styleName="progress" style={{width: `${(ramUsage / ramQuota) * 100}%`}}/>
              </div>
              <span className="font-10">{`${((ramUsage / ramQuota) * 100).toFixed(2)}%`}</span>
            </div>
          </div>
        </div>
        <div styleName="footer">
          <div>
            <p className="font-16 color-text-white">{eosQuota}&nbsp;
              {tokenPrice && <span className="opacity-_6">(${(tokenPrice * parseFloat(eosQuota)).toFixed(2)})</span>}
            </p>
            <p className="opacity-_6 font-12 color-text-white bold">{t('unstaked')}</p>
          </div>
          <div styleName="resource-info">
            <div styleName="eos-unstaked">
              <p className="font-16 color-text-white">{eosStaked}</p>
              <p className="opacity-_6 font-12 color-text-white bold">{t('staked')}</p>
            </div>
            <div styleName="cpu-net">
              <div>
                <span className="opacity-_6">CPU</span>
                <span className="opacity-1">{`${(cpuUsage / cpuQuota * 100).toFixed(2)}%`}</span>
              </div>
              <div>
                <span className="opacity-_6">NET</span>
                <span className="opacity-1">{`${(netUsage / netQuota * 100).toFixed(2)}%`}</span>
              </div>
            </div>
          </div>
        </div>
        <Overlay show={showLogOut}
                 close={() => toggleLogOut(false)}
                 overlayColor={'transparent'}
                 contentWidth={'320px'}>
        </Overlay>
        {this.renderAccountSummaryModal()}
      </div>
    );
  }

  renderAccountSummaryModal() {
    const {
      t,
      accountName,
      disconnect,
      showLogOut,
    } = this.props;
    if (!showLogOut) return null;
    return (<div styleName="account-summary" className="color-text-primary modal-content">
      <article styleName="account-name">
        <p>{t('accountName')}</p>
        <p>{accountName}</p>
      </article>
      <article styleName="scatter-auth">
        <p>{t('scatterAuthorization')}</p>
      </article>
      <div styleName="log-out" className="general-button-container" onClick={disconnect}>
        <span>{t('cancelTheAuthorization')}</span>
      </div>
    </div>);
  }

  renderSyncHint() {
    const {t, accountSyncStage, login} = this.props;
    const notSync = accountSyncStage === AccountSyncStage.NOT_START;
    if (!notSync) return null;
    return (
      <div styleName="hint">
        <div styleName="hint-text">
          {t('syncHint')}
        </div>
        <div className="cursor-pointer" styleName="sync-button" onClick={login}>
          <p>{t('syncBtn')}</p>
        </div>
        <Link to="/account/create">
          <div className="cursor-pointer" styleName="create-button">
            <p>{t('createBtn')}</p>
          </div>
        </Link>
        <a href={t('howToTradeRamHref')} target="_blank" styleName="how-to-trade-ram">{t('howToTradeRam')}</a>
      </div>
    );
  }

  renderLoading() {
    const {accountSyncStage} = this.props;
    const syncing = accountSyncStage === AccountSyncStage.SYNCING;
    if (!syncing) return null;
    return (<div className="loading">
      <img alt='loading' src={loading}/>
    </div>);
  }

  render() {
    return (
      <div styleName="sync-scatter">
        {this.renderSyncHint()}
        {this.renderInfo()}
        {this.renderLoading()}
        <UserTransaction/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  accountSyncStage: state.accountInfo.accountSyncStage,
  tokenPrice: state.accountInfo.tokenPrice,
  accountName: state.accountInfo.accountName,
  eosQuota: state.accountInfo.eosQuota,
  eosStaked: state.accountInfo.eosStaked,
  ramQuota: state.accountInfo.ramQuota,
  ramUsage: state.accountInfo.ramUsage,
  ramValue: state.accountInfo.ramValue,
  cpuQuota: state.accountInfo.cpuQuota,
  cpuUsage: state.accountInfo.cpuUsage,
  netQuota: state.accountInfo.netQuota,
  netUsage: state.accountInfo.netUsage,
  showLogOut: state.accountInfo.showLogOut,
});

const mapDispatchToProps = (dispatch) => ({
  init: async () => {
    dispatch(await AppStateActions.init());
  },
  login: async ({auto = false}) => {
    try {
      dispatch(AccountInfoActions.changeAccountSyncStage(AccountSyncStage.SYNCING));
      if (auto) {
        dispatch(await AccountInfoActions.autoLogin());
      } else {
        dispatch(await AccountInfoActions.login());
      }
      dispatch(await AccountInfoActions.syncAccount());
      dispatch(await AccountInfoActions.changeTokenPrice());
      dispatch(AccountInfoActions.changeAccountSyncStage(AccountSyncStage.SYNCED));
    } catch (e) {
      dispatch(AccountInfoActions.changeAccountSyncStage(AccountSyncStage.NOT_START));
    }
  },
  disconnect: async () => {
    dispatch(await AccountInfoActions.logout());
    dispatch(AccountInfoActions.toggleLogOut(false));
    dispatch(AccountInfoActions.changeAccountSyncStage(AccountSyncStage.NOT_START));
  },
  toggleUserTransaction: async () => {
    dispatch(RamTransactionActions.changeIsShowUserTransaction(true));
  },
  toggleUserBalanceModal: async () => dispatch(AppStateActions.toggleUserBalanceModal()),
  toggleLogOut: (val) => dispatch(AccountInfoActions.toggleLogOut(val)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(SyncScatter));
