import * as React from "react";
import * as _ from "lodash";
import { Link } from 'react-router'

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
  InitialLoader,
  FilteredQuery,
  TermQuery
} from "searchkit";

import "searchkit/release/theme.css";
import "./../styles/customisations.scss";

import {SearchBox2} from './components/SearchBox2'
import {TimeRangeFilter} from './components/TimeRangeFilter'

const MovieHitsItem = (props)=> {
  const {bemBlocks, result} = props
  // let url = "http://www.rottentomatoes.com/m/" + result._source.movie.url_id
  let url = `/review?movies[0]=${encodeURIComponent(result._source.movie.title)}`
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <a href={url} target="_blank">
        <img data-qa="poster" className={bemBlocks.item("poster")} src={result._source.movie.imdb.Poster} width="150" height="220"/>
      </a>
      <div data-qa="movie" className={bemBlocks.item("movie")} dangerouslySetInnerHTML={{__html:_.get(result,"highlight['movie.title']",false) || result._source.movie.title}}>
      </div>
    </div>
  )
}

export class MovieApp extends React.Component<any, any> {

  searchkit:SearchkitManager

  constructor() {
    super(); //@ZHANQI: Added to avoid ERROR 
    const host = "https://tomato.ga:9999"
    this.searchkit = new SearchkitManager(host, {
      basicAuth: "elasticsearch:soelynnlovestomatoes"
    })
    this.searchkit.addDefaultQuery((query) => {
      return query.addQuery(FilteredQuery({
        filter: TermQuery("_type", "movie")
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
            <div className="sk-layout">
              <div className="tomato-top-bar sk-layout__top-bar sk-top-bar">
                <div className="sk-top-bar__content">
                  <div className="tomato-logo my-logo">Tomato Movies</div>
                  <SearchBox2 placeholder="Search movies" queryOptions={{"minimum_should_match":"70%"}} autofocus={true} searchOnChange={false} queryFields={["movie.title^1"]}/>
                </div>
              </div>

              <div className="sk-layout__body">
          			<div className="sk-layout__filters">
          				<ResetFilters />
                  <TimeRangeFilter format={"YYYY-MM-DD"} min={"2013-11-01"} max={"2016-06-30"} interval={'1M'} field="movie.release_dates.theater" id="release_dates" title="Released dates" showHistogram={true}/>
                  <RangeFilter min={0} max={100} field="movie.ratings.critics_score" id="rating" title="Metascore" showHistogram={true}/>
                  <RefinementListFilter translations={{"facets.view_more":"View more movies"}} id="movies" title="Movies" field="movie.title.raw" operator="OR" size={10}/>
                  <RefinementListFilter translations={{"facets.view_more":"View more genres"}} id="genres" title="Genres" field="movie.imdb.Genre" operator="AND" size={10}/>
                  <RefinementListFilter translations={{"facets.view_more":"View more actors"}} id="actors" title="Actors" field="movie.abridged_cast.name" operator="AND" size={10}/>
                  <RefinementListFilter translations={{"facets.view_more":"View more characters"}} id="characters" title="Characters" field="movie.abridged_cast.characters" operator="AND" size={10}/>
                </div>

                <div className="sk-layout__results sk-results-list">
                  <div className="body-header">
                    <Link className="link" to="/stats">Statistics</Link>
                    <span className="label">Movies</span>
                    <Link className="link" to="/review">Reviews</Link>
                  </div>

                  <div className="sk-results-list__action-bar sk-action-bar">

                    <div className="sk-action-bar-row">
              				<HitsStats translations={{
                        "hitstats.results_found":"{hitCount} results found"
                      }}/>
              				<SortingSelector options={[
              					{label:"Relevance", field:"_score", order:"desc",defaultOption:true},
              					{label:"Latest Releases", field:"movie.release_dates.theater", order:"desc"},
              					{label:"Earliest Releases", field:"movie.release_dates.theater", order:"asc"}
              				]}/>
              			</div>

                    <div className="sk-action-bar__filters">
                      <SelectedFilters/>
                      <ResetFilters/>
                    </div>

                  </div>
                  <Hits mod="sk-hits-grid" hitsPerPage={15} highlightFields={["movie.title"]}
                  itemComponent={MovieHitsItem}/>
                  <NoHits suggestionsField={"movie.title"}/>
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
