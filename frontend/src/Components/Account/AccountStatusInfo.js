import React, { Component } from 'react';
import { translate } from 'react-i18next';
import './AccountStageInfo.scss';

class AccountStatsInfo extends Component {
  render() {
    const { t } = this.props;

    return (<section styleName="account-info-stage-container">
      <div styleName="page-summary">
        <h2>{t('about3rdex')}</h2>
        <p className="color-text-primary">{t('about3rdexContent1')}</p>
        <p>{t('about3rdexContent2')}</p>
      </div>
    </section>);
  }
}

export default translate('translations')(AccountStatsInfo);
