import React, { Component } from 'react';
import { compose, withStateHandlers, withProps } from 'recompose';
import { Polyline, withGoogleMap, withScriptjs, GoogleMap, Marker } from 'react-google-maps';

const Map = compose(
    withProps({
        googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=&v=3.exp&libraries=geometry,drawing,places',
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100%` }} />,
        mapElement: <div style={{ height: `100%` }} />
    }),
    withPropsOnChange(['infoWindowForMarker'], props => {
        return props.infoWindowForMarker;
    }),
    withPropsOnChange(['infoWindowForPolyline'], props => {
        return props.infoWindowForPolyline;
    }),
    withScriptjs,
    withGoogleMap
)(props => (
    <GoogleMap defaultZoom={props.zoom} defaultCenter={props.center} onClick={props.mapOnClick}>
        {props.markers.map(x => (
            <Marker
                defaultIcon={marker} // marker: imported image
                position={{ lat: markerNode.latitude, lng: markerNode.longitude }}
                onClick={() => setInfoWindowForMarker(true, markerNode)}
                properties={markerNode}
            />
        ))}
		{props.polylines.map(polyline => (
            <Polyline
                path={[
                    { lat: polyline.latitude, lng: polyline.longitude },
                    { lat: polyline.latitude, lng: polyline.longitude }
                ]}
                onClick={() => setInfoWindowForPolyline(true, polyline)}
                geodesic={false}
                defaultOptions={{ strokeColor: polyline.color, strokeWeight: 6 }}
                properties={polyline}
            />
        ))}
		{props.infoWindowForPolyline.map(polyline =>
           <InfoWindow
                defaultPosition={{
                    lat: (polyline.link.from.latitude + polyline.link.to.latitude) / 2,
                    lng: (polyline.link.from.longitude + polyline.link.to.longitude) / 2
                }}
            >
                <div>
                    <h3>Title: {polyline.title}</h3>
                    <div>
                        <b>Property 1:</b> {polyline.property1}
                    </div>
                    <div>
                        <b>Property 2:</b> {polyline.property2}
                    </div>
                    <hr />
					<div>
						<a onClick={() => function1()}>Function1</a>
					</div>
                </div>
            </InfoWindow>
        ))}
    </GoogleMap>
));

class DemoMap extends Component {
    state = {
        model: { nodeDataArray: [], linkDataArray: [] },
        infoWindowForMarker: [],
        infoWindowForPolyline: []
    };

    findAll(url, mapType) {
        message.loading('Loading...', 1.5);
        axios.get(url + '/' + mapType).then(res => {
            const model = res.data;
            this.setState({ ...this.state, model });
            message.success('Loaded!', 3);
        });
    }

    mapOnClick = () => {};
    markerOnClick = () => {};
    polylineOnClick = () => {};

    clearInfoWindowForMarker = () => {
        this.setState({ ...this.state, infoWindowForMarker: [], infoWindowForPolyline: [] });
    };

    setInfoWindowForMarker = (status, marker) => {
        const infoWindowForMarker = this.state.infoWindowForMarker;

        if (status) {
            infoWindowForMarker.push(marker);
        } else {
            infoWindowForMarker.pop(marker);
        }

        this.setState({ ...this.state, infoWindowForMarker });
    };

    setInfoWindowForPolyline = (status, polyline) => {
        const infoWindowForPolyline = this.state.infoWindowForPolyline;

        if (status) {
            infoWindowForPolyline.push(polyline);
        } else {
            infoWindowForPolyline.pop(polyline);
        }

        this.setState({ ...this.state, infoWindowForPolyline });
    };

    render() {
        return (
            <div style={{ height: '100%' }}>
                <CustomMap
                    center={this.props.center}
                    zoom={this.props.zoom}
                    markers={this.state.model.nodeDataArray}
                    polylines={this.state.model.linkDataArray}
                    infoWindowForMarker={this.state.infoWindowForMarker}
                    infoWindowForPolyline={this.state.infoWindowForPolyline}
                    setInfoWindowForMarker={this.setInfoWindowForMarker}
                    setInfoWindowForPolyline={this.setInfoWindowForPolyline}
                />
            </div>
        );
    }
}

DemoMap.defaultProps = {
    markers: [{ lat: 53.42728, lng: -6.24357 }, { lat: 43.681583, lng: -79.61146 }],
    center: [47.367347, 8.5500025],
    zoom: 4
};

export default DemoMap;
