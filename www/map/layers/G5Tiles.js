import G5Layer from "./G5Layer.js";

class G5Tiles extends G5Layer {
    get type() {return "tiles"}

    get url() {return this.config.url || "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png"}
    set url(u) {this.config.url = u}
    get minZoom() {return this.config.minZoom || 1}
    set minZoom(z) {this.config.minZoom = z}
    get maxZoom() {return this.config.maxZoom || 19}
    set maxZoom(z) {this.config.maxZoom = z}
    get tileSize() {return this.config.tileSize || 256}
    set tileSize(s) {this.config.tileSize = s} 

    async initLayer(mapa) {        
        loaders.registerLoaders(loaders.ImageLoader);
        this.refresh(mapa);
    }

    async refresh(mapa) {
        const deckLayer = new deck.TileLayer({
            id: this.id,
            data: this.url,
            minZoom: this.minZoom,
            maxZoom: this.maxZoom,
            tileSize: this.tileSize,
            opacity: this.opacity,
            renderSubLayers: props => {
                const {
                    bbox: { west, south, east, north }
                } = props.tile;      
                return new deck.BitmapLayer(props, {
                    data: null,
                    image: props.data,
                    bounds: [west, south, east, north]
                });
            }
        });
        this.deckLayers = deckLayer;
        mapa.refreshLayers();
    }    
}

G5Layer.registerLayer("tiles", G5Tiles);
export default G5Tiles;