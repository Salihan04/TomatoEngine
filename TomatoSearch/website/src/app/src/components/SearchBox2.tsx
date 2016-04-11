import * as React from "react";

import {
  SearchBox,
  FilterBasedAccessor
} from "searchkit";

import * as axios from "axios";
import * as _ from "lodash";

const moment = require("moment");
const jsonp = require("jsonp");
import SpeechRecognition from "./SpeechRecognition";

export class SearchBox2 extends SearchBox {

	constructor(props) {
		super(props);
		this.state = _.extend(this.state, {
			recognizing: false
		});
	}

	toggleSpeech() {
		if (!SpeechRecognition.recognizing) {
			SpeechRecognition.startRecognize();
			this.setState({
				recognizing: true
			});
			this.setFocusState(true);
			
		} else {
			this.setState({
				recognizing: false
			});
			this.setFocusState(false);
		}
	}

	componentDidMount() {
		SpeechRecognition.initialize(this.setValue.bind(this), this.submit.bind(this));
	}

	setValue(value) {
		this.accessor.setQueryString(value);
		this.forceUpdate();
	}

	submit() {
		this.searchQuery(this.getValue());
	}

	resolveQuery(query, callback) {
		const version = 20160323;
		const token = 'W7SPBNN4HSU5G4PQJQHSTYM2TDEQ7OZZ';
		jsonp(`https://api.wit.ai/message?q=${query}&v=${version}&access_token=${token}`, null,
			(err, data) => {
				if (err) {
					console.log(err);
				} else {
					callback(data.outcomes[0]);
				}
			}
		);
	}

	searchQuery(query) {
		if (!SpeechRecognition.recognizing) {
			this.setState({
				recognizing: false
			});
			this.setFocusState(false);
		}

		let that = this;
		this.resolveQuery(query, function(result) {
			console.log(result);
			if (result.intent == "Movies" && !_.isEmpty(result.entities)) {
				console.log("intent is Movies");
				// get all filters
				let filters = that.searchkit.getAccessorsByType(FilterBasedAccessor);
				let ratingfilter, titlefilter, genrefilter,
					actorFilter, characterFilter, dateFilter;
				for (let i = 0; i < filters.length; i++) {
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
					} else if (filters[i].key == "movie.abridged_cast.name") {
						actorFilter = filters[i];
						actorFilter.state.value = [];
					} else if (filters[i].key == "movie.abridged_cast.characters") {
						characterFilter = filters[i];
						characterFilter.state.value = [];
					} else if (filters[i].key == "release_dates") {
						dateFilter = filters[i];
						dateFilter.state = dateFilter.state.setValue({
							min: "2013-11-01",
							max: "2016-06-30"
						});
					}
				}
				if (result.entities.genre) {
					let genre = result.entities.genre;
					for (let i = 0; i < genre.length; i++) {
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
				if (result.entities.actor) {
					let actor = result.entities.actor;
					for (let i = 0; i < actor.length; i++) {
						if (actorFilter.state.value.indexOf(actor[i].value) == -1) {
							actorFilter.state.value.push(actor[i].value);
						}
					} 
				}
				if (result.entities.character) {
					let character = result.entities.character;
					for (let i = 0; i < character.length; i++) {
						if (characterFilter.state.value.indexOf(character[i].value) == -1) {
							characterFilter.state.value.push(character[i].value);
						}
					} 
				}
				if (result.entities.datetime) {
					let minDate, maxDate;
					let date = result.entities.datetime[0];
					let type = date.type;

					if (type === "interval") {
						if (date.from) {
							let fromDate = date.from.value.split("T")[0];
							minDate = moment(fromDate).format("YYYY-MM-DD");
						}

						if (date.to) {
							let toDate = date.to.value.split("T")[0];
							maxDate = moment(toDate).format("YYYY-MM-DD");
						}
					} else if (type === "value") {
						let grain = date.grain;
						let valueDate = date.value.split("T")[0];
						let format;
						minDate = moment(valueDate).format("YYYY-MM-DD");
						if (grain === "day") {
							format = "days";
						} else if (grain === "month") {
							format = "months";
						} else if (grain === "year") {
							format = "years";
						}

						if (format) {
							maxDate = moment(valueDate).add(1, format).format("YYYY-MM-DD");
						}
					}
					
					if (!minDate || moment(minDate).isBefore("2013-11-01")) {
						minDate = "2013-11-01";
					}

					if (!maxDate || moment(maxDate).isAfter("2016-06-30")) {
						maxDate = "2016-06-30";
					}

					dateFilter.state = dateFilter.state.setValue({
						min: minDate,
						max: maxDate
					});
				}

				if (result.entities.search_query) {
					query = result.entities.search_query[0].value;
				} else {
					query = "";
				}

				let shouldResetOtherState = false;
				that.accessor.setQueryString(query, shouldResetOtherState);
				that.searchkit.performSearch();
			} else {
				let shouldResetOtherState = false;
				that.accessor.setQueryString(query, shouldResetOtherState);
				that.searchkit.performSearch();
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

	render() {
		// console.log(this.props);
		// return super.render();
		let block = this.bemBlocks.container;
		let recognizing = this.state.recognizing || SpeechRecognition.recognizing;
		let speechIcon = recognizing ? "settings_voice" : "keyboard_voice";
		let speechClass = recognizing ? "speech-recognizing" : "speech";

		return (
			<div className={block().state({focused:this.state.focused})}>
			<form onSubmit={this.onSubmit.bind(this)}>
				<div className={block("icon")}></div>
				<input type="text"
				data-qa="query"
				className={block("text")}
				placeholder={this.props.placeholder || this.translate("searchbox.placeholder")}
				value={this.getValue()}
				onFocus={this.setFocusState.bind(this, true)}
				onBlur={this.setFocusState.bind(this, false)}
				ref="queryField"
				autoFocus={this.props.autofocus}
				onInput={this.onChange.bind(this)}/>
				<input type="submit" value="search" className={block("action")} data-qa="submit"/>
				<div data-qa="loader" className={block("loader").mix("sk-spinning-loader").state({hidden:!this.isLoading()})}></div>
              	<i className={`material-icons speech-icon ${speechClass}`} onClick={this.toggleSpeech.bind(this)}>{speechIcon}</i>
			</form>
			</div>
		);

	}
}