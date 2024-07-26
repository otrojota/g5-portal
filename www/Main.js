import { ZCustomController } from "zvc";
import scales from "./lib/g5-scales.js";
import g5 from "./lib/g5.js";
import geoos from "lib/geoos.js";
import G5Layer from "./map/layers/G5Layer.js";

class Main extends ZCustomController {
    async onThis_init() {
        console.log("escalas", scales.getLibrary());        
        await geoos.init();
    }
    onThis_activated() {
        g5.on("mapInitialized", _ => {
            
            let l0 = G5Layer.newLayer("terrain", {opacity: 1});
            g5.map.addLayer(l0);
            
            /*            
            let l0 = G5Layer.newLayer("tiles", {tileSize: 256, opacity: 1, url: "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"});
            g5.map.addLayer(l0);            
            */   
            /*         
            let l0 = G5Layer.newLayer("tiles", {tileSize: 256, opacity: 1, url: "https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=sk.eyJ1Ijoib3Ryb2pvdGEiLCJhIjoiY2x6MWE1Y3cwMWl1NzJrcHJ0NWttcm1icSJ9.DqbaHy7kHa369ippq_uQNA"});
            g5.map.addLayer(l0);            
            */
            /*
            let l1 = G5Layer.newLayer("vector", {
                dataSet: "ine-regional", file: "comunas",
                opacity: 0.6
            });
            g5.map.addLayer(l1);        
            */
            
            let l1 = G5Layer.newLayer("vector", {
                dataSet: "subpesca-interes", file: "concesiones-acuicultura",
                opacity: 0.6
            });
            g5.map.addLayer(l1);        
            
            /*
            let l2 = G5Layer.newLayer("raster", {
                dataSet: "noaa-gfs4", variable: "TMP_2",
                opacity: 0.4,
                visualizers:{                    
                    "test1":{
                        type: "shader", active: true,
                        useElevation: false,
                        elevationFactor: 100000,
                        colorScale:{
                            name: "zeu - NASA OceanColor",
                            config: {minAuto: true, maxAuto: true}
                        }
                    }                                     
                }
            });
            g5.map.addLayer(l2);  
            */           
            
            /*
            let l3 = G5Layer.newLayer("raster", {
                dataSet: "gebco-bathymetry", variable: "BATHYMETRY",
                opacity: 1,
                visualizers:{
                    "test1":{
                        type: "shader", active: true,
                        useElevation: true,
                        elevationFactor: 10,
                        elevationAsMeters: true,
                        colorScale:{
                            name: "Agua -> Tierra",
                            config: {minAuto: true, maxAuto: true}
                        }
                    }                    
                }
            });
            g5.map.addLayer(l3);   
            */
            /*
            let l4 = G5Layer.newLayer("raster", {
                dataSet: "noaa-gfs4", variable: "PRES",
                opacity: 0.8,
                visualizers:{                    
                    "test1":{
                        type: "shader", active: true,
                        useElevation: false,
                        elevationFactor: 10000,
                        elevationAsMeters: true,
                        colorScale:{
                            name: "Magma - MatplotLib",
                            config: {minAuto: true, maxAuto: true}
                        }
                    },                    
                    "test2":{
                        type: "columns", active: true,
                        radius: 0.6,
                        elevationScale: 80000,
                        colorScale:{
                            name: "zeu - NASA OceanColor",
                            config: {minAuto: true, maxAuto: true}                            
                        }
                    }                
                }
            });
            g5.map.addLayer(l4); 
            */
        })
    }
}

export default Main;