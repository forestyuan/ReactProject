import React, { Component } from 'react';
import { translate } from 'react-i18next';
import AccountPanel from '../../Components/Account/AccountPanel';
import ConditionButton from '../ConditionButton';
import AccountStatusInfo from './AccountStatusInfo';
import './CheckStatus.scss';

class CheckStatus extends Component {

  render() {
    const {t} = this.props;
    const { children, nextAction, isNextValid, renderforgotLink } = this.props;
    return (
      <AccountPanel info={<AccountStatusInfo/>}>
        <div styleName="check-status-container">
          <section styleName="content-wrapper">
            {children}
            <div styleName="action-container">
              {renderforgotLink()}
              <ConditionButton isValid={isNextValid} action={nextAction}>
                <div>{t('Next')} &nbsp;<i className="icon-right"/></div>
              </ConditionButton>
            </div>
          </section>
        </div>
      </AccountPanel>
    );
  }
}

export default translate('translations')(CheckStatus);
