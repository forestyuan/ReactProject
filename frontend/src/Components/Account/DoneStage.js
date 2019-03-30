import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { AccountCreateActions } from '../../Reducers/AccountCreateReducer';
import './DoneStage.scss';
import { AppStateActions } from '../../Reducers/AppStateReducer';
import { Link } from 'react-router-dom';

class DoneStage extends Component {
  constructor(props) {
    super(props);
    this.props.initScatter();
  }

  render() {
    const {
      t,
      eosAccount,
      scatterInit
    } = this.props;
    const { account_name, cpu_weight, net_weight, total_resources: { ram_bytes } } = eosAccount;
    return (
      <div styleName="container">
        <div styleName="title-container">
          <div styleName="title">{t('congratulations')}</div>
          <div styleName="title">{t('alreadySetup')}</div>
          <div styleName="title">{t('eosAccount')}</div>
        </div>
        <div styleName="account-name-container">
          <div styleName="account-name" className="donestage-account-name">{account_name}</div>
          <div styleName="account-name-hint">{t('The Account Name')}</div>
        </div>
        <div styleName="divider">
          <hr/>
        </div>
        <div>
          <div styleName="hint-container">
            <div>{t('staked')}</div>
            <div>{((cpu_weight + net_weight) / 10000).toFixed(4)} EOS</div>
          </div>
          <div styleName="hint-container">
            <div>Ram (KB)</div>
            <div>{((ram_bytes) / 1024).toFixed(3)} KB</div>
          </div>
          <div styleName="hint-container">
            <div>{t('unstaked')}</div>
            <div> -</div>
          </div>
        </div>
        <div styleName="divider">
          <hr/>
        </div>
        <div styleName="buttons">
          <Link to="/account/create">
            <div className="general-button-container">
              {t('anotherNewAccount')}
            </div>
          </Link>
          <div className={`primary-button-container ${scatterInit ? 'active' : 'disabled'}`}>
            {t('importToScatter')}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  scatterInit: state.appState.initFinish,
  accountName: state.accountCreate.accountName,
});
const mapDispatchToProps = (dispatch) => ({
  initScatter: async () => {
    AppStateActions.init();
  },
  importToScatter: async ({ activePublicKey }) => {
    await dispatch(AccountCreateActions.importToScatter({
      activePublicKey
    }));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(DoneStage));
