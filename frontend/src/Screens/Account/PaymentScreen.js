/* global StripeCheckout */
import React, {Component} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';
import AccountPanel from '../../Components/Account/AccountPanel';
import AccountStageInfo from '../../Components/Account/AccountStageInfo';
import ConditionButton from '../../Components/ConditionButton';
import DoneStage from '../../Components/Account/DoneStage';
import ProcessStage from '../../Components/Account/ProcessStage';
import {Overlay} from '../../Components/Overlay';
import {Config} from '../../Config';
import {AccountCreateActions, STAGES} from '../../Reducers/AccountCreateReducer';
import {Toast} from '../../Services/Toast';
import loadingGif from '../../Images/loading.gif';
import './PaymentScreen.scss';

const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

class PaymentScreen extends Component {
  constructor(props) {
    super(props);
    const params = props.match.params;
    if (!params.requestId) return props.history.replace('/account/create');
    this.state = {
      friendEmail: '',
      isFriendEmailValid: false,
    };
  }


  async componentDidMount() {
    await this.validateAccountRequest();
    this.configureStripe();
  }

  componentWillUnmount() {
    this.clearCheckStatusInterval();
  }

  clearCheckStatusInterval() {
    if (this.checkAccountStatusInterval) {
      clearInterval(this.checkAccountStatusInterval);
      this.checkAccountStatusInterval = null;
    }
  }

  startInterval() {
    const requestId = this.props.match.params.requestId;
    const {getAccountRequest} = this.props;
    this.checkAccountStatusInterval = setInterval(async () => {
      try {
        const res = await getAccountRequest(requestId);
        if (res && res.stage === STAGES.done) return this.clearCheckStatusInterval();
      } catch (err) {
      }
    }, 3000);
  }

  async validateAccountRequest() {
    const {getAccountRequest, match} = this.props;
    try {
      const res = await getAccountRequest(match.params.requestId);
      if (res && res.stage === STAGES.process && !this.checkAccountStatusInterval) return this.startInterval();
    } catch (err) {
    }
  }

  configureStripe() {
    const accountRequestId = this.props.match.params.requestId;
    const {chargeUser, t} = this.props;
    const that = this;
    this.handler = StripeCheckout.configure({
      ...Config.stripeConfig,
      token: async (token) => {
        try {
          await chargeUser({token, accountRequestId});
          await that.validateAccountRequest();
        } catch (err) {
          // FIXME: stripe config error copywriter
          Toast.failed(t('canNotConnectToStripe'));
          console.error(err);
        } finally {
          that.props.changeCharging(false);
        }
      },
      opened() {
        that.props.changeCharging(true);
      },
      closed() {
        that.props.changeCharging(false);
      }
    });
  }

  async handlePayButtonClick() {
    if (this.handler) {
      this.handler.open(Config.stripeCheckoutConfiguration);
    }
  }

  handleFriendEmailChange(e) {
    const email = e.target.value;
    this.setState({
      friendEmail: email,
      isFriendEmailValid: emailRegex.test(email)
    });
  }

  renderPay() {
    const {toggleEmailFriend, t, toggleIsShowSendToFriend, isShowSendToFriend} = this.props;
    const friendSetupUrl = `${Config.frontend}/account/setup/${this.props.match.params.requestId}`;
    return (<div styleName="container">
      <div styleName="title-container">
        <div styleName="title" className="payment-screen-reminder">{t('successThenRedirectHere')}</div>
        <div styleName="subtitle">{t('checkStatusByNameOrPK')}</div>
      </div>
      <div>
        <div styleName="payment-label">{t('selectPaymentMethod')}</div>
        <div className="primary-button-container active" styleName="pay-usd-button"
             onClick={this.handlePayButtonClick.bind(this)}>
          <div>
            <span>{t('creditCard')}</span>&nbsp;
            <span styleName="stripe">Powered by Stripe</span>
          </div>
          <div>{Config.serviceFee}</div>
        </div>
        <div>
          <div styleName="resource-label">
            {t('resourceIncluded')}
          </div>
          <div styleName="hint-container">
            <div>{t('amountToDelegate')}</div>
            <div>{Config.accountResources.cpu + Config.accountResources.net} {Config.coreSymbol}</div>
          </div>
          <div styleName="hint-container">
            <div>RAM</div>
            <div>{Config.accountResources.ramKB} KB</div>
          </div>
        </div>
        <div styleName="divider">
          <hr />
          <div>OR</div>
          <hr />
        </div>
        <div className="general-button-container forward-button" 
             styleName="send-link-button" 
             onClick={toggleIsShowSendToFriend}>
          <p>{t('sendLinkToSomeone')}</p>
          {isShowSendToFriend && <div styleName="share-action-container">
            <div styleName="action-row" className="copy-the-link">
              <CopyToClipboard text={friendSetupUrl}
                               onCopy={() => Toast.success('Link Copied!', {position: 'bottom-left'})}>
                <div>{t('copyLink')}</div>
              </CopyToClipboard>
            </div>
            <div styleName="line" />
            <div styleName="action-row" onClick={() => toggleEmailFriend(true)}>{t('Email my friend')}</div>
          </div>}
        </div>
        <div styleName="hint">
          {t('stakeByFriend')}
        </div>
      </div>
    </div>);
  }

  render() {
    const {t, charging, match} = this.props;
    const requestId = match.params && match.params.requestId;
    const friendSetupUrl = `${Config.frontend}/account/setup/${requestId}`;
    const {stage, eosAccount, showEmailFriendOverlay, toggleEmailFriend, shareLinkToFriend} = this.props;
    return (
      <div>
        <AccountPanel info={<AccountStageInfo />}>
          {
            {
              [STAGES.payment]: this.renderPay(),
              [STAGES.process]: <ProcessStage requestId={requestId} />,
              [STAGES.done]: <DoneStage eosAccount={eosAccount} />
            }[stage || STAGES.process]
          }
        </AccountPanel>
        <Overlay show={showEmailFriendOverlay} contentBorderColor={'#a2c3fe'}>
          <div styleName="email-friend-overlay-container" className="alert-container">
            <div styleName="top-row">
              <p className="semi-bold">{t('enterFriendEmail')}</p>
              <i className="icon-cancel" onClick={() => toggleEmailFriend(false)} />
            </div>
            <div styleName="input-container">
              <input className="general-input alert-email-address" type="text" placeholder={'Email Address'}
                     onChange={this.handleFriendEmailChange.bind(this)} value={this.state.friendEmail} />
              <div styleName="hint">{t('noSpam')}</div>
            </div>
            <div styleName="ok-button">
              <ConditionButton isValid={this.state.isFriendEmailValid}
                               action={() => shareLinkToFriend({
                                 to: this.state.friendEmail,
                                 shareUrl: friendSetupUrl
                               })}>
                <div>OK</div>
              </ConditionButton>
            </div>
          </div>
        </Overlay>
        <Overlay show={charging} contentWidth={64}>
          <img alt="charging" src={loadingGif} width={64} />
        </Overlay>
      </div>);
  }
}

const mapStateToProps = (state) => ({
  stage: state.accountCreate.stage,
  eosAccount: state.accountCreate.eosAccount,
  showEmailFriendOverlay: state.accountCreate.showEmailFriendOverlay,
  isShowSendToFriend: state.accountCreate.isShowSendToFriend,
  charging: state.accountCreate.charging
});

const mapDispatchToProps = (dispatch) => ({
  updateStage: (stage) => dispatch(AccountCreateActions.changeStage(stage)),
  chargeUser: async ({token, accountRequestId}) => {
    dispatch(await AccountCreateActions.charge({
      token,
      accountRequestId
    }));
  },
  getAccountRequest: async (requestId, history) => {
    try {
      const result = await AccountCreateActions.fetchAccountRequest({requestId, history});
      dispatch(result);
      return result;
    } catch (err) {
      return {stage: null};
    }
  },
  toggleEmailFriend: (value) => dispatch(AccountCreateActions.toggleEmailFriend(value)),
  toggleIsShowSendToFriend: () => dispatch(AccountCreateActions.changeIsShowSendToFriend()),
  shareLinkToFriend: async ({to, shareUrl}) => dispatch(await AccountCreateActions.shareLinkToFriend({
    to,
    shareUrl
  })),
  changeCharging: (val) => dispatch(AccountCreateActions.changeCharging(val))
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(PaymentScreen));
