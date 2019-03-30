import React, {Component} from 'react';
import {translate} from 'react-i18next';
import './AccountPanel.scss';
import AccountCreationNav from './AccountTopTab';
import SideNav from '../SideNav';

class AccountPanel extends Component {
  render() {
    const { t } = this.props;
    const { children, info } = this.props;

    return (
      <div className="app">
        <SideNav/>
        <div styleName="account-container" className="background-style">
          <section styleName="account-form">
            <div>
              <header>
                <AccountCreationNav/>
              </header>
              <section styleName="account-creation-panel">
                {children}
              </section>
              <section styleName="contact-us">
                <a target="_blank" href={t('contactUsHref')}>{t('contactUs')}</a>&nbsp;{t('ifYouHaveAnyProblem')}
              </section>
            </div>
          </section>
          <section className='info' styleName="account-info">
            {info}
          </section>
        </div>
      </div>
    );
  }
}

export default translate('translations')(AccountPanel);
