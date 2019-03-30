import React, {Component} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';
import NavItem from './NavItem';
import {LandingActions, TopNavItems} from '../../Reducers/LandingReducer';
import './TopNavResponsive.scss';

class TopNavResponsive extends Component {
  render() {
    const {t} = this.props;
    const {hideNavResponsive} = this.props;
    return (<div styleName="top-nav-responsive"
                 className="hide-xs">
      <div styleName="nav-items">
        {TopNavItems.map(nav => <NavItem key={nav.to} to={nav.to} label={t(nav.label)} />)}
      </div>
      <div>
        <LanguageSwitcher showExtra={true} textStyle={{
          fontSize: '18px',
          color: '#629aff',
          fontWeight: '500'
        }} />
      </div>
      <i className="icon-cancel" styleName="close" onClick={hideNavResponsive} />
    </div>);
  }
}


const mapStateToProps = (state) => ({
  currentSection: state.landing.currentSection,
});

const mapDispatchToProps = (dispatch) => ({
  hideNavResponsive: () => dispatch(LandingActions.changeShowNavResponsive(false)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('landing')(TopNavResponsive));
