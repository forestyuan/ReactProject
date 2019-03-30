import React, {Component} from 'react';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';
import AccountPanel from '../../Components/Account/AccountPanel';
import {AccountCreateActions, SETUP_STAGES, STAGES} from '../../Reducers/AccountCreateReducer';
import AccountStatusInfo from '../../Components/Account/AccountStatusInfo';
import ConditionButton from '../../Components/ConditionButton';
import {Config} from '../../Config';
import {AppStateActions} from '../../Reducers/AppStateReducer';
import {Overlay} from '../../Components/Overlay';
import loadingGif from '../../Images/loading.gif';
import './SetupScreen.scss';
import {AccountInfoActions} from '../../Reducers/AccountInfoReducer';

function formatDateTime(ts) {
  const date = new Date(ts);
  return date.toLocaleDateString([], {
    h12: false,
    timeZoneName: 'long',
    hour: 'numeric',
    minute: 'numeric'
  });
}

class SetupScreen extends Component {
  constructor(props) {
    super(props);
    const params = props.match.params;
    if (!params.requestId) return props.history.replace('/account/create');
    props.initScatter();
  }

  async componentDidMount() {
    // validate can request be setup
    const {getAccountRequestStage, getAccountRequestById, match} = this.props;
    const res = await getAccountRequestStage(match.params.requestId);
    if (!res || (res.stage !== STAGES.payment && res.stage !== STAGES.done)) {
      this.props.history.replace('/account/create');
    }
    await getAccountRequestById(match.params.requestId);
  }

  componentWillUnmount() {
    this.clearCheckCreatedInterval();
  }

  startCheckCreatedInterval() {
    this.timer = setInterval(async () => {
      const {
        checkIsAccountCreated,
        accountRequest,
        setupStage,
        getAccountRequestById,
        match: {params: {requestId}}
      } = this.props;
      await checkIsAccountCreated(accountRequest);
      if (setupStage === SETUP_STAGES.done || setupStage === SETUP_STAGES.loaded) {
        await getAccountRequestById(requestId);
        this.clearCheckCreatedInterval();
      }
    }, 1000);
  }

  clearCheckCreatedInterval() {
    clearInterval(this.timer);
    this.timer = null;
  }

  async doSetup() {
    const {setup, accountRequest} = this.props;
    await setup(accountRequest);
    this.startCheckCreatedInterval();
  }

  renderSetup() {
    const {t, accountRequest, scatterInit} = this.props;
    return (<section styleName="content-wrapper">
      <h4>{t('friendAccountSetupRequest')}</h4>
      <div styleName="account-info">
        <div styleName="info-row">
          <p>{accountRequest.accountName || '-'}</p>
          <p>{t('The Account Name')}</p>
        </div>
        <div styleName="info-row">
          <p>{formatDateTime(accountRequest.updateAt || Date.now())}</p>
          <p>{t('Request Date')}</p>
        </div>
        <div styleName="info-row">
          <p>{Config.accountResources.ramKB} KB</p>
          <p>{t('Initiating RAM')}</p>
        </div>
        <div styleName="info-row">
          <p>{Config.accountResources.cpu + Config.accountResources.net} {Config.coreSymbol}</p>
          <p>{t('Need to Stake EOS')}</p>
        </div>
        <p styleName="extra-hint">{t('No extra fee charged')}</p>
        <ConditionButton
          action={this.doSetup.bind(this)}
          isValid={scatterInit}
          styleName="setup-btn">
          <span>{t('Auth Scatter to set up the account')}</span>
        </ConditionButton>
      </div>
    </section>);
  }

  renderDone() {
    const {t, accountRequest} = this.props;
    return (<section styleName="content-wrapper__done">
      <h4>{t('friendSetupSuccess')}</h4>
      <div styleName="account-info">
        <div styleName="name">
          <p>{accountRequest.accountName}</p>
          <p>{t('The Account Name')}</p>
        </div>
        <div styleName="info-row">
          <p>{t('Staked')} {Config.coreSymbol}</p>
          <p>{accountRequest.staked || '-'} {Config.coreSymbol}</p>
        </div>
        <div styleName="info-row">
          <p>{t('RAM (4KB)')}</p>
          <p>{accountRequest.ramValue} {Config.coreSymbol}</p>
        </div>
        <div styleName="info-row">
          <p>{t('Un-Staked')} {Config.coreSymbol}</p>
          <p>{accountRequest.unstaked || '-'} {Config.coreSymbol}</p>
        </div>
        <div onClick={() => this.props.history.replace('/account/create')}
             className="general-button-container" styleName="create-new-btn">
          <p>{t('Create New Account')}</p>
        </div>
      </div>
    </section>);
  }

  render() {
    const {setupStage} = this.props;
    return (
      <div>
        <AccountPanel info={<AccountStatusInfo />}>
          {setupStage !== SETUP_STAGES.done && this.renderSetup()}
          {setupStage === SETUP_STAGES.done && this.renderDone()}
          <Overlay show={[SETUP_STAGES.creating, SETUP_STAGES.init].includes(setupStage)} contentWidth={'80px'}>
            <img alt="loading" src={loadingGif} width={80} />
          </Overlay>
        </AccountPanel>
      </div>);
  }
}

const mapStateToProps = (state) => ({
  scatterInit: state.appState.initFinish,
  stage: state.accountCreate.stage,
  setupStage: state.accountCreate.setupStage,
  eosAccount: state.accountCreate.eosAccount,
  accountRequest: state.accountCreate.accountRequest
});

const mapDispatchToProps = (dispatch) => ({
  initScatter: async () => dispatch(AppStateActions.init()),
  updateStage: (stage) => dispatch(AccountCreateActions.changeStage(stage)),
  getAccountRequestStage: async (requestId, history) => {
    const result = await AccountCreateActions.fetchAccountRequest({requestId, history});
    dispatch(result);
    return result;
  },
  getAccountRequestById: async (requestId) => dispatch(await AccountCreateActions.updateAccountRequest({requestId})),
  setup: async (accountRequest) => {
    dispatch(await AccountInfoActions.login());
    dispatch(AccountCreateActions.startSetup({accountRequest}));
    dispatch(await AccountCreateActions.setupAccount({accountRequest}));
  },
  checkIsAccountCreated: async (accountRequest) => (dispatch(await AccountCreateActions.checkIsAccountCreated({accountRequest})))
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(SetupScreen));
