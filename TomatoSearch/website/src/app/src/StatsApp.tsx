import * as React from "react";
import {ConfusionMatrix} from './components/ConfusionMatrix'
import {BarChart} from './components/BarChart'
import { Link } from 'react-router'

const confusionData = [
  [65, 17, 5],
  [18, 50, 12],
  [1, 3, 80]
];

const scores = [[0.78486, 0.78486, 0.78486]];

export class StatsApp extends React.Component<any, any> {
    render() {
        return (
            <div className="sk-layout stats">
              <div className="tomato-top-bar sk-layout__top-bar sk-top-bar">
                <div className="sk-top-bar__content">
                  <div className="tomato-logo my-logo">Statistics</div>
                </div>
              </div>
              <div className="sk-layout__body center-body">
                <div className="body-header header-space">
                  <Link className="link" to="/review">Reviews</Link>
                  <span className="label">Statistics</span>
                  <Link className="link" to="/movie">Movies</Link>
                </div>
                <ConfusionMatrix className="matrix" data={confusionData} container="matrix" dimenX={3} dimenY={3}/>
                <BarChart className="matrix" data={scores} container="scores"/>
                {/*
                <div className="matrix">
                  <table className="table">
                  <caption>Confusion Matrix</caption>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Predicted Negative</th>
                      <th>Predicted Neutral</th>
                      <th>Predicted Positive</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <th>Actual Negative</th>
                      <td>65</td>
                      <td>18</td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <th>Actual Neutral</th>
                      <td>17</td>
                      <td>50</td>
                      <td>3</td>
                    </tr>
                    <tr>
                      <th>Actual Positive</th>
                      <td>5</td>
                      <td>12</td>
                      <td>80</td>
                    </tr>
                  </tbody>
                  </table>
                </div>
                */}
              </div>
            </div>
        )
    }
}