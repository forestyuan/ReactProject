import React, {Component} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import {Element as ScrollElement} from 'react-scroll';
import FeaturesSection from './Landing/FeaturesSection';
import About3rWalletSection from './Landing/About3rWalletSection';
import About3rdexSection from './Landing/About3rdexSection';
import TimelineSection from './Landing/TimelineSection';
import ContactUsSection from './Landing/ContactUsSection';
import TopNavBar from '../Components/Landing/TopNavBar';
import {SectionName} from '../Reducers/LandingReducer';
import './LandingScreen.scss';
import TopNavResponsive from '../Components/Landing/TopNavResponsive';
import PosterSection from './Landing/PosterSection';

class LandingScreen extends Component {

  render() {
    const {currentSection} = this.props;
    const {showNavResponsive} = this.props;
    console.log('show nav responsive', showNavResponsive);
    return (<div id='scroll-container' styleName="container">
        <section styleName="content">
          <ScrollElement name={SectionName.POSTER}><PosterSection /></ScrollElement>
          <ScrollElement name={SectionName.FEATURES}><FeaturesSection /></ScrollElement>
          <ScrollElement name={SectionName.ABOUT_3R_WALLET}><About3rWalletSection /></ScrollElement>
          <ScrollElement name={SectionName.ABOUT_3RDEX}><About3rdexSection /></ScrollElement>
          <ScrollElement name={SectionName.TIMELINE}><TimelineSection /></ScrollElement>
          <ScrollElement name={SectionName.CONTACT_US}><ContactUsSection /></ScrollElement>
        </section>
        {SectionName.POSTER !== currentSection && <TopNavBar />}
        {showNavResponsive && <TopNavResponsive />}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentSection: state.landing.currentSection,
  showNavResponsive: state.landing.showNavResponsive,
});

const mapActionsToProps = () => ({});

export default connect(mapStateToProps, mapActionsToProps)(translate('landing')(LandingScreen));
