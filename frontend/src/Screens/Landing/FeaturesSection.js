import React, {Component} from 'react';
import {translate} from 'react-i18next';
import {Assets} from '../../UIKit/Assets';
import './FeaturesSection.scss';

const Features = [
  {icon: Assets.landing.icon_1, content: 'All-in-one gateway to blockchain world with 3rWallet'},
  {icon: Assets.landing.icon_2, content: 'Open and transparent, assets owned by owner'},
  {icon: Assets.landing.icon_3, content: 'Blazing fast trading speed, shorter confirmation time'},
  {icon: Assets.landing.icon_4, content: 'Asset listing, delisting by community consensus'},
  {icon: Assets.landing.icon_5, content: 'Less scalpers, less scam, by security deposit mechanism'},
  {icon: Assets.landing.icon_6, content: 'High performance API'},
  {icon: Assets.landing.icon_7, content: 'Low transaction fee'},
  {icon: Assets.landing.icon_8, content: 'Virtual-Trading Mining'},
];

class FeaturesSection extends Component {
  render() {
    const {t} = this.props;
    return (<section styleName="features-section-container">
      <section styleName="about-3rdex">
        <h2 styleName="title">{t('What’s 3rdex')}</h2>
        <div styleName="intro">
          <h3>{t('3rdex is the new gateway to blockchain world for the massive. ')}</h3>
          <p>{t('With our versatile universal crypto currency wallet and high-performance decentralized digital asset exchange based on EOS, 3rdex lowers the barriers for massive users to utilize blockchain applications, and boost the user adoption of DApps and the whole blockchain industry.')}</p>
        </div>
        <div styleName="features">
          {Features.map((f, i) => <div key={i} styleName="feature">
            <img src={f.icon} alt={t(f.content)} />
            <p>{t(f.content)}</p>
          </div>)}
        </div>
      </section>
      <section styleName="wallet-and-3rdex">
        <div styleName="wallet">
          <div styleName="background-rect">
            <div styleName="background-gradient"/>
          </div>
          <div styleName="content">
            <h3>{t('3rwallet')}</h3>
            <p styleName="description">{t('Versatile Universal Crypto Currency Wallet')}</p>
          </div>
        </div>
        <div styleName="dex">
          <div styleName="background-rect">
            <div styleName="background-gradient"/>
          </div>
          <div styleName="content">
            <h3>{t('3rdex')}</h3>
            <p styleName="description">{t('High-performance Decentralized Digital Asset Exchange')}</p>
            <p styleName="base-on-eos">{t('Based on EOS')}</p>
          </div>
        </div>
      </section>
    </section>);
  }
}

export default translate('landing')(FeaturesSection);
