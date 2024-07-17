import { ZCustomController } from "zvc";
import g5 from "../lib/g5.js";

class Map extends ZCustomController {
    onThis_init() {
        this.initialized = false;
        this.layers = [];
        g5.map = this;
        this.mapViewChangeListener = v => this.onMapViewChanged(v);
    }    

    onThis_activated() {
        this.viewState = {
            maxPitch: 120,
            longitude: -71.591886,
            latitude: -33.034553,
            zoom: 6,
            pitch: 20,
            bearing: 0,
            transitionDuration: 1000
        };

        this.deck = new deck.Deck({
            parent: this.view,
            initialViewState: this.viewState,
            views:[new deck.MapView()],
            //views: [new deck.FirstPersonView()],
            controller: true,
            layers: [],
            onViewStateChange: (e) => this.onViewStateChange(e)
        });  
        g5.on("mapViewChange", this.mapViewChangeListener);
    }

    onThis_deactivated() {
        g5.off("mapViewChange", this.mapViewChangeListener);
    }

    onMapViewChanged(v) {
        console.log("viewChange", v);
        if (v == "map") {
            this.viewState = {
                ...this.viewState,
                transitionDuration: 1000,
                transitionInterpolator: new deck.LinearInterpolator(['bearing', 'pitch']),
                pitch: 20,
                bearing: 0
            };
            this.deck.setProps({
                views: [new deck.MapView()],
                viewState: this.viewState,
                controller: true
            });
        } else if (v == "first-person") {
            this.viewState = {
                ...this.viewState,
                transitionDuration: 1000,
                transitionInterpolator: new deck.LinearInterpolator(['bearing', 'pitch']),
                pitch: 60,
                bearing: 0
            };
            this.deck.setProps({
                views: [new deck.FirstPersonView()],
                viewState: this.viewState,
                controller: true
            });
        } else {
            throw "Vista " + v + " no implementada";
        }
    }
    
    recalcBounds(viewState) {
        this.viewState = viewState;
        const vp =  new deck.WebMercatorViewport(viewState);
        let n = 90, w = -180, s = -90, e = 180;
        if (vp.pitch < 65) {
            const leftTop = vp.unproject([0,0]);
            const rightTop = vp.unproject([vp.width,0]);
            const leftBottom = vp.unproject([0, vp.height]);
            const rightBottom = vp.unproject([vp.width, vp.height]);
            // Por la rotación, cualquier esquina puede ser norte o sur, este o weste
            n = Math.max(leftTop[1], rightTop[1], leftBottom[1], rightBottom[1]);
            s = Math.min(leftTop[1], rightTop[1], leftBottom[1], rightBottom[1]);
            w = Math.min(leftTop[0], rightTop[0], leftBottom[0], rightBottom[0]);
            e = Math.max(leftTop[0], rightTop[0], leftBottom[0], rightBottom[0]);
            n = Math.max(-90, Math.min(n, 90));
            s = Math.max(-90, Math.min(s, 90));
            if (s > n) {let swap = n; n = s; s = swap;}
            w = Math.max(-180, Math.min(w, 180));
            e = Math.max(-180, Math.min(e, 180));
            if (w > e) {let swap = e; e = w; w = swap;}
        }

        this._bounds = {n,w,s,e}
        console.log("bounds", this._bounds, vp.pitch);
        return this._bounds;
    }
    get bounds() {return this._bounds}

    onViewStateChange({viewState}) {
        const oldB = this.bounds;
        const b = this.recalcBounds(viewState);
        if (!oldB || oldB.n != b.n || oldB.w != b.w || oldB.s != b.s || oldB.e != b.e) {
            g5.trigger("mapMoving", b);        
            if (this.moveTimer) clearTimeout(this.moveTimer);
            this.moveTimer = setTimeout(async _ => {
                if (this.initialized) {
                    let promises = [];
                    for (let l of this.layers) promises.push(l.moved(this));
                    await Promise.all(promises);
                    await g5.trigger("mapMoved", this.bounds);
                } else {
                    this.initialized = true;
                    await g5.trigger("mapInitialized", this);
                }
            }, 300); 
        }        
    }
    
    async addLayer(g5Layer) {
        if (!this.initialized) throw "Agrega Capa con Mapa no inicializado";
        this.layers.push(g5Layer);
        await g5Layer.initLayer(this);        
    }

    refreshLayers() {
        let layers = [];
        for (let l of this.layers) {
            layers.push(...l.deckLayers);
        }
        this.deck.setProps({layers})
    }
}

export default Map;