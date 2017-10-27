var React = require('react');

const _trendingCall = "https://developersapi.audioburst.com/v2/topstories/trending?device=web";
const _burstCall = "https://developersapi.audioburst.com/v2/burst?device=web&burstId=";
const _apiCallParams = {
	type: "GET",
	headers: {
		"Ocp-Apim-Subscription-Key": "e57086af14c44cdcad48f89e3cc26f67"
	}
};

import { BurstItem } from './BurstItem';

export class BurstList extends React.Component {
	constructor(props) {
		super(props)
		this.state = { 
			requestFailed: false,
			activeBurstURL: ""
		};
	}

	componentDidMount() {
		fetch(_trendingCall, _apiCallParams)
		.then( (response) => response.json() )
		.then((responseJson) => {

			var _response = responseJson;

			this.setState({
				audioburstData: _response,
				trendingObjects: []
			})

			let _data = this.state.audioburstData,
					_dataArray = [];

			_data.map(function(dataObj) {
				var _category = dataObj.category,
						_stories = dataObj.stories,
						_mainObj = { 
							category: _category, 
							stories: []
						};

				_dataArray.push(_mainObj);
			});


			if (_dataArray)
				this.setState({ trendingObjects: _dataArray })

		})
    .catch((error) => {
    	// If there's an error, set requestFailed state
    	this.setState({
    		requestFailed: true
    	})
    });

	}

	burstFetch(burstId) {
		fetch(_burstCall + burstId, _apiCallParams)
		.then( (response) => response.json() )	
		.then((responseJson) => {
			var _burstResponse = responseJson;

			this.setState({ burst: _burstResponse })
			this.setState({ isFetched: true })

			var _burst = this.state.burst.bursts[0];

			this.setState({
				activeBurst: _burst,
				activeShowName: _burst.source.showName,
				activeTitle: _burst.title,
				activeDate: _burst.publicationDateISO,
				activeText: _burst.text,
				activeBurstURL: _burst.contentURLs.audioURL
			},
				function(){
					this.refs.audio.pause();
					this.refs.audio.load();
					this.refs.audio.play();
				}
			)			
		})
    .catch((error) => {
    	// If there's an error, set requestFailed state
    	console.log("error");
    });

	}

	render() {
		var _failCheck = this.state.requestFailed,
				_audioData = this.state.audioburstData,
				_randomNumber = function _randomNumber(min, max) { return Math.round(Math.random() * (max - min) + min); };

		// If request fails
		if (_failCheck) return <p>Failed!</p>
		if (!_audioData) return <p>Loading...</p>
		
		return (
			<div>
				<audio controls autoPlay ref="audio">
					<source src={this.state.activeBurstURL} type="audio/mp3" />
				</audio>
			{_audioData.map(function(dataObj, index){
				var _stories = dataObj.stories;

				return (
					<div>				
						<h1 key={index}>{dataObj.category}</h1>
						{_stories.map(function(story, index) {
							var _totalStories = story.bursts.length,
									_randomStorySelector = _randomNumber(0, _totalStories - 1);

							return (
							<div>
								<BurstItem clickHandler={ () => this.burstFetch(story.bursts[_randomStorySelector]) } key={index} burst={story.bursts[_randomStorySelector]} entity={story.entity} />
							</div>
							)
						}, this)}
					</div>
				)

			}, this)}

			</div>
		)
	}
};