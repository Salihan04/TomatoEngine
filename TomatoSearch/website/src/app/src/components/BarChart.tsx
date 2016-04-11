import * as React from 'react';
import * as _ from 'lodash';
import {Chart} from './Chart';

import highchartsTheme from './highchartsTheme';

export class BarChart extends React.Component<any, any> {
  chart: any;
  refs: any;
  static propTypes = {
    data: React.PropTypes.array.isRequired,
    className: React.PropTypes.string,
    style: React.PropTypes.object,
    container: React.PropTypes.string.isRequired
  }

  state = {
    config: this.getConfig([])
  }

  getSeries(data, index) {
    return {
      type: 'column',
      data: data,
      // lineColor: highchartsTheme.colors[(index % 20|| 0)],
    }
  }

  getConfig(data) {
		const instance = this;
    return {
      chart: {
        animation: true,
      },
      title: {
        text: 'Classification scores'
      },
			xAxis: {
        categories: ['F1', 'Recall', 'Precision']
			},
      yAxis: {
        title: {
          text: 'Score'
        }
      },
      legend: {
        enabled: false
      },
      series: _.map(data, (it, idx) => this.getSeries(it, idx)),
      tooltip: {
        shared: true,
        headerFormat: '<span style="color:{point.color}">\u25CF</span> {point.key}: <b>{point.y}</b><br/>',
        pointFormat: ''
      },
      plotOptions: {
        column: {
          fillColor: 'rgba(118, 152, 218, 0.25)',
          lineWidth: 2,
          states: {
            hover: {
              halo: false
            }
          },
					colorByPoint: true
        },
				series: {
					allowPointSelect: true,
				}
      }
    };
  }

  render() {
    return (
      <Chart
        className={this.props.className}
        style={this.props.style}
        container={this.props.container}
        options={this.getConfig(this.props.data)}
        ref={'chart'}/>
    );
  }
}
