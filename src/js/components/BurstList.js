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
				_audioData = this.state.audioburstData;

		// If request fails
		if (_failCheck) return <p className="message message-failed">Failed!</p>
		if (!_audioData) return <p className="message message-loading">Loading...</p>
		
		return (
			<div>
				<div className="playerContainer">
					<div className="playerContainer__bg">
					</div>
					<h3>{this.state.activeShowName}</h3>
					<p>{this.state.activeDate}</p>
					<audio controls autoPlay ref="audio" id="player">
						<source src={this.state.activeBurstURL} type="audio/mp3" />
					</audio>
				</div>
				<div className="burstContainer">
					{_audioData.map(function(dataObj, index){
						var _stories = dataObj.stories;

						return (
							<div className="burstItem">				
								<h2 key={index}>{dataObj.category}</h2>
								{_stories.map(function(story, index) {
									var _totalStories = story.bursts.length,
											_randomStorySelector = randomNumber(0, _totalStories - 1);

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
			</div>
		)
	}
};