import G5RasterVisualizer from "./G5RasterVisualizer.js";
import ParticleLayer from "./deck-custom-layers/ParticleLayer.js";

class ParticlesRasterVisualizer extends G5RasterVisualizer {
    get type() {return "particles"}
    get order() {return 15}
    
    async getDeckLayers(map) {
        let box = this.grid.foundBox;
        console.log("usando box", box);
        return new ParticleLayer({
            id: this.id,
            image: {width: 4, height: 2, data: new Uint8Array([10,20,20,10,10,20,20,10])},
            imageUnscale:[-128, 127],
            bounds: [box.lng0, box.lat0, box.lng1, box.lat1],
            opacity: this.opacity,
            numParticles: 5000,
            maxAge: 10,
            speedFactor: 3,
            color: [255, 255, 255],
            width: 2,
            animate: true
        });
    }
}

G5RasterVisualizer.registerVisualizer("particles", ParticlesRasterVisualizer);
export default ParticlesRasterVisualizer;