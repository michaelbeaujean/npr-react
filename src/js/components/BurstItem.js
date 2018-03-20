var React = require('react');

const _imgurSearchUrl = "https://api.imgur.com/3/gallery/t/";
const _imgurApiParams = {
	type: "GET",
	headers: {
		"Authorization": "Client-ID e75ad098d8ce655"
	}
}

export function randomNumber(min, max) { return Math.round(Math.random() * (max - min) + min); };

export class BurstItem extends React.Component {
	constructor(props) {
		super(props)
		this.state = { 
			isFetched: false,
			burst: {},
			imageResponse: {},
			imageFetched: false
		}
	}

	componentDidMount() {
		fetch(_imgurSearchUrl + this.props.entity, _imgurApiParams)
		.then( (response) => response.json() )
		.then( (responseJson) => {

			var _responseJson = responseJson,
					_responseItems = _responseJson.data.items,
					_responseTotalItems = _responseItems.length,
					_randomImageSelector = randomNumber(0, _responseTotalItems - 1);

			this.setState({
				imageResponse: _responseJson,
				imageFetched: true,
				imageURL: _responseItems[_randomImageSelector].images[0].link
			})
		})
    .catch((error) => {
    	console.log("image fetch error");
    });
	}	

	render() {
		var _burstDetails = null;

		return (
			<div className="burst" onClick={this.props.clickHandler}>
				<h3 className="burstName">{this.props.entity}</h3>
				<img className="burstImage" src={this.state.imageURL} />
			</div>
		)
	}
}
