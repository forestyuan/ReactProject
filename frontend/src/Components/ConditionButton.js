import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Toast} from "../Services/Toast";

class ConditionButton extends Component {
  static propTypes = {
    isValid: PropTypes.bool,
    action: PropTypes.func,
    invalidHint: PropTypes.string,
  };

  onClick() {
    const {isValid, action, invalidHint} = this.props;
    if (!isValid) {
      Toast.failed(invalidHint);
      return null;
    }
    return action();
  }

  render() {
    const {isValid, children} = this.props;
    return (
      <div className={`flexible-button primary-button-container ${isValid ? 'active' : ''}`}
           onClick={this.onClick.bind(this)}>
        {children}
      </div>
    );
  }
}

export default ConditionButton;
