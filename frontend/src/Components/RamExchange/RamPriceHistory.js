import React, {Component} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import classNames from 'classnames';
import {CHART_TYPE, RamChartActions} from '../../Reducers/RamChartReducer';
import {chartTimeRangeOptions, ramPriceOptions} from '../../Services/Chart';
import {Assets} from '../../UIKit/Assets';
import './RamPriceHistory.scss';

class RamPriceHistory extends Component {
  componentDidMount() {
    this.props.init();
  }

  renderTimeRange() {
    const { t } = this.props;
    const { chartTimeRange, chartSpanOptions, chartType } = this.props;
    const { changeChartTimeRange } = this.props;
    return Object.keys(chartSpanOptions).map(key =>
      <div styleName="time-range-container" key={key}>
        <div styleName={`time-range ${chartTimeRange === chartSpanOptions[key] ? 'selected' : ''}`}
             onClick={() => changeChartTimeRange({ chartTimeRange: chartSpanOptions[key], chartType })}
             key={key}>{t(key)}</div>
      </div>
    );
  }

  render() {
    const { t } = this.props;
    const { rawPriceData, chartType, currentPrice, priceDifference, differencePercentage, chartTimeRange } = this.props;
    const { toggleChartType } = this.props;
    const priceDiffClassName = priceDifference > 0 ? 'font-18 color-text-green' : 'font-18 color-text-orange';
    const isCandle = chartType === CHART_TYPE.candle;
    return (<div styleName="ram-price-history-container" className="market-price-chart">
      <div styleName="top-bar">
        <div>
          <div styleName="chart-title-container">
            <h4 styleName="chart-title" className="font-16 color-text-shallow no-margin">{t('chartTitle')}</h4>
          </div>
          <div>
            <p styleName="price">{currentPrice}</p>
            <div styleName="other">
              <p className={priceDiffClassName}>{`${priceDifference}(${differencePercentage})`}</p>
              <p className="font-18 color-text-shallow">EOS/KB</p>
            </div>
          </div>
        </div>
        <div styleName="right">
          <div styleName="chart-type-selector-container">
            <a styleName={classNames('chart-type-selector', 'line', { 'active': !isCandle })}
               onClick={() => toggleChartType({ chartType: CHART_TYPE.line, chartTimeRange, rawPriceData })}>
              <img alt='line' src={isCandle ? Assets.lineIconInactive : Assets.lineIcon} />{t('Line')}
            </a>
            <a styleName={classNames('chart-type-selector', 'candle', { 'active': isCandle })}
               onClick={() => toggleChartType({ chartType: CHART_TYPE.candle, chartTimeRange, rawPriceData })}>
              <img alt='candle' src={!isCandle ? Assets.stockIconInactive : Assets.stockIcon} />{t('Candle')}
            </a>
          </div>
        </div>
      </div>
      <div styleName="range-selector">
        <div styleName="selector">
          {this.renderTimeRange()}
        </div>
      </div>
      <div styleName="chart-container">
        <div id='ram-price-stock-chart'/>
      </div>
    </div>);
  }
}

const mapStateToProps = state => ({
  rawPriceData: state.chartData.rawPriceData,
  chartTimeRange: state.chartData.chartTimeRange,
  chartType: state.chartData.chartType,
  currentPrice: state.chartData.currentPrice,
  priceDifference: state.chartData.priceDifference,
  differencePercentage: state.chartData.differencePercentage,
  chartSpanOptions: chartTimeRangeOptions,
  ramPriceOptions: ramPriceOptions
});

const mapDispatchToProps = (dispatch) => ({
  init: async () => {
    dispatch(await RamChartActions.listRamPriceData({}));
  },
  changeChartTimeRange: async ({ chartTimeRange, chartType }) => {
    dispatch(RamChartActions.changeChartTimeRange(chartTimeRange));
    dispatch(await RamChartActions.listRamPriceData({ range:chartTimeRange, chartType }));
  },
  toggleChartType: async ({ chartType, rawPriceData, chartTimeRange }) => {
    dispatch(RamChartActions.toggleChartType({ range: chartTimeRange, chartType, rawPriceData }));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('translations')(RamPriceHistory));
