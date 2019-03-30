import ecc from 'eosjs-ecc';
import React, {Component} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';
import {Redirect, withRouter} from 'react-router';
import AccountPanel from '../../Components/Account/AccountPanel';
import AccountStageInfo from '../../Components/Account/AccountStageInfo';
import ConditionButton from '../../Components/ConditionButton';
import KeyInput from '../../Components/Account/KeyInput';
import {AccountCreateActions, STAGES} from '../../Reducers/AccountCreateReducer';
import {AccountRequestResource} from '../../Resources/AccountRequest';
import {Toast} from '../../Services/Toast';
import {Overlay} from '../../Components/Overlay';
import './KeyGenScreen.scss';
import {Assets} from '../../UIKit';

class KeyGenScreen extends Component {

  componentDidMount() {
    const {init} = this.props;
    init();
  }

  componentWillUnmount() {
    const {changeIsSelfImport, toggleSaveKeysAlert} = this.props;
    changeIsSelfImport(true);
    toggleSaveKeysAlert(false);
  }


  async genKeySecure() {
    const {ownerPrivateKey, activePrivateKey} = await this.props.genKeyPairs();
    this.refs.ownerPrivate.innerHTML = ownerPrivateKey;
    this.refs.activePrivate.innerHTML = activePrivateKey;
  }

  async nextStage() {
    const {t} = this.props;
    const {activePublicKey, ownerPublicKey, accountName} = this.props;
    try {
      const {accountRequest} = await AccountRequestResource.create({activePublicKey, ownerPublicKey, accountName});
      this.props.history.push(`/account/payment/${accountRequest._id}`);
    } catch (err) {
      Toast.failed(t('Failed to save public keys. Please try again'));
    }
  }

  async showSaveKeyAlert() {
    const {toggleSaveKeysAlert, isSelfImport} = this.props;
    if (!isSelfImport) {
      toggleSaveKeysAlert(true);
    } else {
      await this.nextStage();
    }
  }

  savePrivateToClipboard(refName) {
    const key = this.refs[refName].innerHTML;
    const type = refName === 'ownerPrivate' ? 'Owner' : 'Active';
    const textField = document.createElement('textarea');
    textField.innerText = `${type} Private Key: ${key}`;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    Toast.success(`${type} Private Key Copied`);
  }

  goBack() {
    this.props.clearGenKeyPairs();
  }

  renderSelfImportPublicKeys() {
    const {t} = this.props;
    const {isActiveKeyValid, isOwnerKeyValid} = this.props;
    const {updateActivePublicKey, updateOwnerPublicKey} = this.props;
    const className = this.props.isSelfImport ? '' : 'hide';
    return (<section className={className} styleName="import-wrapper">
      <div styleName="header-text" className="key-gen-reminder">
        <h4>{t('enterPublicKey')}<br />{t('orGenNewKeyPairs')}</h4>
      </div>
      <div styleName="key-gen-form">
        <section styleName="key-section">
          <div>
            <h5>{t('Owner Public Key')}</h5>
            <KeyInput onChange={updateOwnerPublicKey} isValid={isOwnerKeyValid}
                      placeholder={t('enterOwnerPublicKey')} />
          </div>
        </section>
        <section styleName="key-section">
          <div>
            <h5>{t('Active Public Key')}</h5>
            <KeyInput onChange={updateActivePublicKey} isValid={isActiveKeyValid}
                      placeholder={t('enterActivePublicKey')} />
          </div>
        </section>
      </div>
    </section>);
  }

  renderGeneratedKeys() {
    const {t} = this.props;
    const {activePublicKey, ownerPublicKey} = this.props;
    const className = this.props.isSelfImport ? 'hide' : '';
    return (
      <section styleName="generate-wrapper" className={className}>
        <div styleName="header-text">
          <h4>
            {t('newKeyPairsGen')}
            <br />
            {t('saveToSafePlace')}
          </h4>
          <span styleName="go-back" onClick={this.goBack.bind(this)}>{t('alreadyHaveKeyPairs')}</span>
        </div>
        <div styleName="key-gen-form">
          <section styleName="key-section">
            <div>
              <h5>{t('Owner Public Key')}</h5>
              <div styleName="key-button-row">
                <div styleName="public-key" className="owner-public-key">{ownerPublicKey}</div>
                <CopyToClipboard text={`Owner Public Key: ${ownerPublicKey}`}
                                 onCopy={() => Toast.success(t('ownerPublicKeyCopied'))}>
                  <img src={Assets.copyPasteIcon} alt="copy" />
                </CopyToClipboard>
              </div>
            </div>
            <div>
              <h5>{t('Owner Private Key')} <i className="icon-lock" /></h5>
              <div styleName="key-button-row">
                <div styleName="private-key" className="owner-private-key" ref="ownerPrivate" />
                <div onClick={() => this.savePrivateToClipboard('ownerPrivate')}>
                  <img src={Assets.copyPasteIcon} alt="copy" />
                </div>
              </div>
              <p styleName="save-to-safe-place">{t('saveToSafePlace')}</p>
            </div>
            <div styleName="image-text">
              OWNER
            </div>
          </section>
          <section styleName="key-section">
            <div>
              <h5>{t('Active Public Key')}</h5>
              <div styleName="key-button-row">
                <div styleName="public-key" className="active-public-key">{activePublicKey}</div>
                <CopyToClipboard text={`Active Public Key: ${activePublicKey}`}
                                 onCopy={() => Toast.success('activePublicKeyCopied')}>
                  <img src={Assets.copyPasteIcon} alt="copy" />
                </CopyToClipboard>
              </div>
            </div>
            <div>
              <h5>{t('Active Private Key')} <i className="icon-lock" /></h5>
              <div styleName="key-button-row">
                <div styleName="private-key" className="active-private-key" ref="activePrivate" />
                <div onClick={() => this.savePrivateToClipboard('activePrivate')}>
                  <img src={Assets.copyPasteIcon} alt="copy" />
                </div>
              </div>
              <p styleName="save-to-safe-place">{t('saveToSafePlace')}</p>
            </div>
            <div styleName="image-text">
              ACTIVE
            </div>
          </section>
        </div>
      </section>);
  }

  render() {
    const {t} = this.props;
    const {isConditionButtonValid, accountName, isShowSaveKeysAlert, toggleSaveKeysAlert} = this.props;
    if (!accountName) return (<Redirect to={`/account/create`} />);
    return (
      <AccountPanel info={<AccountStageInfo />}>
        <div styleName="key-gen-container">
          <div styleName="panel-title-container" />
          {this.renderSelfImportPublicKeys()}
          {this.renderGeneratedKeys()}
          <div styleName="key-gen-actions">
            <div className="general-button-container generate-key-pairs-btn" styleName="generate-key-button"
                 onClick={this.genKeySecure.bind(this)}>
              {t('genKeyPairs')}
            </div>
            <ConditionButton isValid={isConditionButtonValid}
                             action={this.showSaveKeyAlert.bind(this)}>
              <div>{t('Next')} &nbsp;<i className="icon-right" /></div>
            </ConditionButton>
          </div>
        </div>
        <Overlay show={isShowSaveKeysAlert} contentBorderColor={'#a2c3fe'}>
          <article styleName="alert-container" className="alert-container">
            <div styleName="alert-header">
              <i className="icon-cancel" styleName="icon-close" onClick={() => toggleSaveKeysAlert(false)} />
            </div>
            <div styleName="alert-content">
              <p>{t('isSaveToSafe')}</p>
            </div>
            <div styleName="alert-actions" className="alert-actions">
              <div className="alert-actions-no" onClick={() => toggleSaveKeysAlert(false)}>
                <p>{t('noSaveToSafe')}</p>
              </div>
              <div className="alert-actions-yes" onClick={this.nextStage.bind(this)}>
                <p>{t('yesSaveToSafe')}</p>
              </div>
            </div>
          </article>
        </Overlay>
      </AccountPanel>
    );
  }
}

const mapStateToProps = state => ({
  accountName: state.accountCreate.accountName,
  ownerPublicKey: state.accountCreate.ownerPublicKey,
  activePublicKey: state.accountCreate.activePublicKey,
  isOwnerKeyValid: ecc.isValidPublic(state.accountCreate.ownerPublicKey),
  isActiveKeyValid: ecc.isValidPublic(state.accountCreate.activePublicKey),
  isConditionButtonValid: ecc.isValidPublic(state.accountCreate.ownerPublicKey) &&
    ecc.isValidPublic(state.accountCreate.activePublicKey) &&
    !!state.accountCreate.accountName,
  isShowSaveKeysAlert: state.accountCreate.isShowSaveKeysAlert,
  isSelfImport: state.accountCreate.isSelfImport
});
const mapDispatchToProps = (dispatch) => ({
  updateOwnerPublicKey: (val) => dispatch(AccountCreateActions.changeOwnerPublicKey(val)),
  updateActivePublicKey: (val) => dispatch(AccountCreateActions.changeActivePublicKey(val)),
  init: () => {
    dispatch(AccountCreateActions.changeStage(STAGES.keyGen));
    dispatch(AccountCreateActions.changeOwnerPublicKey(''));
    dispatch(AccountCreateActions.changeActivePublicKey(''));
    ecc.initialize();
  },
  toggleSaveKeysAlert: (val) => dispatch(AccountCreateActions.changeIsShowSaveKeysAlert(val)),
  changeIsSelfImport: (val) => dispatch(AccountCreateActions.changeIsSelfImport(val)),
  genKeyPairs: async () => {
    const [ownerPrivateKey, activePrivateKey] = await Promise.all([ecc.randomKey(), ecc.randomKey()]);
    let activePublicKey = ecc.privateToPublic(activePrivateKey);
    let ownerPublicKey = ecc.privateToPublic(ownerPrivateKey);
    dispatch(AccountCreateActions.changeOwnerPublicKey(ownerPublicKey));
    dispatch(AccountCreateActions.changeActivePublicKey(activePublicKey));
    dispatch(AccountCreateActions.changeIsSelfImport(false));
    return {ownerPrivateKey, activePrivateKey};
  },
  clearGenKeyPairs: () => {
    dispatch(AccountCreateActions.changeIsSelfImport(true));
    dispatch(AccountCreateActions.changeOwnerPublicKey(''));
    dispatch(AccountCreateActions.changeActivePublicKey(''));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(translate('translations')(KeyGenScreen)));

