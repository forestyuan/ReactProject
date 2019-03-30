import classNames from 'classnames';
import React, {Component} from 'react';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import AccountNameInput from '../Components/Account/AccountNameInput';
import AccountPanel from '../Components/Account/AccountPanel';
import AccountStageInfo from '../Components/Account/AccountStageInfo';
import ConditionButton from '../Components/ConditionButton';
import CheckBox from '../Components/CheckBox';
import {AccountCreateActions, isNameStageValid, STAGES} from '../Reducers/AccountCreateReducer';
import './AccountScreen.scss';
import {Assets} from '../UIKit';

class AccountScreen extends Component {
  async componentDidMount() {
    const { init, generateAccountName } = this.props;
    init();
    await generateAccountName();
  }


  render() {
    const { t, history } = this.props;
    const {
      accountName,
      accountNameValidation,
      agreeTermsAndConditions,
      isNextValid,
    } = this.props;
    const {
      generateAccountName,
      toggleTermsAndConditions
    } = this.props;
    const invalidHint = (() => {
      if (!agreeTermsAndConditions) {
        return t('Please confirm Terms & Conditions.');
      }
      return t('Please verify username.');
    })();
    return (
      <AccountPanel info={<AccountStageInfo/>}>
        <div styleName="container">
          <div styleName="panel-title-container">
            <div styleName="panel-title" className="new-account">New Account</div>
          </div>
          <div styleName="form-container">
            <div styleName="label-container">
              <div styleName="label">{t('createAccountName')}</div>
              <div styleName="random-generation" className="eos-random-generate" onClick={generateAccountName}>
                <img src={Assets.refreshIcon} alt={t('randomGeneration')} />
                <span>{t('randomGeneration')}</span>
              </div>
            </div>
            <div styleName="name-input">
              <AccountNameInput/>
              <div styleName={classNames('input-hint-container', { 'invalid': !accountNameValidation.valid })}>
                <div>{t('12CharactersHint')}</div>
                <div>{accountName.length}/12</div>
              </div>
            </div>
            <div styleName={classNames('name-hint', { 'invalid': !accountNameValidation.available })}>
              {t(accountNameValidation.msg)}
            </div>
            <div styleName="buttons-container">
              <div styleName="terms-and-condition">
                <div styleName="check-box-wrapper">
                  <CheckBox checked={agreeTermsAndConditions} onChange={toggleTermsAndConditions}/>
                </div>
                <div styleName="condition">{t('iAgreeTo')}&nbsp;
                  <a href={t('termsAndConditionsHref')} target="_blank">{t('termsAndConditions')}</a>.
                </div>
              </div>
              <ConditionButton isValid={isNextValid} invalidHint={t(invalidHint)} action={() => history.push('/account/key-gen')}>
                <div>{t('Next')} &nbsp;<i className="icon-right"/></div>
              </ConditionButton>
            </div>
          </div>
        </div>
      </AccountPanel>
    );
  }
}

const mapStateToProps = state => ({
  accountName: state.accountCreate.accountName,
  accountNameValidation: state.accountCreate.accountNameValidation,
  agreeTermsAndConditions: state.accountCreate.agreeTermsAndConditions,
  isNextValid: isNameStageValid(state.accountCreate),
  generatingName: state.accountCreate.generatingName,
  checkingName: state.accountCreate.generatingName,
});
const mapDispatchToProps = (dispatch) => ({
  toggleTermsAndConditions: ({ target: { checked } }) => dispatch(AccountCreateActions.toggleTermsAndConditions(checked)),
  generateAccountName: async () => {
    dispatch(AccountCreateActions.changeGeneratingName(true));
    const generateAccountNameAction = await AccountCreateActions.generateAccountName();
    dispatch(generateAccountNameAction);
    dispatch(await AccountCreateActions.checkAccountName(generateAccountNameAction.accountName));
    dispatch(AccountCreateActions.changeGeneratingName(false));
  },
  init: () => {
    dispatch(AccountCreateActions.changeIsSelfImport(true));
    dispatch(AccountCreateActions.resetNameStage());
    dispatch(AccountCreateActions.changeStage(STAGES.name));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(translate('translations')(AccountScreen)));

