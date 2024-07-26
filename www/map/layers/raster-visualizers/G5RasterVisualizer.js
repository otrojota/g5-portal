import G5Scale from "lib/g5-scales.js";

class G5RasterVisualizer {
    static _registeredVisualizers = {}
    static createFromConfig(rasterLayer, config) {
        let type = config.type;
        let _class = G5RasterVisualizer._registeredVisualizers[type];
        if (!_class) throw "No hay visualizador registrado para el tipo " + type;
        return new _class(rasterLayer, config);
    }
    static registerVisualizer(type, _class) {
        G5RasterVisualizer._registeredVisualizers[type] = _class;
    }

    constructor(rasterLayer, config) {
        this._rasterLayer = rasterLayer;
        this._config = config;
        if (!this.id) this.id = this.type + "_" + rasterLayer.nextVisualizerId();
        if (config.colorScale) this.colorScale = G5Scale.byName(config.colorScale.name, config.colorScale.config);
    }

    async activate() {
        if (this.colorScale) await this.colorScale.init();
    }
    async deactivate() {}

    get rasterLayer() {return this._rasterLayer}
    set rasterLayer(l) {this._rasterLayer = l}
    get config() {return this._config}
    set config(c) {this._config = c}
    get id() {return this.config.id}
    set id(id) {this.config.id = id}
    get active() {return this.config.active}
    set active(a) {this.config.active = a}
    get name() {return this.config.name}
    set name(n) {this.config.name = n}
    get grid() {return this.rasterLayer.grid}
    get lat0() {return this.grid.foundBox.lat0}
    get lng0() {return this.grid.foundBox.lng0}
    get dLat() {return this.grid.foundBox.dLat}
    get dLng() {return this.grid.foundBox.dLng}
    get nCols() {return this.grid.ncols}
    get nRows() {return this.grid.nrows}
    get min() {return this.grid.min}
    get max() {return this.grid.max}
    get colorScale() {return this._colorScale}
    set colorScale(s) {this._colorScale = s}
    get opacity() {return this.rasterLayer.opacity}
    
    get type() {throw "type no sobreescrito para raster visualizer"}
    get order() {return 0} // drawing order from bottom to top   

    // Utiles
    getCellSize() {
        // Distancia en metros al centro de la grilla
        if (!this.grid || !this.nRows || !this.nCols) return {width:0, height:0}
        let iRow = parseInt(this.nRows / 2);
        let iCol = parseInt(this.nCols / 2);
        let lat0 = this.lat0 + this.dLat * iRow, lat1 = lat0 + this.dLat;
        let lng0 = this.lng0 + this.dLng * iCol, lng1 = lng0 + this.dLng;
        let width = turf.distance(turf.point([lng0, lat0]), turf.point([lng1, lat0]), {units: "meters"});
        let height = turf.distance(turf.point([lng0, lat0]), turf.point([lng0, lat1]), {units: "meters"});
        return {width, height}
    }
    getColor(value, lat, lng) {
        let cs = this.colorScale;
        if (!cs) return [0,0,0,0];
        let color = cs.getClippedColor(value);
        if (!Array.isArray(color)) throw "Color " + color + " no es arreglo retornado por escala " + cs;
        if (color.length < 4) color.push(255);
        return color;
    }
    async getDeckLayers(map) {return []}    
}

// Autoregistro de Visualizers
import("./ColumnsRasterVisualizer.js");
import("./ScatterPlotRasterVisualizer.js");
import("./ShaderRasterVisualizer.js");
import("./ParticlesRasterVisualizer.js");
export default G5RasterVisualizer;