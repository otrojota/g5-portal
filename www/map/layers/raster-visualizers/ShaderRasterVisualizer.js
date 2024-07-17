import G5RasterVisualizer from "./G5RasterVisualizer.js";
import ShaderLayer from "./deck-custom-layers/ShaderLayer.js";

class ShaderRasterVisualizer extends G5RasterVisualizer {
    get type() {return "shader"}
    get order() {return 5}
    
    get useElevation() {return this.config.useElevation}
    set useElevation(u) {this.config.useElevation = u}
    get elevationFactor() {return this.config.elevationFactor}
    set elevationFactor(f) {this.config.elevationFactor = f}
    get elevationAsMeters() {return this.config.elevationAsMeters}
    set elevationAsMeters(a) {this.config.elevationAsMeters = a}

    async getDeckLayers(map) {
        this.colorScale.refreshLimits(this.min, this.max);
        return new ShaderLayer({
            id: this.id,
            data: this.rasterLayer.grid,
            getColor: value => (this.getColor(value)),
            opacity: this.opacity,
            getElevation: value => {
                if (!this.useElevation) return 0;
                if (this.elevationAsMeters) {
                    return value * this.elevationFactor;
                } else {
                    return this.colorScale.normalizeValue(value) * this.elevationFactor;
                }
            }
        });
    }
}

G5RasterVisualizer.registerVisualizer("shader", ShaderRasterVisualizer);
export default ShaderRasterVisualizer;