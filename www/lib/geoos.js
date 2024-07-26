import {ZClient} from "lib/ZClient.js";

class GEOOS {
    static get instance() {
        if (this._singleton) return this._singleton;
        this._singleton = new GEOOS("https://geoserver.geoos.org");
        return this._singleton;
    }

    constructor(url) {
        this.url = url;
        this.zClient = new ZClient();
        this.zClient.pathPrefix = this.url + "/";
    }

    async init() {        
        this.metadata = await this.zClient.get("metadata");
        console.log("metadata", this.metadata);
    }
    
    /*
    getGeoJsonURL(dataSet, file) {
        return this.url + `/${dataSet}/${file}/geoJson`;
    }
    */
    async getGeoJson(dataSet, file) {
        let ds = this.metadata.dataSets.find(ds => (ds.code == dataSet));
        if (!ds) throw "No se encontró el dataSet " + dataSet;
        let f = ds.files.find(f => (f.name == file));
        if (!f) throw "No se encontró el file " + file + " en el dataSet " + dataSet;
        return await this.zClient.get(`${dataSet}/${file}/geoJson`);
    }
    async rasterQuery(dataSet, variable, query, params) {
        let url = `${dataSet}/${variable}/${query}`;
        return await this.zClient.get(url, params);
    }
    async getRasterGrid(dataSet, variable, bounds, time, dLat, dLng, margin) {
        let params = {n: bounds.n, w: bounds.w, s: bounds.s, e: bounds.e}
        if (time) params.time = time;
        if (dLat) params.dLat = dLat;
        if (dLng) params.dLng = dLng;
        if (margin) params.margin = margin;
        return await this.rasterQuery(dataSet, variable, "grid", params)
    }
}

export default GEOOS.instance;