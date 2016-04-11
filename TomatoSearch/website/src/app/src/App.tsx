import * as React from "react";
import * as _ from "lodash";
import { Link } from 'react-router'

import {
  BoolMust,
  SearchBox,
  Hits,
  HitsStats,
  RefinementListFilter,
  Pagination,
  ResetFilters,
  MenuFilter,
  SelectedFilters,
  HierarchicalMenuFilter,
  NumericRefinementListFilter,
  SortingSelector,
  SearchkitComponent,
  SearchkitProvider,
  SearchkitManager,
  NoHits,
  RangeFilter,
  InitialLoader,
  FilteredQuery,
  TermQuery,
  ItemHistogramList
} from "searchkit";

import "searchkit/release/theme.css";
import "./../styles/customisations.scss";

const MovieHitsItem = (props)=> {
  const {bemBlocks, result} = props;
  let url = "http://www.rottentomatoes.com/m/" + result._source.review.movie;
  const sentiment = result._source.review.sentiment;
  let sentimentText;
  if (sentiment === 0) {
    sentimentText = "Negative";
  } else if (sentiment === 1) {
    sentimentText = "Neutral";
  } else if (sentiment === 2) {
    sentimentText = "Positive";
  }

  return (
    <div className="item-block">
      <div className={bemBlocks.item().mix(bemBlocks.container("item")) } data-qa="hit">
        <div className="col-2" style={{textAlign: 'right'}}>
          <a href={url} target="_blank">
            <img data-qa="poster" className={bemBlocks.item("poster") } src={result._source.review.metadata.poster} width="150" height="220"/>
          </a>
          <div data-qa="movie" className={bemBlocks.item("movie") } dangerouslySetInnerHTML={{ __html: _.get(result, "highlight.review.metadata.title", false) || result._source.review.metadata.title }}>
          </div>
        </div>
        <div className={`col-1 sentiment sentiment-${sentiment}`}>
          <span>{sentimentText}</span>
        </div>
        <div className="col-9">
          <div data-qa="review" className={bemBlocks.item("review")} dangerouslySetInnerHTML={{__html:_.get(result,"highlight.review.review",false) || result._source.review.review}}>
          </div>
        </div>
      </div>
    </div>
  )
}

export class App extends React.Component<any, any> {

  searchkit:SearchkitManager

  constructor() {
    super(); //@ZHANQI: Added to avoid ERROR 
    const host = "https://tomato.ga:9999"
    this.searchkit = new SearchkitManager(host, {
      basicAuth: "elasticsearch:soelynnlovestomatoes"
    })
    this.searchkit.addDefaultQuery((query) => {
      return query.addQuery(FilteredQuery({
        filter: BoolMust([
          TermQuery("_type", "review"),
          TermQuery("review.lang", "en")
        ])
      }));
    })
    this.searchkit.translateFunction = (key)=> {
      return {"pagination.next":"Next Page"}[key]
    }
    // super()
  }

  render(){

    return (
      <div>
        <SearchkitProvider searchkit={this.searchkit}>
          <div>
            <div className="sk-layout sk-layout__review-app">
              <div className="tomato-top-bar sk-layout__top-bar sk-top-bar">
                <div className="sk-top-bar__content">
                  <div className="tomato-logo my-logo">Tomato Reviews</div>
                  <SearchBox translations={{"searchbox.placeholder":"Search reviews"}} queryOptions={{"minimum_should_match":"70%"}} autofocus={true} searchOnChange={true} queryFields={["review.review^1","review.title^2"]}/>
                </div>
              </div>

              <div className="sk-layout__body">
          			<div className="sk-layout__filters">
          				<ResetFilters />
                  <RangeFilter min={0} max={50} field="review.rating" id="rating" title="Original rating" showHistogram={true}/>
                  <NumericRefinementListFilter id="sentiment" title="Sentiment" field="review.sentiment"
                  options={[
                    {title:"All"},
                    {title:"Positive", from:2, to:3},
                    {title:"Neutral", from:1, to:2},
                    {title:"Negative", from:0, to:1}
                  ]}/>
                  <RefinementListFilter translations={{"facets.view_more":"View more movies"}} id="movies" title="Movies" field="review.metadata.title" operator="OR" size={10}/>
                  {/*<RefinementListFilter translations={{"facets.view_more":"View more languages"}} id="languages" title="Languages" field="review.lang.type" operator="OR" size={10}/>*/}
                </div>

                <div className="sk-layout__results sk-results-list">

                  <div className="body-header">
                    <Link className="link" to="/movie">Movies</Link>
                    <span className="label">Reviews</span>
                    <Link className="link" to="/stats">Statistics</Link>
                  </div>

                  <div className="sk-results-list__action-bar sk-action-bar">

                    <div className="sk-action-bar-row">
              				<HitsStats translations={{
                        "hitstats.results_found":"{hitCount} results found"
                      }}/>
              				<SortingSelector options={[
              					{label:"Relevance", field:"_score", order:"desc",defaultOption:true},
              					{label:"Latest Releases", field:"review.released", order:"desc"},
              					{label:"Earliest Releases", field:"review.released", order:"asc"}
              				]}/>
              			</div>

                    <div className="sk-action-bar__filters">
                      <SelectedFilters/>
                      <ResetFilters/>
                    </div>

                  </div>
                  <div className="header">
                    <div className="col-2">Movie</div>
                    <div className="col-1">Sentiment</div>
                    <div className="col-9">Review</div>
                  </div>
                  <Hits hitsPerPage={10} highlightFields={["review.review"]}
                  itemComponent={MovieHitsItem}/>
                  <NoHits suggestionsField={"review.review"}/>
                  <InitialLoader/>
          				<Pagination showNumbers/>
          			</div>
              </div>
        		</div>
          </div>
        </SearchkitProvider>
      </div>
	)}

}
