var React = require('react');

const _trendingLink = "https://developersapi.audioburst.com/v2/topstories/trending?device=web",
			_requestParams = {
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
		fetch(_trendingLink, _requestParams)
		.then( (response) => response.json() )
		.then((responseJson) => {
			var _response = responseJson;

			this.setState({
				audioburstData: _response
			})
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
		if (_failCheck) {
			return <p>Failed!</p>
		} else {
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
	}
};

module.exports = App;