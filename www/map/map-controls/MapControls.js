import { ZCustomController } from "zvc";
import g5 from "lib/g5.js";

class MapControls extends ZCustomController {
    async onCmdViewFirstPerson_click() {
        await g5.setMapView("first-person");
    }
    async onCmdViewMap_click() {
        await g5.setMapView("map");
    }
    async onCmdViewGlobe_click() {
        await g5.setMapView("globe");
    }
}

export default MapControls