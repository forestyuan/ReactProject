import React, {Component} from 'react';
import {translate} from 'react-i18next';

class ToastContent extends Component {
  render() {
    const {t, content} = this.props;
    return (<p style={{
      margin: 0,
      color: '#FAFAFA'
    }}>
      {t(content)}
    </p>);
  }
}

export default translate('translations')(ToastContent);
