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
  RangeFilter
} from "searchkit";

require("./../styles/index.scss");

class MovieHits extends Hits {
  renderResult(result:any) {
    let url = "http://www.rottentomatoes.com/m/" + result._source.review.movie
    return (
      <div className={this.bemBlocks.item().mix(this.bemBlocks.container("item"))} key={result._id}>
        <a href={url} target="_blank">
          <div className={this.bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:_.get(result,"highlight.review.review",false) || result._source.review.review}}>
          </div>
        </a>
      </div>
    )
  }
}

export class App extends React.Component<any, any> {

  searchkit:SearchkitManager

  constructor() {
    const host = "https://elasticsearch:qwerty123@tomato.ga:9999"
    this.searchkit = new SearchkitManager(host, {
      basicAuth: "elasticsearch:qwerty123"
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
          <div className="layout__search-box">
            <SelectedFilters/>
            <SearchBox translations={{"searchbox.placeholder":"search movies"}} queryOptions={{"minimum_should_match":"70%"}} autofocus={true} searchOnChange={true} queryFields={["actors^1","type^2","languages","title^5", "genres^2"]}/>
          </div>

    			<div className="layout__filters">
    				<ResetFilters />
            <RangeFilter min={0} max={50} field="review.rating" id="rating" title="Metascore" showHistogram={true}/>
            <RefinementListFilter translations={{"facets.view_more":"View more writers"}} id="writers" title="Writers" field="review.movie" operator="OR" size={10}/>
            {/*<HierarchicalMenuFilter fields={["type.raw", "genres.raw"]} title="Categories" id="categories"/>
            <RangeFilter min={0} max={10} field="imdbRating" id="imdbRating" title="IMDB Rating" showHistogram={true}/>
            <RefinementListFilter id="actors" title="Actors" field="actors.raw" operator="AND" size={10}/>

    				<RefinementListFilter id="countries" title="Countries" field="countries.raw" operator="OR" size={10}/>
            <NumericRefinementListFilter id="runtimeMinutes" title="Length" field="runtimeMinutes" options={[
              {title:"All"},
              {title:"up to 20", from:0, to:20},
              {title:"21 to 60", from:21, to:60},
              {title:"60 or more", from:61, to:1000}
            ]}/>*/}
          </div>
    			<div className="layout__results-info">
    				<HitsStats/>
    				<SortingSelector options={[
    					{label:"Relevance", field:"_score", order:"desc"},
    					{label:"Latest Releases", field:"review.released", order:"desc"},
    					{label:"Earliest Releases", field:"review.released", order:"asc"}
    				]}/>
    			</div>
    			<div className="layout__results">
    				<MovieHits hitsPerPage={10} highlightFields={["review.review"]}/>
            <NoHits suggestionsField={"review.review"}/>
    				<Pagination/>
    			</div>
    			<a className="view-src-link" href="https://github.com/searchkit/searchkit-demo/blob/master/src/app/src/App.tsx">View source »</a>
    		</div>
      </div>
      </SearchkitProvider>
      </div>
	)}

}
