import React, { Component } from 'react';
import { translate } from 'react-i18next';
import TopNavBar from '../../Components/Landing/TopNavBar';
import { Assets } from '../../UIKit/Assets';
import './PosterSection.scss';


class PosterSection extends Component {
  render() {
    const { t } = this.props;
    return (<section styleName="features-section-container">
      <section styleName="poster">
        <div styleName="bg-container">
          <div styleName="top-left-bg">
            <div styleName="rect-1"/>
          </div>
          <div styleName="bottom-right-bg" style={{ backgroundImage: `url(${Assets.landing.hero})` }}/>
        </div>
        <TopNavBar/>
        <div styleName="content-container">
          <h2 styleName="title">{t('Your New Gateway to Blockchain World')}</h2>
          <p styleName="content">
            {t('High-performance Decentralized Digital Asset Exchange based on EOS')}
            <br/>
            {t('Versatile Universal Crypto Currency Wallet')}
          </p>
          <div styleName="button-row">
            <div styleName="download-beta-btn">
              <a href='https://github.com/3rdex/3rWallet-release/releases'
                 target="_blank" className="ram-exchange-beta">{t('Download 3rWallet Beta')}</a>
            </div>
            <div styleName="ram-exchange-beta-btn">
              <a href='/ram-eos' className="ram-exchange-beta">{t('Ram Exchange Beta')}</a>
            </div>
          </div>
        </div>
      </section>
    </section>);
  }
}


export default translate('landing')(PosterSection);
