import React, {Component} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import {Assets} from "../../UIKit/Assets";
import './About3rdexSection.scss';


class About3rdexSection extends Component {
  render() {
    const {t} = this.props;
    return (<section styleName="about-3rdex-section-container">
      <section styleName="feature-community-controlled">
        <div styleName="image-container">
          <img src={Assets.landing.illus_2} alt={t('About the Wallet')}/>
        </div>
        <div styleName="content-container">
          <h2 styleName="about">{t('About the D-ex')}</h2>
          <h3 styleName="title">{t('Community Controlled Listing / Delisting')}</h3>
          <p styleName="description">{t('Traders vote through smart contracts. More trading, more voting power. Automatic token listing when requirements fulfilled.')}</p>
        </div>
      </section>
      <section styleName="feature-security-deposit">
        <div styleName="content-container">
          <h2 styleName="about">{t('About the D-ex')}</h2>
          <h3 styleName="title">{t('Security Deposit Mechanism')}</h3>
          <p styleName="description">{t('Token issuers who have insufficient credit must deposit circulating tokens in order to get listed and traded within allowed trading volume.')}</p>
        </div>
        <div styleName="image-container">
          <img src={Assets.landing.illus_3} alt={t('Security Deposit Mechanism')}/>
        </div>
      </section>
      <section styleName="feature-virtual-trading-mining">
        <div styleName="image-container">
          <img src={Assets.landing.illus_4} alt={t('Virtual-Trading Mining')}/>
        </div>
        <div styleName="content-container">
          <h2 styleName="about">{t('About the D-ex')}</h2>
          <h3 styleName="title">{t('Virtual-Trading Mining')}</h3>
          <p styleName="description">{t('Users new to crypto investment may utilize our virtual-trading platform to learn and train the sense of crypto trading while being rewarded.')}</p>
        </div>
      </section>
    </section>);
  }
}


const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(translate('landing')(About3rdexSection));
