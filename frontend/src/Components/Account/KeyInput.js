import React, { Component } from 'react';
import { translate } from 'react-i18next';
import './KeyInput.scss';

class KeyInput extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '', invalidKey: false };
  }

  handleChange(event) {
    const { onChange } = this.props;
    const val = event.target.value;
    this.setState({
      value: val,
      invalidKey: false,
    });
    return onChange(val);
  }

  validateInput() {
    const { isValid } = this.props;
    this.setState({
      invalidKey: !isValid
    });
  }

  render() {
    const { placeholder, t } = this.props;
    return (
      <div styleName="key-input-container">
        <input type="text" className="enter-public-key"
               value={this.state.value} onChange={this.handleChange.bind(this)}
               onBlur={this.validateInput.bind(this)} placeholder={placeholder}/>
        {this.state.invalidKey && <div styleName="error">{t('invalidKeyValue')}</div>}
      </div>

    );
  }
}

export default translate('translations')(KeyInput);
