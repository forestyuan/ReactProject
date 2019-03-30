import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import logo from '../Images/logo-text.png';
import './SideNav.scss';

export const isAccount = (match, location) => {
  if (match) return true;
  return location && location.pathname.startsWith('/account');
};


class SideNav extends Component {
  render() {
    const {t} = this.props;
    return (
      <section className="hide-lt-md sidebar-navigation" styleName="app-side-nav">
        <Link to="/" className="logo-3rdex" styleName="app-logo-container">
          <img src={logo} styleName='app-logo' alt='logo'/>
        </Link>
        <NavLink to="/ram-eos" activeClassName='semi-bold color-text-primary'>
          {t('RAMExchange')}
        </NavLink>
        <NavLink to="/account/create" activeClassName='semi-bold color-text-primary'
                 isActive={isAccount}>
          {t('createAccount')}</NavLink>
        <a className='font-14 color-text-secondary cursor-pointer'
           target='_blank'
           href={t('precautionsLink')}
           styleName="precautions">
          {t('precautions')}
        </a>
        <a className='font-12 color-text-primary' styleName="copy-right">
          {t('copyright')} <span styleName="copy-right-char">&copy;</span> 2018 3rdex</a>
      </section>
    );
  }
}

export default translate('translations')(SideNav);
