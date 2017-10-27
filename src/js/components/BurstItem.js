var React = require('react');

export class BurstItem extends React.Component {
	constructor(props) {
		super(props)
		this.state = { 
			isFetched: false,
			burst: {}
		}
	}

	render() {
		var _burstDetails = null;

		return (
			<div>
				<p onClick={this.props.clickHandler}>{this.props.entity}</p>
			</div>
		)
	}
}
