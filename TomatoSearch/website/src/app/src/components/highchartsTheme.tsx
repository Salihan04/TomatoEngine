const isArray = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

const splat = (obj) => {
    return isArray(obj) ? obj : [obj];
}

const hexToRgba = (hex, opacity) => {
  const newHex = hex.replace('#', '');
  const r = parseInt(newHex.substring(0, 2), 16);
  const g = parseInt(newHex.substring(2, 4), 16);
  const b = parseInt(newHex.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

const colors = [
  '#3366CC', '#DC3912', '#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC', '#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC'];

export default {
  lang: {
    thousandsSep: ''
  },
  colors: colors,
  chart: {
    style: {
      fontFamily: 'Roboto, sans-serif'
    },
    spacingTop: 20,
    backgroundColor: '#ffffff',
    resetZoomButton: {
      position: {
        x: -30,
        y: 30
      },
      relativeTo: 'chart',
      theme: {
        fill: 'white',
        stroke: 'silver',
        r: 0,
        font: '12px Roboto, sans-serif',
        states: {
          hover: {
            fill: '#41739D',
            style: {
              color: 'white'
            }
          }
        }
      }
    }
  },
  plotOptions: {
    series: {
      colors: colors,
      fillOpacity: 0.3,
      dataLabels: {
        style: {
          font: 'bold 20px Roboto, sans-serif',
          fontSize: '20px',
          color: 'black'
        }
      }
    }
  },
  title: {
    style: {
      color: '#000',
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 'bold',
      fontSize: '20px'
    }
  },
  subtitle: {
    style: {
      color: '#666666',
      font: 'bold 12px "Roboto", sans-serif'
    }
  },
  xAxis: {
    title: {
      style: {
        font: '16px "Roboto", sans-serif'
      }
    },
    labels: {
      style: {
        font: '16px "Roboto", sans-serif'
      }
    }
  },
  yAxis: {
    title: {
      style: {
        font: '16px "Roboto", sans-serif'
      }
    },
    labels: {
      style: {
        font: '16px "Roboto", sans-serif'
      }
    }
  },
  labels: {
    style: {
      font: 'bold 10px Roboto, sans-serif',
      color: 'black'
    }
  },
  legend: {
    itemHoverStyle: {
      color: 'gray'
    }
  },
  tooltip: {
    borderWidth: 0,
    backgroundColor: '#FFFFFF',
    headerFormat: '<span style="font-size: 12px">{point.key}</span><br/>',
    formatter: function(tooltip) {
      var items = this.points || splat(this),
          series = items[0].series,
          s;

      // sort the values
      items.sort(function(a, b){
          return ((a.y < b.y) ? -1 : ((a.y > b.y) ? 1 : 0));
      });
      items.reverse();
      return tooltip.defaultFormatter.call(this, tooltip);
    },
    style: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: '14px',
    },
    shape: 'square'
  }
}
