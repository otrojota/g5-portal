class G5Scale {
    static registerScale(e) {
        if (!G5Scale.library) G5Scale.library = [];
        G5Scale.library.push(e);
    }
    static getLibrary() {
        return G5Scale.library;
    }
    static byName(name, config, urlPrepend) {
        let baseConfig = G5Scale.getLibrary().find(e => e.nombre == name);
        if (!baseConfig) throw "No se encontró la escala '" + name + "'";
        for (let key of Object.keys(config || {})) {
            baseConfig[key] = config[key];
        }
        return G5Scale.createFromConfig(baseConfig, urlPrepend);
    }
    static createFromConfig(config, urlPrepend) {
        if (!urlPrepend) {
            let baseURL = window.location.origin + window.location.pathname;
            if (baseURL.endsWith("/")) baseURL = baseURL.substring(0, baseURL.length - 1);
            urlPrepend = baseURL;
        }
        if (config.type == "hsl") {
            let scale = new LinealHSL(config);
            return scale;
        } else if (config.type == "transparente") {
            let scale = new Transparente(config);
            return scale;
        } else if (config.type == "esquemaPG") {
            let scale = new EsquemaPG(config, urlPrepend);
            return scale;
        } else if (config.type == "agua-tierra") {
            let scale = new AguaTierra(config);
            return scale;
        } else if (config.type == "color-fijo-negro") {
            let scale = new Negro(config);
            return scale;
        } else if (config.type == "color-fijo-blanco") {
            let scale = new Blanco(config);
            return scale;
        } else if (config.type == "color-fijo-rojo") {
            let scale = new Rojo(config);
            return scale;
        } else if (config.type == "color-fijo-verde") {
            let scale = new Verde(config);
            return scale;
        } else if (config.type == "color-fijo-azul") {
            let scale = new Azul(config);
            return scale;
        } else if (config.type == "scale-rangos") {
            let scale = new scaleRangos(config);
            return scale;
        }
        throw "Escala '" + config.type + "' no implementada";
    }

    constructor(config) {
        this.config = config;
        //this.dinamica = config.dinamica;
        //this.bloqueada = config.bloqueada;
        this.min = this.fixedMin;
        this.max = this.fixedMax;     
    }
    get minAuto() {return this.config.minAuto}
    set minAuto(m) {this.config.minAuto = m}
    get maxAuto() {return this.config.maxAuto}
    set maxAuto(m) {this.config.maxAuto = m}
    get minClip() {return this.config.minClip}
    set minClip(c) {this.config.minClip = c}
    get maxClip() {return this.config.maxClip}
    set maxClip(c) {this.config.maxClip = c}
    get fixedMin() {return this.config.fixedMin}
    set fixedMin(m) {this.config.fixedMin = m}
    get fixedMax() {return this.config.fixedMax}
    set fixedMax(m) {this.config.fixedMax = m}

    async init() {return this}
    refreshLimits(min, max) {
        if (this.minAuto) this.min = min;
        if (this.maxAuto) this.max = max;
    }
    getColor(valor) {}
    getClippedColor(valor) {
        if (this.minClip && valor < this.fixedMin) return [0,0,0,0];
        if (this.maxClip && valor > this.fixedMax) return [0,0,0,0];
        return this.getColor(valor);
    }
    normalizeValue(valor) {
        let v = (valor - this.min) / (this.max - this.min);
        if (v <0) v = 0;
        if (v > 1) v = 1;
        return v;
    }
}

class LinealHSL extends G5Scale{
    constructor(config) {
        super(config);
    }    
    getColor(valor) {
        let color = "red";
        if (valor !== undefined && this.min < this.max) {
            let v = (valor - this.min) / (this.max - this.min);
            if (v < 0) v = 0;
            if (v > 1) v = 1;
            let r = Math.round(v * 255);
            let g = Math.round((1 - v) * 255);            
            color = [r,g,0]
        }
        return color;
    }
}

class EsquemaURL extends G5Scale {
    constructor(config, urlPrepend) {
        super(config);
        this.urlPrepend = urlPrepend;
    }

    init() {
        return new Promise((resolve, reject) => {
            fetch((this.urlPrepend?this.urlPrepend:"") + this.config.url).then(r => {
                r.text().then(txt => {
                    this.parseaEsquema(txt)
                    resolve(this);                
                });
            }).catch(error => reject(error));
        })
    }
    getColor(valor) {
        let v;
        if (this.min == this.max) v = 0;
        else v = (valor - this.min) / (this.max - this.min);        
        if (v < 0) v = 0;
        if (v > 1) v = 1;
        let i = parseInt(this.rangos.length / 2);
        return this.busquedaBinaria(v, i, 0, this.rangos.length - 1);
    }
    busquedaBinaria(v, i, i0, i1) {        
        let r = this.rangos[i];
        if (v >= r.min && v <= r.max || (i1 - i0) <= 1) return r.color;
        if (v < r.min) {
            let newI = parseInt(i0 + (i - i0) / 2);
            if (newI == i) {
                console.error("Error en búsqueda binaria .. rango menor inválido");
                return r.color;
            }
            return this.busquedaBinaria(v, newI, i0, i-1);
        } else if (v >= r.max) {
            let newI = i + (i1 - i) / 2;
            if (newI != parseInt(newI)) newI = 1 + parseInt(newI);
            if (newI == i) {
                console.error("Error en búsqueda binaria .. rango mayor inválido");
                return r.color;
            }
            return this.busquedaBinaria(v, newI, i+1, i1);
        } else if (isNaN(v)) {
            return null;
        } else {
            console.error("Error en búsqueda binaria .. condición no manejada", r, v);
            return r.color;
        }
    }
}

class EsquemaPG extends EsquemaURL {
    constructor(config, urlPrepend) {
        super(config, urlPrepend);
    }
    
    parseaEsquema(txt) {
        let rangos = [];
        let lines = txt.split("\n");
        let l1 = undefined;
        for (let i=0; i<lines.length; i++) {
            let campos = lines[i].split(" ").reduce((campos, v) => {
                if (v) campos.push(parseFloat(v));
                return campos;
            }, []);
            if (l1 === undefined) l1 = campos[0] + 0.0001;
            if (campos.length) {
                rangos.push({min:campos[0], max:l1, color:[campos[1], campos[2], campos[3]]})
                l1 = campos[0];
            }
        }
        rangos.sort((r1, r2) => (r1.min - r2.min));
        let limites = rangos.reduce((acum, r) => {
            if (acum.min === undefined || r.min < acum.min) acum.min = r.min;
            if (acum.max === undefined || r.max > acum.max) acum.max = r.max;
            return acum;
        }, {min:undefined, max:undefined});
        let rangoTotal = limites.max - limites.min;
        rangos = rangos.map(r => ({
            min:(r.min - limites.min) / rangoTotal,
            max:(r.max - limites.min) / rangoTotal,
            color:r.color
        }))
        this.rangos = rangos;
    }
    
}


class Transparente extends G5Scale {
    constructor(config) {
        super(config);
        this.valorCorte = config.valorCorte || 0;
        this.color = config.color || [255,255,255];
    }    
    getColor(valor) {
        if (valor < this.valorCorte) return [0,0,0,0];
        let d = this.max - this.valorCorte;
        if (d <= 0) d = 0.01;
        let p = (valor - this.valorCorte) / d;
        let r = this.color[0];
        let g = this.color[1];
        let b = this.color[2];
        let a = p;
        return [r, g, b, a]
    }
}

class AguaTierra extends G5Scale {
    constructor(config) {
        super(config);
        this.coloresAgua = [[1, 36, 92], [2, 86, 222]];
        this.coloresTierra = [[135, 71, 3], [245, 128, 2]];
    }    
    getColor(valor) {
        let r, g, b;
        if (Math.abs(valor) < 0.001) {
            r = this.coloresTierra[0][0];
            g = this.coloresTierra[0][1];
            b = this.coloresTierra[0][2];
        } else if (valor < 0) {
            let f = (valor - this.min) / (-this.min);
            r = (1-f) * this.coloresAgua[0][0] + f * this.coloresAgua[1][0];
            g = (1-f) * this.coloresAgua[0][1] + f * this.coloresAgua[1][1];
            b = (1-f) * this.coloresAgua[0][2] + f * this.coloresAgua[1][2];
        } else {
            let f = valor / this.max;
            r = (1-f) * this.coloresTierra[0][0] + f * this.coloresTierra[1][0];
            g = (1-f) * this.coloresTierra[0][1] + f * this.coloresTierra[1][1];
            b = (1-f) * this.coloresTierra[0][2] + f * this.coloresTierra[1][2];
        }        
        return [r,g,b]
    }    
}

class ColorFijo extends G5Scale{
    constructor(config) {
        super(config);
        this.color = config.color;
    }    
    getColor(valor) {
        if (valor === undefined || valor === null || valor < this.min || valor > this.max) return [0,0,0,0];
        return this.color;
    }
    refreshPreview(div) {
        div[0].style.removeProperty("background-image");
        div.css({"background-color":this.color})
    }
}
class Negro extends ColorFijo {
    constructor(config) {super({color:[0,0,0]})}
}
class Blanco extends ColorFijo {
    constructor(config) {super({color:[255,255,255]})}
}
class Azul extends ColorFijo {
    constructor(config) {super({color:[0,0,255]})}
}
class Rojo extends ColorFijo {
    constructor(config) {super({color:[255,0,0]})}
}
class Verde extends ColorFijo {
    constructor(config) {super({color:[0,255,0]})}
}

class scaleRangos extends G5Scale {
    constructor(config) {
        super(config);
        let minRef = config.min || 0;
        let maxRef = config.max || 1;
        this.rangos = [];
        for (let i=0; i<(config.rangos.length - 1); i++) {
            let r0 = config.rangos[i];
            let r1 = config.rangos[i+1];
            this.rangos.push({
                min:(r0[0] - minRef) / (maxRef - minRef),
                max:(r1[0] - minRef) / (maxRef - minRef),
                color:config.rangos[i][1]
            })
        }
        this.min = minRef;
        this.max = maxRef;
    }

    init() {return this}
    getColor(valor) {
        let v;
        if (this.min == this.max) v = 0;
        else v = (valor - this.min) / (this.max - this.min);
        if (this.config.ajustarALimites) {
            if (v < 0) v = 0;
            if (v > 1) v = 1;
        } else {
            if (v < 0 || v > 1) return [0,0,0,0];
        }
        let i = parseInt(this.rangos.length / 2);
        return this.busquedaBinaria(v, i, 0, this.rangos.length - 1);
    }
    busquedaBinaria(v, i, i0, i1) {        
        let r = this.rangos[i];
        if (v >= r.min && v <= r.max || (i1 - i0) <= 1) return r.color;
        if (v < r.min) {
            let newI = parseInt(i0 + (i - i0) / 2);
            if (newI == i) {
                console.error("Error en búsqueda binaria .. rango menor inválido");
                return r.color;
            }
            return this.busquedaBinaria(v, newI, i0, i-1);
        } else if (v >= r.max) {
            let newI = i + (i1 - i) / 2;
            if (newI != parseInt(newI)) newI = 1 + parseInt(newI);
            if (newI == i) {
                console.error("Error en búsqueda binaria .. rango mayor inválido");
                return r.color;
            }
            return this.busquedaBinaria(v, newI, i+1, i1);
        } else if (isNaN(v)) {
            return null;
        } else {
            console.error("Error en búsqueda binaria .. condición no manejada", r, v);
            return r.color;
        }
    }
}

G5Scale.registerScale({type:"esquemaPG", url:"/lib/scales-pg/nasa-oc-sst.pg", nombre:"sst - NASA OceanColor"});
G5Scale.registerScale({type:"esquemaPG", url:"/lib/scales-pg/nasa-oc-rainbow.pg", nombre:"rainbow - NASA OceanColor"});
G5Scale.registerScale({type:"esquemaPG", url:"/lib/scales-pg/nasa-oc-zeu.pg", nombre:"zeu - NASA OceanColor"});
G5Scale.registerScale({type:"esquemaPG", url:"/lib/scales-pg/nasa-oc-ndvi.pg", nombre:"ndvi - NASA OceanColor"});
G5Scale.registerScale({type:"esquemaPG", url:"/lib/scales-pg/matplot-lib-inferno.pg", nombre:"Inferno - MatplotLib"});
G5Scale.registerScale({type:"esquemaPG", url:"/lib/scales-pg/matplot-lib-magma.pg", nombre:"Magma - MatplotLib"});
G5Scale.registerScale({type:"esquemaPG", url:"/lib/scales-pg/matplot-lib-plasma.pg", nombre:"Plasma - MatplotLib"});
G5Scale.registerScale({type:"esquemaPG", url:"/lib/scales-pg/matplot-lib-viridis.pg", nombre:"Viridis - MatplotLib"});
G5Scale.registerScale({type:"esquemaPG", url:"/lib/scales-pg/uk-met-office-temp.pg", nombre:"Temp - UK Met Office"});
G5Scale.registerScale({type:"esquemaPG", url:"/lib/scales-pg/saga-01.pg", nombre:"SAGA - 01"});
G5Scale.registerScale({type:"esquemaPG", url:"/lib/scales-pg/saga-04.pg", nombre:"SAGA - 04"});
G5Scale.registerScale({type:"esquemaPG", url:"/lib/scales-pg/saga-05.pg", nombre:"SAGA - 05"});
G5Scale.registerScale({type:"esquemaPG", url:"/lib/scales-pg/saga-12.pg", nombre:"SAGA - 12"});
G5Scale.registerScale({type:"esquemaPG", url:"/lib/scales-pg/saga-16.pg", nombre:"SAGA - 16"});
G5Scale.registerScale({type:"esquemaPG", url:"/lib/scales-pg/saga-17.pg", nombre:"SAGA - 17"});
G5Scale.registerScale({type:"hsl", nombre:"HSL Lineal Simple"});
G5Scale.registerScale({type:"transparente", nombre:"Transparencia Lineal"});
G5Scale.registerScale({type:"agua-tierra", nombre:"Agua -> Tierra"});
G5Scale.registerScale({type:"color-fijo-negro", nombre:"Color Fijo: Negro"});
G5Scale.registerScale({type:"color-fijo-blanco", nombre:"Color Fijo: Blanco"});
G5Scale.registerScale({type:"color-fijo-rojo", nombre:"Color Fijo: Rojo"});
G5Scale.registerScale({type:"color-fijo-verde", nombre:"Color Fijo: Verde"});
G5Scale.registerScale({type:"color-fijo-azul", nombre:"Color Fijo: Azul"});
G5Scale.registerScale({
    yype:"scale-rangos", nombre:"Open Weather - Classic Rain",
    ajustarALimites:true,
    min:0, max:140, unidad:"mm",
    rangos:[
        [0, [225, 200, 100, 0]],
        [0.1, [200, 150, 150, 0]],
        [0.2, [150, 150, 170, 0]],
        [0.5, [120, 120, 190, 0]],
        [1, [110, 110, 205, 0.3 * 255]],
        [140, [20, 20, 255, 0.9 * 255]]
    ]
});
G5Scale.registerScale({
    yype:"scale-rangos", nombre:"Open Weather - Classic Clouds",
    ajustarALimites:true,
    min:0, max:100, unidad:"%",
    rangos:[
        [0,   [255, 255, 255, 0.0]],
        [10,  [253, 253, 255, 0.1 * 255]],
        [20,  [252, 251, 255, 0.2 * 255]],
        [30,  [250, 250, 255, 0.3 * 255]],
        [40,  [249, 248, 255, 0.4 * 255]],
        [50,  [247, 247, 255, 0.5 * 255]],
        [60,  [246, 245, 255, 0.75 * 255]],
        [70,  [244, 244, 255, 1 * 255]],
        [80,  [243, 242, 255, 1 * 255]],
        [90,  [242, 241, 255, 1 * 255]],
        [100, [240, 240, 255, 1 * 255]]
    ]
});
G5Scale.registerScale({
    yype:"scale-rangos", nombre:"Open Weather - Temperature",
    ajustarALimites:true,
    min:-65, max:30, unidad:"ºF",
    rangos:[
        [-65, [130, 22, 146, 1 * 255]],
        [-55, [130, 22, 146, 1 * 255]],
        [-45, [130, 22, 146, 1 * 255]],
        [-40, [130, 22, 146, 1 * 255]],
        [-30, [130, 87, 219, 1 * 255]],
        [-20, [32, 140, 236, 1 * 255]],
        [-10, [32, 196, 232, 1 * 255]],
        [0,   [35, 221, 221, 1 * 255]],
        [10,  [194, 255, 40, 1 * 255]],
        [20,  [255, 240, 40, 1 * 255]],
        [25,  [255, 194, 40,1 * 255]],
        [30,  [252, 128, 20, 1 * 255]]
    ]
});
G5Scale.registerScale({
    yype:"scale-rangos", nombre:"Open Weather - Pressure",
    ajustarALimites:true,
    min:94000, max:108000, unidad:"Pa",
    rangos:[
        [94000, [0,115,255,1 * 255]],
        [96000, [0,170,255,1 * 255]],
        [98000, [75,208,214,1 * 255]],
        [100000, [141,231,199,1 * 255]],
        [101000, [176,247,32,1 * 255]],
        [102000, [240,184,0,1 * 255]],
        [104000, [251,85,21,1 * 255]],
        [106000, [243,54,59,1 * 255]],
        [108000, [198,0,0,1 * 255]]
    ]
});
G5Scale.registerScale({
    yype:"scale-rangos", nombre:"Open Weather - Wind",
    ajustarALimites:true,
    min:0, max:200, unidad:"m/s",
    rangos:[
        [1, [255,255,255, 0]],
        [5, [238,206,206, 0.4 * 255]],
        [15, [179,100,188, 0.7 * 255]],
        [25, [63,33,59, 0.8 * 255]],
        [50, [116,76,172, 0.9 * 255]],
        [100, [70,0,175,1 * 255]],
        [200, [13,17,38,1 * 255]]
    ]
});

export default G5Scale;