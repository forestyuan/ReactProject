import React, { Component } from 'react';
import './CheckBox.scss';

class CheckBox extends Component {
  render() {
    const { checked, onChange } = this.props;
    const wrapperStyle = checked ? 'container checked' : 'container';
    return (
      <div styleName={wrapperStyle}>
        <input type="checkbox" checked={checked} onChange={onChange} />
        {checked && <i className="icon-ok" styleName="" /> }
      </div>
    );
  }
}

export default CheckBox;
