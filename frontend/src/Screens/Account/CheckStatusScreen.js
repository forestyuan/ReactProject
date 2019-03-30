import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import CheckStatus from '../../Components/Account/CheckStatus';
import { AccountRequestStatusActions } from '../../Reducers/AccountRequestStatusReducer';
import { Toast } from '../../Services/Toast';
import './CheckStatusScreen.scss';

class CheckStatusScreen extends Component {
  render() {
    const { t, history } = this.props;
    const { accountName } = this.props;
    const { changeAccountName, checkByAccountName } = this.props;
    return (
      <CheckStatus nextAction={() => checkByAccountName({ accountName, history })}
                   isNextValid={() => !!accountName}
                   renderforgotLink={() => (<Link styleName="link" to="/account/status-by-key">
                     {t('forgotAccountName')}
                   </Link>)}>
        <div styleName="input-container">
          <h4>{t('enterYourAccountName')}</h4>
          <input type="text" className="general-input" onChange={changeAccountName} maxLength={12} />
          <div styleName="hint">
            <span>{t('12CharactersHint')}</span>
            <span>{accountName.length}/12</span>
          </div>
        </div>
      </CheckStatus>
    );
  }
}


const mapStateToProps = state => ({
  accountName: state.accountRequestStatus.accountName,
  accountRequestId: state.accountRequestStatus.accountRequestId
});
const mapDispatchToProps = (dispatch) => ({
  changeAccountName: ({ target: { value } }) => dispatch(AccountRequestStatusActions.changeAccountName(value)),
  changePublicKey: ({ target: { value } }) => dispatch(AccountRequestStatusActions.changePublicKey(value)),
  checkByAccountName: async ({ accountName, history }) => {
    const { accountRequestId } = await AccountRequestStatusActions.checkByAccountName({ accountName });
    if (accountRequestId) {
      history.push(`/account/payment/${accountRequestId}`);
    } else {
      Toast.failed(`${accountName} not found`);
    }
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(CheckStatusScreen));
