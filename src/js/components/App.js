var React = require('react');

const _trendingCall = "https://developersapi.audioburst.com/v2/topstories/trending?device=web",
			_burstCall = "https://developersapi.audioburst.com/v2/burst?device=web&burstId=",
			_apiCallParams = {
				type: "GET",
				headers: {
					"Ocp-Apim-Subscription-Key": "e57086af14c44cdcad48f89e3cc26f67"
				}
			};

class BurstItem extends React.Component {
	constructor(props) {
		super(props)
		this.state = { 
			isFetched: false,
			burst: {}
		}
		this.burstFetch = this.burstFetch.bind(this);
	}

	burstFetch(burstId) {
		fetch(_burstCall + burstId, _apiCallParams)
		.then( (response) => response.json() )	
		.then((responseJson) => {
			var _burstResponse = responseJson;

			this.setState({ burst: _burstResponse })
		})

		this.setState({ isFetched: true })
	}	

	render() {
		var _burstDetails = null;

		if (this.state.isFetched) {
			var _burst = this.state.burst.bursts[0],
					_showName = _burst.source.showName,
					_title = _burst.title,
					_date = _burst.publicationDateISO,
					_text = _burst.text,
					_audioURL = _burst.contentURLs.audioURL;

			_burstDetails = (
				<div>
					<h3>{_showName}</h3>
					<h4>{_title}</h4>
					<p>{_date}</p>
					<p>{_text}</p>
					<audio controls autoPlay>
						<source src={_audioURL} type="audio/mp3" />
					</audio>
				</div>
			)
		}

		return (
			<div>
				<p onClick={ () => this.burstFetch(this.props.burst) }>{this.props.entity}</p>
				{_burstDetails}
			</div>
		)
	}
}

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = { requestFailed: false };
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
	
	render() {
		var _failCheck = this.state.requestFailed,
				_audioData = this.state.audioburstData,
				_audioBatches = [],
				_randomNumber = function _randomNumber(min, max) { return Math.round(Math.random() * (max - min) + min); };

		// If request fails
		if (_failCheck) return <p>Failed!</p>
		if (!_audioData) return <p>Loading...</p>
		
		return (
			<div>
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
								<BurstItem key={index} burst={story.bursts[_randomStorySelector]} entity={story.entity} />
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

module.exports = App;