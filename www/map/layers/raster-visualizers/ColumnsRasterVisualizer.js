import G5RasterVisualizer from "./G5RasterVisualizer.js";

class ColumnsRasterVisualizer extends G5RasterVisualizer {
    get type() {return "columns"}
    get order() {return 10}

    get diskResolution() {return this.config.diskResolution || 12}
    set diskResolution(r) {this.config.diskResolution = r}
    get elevationScale() {return this.config.elevationScale || 30000}
    set elevationScale(s) {this.config.elevationScale = s}
    get radius() {return this.config.radius || 0.3}
    set radius(r) {this.config.radius = r}

    async getDeckLayers(map) {
        this.colorScale.refreshLimits(this.min, this.max);
        let cs = this.getCellSize();
        let cellSize = Math.min(cs.width, cs.height);
        let radius = cellSize * this.radius / 2;
        return new deck.ColumnLayer({
            id: this.id,
            data: this.rasterLayer.grid.rows.flat(),
            diskResolution: this.diskResolution,
            extruded: true,
            radius,
            opacity: this.opacity,
            elevationScale: this.elevationScale,
            getElevation: d => (d - this.min) / (this.max - this.min),
            getFillColor: d => this.colorScale.getColor(d),
            getPosition: (d, {index}) => {
                const latIndex = parseInt(index / this.nCols);
                const lonIndex = index % this.nCols;
                const lat = this.lat0 + latIndex * this.dLat;
                const lng = this.lng0 + lonIndex * this.dLng;
                return [lng, lat];
            }
        });
    }
}

G5RasterVisualizer.registerVisualizer("columns", ColumnsRasterVisualizer);
export default ColumnsRasterVisualizer;