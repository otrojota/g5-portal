import {
     Deck,
     Layer, TerrainLayer, TileLayer, ScatterplotLayer, BitmapLayer, GeoJsonLayer, ColumnLayer,
     LineLayer, 
     WebMercatorViewport,
     FirstPersonView, _GlobeView, MapView,
     project32, picking
 } from 'deck.gl';

import { load, registerLoaders } from '@loaders.gl/core';
import { CSVLoader } from '@loaders.gl/csv';
import { ImageLoader } from '@loaders.gl/images';
import { TerrainLoader } from '@loaders.gl/terrain';
import { log } from '@luma.gl/gltools';
import { Geometry, Model } from '@luma.gl/engine';
import { isWebGL2 } from '@luma.gl/gltools';
import { Buffer } from '@luma.gl/core';

//registerLoaders([ImageLoader, TerrainLoader]);

const deck = {
    // deck.gl
    Deck, 
    Layer, TerrainLayer, TileLayer, ScatterplotLayer, BitmapLayer, GeoJsonLayer, ColumnLayer,
    LineLayer,
    WebMercatorViewport,
    FirstPersonView, _GlobeView,
    project32, picking,
    // deck.gl/core
    MapView
};

const luma = {
    load, registerLoaders,
    Geometry, Model, log, Buffer
}

const loaders = {
    registerLoaders,
    CSVLoader, ImageLoader, TerrainLoader    
}

window.deck = deck;
window.luma = luma;
window.loaders = loaders;
window.isWebGL2 = isWebGL2;

export default deck;