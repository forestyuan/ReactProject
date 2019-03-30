import React, {Component} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import classNames from 'classnames';
import hexagon from '../../Images/hexagon.svg';
import './TimelineSection.scss';

const Quarters = [
  {quarter: '2018 Q3', content: 'Conceptual Working Demo', current: true},
  {quarter: '2018 Q4', content: 'Trading Platform Closed Beta', extra: '3rWallet Closed Beta'},
  {quarter: '2019 Q1', content: 'Trading Platform General Available', extra: '3rWallet General Available'},
  {quarter: '2019 Q2', content: 'Cross Chain Support (ETH, BTC..)'},
  {quarter: '2019 Q3-Q4', content: 'Fiat Trading Support'},
];

class TimelineSection extends Component {
  render() {
    const {t} = this.props;
    return (<section styleName="timeline-section-container">
        <h2>{t('Time Line')}</h2>
        <section styleName="timeline-container">
          <div styleName="line" />
          <div styleName="line-bottom__sm">
            <div />
          </div>
          {Quarters.map((q, i) => <div key={i} styleName={classNames('quarter', {current: q.current})}>
            <h3 styleName="title">{t(q.quarter)}</h3>
            <img alt="" src={hexagon} styleName="hexagon" />
            <img alt="" src={hexagon} styleName="hexagon__xxs" />
            <p styleName="content">{t(q.content)}</p>
            {q.extra && <p styleName="extra">{t(q.extra)}</p>}
          </div>)}
        </section>
      </section>
    );
  }
}


const mapStateToProps = () => ({});
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(translate('landing')(TimelineSection));
