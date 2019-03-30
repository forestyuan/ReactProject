import React, {Component} from 'react';
import {translate} from 'react-i18next';
import {NavLink} from 'react-router-dom';
import './AccountTopTab.scss';

const isCheckStatus = (match, location) => {
  return !!(location && location.pathname.startsWith('/account/status'));
};

class AccountTopTab extends Component {
  render() {
    const { t } = this.props;
    return (
      <div styleName='account-tabs'>
        <div styleName="logo-container">
          <img src="https://3rdex.com/logo.png" alt="3rdex" height="36px" width="36px" />
        </div>
        <NavLink to="/account" styleName="tab" activeClassName={'semi-bold color-sky-blue'}
                 isActive={(match, location) => !isCheckStatus(match, location)}>
          <div styleName="new-account-tab">{t('newAccount')}</div>
        </NavLink>
        <NavLink to="/account/status" styleName="tab" activeClassName={'semi-bold color-sky-blue'}
                 isActive={isCheckStatus}>
          <div styleName="check-status-tab">{t('checkAccountStatus')}</div>
        </NavLink>
      </div>
    );
  }
}

export default translate('translations')(AccountTopTab);
