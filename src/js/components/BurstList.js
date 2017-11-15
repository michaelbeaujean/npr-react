var React = require('react');

const _audioburstTrendingUrl = "https://developersapi.audioburst.com/v2/topstories/trending?device=web";
const _audioburstBurstUrl = "https://developersapi.audioburst.com/v2/burst?device=web&burstId=";
const _audioburstApiParams = {
	type: "GET",
	headers: {
		"Ocp-Apim-Subscription-Key": "e57086af14c44cdcad48f89e3cc26f67"
	}
};

import { BurstItem, randomNumber } from './BurstItem';

Array.prototype.shuffle = function() {
    var input = this;
     
    for (var i = input.length-1; i >=0; i--) {
     
        var randomIndex = Math.floor(Math.random()*(i+1)); 
        var itemAtIndex = input[randomIndex]; 
         
        input[randomIndex] = input[i]; 
        input[i] = itemAtIndex;
    }
    return input;
}

export class BurstList extends React.Component {
	constructor(props) {
		super(props)
		this.state = { 
			requestFailed: false,
			activeBurstURL: ""
		};
	}

	componentDidMount() {
		fetch(_audioburstTrendingUrl, _audioburstApiParams)
		.then( (response) => response.json() )
		.then( (responseJson) => {

			var _response = responseJson;

			this.setState({
				audioburstData: _response
			})

		})
		.then( () => {
			var _audioburstData = this.state.audioburstData,
					_storyArr = [];

			_audioburstData.map(function(dataObj, index){
				var _stories = dataObj.stories;

				_stories.map(function(story, index){
					var _totalStories = story.bursts.length,
							_randomStorySelector = randomNumber(0, _totalStories - 1);

					_storyArr.push(
						<BurstItem clickHandler={ () => this.burstFetch(story.bursts[_randomStorySelector]) } burst={story.bursts[_randomStorySelector]} entity={story.entity} />
					);
				});
			});

			var _randomStories = _storyArr.shuffle();

			this.setState({ allStories: _randomStories });
		})
    .catch((error) => {
    	// If there's an error, set requestFailed state
    	this.setState({
    		requestFailed: true
    	})
    });

	}

	burstFetch(burstId) {
		fetch(_audioburstBurstUrl + burstId, _audioburstApiParams)
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
				_allStories = this.state.allStories;

		// If request fails
		if (_failCheck) return <p>Failed!</p>
		if (!_audioData) return <p>Loading...</p>
		
		return (
			<div>
				<div className="playerContainer">
					<h3>{this.state.activeShowName}</h3>
					<p>{this.state.activeDate}</p>
					<audio controls autoPlay ref="audio" id="player">
						<source src={this.state.activeBurstURL} type="audio/mp3" />
					</audio>
				</div>
				<div className="burstContainer">
					{_allStories}
				</div>
			</div>
		)
	}
};