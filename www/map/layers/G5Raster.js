import G5Layer from "./G5Layer.js";
import G5RasterVisualizer from "./raster-visualizers/G5RasterVisualizer.js";
import geoos from "lib/geoos.js";

class G5Raster extends G5Layer {
    get type() {return "raster"}
    get dataSet() {return this.config.dataSet}
    get variable() {return this.config.variable}

    get visualizers() {
        let ret = [];
        for (let id of Object.keys(this.config.visualizers || {})) {
            ret.push(this._visualizers[id])
        }
        ret.sort((v1, v2) => (v1.order > v2.order?1:-1));
        return ret;
    }
    get activeVisualizers() {return this.visualizers.filter(v => (v.active))}
    
    constructor(config) {
        super(config);
        this._nextVisualizerId = 1;
        this._visualizers = {};
        for (let id of Object.keys(this.config.visualizers || {})) {
            this._visualizers[id] = G5RasterVisualizer.createFromConfig(this, this.config.visualizers[id]);
        }
    }

    nextVisualizerId() {return this._nextVisualizerId++}

    async loadRasterGrid(mapa) {
        this.grid = await geoos.getRasterGrid(this.dataSet, this.variable, mapa.bounds, Date.now());
    }

    async initLayer(map) {
        for (let v of this.activeVisualizers) await v.activate();
        await this.refresh(map);
    }

    async moved(map) {
        await this.refresh(map);
    }

    async refresh(map) {
        await this.loadRasterGrid(map);
        let layers = [];
        for (let v of this.activeVisualizers) {
            let vLayers = await v.getDeckLayers(map);
            if (vLayers) {
                if (Array.isArray(vLayers)) layers.push(...vLayers);
                else layers.push(vLayers);                
            }
        }
        this.deckLayers = layers;
        map.refreshLayers();
    }
}

G5Layer.registerLayer("raster", G5Raster);
export default G5Raster;