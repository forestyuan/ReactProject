import Highcharts from 'highcharts/highstock';

export const drawCandleData = ({ rawData, range: chartTimeRange }) => {
  const candleData = rawData.map((price) => {
    const { from, open, high, low, close } = price;
    return { x: from, open, high, low, close };
  });
  Highcharts.stockChart('ram-price-stock-chart', {
    chart: {
      backgroundColor: 'transparent',
    },
    credits: {
      enabled: false
    },
    time: {
      useUTC: false,
    },
    rangeSelector: {
      enabled: false,
    },
    plotOptions: {
      candlestick: {
        color: '#ef6d65',
        upColor: '#4e7df5',
        lineColor: '#ef6d65',
        upLineColor: '#4d7ef5',
      }
    },
    series: [{
      type: 'candlestick',
      name: 'RAM Price',
      data: candleData,
      color: '#ef6d65',
      turboThreshold: 0,
      tooltip: {
        pointFormat: 'Open: {point.open}<br />' +
          'High: {point.high}<br />' +
          'Low: {point.low}<br />' +
          'Close: {point.close}<br />' +
          '{point.key}<br />',
        valueDecimals: 4,
        valueSuffix: ' EOS',
      },
    }],
    yAxis: {
      gridLineColor: '#e6e6e6',
      gridLineWidth: 1,
      tickPosition: 'outside',
    },
    xAxis: {
      gridLineColor: '#e6e6e6',
      gridLineWidth: 1,
      tickPosition: 'outside',
    },
  });
};

export const drawLineData = ({ rawData, range: chartTimeRange }) => {
  const ramPriceLinData = rawData.map((price) => [price.from, price.open]);
  console.log('ramPriceLineData', JSON.stringify(ramPriceLinData));
  Highcharts.stockChart('ram-price-stock-chart', {
    chart: {
      backgroundColor: 'transparent',
    },
    credits: {
      enabled: false
    },
    time: {
      useUTC: false,
    },
    rangeSelector: {
      enabled: false,
    },
    plotOptions: {
      series: {
        fillOpacity: 0.1
      }
    },
    series: [{
      type: 'area',
      name: 'RAM Price Line',
      data: ramPriceLinData,
      color: '#629aff',
      softThreshold: false,
      threshold: null,
    }],
    yAxis: {
      gridLineColor: '#e6e6e6',
      gridLineWidth: 1,
      tickPosition: 'outside',
    },
    xAxis: {
      gridLineColor: '#e6e6e6',
      gridLineWidth: 1,
      tickPosition: 'outside',
    },
  });
};
