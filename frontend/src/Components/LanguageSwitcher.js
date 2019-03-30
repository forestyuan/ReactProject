import React, {Component} from 'react';
import {translate} from 'react-i18next';
import './LanguageSwitcher.scss';

class LanguageSwitcher extends Component {
  render() {
    const {i18n, textStyle, style, showExtra} = this.props;
    const changeLanguage = () => {
      const target = i18n.language.startsWith('zh') ? 'en' : 'zh';
      i18n.changeLanguage(target);
    };
    const displayLang = i18n.language.startsWith('zh') ? 'EN' : '中文';
    return (
      <div className="general-button-container" styleName="button" style={style} onClick={changeLanguage}>
        <span style={textStyle}>
          {!showExtra && <span className="hide-xs hide-sm" style={textStyle}>Language: </span>}
          {showExtra && <span  style={textStyle}>Language: </span>}
          {displayLang}
          </span>
      </div>
    );
  }
}

export default translate('translations')(LanguageSwitcher);

