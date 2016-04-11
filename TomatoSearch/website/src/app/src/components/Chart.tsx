import * as React from 'react';
import * as _ from 'lodash';
import highchartsTheme from './highchartsTheme';

let Highcharts = require('highcharts');
let Highmaps = require('highcharts/highmaps.src');

export class Chart extends React.Component<any, any> {
  InternalHighcharts = Highcharts;
  chart: any = null;

  // When the DOM is ready, create the chart.
  componentDidMount() {
    if (this.props.type === 'Map') {
      this.InternalHighcharts = Highmaps;
      // Allow multi select without combination modifier
      (function(H) {
        H.wrap(H.Point.prototype, 'firePointEvent', function(proceed, eventType, eventArgs, defaultFunction) {
          var point = this,
            series = this.series,
            seriesOptions = series.options;
          if (seriesOptions.point.events[eventType] || (point.options && point.options.events && point.options.events[eventType])) {
            this.importEvents();
          }
          if (eventType === 'click' && seriesOptions.allowPointSelect) {
            defaultFunction = function(event) {
              if (point.select) {
                // Original code:
                // point.select(null, event.ctrlKey || event.metaKey || event.shiftKey);
                point.select(null, true);
              }
            };
          }
          H.fireEvent(this, eventType, eventArgs, defaultFunction);
        });
      }(this.InternalHighcharts));
    }

    // Extend Highcharts with modules
    if (this.props.modules) {
      this.props.modules.forEach((module) => {
        module(this.InternalHighcharts);
      });
    }

    this.renderChart(this.props.type, this.props.container, this.props.options);
  }

  difference(template, override) {
    var ret = {};
    for (var name in template) {
        if (name in override) {
            if (_.isObject(override[name]) && !_.isArray(override[name])) {
                var diff = this.difference(template[name], override[name]);
                if (!_.isEmpty(diff)) {
                    ret[name] = diff;
                }
            } else if (!_.isEqual(template[name], override[name])) {
                ret[name] = override[name];
            }
        }
    }
    return ret;
  }

  shouldComponentUpdate(nextProps) {
    const equal = _.isEqual(this.props.options, nextProps.options);
    if (!equal) {
      this.renderChart(this.props.type, this.props.container, nextProps.options);
    }
    return !equal;
  }

  //Destroy chart before unmount.
  componentWillUnmount() {
    this.chart.destroy();
  }

  getChart() {
    if (!this.chart) {
      throw new Error('getChart() should not be called before the component is mounted');
    }
    return this.chart;
  }

  static getTheme() {
    return highchartsTheme;
  }

  renderChart = (type, container, options) => {
    if (!this.chart) {
      this.InternalHighcharts.theme = Chart.getTheme();

      // Apply the theme
      this.InternalHighcharts.setOptions(this.InternalHighcharts.theme);

      // Remove credit link at footer
      if (options) {
        options.credits = false;
      }

      // Set container which the chart should render to.
      this.chart = this.InternalHighcharts[type || 'chart'](
        container,
        options
      );
    } else {
      const newSeries = options.series;
      const newLength = newSeries.length;
      const oldLength = this.chart.series.length;

      if (newLength === oldLength) {
        _.each(newSeries, (it, index) => {
          this.chart.series[index].update(it, false);
        });
      } else if (newLength > oldLength) {
        for (let index = 0; index < oldLength; index++) {
          this.chart.series[index].update(newSeries[index]);
        };

        for (let index = oldLength; index < newLength; index++) {
          this.chart.addSeries(newSeries[index], false);
        }
      } else {
        for (let index = newLength; index < oldLength; index++) {
          // Remove from the back
          this.chart.series[oldLength - index].remove(false);
        }

        for (let index = 0; index < newLength; index++) {
          this.chart.series[index].update(newSeries[index], false);
        };
      }
      this.chart['colorCounter'] = newLength;
      this.chart.redraw();
    }
  }

  //Create the div which the chart will be rendered to.
  render() {
    return (
      <div
        className={this.props.className}
        onMouseMove={this.props.onMouseMove}
        style={this.props.style}
        id={this.props.container}
        ref={'chart'}/>
    );
  }
}
