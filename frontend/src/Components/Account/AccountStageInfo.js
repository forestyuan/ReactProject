import classNames from 'classnames';
import React, {Component} from 'react';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {STAGES, STAGES_SEQUENCE} from '../../Reducers/AccountCreateReducer';
import {Config} from '../../Config';
import './AccountStageInfo.scss';

const Icon = ({state}) => (<div styleName={state} className={classNames({
  'icon-ok': state === 'finished'
})} />);

const ProgressNode = translate('translations')(({t, name, state}) => {
  return <div styleName="stage">
    <Icon state={state} />
    <span styleName="stage-name">{name}</span>
  </div>;
});

const progressNodeState = (index, currentIndex) => {
  if (index < currentIndex) return 'finished';
  if (index > currentIndex) return 'inactive';
  return 'active';
};

const Progress = translate('translations')(({t, currentIndex}) => (<div styleName="stage-wrapper">
  <ProgressNode name={t('accountName')} state={progressNodeState(0, currentIndex)} />
  <div styleName="line" />
  <ProgressNode name={t('keyPairs')} state={progressNodeState(1, currentIndex)} />
  <div styleName="line" />
  <ProgressNode name={t('payment')} state={progressNodeState(2, currentIndex)} />
</div>));


class AccountStageInfo extends Component {
  render() {
    const {t} = this.props;
    const {stage} = this.props;
    const stageIndex = STAGES_SEQUENCE.indexOf(stage);
    const showTopButton = [STAGES.name, STAGES.payment].includes(stage);

    return (<section styleName="account-info-stage-container" className="information-container">
      <div styleName="already-request">
        {showTopButton && <p className="font-16 color-text-primary">{
          stage === STAGES.name ?
            t('nameCheckRequestTitle') :
            t('paymentCheckRequestTitle')
        }</p>}
        {showTopButton && <Link to="/account/status">
          <div className="general-button-container color-text-blue font-14" styleName="check-button">
            {t('checkRequestStatus')}
          </div>
        </Link>}
      </div>
      {stage === STAGES.name && <div styleName="page-summary" className="introduction-details">
        <h2>{t('nameStageInfoTitle')}</h2>
        <p className="color-text-primary">{t('nameStageInfoContent1')}</p>
        <p>
          <span>{t('nameStageInfoContent2_1')}</span>
          <b>{Config.accountResources.ramKB} KB</b>
          <span>{t('nameStageInfoContent2_2')}</span>
          <b>{Config.accountResources.cpu} {Config.coreSymbol}</b>
          <span>{t('nameStageInfoContent2_3')}</span>
          <b>{Config.accountResources.net} {Config.coreSymbol}</b>
          <span>{t('nameStageInfoContent2_3')}</span>
        </p>
      </div>}
      {stage === STAGES.keyGen && <div styleName="page-summary" className="introduction-details">
        <h2>{t('keyGenStageInfoTitle')}</h2>
        <p className="color-text-primary">{t('keyGenStageInfoContent1')}</p>
        <p>{t('keyGenStageInfoContent2')}</p>
      </div>}
      {stage === STAGES.payment && <div styleName="page-summary" className="introduction-details">
        <h2>{t('paymentStageInfoTitle')}</h2>
        <p className="color-text-primary">{t('paymentStageInfoContent1')}</p>
        <p>{t('paymentStageInfoContent2')}</p>
      </div>}
      {stage === STAGES.done && <div styleName="page-summary" className="introduction-details">
        <h2>{t('doneStageInfoTitle')}</h2>
        <p className="color-text-primary">{t('doneStageInfoContent1')}</p>
        <p>{t('doneStageInfoContent2_1')}<a target="_blank"
                                            href={`${Config.frontend}/ram-eos`}>
          {t('doneStageInfoContent2_2')}</a>{t('doneStageInfoContent2_3')}
        </p>
      </div>}
      {stage !== STAGES.process && <Progress currentIndex={stageIndex} />}
    </section>);
  }
}

const mapStateToProps = state => ({
  stage: state.accountCreate.stage
});
export default connect(mapStateToProps)(translate('translations')(AccountStageInfo));
