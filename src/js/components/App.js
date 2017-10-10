var React = require('react');

class App extends React.Component {
	render() {
		const _trendingLink = "https://developersapi.audioburst.com/v2/topstories/trending?device=web",
					_requestParams = {
						type: "GET",
						headers: {
							"Ocp-Apim-Subscription-Key": "e57086af14c44cdcad48f89e3cc26f67"
						}
					};
		
		fetch(_trendingLink, _requestParams)
		.then( (response) => response.json() )
		.then((responseJson) => {
			var _response = responseJson;

			for (let _i = 0; _i < _response.length; _i++) {
				var _this = _response[_i],
						_category = _this.category,
						_stories = _this.stories;

				console.log("Category: " + _category);

				for (let _n = 0; _n < _stories.length; _n++) {
					var _thisStory = _stories[_n],
							_storyTitle = _thisStory.entity,
							_bursts = _thisStory.bursts

					console.log("Story: " + _storyTitle);

					for (let _x = 0; _x < _bursts.length; _x++) {
						var _thisBurst = _bursts[_x];

						console.log("Burst #" + _x + ": " + _thisBurst);
					}
				}
			}
		})
    .catch((error) => {
      console.error(error);
    });
		return <h1>app</h1>
	}
};

module.exports = App;