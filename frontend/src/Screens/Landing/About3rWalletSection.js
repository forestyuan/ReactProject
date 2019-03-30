import React, {Component} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import {Assets} from "../../UIKit";
import './About3rWalletSection.scss';

class About3rWalletSection extends Component {
  render() {
    const {t} = this.props;
    return (<section styleName="about-3rwallet-section-container">
      <section styleName="about-wallet">
        <div styleName="left-container">
          <h2 styleName="about">{t('About the Wallet')}</h2>
          <h3 styleName="title">{t('Versatile Universal Crypto Currency Wallet')}</h3>
          <p styleName="description">{t('Manage all your crypto accounts in one single wallet platform 3rWallet. Within a universal and easy-to-use interface, user can inquiry token balances, transfer, accept payments, trade in exchanges or create/call smart contracts, regardless of account types.')}</p>
        </div>
        <div styleName="right-container">
          <img src={Assets.landing.illus_1} alt={t('About the Wallet')} />
        </div>
      </section>
    </section>);
  }
}


const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(translate('landing')(About3rWalletSection));
