import G5Layer from "./G5Layer.js";
import geoos from "lib/geoos.js";

class G5Vectorial extends G5Layer {
    get type() {return "vector"}
    get dataSet() {return this.config.dataSet}
    get file() {return this.config.file}
    

    async initLayer(mapa) {
        await this.loadGeoJson();
        this.refresh(mapa);
    }

    async loadGeoJson() {
        this.geoJson = await geoos.getGeoJson(this.dataSet, this.file);
    }
    
    async refresh(mapa) {
        const deckLayer = new deck.GeoJsonLayer({
            id: this.id,
            data: this.geoJson.geoJson.features,
            opacity: this.opacity,
            stroked: true,
            filled: true,
            pickable: true,
            getLineColor: [0,0,0,255],
            getLineWidth: 1,
            getLineWidthScale: 1,
            getFillColor: [160, 160, 180, 255],            
            pointType: 'circle+text',
            getPointRadius: 4,
            getText: f => f.properties.name,
            getTextSize: 12            
        });
        this.deckLayers = deckLayer;
        mapa.refreshLayers();
    }    
}

G5Layer.registerLayer("vector", G5Vectorial);
export default G5Vectorial;