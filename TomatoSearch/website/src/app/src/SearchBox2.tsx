import * as React from "react";

import {
  SearchBox,
  FilterBasedAccessor
} from "searchkit";

import * as axios from "axios";

export class SearchBox2 extends SearchBox {

	resolveQuery(query, callback) {
		axios.get('https://api.wit.ai/message', {
	    params: {
	      q: query,
	      v: 20160323
	    },
	    headers: {
	    	'Authorization': 'Bearer W7SPBNN4HSU5G4PQJQHSTYM2TDEQ7OZZ'
	    }
	  })
	  .then(function (response) {
	    callback(response.data.outcomes[0]);
	  })
	  .catch(function (response) {
	    console.log(response);
	  });
	}

  searchQuery(query) {
  	let that = this;
  	this.resolveQuery(query, function(result) {
  		console.log(result);
  		if (result.intent == "Movies") {
  			console.log("intent is Movies");
  			// get all filters
  			let filters = that.searchkit.getAccessorsByType(FilterBasedAccessor);
			  var ratingfilter, titlefilter, genrefilter;
			  for (var i = 0; i < filters.length; i++) {
			  	console.log(filters[i]);
			  	if (filters[i].key == "rating") {
			  		ratingfilter = filters[i];
			  		ratingfilter.state.value = [];
			  	} else if (filters[i].key == "movie.title.raw") {
			  		titlefilter = filters[i];
			  		titlefilter.state.value = [];
			  	} else if (filters[i].key == "movie.imdb.Genre") {
			  		genrefilter = filters[i];
			  		genrefilter.state.value = [];
			  	}
			  }
  			if (result.entities.genre) {
					let genre = result.entities.genre;
					for (var i = 0; i < genre.length; i++) {
					  //state.add or state.setValue is not working
					  if (genrefilter.state.value.indexOf(genre[i].value) == -1) {
							genrefilter.state.value.push(genre[i].value);
					  }
					} 
			  }
			  if (result.entities.movie) {
					let movie = result.entities.movie;
					for (var i = 0; i < movie.length; i++) {
					  if (titlefilter.state.value.indexOf(movie[i].value) == -1) {
							titlefilter.state.value.push(movie[i].value);
					  }
					} 
			  }
			  that.searchkit.performSearch()
  		}
  	})
/*
    let shouldResetOtherState = false
    this.accessor.setQueryString(query, shouldResetOtherState )
    let now = +new Date
    let newSearch = now - this.lastSearchMs <= 2000
    this.lastSearchMs = now
    this.searchkit.performSearch(newSearch)
 */
  }
}