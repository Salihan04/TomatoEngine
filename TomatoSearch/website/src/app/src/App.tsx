import * as React from "react";
import * as _ from "lodash";

import {
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
  InitialLoader
} from "searchkit";

import "./../styles/customisations.scss";
import "searchkit/release/theme.css";

const MovieHitsItem = (props)=> {
  const {bemBlocks, result} = props
  let url = "http://www.rottentomatoes.com/m/" + result._source.review.movie
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <a href={url} target="_blank">
        <div data-qa="review" className={bemBlocks.item("review")} dangerouslySetInnerHTML={{__html:_.get(result,"highlight.review.review",false) || result._source.review.review}}>
        </div>
      </a>
      <p data-qa="movie" className={bemBlocks.item("movie")} dangerouslySetInnerHTML={{__html:_.get(result,"highlight.review.movie",false) || result._source.review.movie}}>
      </p>
    </div>
  )
}

export class App extends React.Component<any, any> {

  searchkit:SearchkitManager

  constructor() {
    const host = "https://tomato.ga:9999"
    this.searchkit = new SearchkitManager(host, {
      basicAuth: "elasticsearch:soelynnlovestomatoes"
    })
    this.searchkit.translateFunction = (key)=> {
      return {"pagination.next":"Next Page"}[key]
    }
    super()
  }

  render(){

    return (
      <div>
        <SearchkitProvider searchkit={this.searchkit}>
          <div>
            <div className="layout">
              <div className="layout__top-bar top-bar">
                <div className="top-bar__content">
                  <div className="my-logo">Searchkit Acme co</div>
                  <SearchBox translations={{"searchbox.placeholder":"search movies"}} queryOptions={{"minimum_should_match":"70%"}} autofocus={true} searchOnChange={true} queryFields={["review.review^1","review.title^2"]}/>
                </div>
              </div>

              <div className="layout__body">
          			<div className="layout__filters">
          				<ResetFilters />
                  <RangeFilter min={0} max={50} field="review.rating" id="rating" title="Metascore" showHistogram={true}/>
                  <RefinementListFilter translations={{"facets.view_more":"View more movies"}} id="movies" title="Movies" field="review.movie" operator="OR" size={10}/>
                </div>

                <div className="layout__results results-list">

                  <div className="results-list__action-bar action-bar">

                    <div className="action-bar__info">
              				<HitsStats translations={{
                        "hitstats.results_found":"{hitCount} results found"
                      }}/>
              				<SortingSelector options={[
              					{label:"Relevance", field:"_score", order:"desc",defaultOption:true},
              					{label:"Latest Releases", field:"review.released", order:"desc"},
              					{label:"Earliest Releases", field:"review.released", order:"asc"}
              				]}/>
              			</div>

                    <div className="action-bar__filters">
                      <SelectedFilters/>
                      <ResetFilters/>
                    </div>

                  </div>
                  <Hits hitsPerPage={10} highlightFields={["review.review"]}
                  itemComponent={MovieHitsItem}/>
                  <NoHits suggestionsField={"review.review"}/>
                  <InitialLoader/>
          				<Pagination showNumbers/>
          			</div>
              </div>
        			<a className="view-src-link" href="https://github.com/searchkit/searchkit-demo/blob/master/src/app/src/App.tsx">View source »</a>
        		</div>
          </div>
        </SearchkitProvider>
      </div>
	)}

}
