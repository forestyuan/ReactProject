import classNames from 'classnames';
import React, {Component} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';
import {AccountCreateActions} from '../../Reducers/AccountCreateReducer';
import {Toast} from '../../Services/Toast';
import {Assets} from '../../UIKit';
import './AccountNameInput.scss';

class AccountNameInput extends Component {
  async onNameChange({target: {value}}) {
    const {changeAccountName, checkAccountName} = this.props;
    if (value.length <= 12) changeAccountName(value);
    if (value.length === 12) await checkAccountName(value);
  }

  render() {
    const {
      accountName,
      accountNameValidation,
      changeAccountName,
      generatingName,
      checkingName,
      checkAccountName
    } = this.props;
    const {valid} = accountNameValidation;
    return (
      <div>
        <div styleName={classNames('input-container', {'invalid': !valid})}>
          <div styleName="input display">
            {accountName && accountName.split('').map((char, i) => {
              const valid = /[a-z12345]/g.test(char);
              if (valid) return <span key={i}>{char}</span>;
              return <span key={i} styleName={classNames({'invalid-char': !valid})}>{char}</span>;
            })}
          </div>
          <input type="text" styleName="input" className="new-account-name-input" maxLength={12}
                 disabled={generatingName || checkingName}
                 value={accountName}
                 onFocus={() => changeAccountName(accountName)}
                 onBlur={() => accountName.length === 12 && checkAccountName(accountName)}
                 onChange={this.onNameChange.bind(this)} />
          <div styleName="copy-to-clipboard">
            <CopyToClipboard text={`Account Name: ${accountName}`} onCopy={() => Toast.success('accountNameCopied')}>
              <img src={Assets.copyPasteIcon} alt="copy" />
            </CopyToClipboard>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  accountName: state.accountCreate.accountName,
  accountNameValidation: state.accountCreate.accountNameValidation,
  generatingName: state.accountCreate.generatingName,
  checkingName: state.accountCreate.checkingName,
});
const mapDispatchToProps = (dispatch) => ({
  changeAccountName: (value) => dispatch(AccountCreateActions.changeAccountName(value)),
  checkAccountName: async (accountName) => dispatch(await AccountCreateActions.checkAccountName(accountName)),
});
export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(AccountNameInput));
