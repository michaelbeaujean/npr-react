var React = require('react');

const _trendingCall = "https://developersapi.audioburst.com/v2/topstories/trending?device=web",
			_burstCall = "https://developersapi.audioburst.com/v2/burst?device=web&burstId=",
			_apiCallParams = {
				type: "GET",
				headers: {
					"Ocp-Apim-Subscription-Key": "e57086af14c44cdcad48f89e3cc26f67"
				}
			};

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			requestFailed: false
		}
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

			var _data = this.state.audioburstData,
					_dataArray = [];

			_data.map(function(dataObj) {
				var _category = dataObj.category,
						_stories = dataObj.stories,
						_mainObj = {};

				_stories.map(function(story) {
					var _this = story,
							_bursts = _this.bursts,
							_storyObj = {
								storySubject: _this.entity,
								storyDetails: []
							};

					_bursts.map(function(burstId) {

						fetch(_burstCall + burstId, _apiCallParams)
						.then( (response) => response.json() )
						.then((responseJson) => {
							var _burstResponse = responseJson;

							console.log(_burstResponse);

						})
						
					});

				});						

				_mainObj = {
					category: _category,
					stories: []
				}

				_dataArray.push(_mainObj);
			});


			if (_dataArray)
				this.setState({ trendingObjects: _dataArray })

			console.log(this.state.trendingObjects);
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
				_audioBatches = [];

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
							return <p key={index}>{story.entity}</p>
						})}
					</div>
				)

			})}

			</div>
		)
	}
};

module.exports = App;