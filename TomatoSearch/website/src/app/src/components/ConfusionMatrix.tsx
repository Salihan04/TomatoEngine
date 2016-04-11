import * as React from 'react';
import * as _ from 'lodash';
import {Chart} from './Chart';

import highchartsTheme from './highchartsTheme';
const HighchartsHeatmap = require('highcharts/modules/heatmap.src');

export class ConfusionMatrix extends React.Component<any, any> {
  chart: any;
  refs: any;
  static propTypes = {
    data: React.PropTypes.array.isRequired,
    className: React.PropTypes.string,
    style: React.PropTypes.object,
    container: React.PropTypes.string.isRequired,
    dimenX: React.PropTypes.number.isRequired,
    dimenY: React.PropTypes.number.isRequired
  }

  state = {
    config: this.getConfig([])
  }

  getItems(data) {
    const out = [];
    _.each(data, (x, xi:number) => {
      _.each(x, (y, yi:number) => {
        out.push([this.props.dimenX - 1 - xi, this.props.dimenY - 1 - yi, y]);
      });
    });
    return out;
  }

  getSeries(data) {
    return {
      animation: false,
      name: 'Confusion Matrix',
      data: this.getItems(data),
      dataLabels: {
        enabled: true,
        color: '#000000'
      },
      borderWidth: 1,
      // lineColor: highchartsTheme.colors[(index % 20|| 0)],
    }
  }

  getConfig(data) {
    return {
      chart: {
        type: 'heatmap',
        animation: false
      },
      xAxis: {
        categories: ['Negative', 'Neutral', 'Positive'],
        title: {
          text: 'Predicted class'
        }
      },
      yAxis: {
        categories: ['Negative', 'Neutral', 'Positive'],
        title: {
          text: 'Actual class'
        }
      },
      colorAxis: {
        min: 0,
        minColor: '#FFFFFF',
        maxColor: highchartsTheme.colors[0]
      },
      legend: {
        enabled: false
      },
      title: {
        text: 'Confusion Matrix',
        style: {
          paddingLeft: '10px'
        }
      },
      series: [this.getSeries(data)],
      tooltip: {
      }
    };
  }

  render() {
    return (
      <Chart
        className={this.props.className}
        style={this.props.style}
        modules={[HighchartsHeatmap]}
        container={this.props.container}
        options={this.getConfig(this.props.data)}
        ref={'chart'}/>
    );
  }
}
