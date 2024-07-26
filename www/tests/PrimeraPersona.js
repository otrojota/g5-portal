import { ZCustomController } from "zvc";

class PrimeraPersona extends ZCustomController {
    onThis_activated() {        
        let initialViewState = {
            position: [0, 0, 500],
            latitude: 37.75,
            longitude: -122.4,
            maxPitch: 60,
            pitch: 45,
            bearing: 0,
            zoom: 12
        };

        let layer0 = new deck.TileLayer({
            id: this.id,
            data: "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
            minZoom: 1,
            maxZoom: 19,
            tileSize: 256,
            opacity: 1,
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

        let initialLayer = new deck.ScatterplotLayer({
            id: 'scatter-plot',
            data: [
              { position: [-122.4, 37.74], size: 100 },
              { position: [-122.41, 37.75], size: 100 }
            ],
            getPosition: d => d.position,
            getRadius: d => d.size,
            getColor: d => [255, 0, 0]
        })

        this.deck = new deck.Deck({
            parent: this.view,
            //container: this.view,
            initialViewState,
            views:[new deck.FirstPersonView({fovy: 50, near: 1, far: 10000})],
            controller: true,
            layers: [],
            onViewStateChange: (e) => this.onViewStateChange(e)
        }); 
        setTimeout(_ => {
            this.deck.setProps({layers: [layer0, initialLayer]});
        }, 500); 
    }

    onViewStateChange(e) {
        console.log("e", e);
    }
}

export default PrimeraPersona;