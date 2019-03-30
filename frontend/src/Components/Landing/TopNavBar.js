import React, {Component} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import {Link} from 'react-router-dom';
import classNames from 'classnames';
import LanguageSwitcher from '../LanguageSwitcher';
import NavItem from './NavItem';
import {LandingActions, SectionName, TopNavItems} from '../../Reducers/LandingReducer';
import {Assets} from '../../UIKit/Assets';
import './TopNavBar.scss';

class TopNavBar extends Component {
  render() {
    const {t, currentSection} = this.props;
    const {toggleNavResponsive} = this.props;
    const isPoster = currentSection === SectionName.POSTER;
    const languageTextStyle = {
      fontSize: '18px',
      color: isPoster ? '#f0f3f5' : '#629aff',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
    };
    const menuIconStyle = {color: isPoster ? '#fdfdfd' : '#629aff'};
    return (<div styleName={classNames('top-nav-bar', {top: isPoster, top__fixed: !isPoster})}
                 className="hide-xs">
      <div styleName="left">
        <Link to="/" styleName="logo">
          {isPoster && <img src={Assets.logoWhite} alt="3rdex" />}
          {!isPoster && <img src={Assets.logoBlue} alt="3rdex" />}
        </Link>
        <div styleName="nav-items">
          {TopNavItems.map(nav => <NavItem isFixed={!isPoster}
                                           key={nav.to} to={nav.to} label={t(nav.label)} />)}
        </div>
      </div>
      <div styleName="language-switcher">
        <LanguageSwitcher textStyle={languageTextStyle} />
      </div>
      <div styleName="menu-small">
        <i className="icon-eq-outline" style={menuIconStyle} onClick={toggleNavResponsive} />
      </div>
    </div>);
  }
}


const mapStateToProps = (state) => ({
  currentSection: state.landing.currentSection
});

const mapDispatchToProps = (dispatch) => ({
  toggleNavResponsive: () => dispatch(LandingActions.changeShowNavResponsive(true)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('landing')(TopNavBar));
