import React, {Component} from 'react';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';
import CheckStatus from '../../Components/Account/CheckStatus';
import {AccountRequestStatusActions, isAccountRequestValid} from '../../Reducers/AccountRequestStatusReducer';
import {Toast} from '../../Services/Toast';
import './CheckStatusScreen.scss';

class CheckStatusScreen extends Component {
  render() {
    const {t, history} = this.props;
    const {publicKey} = this.props;
    const {changePublicKey, checkByPublicKey} = this.props;
    return (
      <CheckStatus nextAction={() => checkByPublicKey({publicKey, history})}
                   isNextValid={() => !!publicKey}
                   renderforgotLink={() => (<a styleName="link" target="_blank" href={t('contactUsHref')}>
                     {t('forgotEverything')}
                   </a>)}>
        <div styleName="input-container">
          <h4>{t('enterActivePublicKey')}</h4>
          <input type="text" className="general-input" placeholder='Active Public Key' onChange={changePublicKey}/>
        </div>
      </CheckStatus>
    );
  }
}

const mapStateToProps = state => ({
  isNextValid: isAccountRequestValid(state.accountRequestStatus),
  publicKey: state.accountRequestStatus.publicKey,
  accountRequestId: state.accountRequestStatus.accountRequestId
});

const mapDispatchToProps = (dispatch) => ({
  changeAccountName: ({target: {value}}) => dispatch(AccountRequestStatusActions.changeAccountName(value)),
  changePublicKey: ({target: {value}}) => dispatch(AccountRequestStatusActions.changePublicKey(value)),
  checkByPublicKey: async ({publicKey, history}) => {
    const {accountRequestId} = await AccountRequestStatusActions.checkByPublicKey({publicKey});
    if (accountRequestId) {
      history.push(`/account/payment/${accountRequestId}`);
    } else {
      Toast.failed('Account not found');
    }
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(CheckStatusScreen));
