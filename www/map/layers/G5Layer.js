import g5 from "lib/g5.js";

class G5Layer {
    static _nextId = 1;
    static _registeredLayers = {};    

    static nextId() {return G5Layer._nextId++}
    static registerLayer(type, _class) {
        G5Layer._registeredLayers[type] = _class
    }
    static newLayer(type, config) {
        let _class = G5Layer._registeredLayers[type];
        if (!_class) throw "Tipo de capa " + type + " no registrada";
        return new _class(config);
    }
            
    constructor(config) {
        this._config = config;
        if (!this.id) this.id = this.type + "_" + G5Layer.nextId();
        this._deckLayers = [];
        this._working = false;
    }

    get config() {return this._config}
    set config(c) {this._config = c}
    get id() {return this.config.id}
    set id(id) {this.config.id = id}
    get deckLayers() {return this._deckLayers}
    set deckLayers(l) {
        if (!l) this._deckLayers = [];
        else if (Array.isArray(l)) this._deckLayers = l;
        else this._deckLayers = [l];
    }
    get name() {return this.config.name}
    get opacity() {return this.config.opacity === undefined?1:this.config.opacity}
    set opacity(o) {this.config.opacity = o}

    nextId() {return G5Layer.nextId}

    get type() {throw 'Propiedad type no sobre escrita'}
    async initLayer(mapa) {}
    async moved(mapa) {}

    async startWorking() {
        await g5.trigger("layerStartWorking", this);
    }
    async stopWorking() {
        await g5.trigger("layerStopWorking", this);
    }
    async triggerError(error) {
        await g5.trigger("layerError", this, error);
    }
}

// Autoregistro de capas
import("./G5Tiles.js");
import("./G5Vectorial.js");
import("./G5Raster.js");
import("./G5Terrain.js");

export default G5Layer;