import React, {Component} from 'react';
import {Link} from 'react-scroll';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {LandingActions, SectionName} from '../../Reducers/LandingReducer';
import './NavItem.scss';

class NavItem extends Component {
  render() {
    const {showNavResponsive} = this.props;
    const {hideNavResponsive, changeCurrentSection} = this.props;
    const {to, label, smooth = true, offset = 0, duration = 300, isFixed = false} = this.props;
    const isPoster = to === SectionName.POSTER;
    const displayLabel = isPoster ? '' : label;
    return (<Link
      onClick={() => hideNavResponsive()}
      containerId='scroll-container'
      to={to}
      className="landing-nav-item"
      activeClass="active"
      spy={true}
      hashSpy={true}
      smooth={smooth}
      offset={offset}
      duration={duration}
      isDynamic={true}
      onSetActive={() => {
        changeCurrentSection(to);
      }}
      styleName={classNames({
        'nav-item-fixed': showNavResponsive || isFixed,
        'nav-item': !isFixed,
        'hidden-item': isPoster
      })}>
      <span>{displayLabel}</span>
    </Link>);
  }
}


const mapStateToProps = (state) => ({
  showNavResponsive: state.landing.showNavResponsive
});
const mapDispatchToProps = (dispatch) => ({
  hideNavResponsive: () => dispatch(LandingActions.changeShowNavResponsive(false)),
  changeCurrentSection: (sectionName) => dispatch(LandingActions.changeCurrentSection(sectionName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavItem);
