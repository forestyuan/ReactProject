import React, {Component} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import './ProcessStage.scss';
import {AccountCreateActions} from '../../Reducers/AccountCreateReducer';

class ProcessStage extends Component {
  render() {
    const {t, requestId, checkAgain} = this.props;
    return (
      <div styleName="process-container">
        <div styleName="content-wrapper">
          <h4>{t('paymentProcessing')}</h4>
          <p>
            {t('goBackToPaymentStatus')}
            <br />
            <br />
            {t('ifHaveAnyProblems')} <span styleName="contact-us">{t('contactUs')}</span>
          </p>
          <div onClick={() => checkAgain(requestId)}
               className="general-button-container"
               styleName="check-again">{t('checkAgain')}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => ({});
const mapActionsToProps = (dispatch) => ({
  checkAgain: async (requestId) => {
    try {
      const result = await AccountCreateActions.fetchAccountRequest({requestId});
      dispatch(result);
      return result;
    } catch (err) {
      return {stage: null};
    }
  },
});

export default connect(mapStateToProps, mapActionsToProps)(translate('translations')(ProcessStage));
