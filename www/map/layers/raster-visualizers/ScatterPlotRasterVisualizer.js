import G5RasterVisualizer from "./G5RasterVisualizer.js";

class ScatterPlotRasterVisualizer extends G5RasterVisualizer {
    get type() {return "scatter-plot"}
    get order() {return 0}

    get minRadius() {return this.config.minRadius === undefined?0.2:this.config.minRadius}
    set minRadius(r) {this.config.minRadius = r}
    get maxRadius() {return this.config.maxRadius === undefined?0.8:this.config.maxRadius}
    set maxRadius(r) {this.config.maxRadius = r}

    async getDeckLayers(map) {
        this.colorScale.refreshLimits(this.min, this.max);
        let cs = this.getCellSize();
        let cellSize = Math.min(cs.width, cs.height);
        let minRadius = cellSize * this.minRadius / 2;
        let maxRadius = cellSize * this.maxRadius / 2;
        return new deck.ScatterplotLayer({
            id: this.id,
            data: this.rasterLayer.grid.rows.flat(),
            getPosition: (d, {index}) => {
                const latIndex = parseInt(index / this.nCols);
                const lonIndex = index % this.nCols;
                const lat = this.lat0 + latIndex * this.dLat;
                const lng = this.lng0 + lonIndex * this.dLng;
                return [lng, lat];
            },            
            getRadius: d => minRadius + (maxRadius - minRadius) * (d - this.min) / (this.max - this.min),
            getFillColor: d => {
                let c = this.colorScale.getColor(d);
                //console.log("c", c);
                return c;
            },
            getLineColor: [0,0,0],
            getLineWidth: 100,
            opacity: this.opacity
        });
    }
}

G5RasterVisualizer.registerVisualizer("scatter-plot", ScatterPlotRasterVisualizer);
export default ScatterPlotRasterVisualizer;