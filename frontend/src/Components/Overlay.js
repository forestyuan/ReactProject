import React, {Component} from 'react';
import './Overlay.scss';

export class Overlay extends Component {

  renderContent() {
    const {children, contentWidth, contentBorderColor} = this.props;
    if (!children) return null;
    const style = {
      width: contentWidth || '480px',
      border: contentBorderColor ? `1px solid ${contentBorderColor}` : 'none'
    };
    return (<div className="modal-content" style={style}>
      {children}
    </div>);
  }

  render() {
    const {show, close, overlayColor} = this.props;
    if (!show) return null;
    return (
      <div styleName="modal-container" onClick={close}
           style={{backgroundColor: overlayColor || 'rgba(2, 21, 40, 0.26)'}}>
        {this.renderContent()}
      </div>
    );
  }
}

