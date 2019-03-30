export const chartTimeRangeOptions = {
  '1D': 100,
  '1W': 200,
  '1M': 300,
  '3M': 400,
  'All': 666,
};

export const ramPriceDatasets = {
  fill: false,
  label: "ram price",
  lineColor: '#629AFF',
  lineTension: 0.1,
  borderColor: '#629AFF',
  borderWidth: 4,
  borderCapStyle: 'butt',
  borderDashOffset: 0.0,
  borderJoinStyle: 'miter',
  pointBorderColor: '#629AFF',
  pointBackgroundColor: '#FFFFFF',
  pointBorderWidth: 1,
  pointHoverRadius: 4,
  pointHoverBackgroundColor: '#FFFFFF',
  pointHoverBorderColor: '#629AFF',
  pointHoverBorderWidth: 4,
  pointRadius: 1,
  pointHitRadius: 4,
  data: []
};

export const ramPriceOptions = {
  title: {display: false},
  legend: {display: false},
  tooltips: {
    intersect: false,
    callbacks: {
      label: function (tooltipItems, _data) {
        return tooltipItems.yLabel + ' eos';
      }
    }
  },
  scales: {
    xAxes: [{
      ticks: {
        maxRotation: 0,
        callback(value, index) {
          return index % 4 === 0 ? value : '';
        },
      }
    }],
  },
  responsive: true,
  maintainAspectRatio: false,
};
