import G5Layer from "./G5Layer.js";

luma.log.level = 0;

class G5Terrain extends G5Layer {
    get type() {return "tiles"}

    //get texture() {return this.config.texture || "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png"}
    //get texture() {return this.config.texture || "https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=PeNPF84IaVSOdKnUHWZB"}
    //get texture() {return this.config.texture || "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"}
    get texture() {return this.config.texture || "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=sk.eyJ1Ijoib3Ryb2pvdGEiLCJhIjoiY2x6MWE1Y3cwMWl1NzJrcHJ0NWttcm1icSJ9.DqbaHy7kHa369ippq_uQNA"}
    set texture(u) {this.config.texture = u}    
    //get elevationData() {return this.config.elevationData || "https://opentopomap.org/{z}/{x}/{y}.png"}
    get elevationData() {return this.config.elevationData || "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png"}
    //get elevationData() {return this.config.elevationData || "https://api.maptiler.com/tiles/terrain-rgb-v2/{z}/{x}/{y}.webp?key=PeNPF84IaVSOdKnUHWZB"}
    //get elevationData() {return this.config.elevationData || "https://elevation.arcgis.com/arcgis/rest/services/WorldElevation/Terrain/ImageServer/tile/{z}/{y}/{x}"}
    //get elevationData() {return this.config.elevationData || "https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=sk.eyJ1Ijoib3Ryb2pvdGEiLCJhIjoiY2x6MWE1Y3cwMWl1NzJrcHJ0NWttcm1icSJ9.DqbaHy7kHa369ippq_uQNA"}
    set elevationData(u) {this.config.elevationData = u}
    get minZoom() {return this.config.minZoom || 1}
    set minZoom(z) {this.config.minZoom = z}
    get maxZoom() {return this.config.maxZoom || 19}
    set maxZoom(z) {this.config.maxZoom = z}
    get elevationDecoder() {return this.config.elevationDecoder || {rScaler: 256, gScaler: 1, bScaler: 1/256, offset: -32768}}
    //get elevationDecoder() {return this.config.elevationDecoder || {rScaler: 256, gScaler: 1, bScaler: 1/256, offset: -32768}}
    //get elevationDecoder() {return this.config.elevationDecoder || {rScaler: 6553.6, gScaler: 25.6, bScaler: 0.1, offset: -10000}}
    set elevationDecoder(z) {this.config.elevationDecoder = z}
    

    async initLayer(mapa) {        
        loaders.registerLoaders(loaders.ImageLoader);
        //loaders.registerLoaders(loaders.TerrainLoader);
        this.refresh(mapa);
    }

    async refresh(mapa) {
        const deckLayer = new deck.TerrainLayer({
            id: this.id,
            minZoom: this.minZoom,
            maxZoom: this.maxZoom,
            opacity: this.opacity,
            meshMaxError: 4.0,
            strategy: 'no-overlap',
            elevationDecoder: this.elevationDecoder,
            elevationData: this.elevationData,
            texture: this.texture,
            material: {
                ambient: 0.4,
                diffuse: 0.6,
                shininess: 32,
                specularColor: [30, 30, 30]
            },
            //loaders:[loaders.TerrainLoader]
        });
        this.deckLayers = deckLayer;
        mapa.refreshLayers();
    }    
}

G5Layer.registerLayer("terrain", G5Terrain);
export default G5Terrain;