import React, { Component } from 'react';
import ReactMapGL from 'react-map-gl';
import { fromJS } from 'immutable';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../css/Map.css';

import LayersMenu from './LayersMenu';
import Tray from './Tray';

//set up sources and styles for layers
import DefaultMapStyle  from '../layers/DefaultMapStyle';
import { WatchWarnTilesSource, WatchWarnTilesLayer} from '../layers/WatchWarnTiles';
import { RadarTilesSource, RadarTilesLayer } from '../layers/RadarTiles';

const layers = [WatchWarnTilesLayer].reduce((p,c) => {
    return p.insert(p.size, c);
},DefaultMapStyle.get('layers'));

const mapStyle = DefaultMapStyle
    .setIn(['sources', 'WatchWarnTilesSource'], WatchWarnTilesSource)
    .setIn(['sources', 'RadarTilesSource'], RadarTilesSource)
    .set('layers', layers);

const MAPBOX_TOKEN = "pk.eyJ1Ijoic2FzaGEtaGF2aWEiLCJhIjoiY2pkdGN3MW1hMHpzNDJ4bnk4NzBnOXVzeSJ9.9a0w0WPYRY4qJC0dDSUnKg";

class Map extends Component {
    state = {
        mapStyle,
        //set all layers with toggle to true
        layers: mapStyle.get('layers').filter(layer => layer.get('toggle'))
            .map(layer => layer.get('id'))
            .reduce((p,c) => {
                p[c] = true;
                return p;
            },{}),
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
            latitude: 40.7128,
            longitude: -74.0060,
            zoom: 8
        },
        watchwarn : [],
        bounds: []
    };

    componentDidMount() {
        const bound = this.mapRef.getMap().getBounds();
        const bounds = [bound._ne.lng, bound._ne.lat, bound._sw.lng, bound._sw.lat];
        this.setState({bounds});

        window.addEventListener('resize', this._resize);
        this._resize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resize);
    }

    //window resize
    _resize = () => {
        this.setState({
            viewport: {
                ...this.state.viewport,
                width: this.props.width || window.innerWidth,
                height: this.props.height || window.innerHeight
            }
        });
    };

    _onViewportChange = viewport => {
        //this.getWatchWarnInBound(viewport);
        this.setState({viewport});
    };


    //layers menu toggle
    updateVisibility = () => {
        let mapStyle = this.state.mapStyle;
        Object.keys(this.state.layers).map(id => {
            const visibility = this.state.layers[id];
            //get index of layer
            const layerIndex = mapStyle.get('layers').findIndex(layer => layer.get('id') === id);
            //update layout
            visibility ? mapStyle = mapStyle.setIn(['layers',layerIndex,'layout','visibility'], 'visible') : mapStyle = mapStyle.setIn(['layers',layerIndex,'layout','visibility'], 'none');
        })

        this.setState({ mapStyle });
    }

    _onLayerMenuClick = id => {
        //toggle layers visibility
        const layers = this.state.layers;
        layers[id] = !layers[id];
        this.setState({layers}, () => this.updateVisibility())
    }

    render(){
        return(
        <React.Fragment>
        <ReactMapGL
            ref={ map => this.mapRef = map }
            {...this.state.viewport}
            mapStyle={this.state.mapStyle}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            onViewportChange={this._onViewportChange}
        />
        <LayersMenu 
            layers={this.state.layers}
            onLayerMenuClick={this._onLayerMenuClick}
        />
        <Tray bounds={this.state.bounds}/>
        </React.Fragment>
        )
    }

}

export default Map;