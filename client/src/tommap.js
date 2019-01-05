// Import required packages and components
import React from 'react';
// import fetch from 'isomorphic-fetch'
import { compose, withProps, withHandlers } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import { MarkerClusterer } from 'react-google-maps/lib/components/addons/MarkerClusterer';
let sampleMarkers = require('./SampleMarkers.js');
const RochMap = GoogleMap;
const API_KEY = process.env.REACT_APP_MAP_API;

RochMap.handleClick = () => {
	this.handleClick.bind(RochMap);
};

// console.log(JSON.stringify(GoogleMap))
const MapWithAMarkerClusterer = compose(
	withProps({
		googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=geometry,drawing,places`,
		loadingElement: <div style={{ height: `100%` }} />,
		containerElement: <div style={{ height: `400px`, boxShadow: `0 0 40px #000` }} />,
		mapElement: <div style={{ height: `100%` }} />
	}),
	withHandlers(
		() => ({
			isOpen: false
		}),
		{
			onToggleOpen: ({ isOpen }) => () => ({
				isOpen: !isOpen
			})
		},
		{
			onMarkerClustererClick: () => (markerClusterer) => {
				const clickedMarkers = markerClusterer.getMarkers();
				console.log(`Current clicked markers length: ${clickedMarkers.length}`);
				console.log(clickedMarkers);
			}
		}
	),
	withScriptjs,
	withGoogleMap
)((props) => (
	<RochMap defaultZoom={10} defaultCenter={{ lat: 32.25346, lng: -110.911789 }} onClick={props.handleClick}>
		<MarkerClusterer onClick={props.onMarkerClustererClick} averageCenter enableRetinaIcons gridSize={60}>
			{props.markers.map((marker) => (
				<Marker
					key={marker.photo_id}
					position={{ lat: marker.latitude, lng: marker.longitude }}
					onClick={props.onToggleOpen}
				>
					{props.isOpen && (
						<InfoWindow onCloseClick={props.onToggleOpen}>
							<div>
								Project Name: {marker.name} <br /> Category: {marker.category}
							</div>
						</InfoWindow>
					)}
				</Marker>
			))}
		</MarkerClusterer>
	</RochMap>
));

export default class DemoApp extends React.PureComponent {
	state = {
		markers: []
	};

	componentDidMount() {
		// console.log(sampleMarkers)
		let rochData = sampleMarkers;
		// console.log("this is roch data" + JSON.stringify(rochData))

		this.setState({ markers: rochData });
	}

	render() {
		return <MapWithAMarkerClusterer key={this.state.key} markers={this.state.markers} />;
	}
}
