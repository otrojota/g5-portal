class G5 {
    static get instance() {
        if (G5._singleton) return G5._singleton;
        G5._singleton = new G5();
        return G5._singleton;
    }

    get mapa() {return this._mapa}
    set mapa(m) {this._mapa = m}

    get mapView() {return this._mapView || "map"}
    async setMapView(v) {
        this._mapView = v;
        await this.trigger("mapViewChange", v);
    }

    on(evento, listener) {
        if (!this._listeners) this._listeners = {};
        let listenersEvento = this._listeners[evento];
        if (!listenersEvento) {
            listenersEvento = [];
            this._listeners[evento] = listenersEvento;
        }
        listenersEvento.push(listener);
    }
    off(evento, listener) {
        if (!this._listeners) this._listeners = {};
        let listenersEvento = this._listeners[evento];
        if (!listenersEvento) {
            listenersEvento = [];
            this._listeners[evento] = listenersEvento;
        }
        let idx = listenersEvento.indexOf(listener);
        if (idx >= 0) listenersEvento.splice(idx, 1);
        else console.warn("Listener not found to remove in event " + evento);
    }

    async trigger(evento, data) {
        if (!this._listeners) this._listeners = {};
        let listenersEvento = this._listeners[evento];
        for (let l of (listenersEvento || [])) {
            let ret = l(data);
            if (ret instanceof Promise) await ret;
        }
    }

    // Interpolation
    interpolate(lat, lng, box, rows, nCols, nRows) {
        // https://en.wikipedia.org/wiki/Bilinear_interpolation                    
        if (lat < box.lat0 || lat > box.lat1 || lng < box.lng0 || lng > box.lng1) return null;
        let i = parseInt((lng - box.lng0) / box.dLng);
        let j = parseInt((lat - box.lat0) / box.dLat);
        if (i >= (nCols - 1) || j >= (nRows - 1)) return null;
        let x0 = box.lng0 + box.dLng*i;
        let x = (lng - x0) / box.dLng;
        let y0 = box.lat0 + box.dLat*j;
        let y = (lat - y0) / box.dLat;
        let rx = 1 - x, ry = 1 - y;

        let z00 = rows[j][i], z10 = rows[j][i+1], z01 = rows[j+1][i], z11 = rows[j+1][i+1];
        if (z00 == null || z10 == null || z01 == null || z11 == null) {
            // Usar promedio simple
            let sum=0, n=0;
            if (z00 !== null) {sum += z00; n++;}
            if (z10 !== null) {sum += z10; n++;}
            if (z01 !== null) {sum += z01; n++;}
            if (z11 !== null) {sum += z11; n++;}
            if (n) return sum / n;
            return null;
        }
        return z00*rx*ry + z10*x*ry + z01*rx*y + z11*x*y;
    }
    interpolateVector(lat, lng, box, rowsU, rowsV, nCols, nRows) {
        // https://en.wikipedia.org/wiki/Bilinear_interpolation
        if (lat <= box.lat0 || lat >= box.lat1 || lng <= box.lng0 || lng >= box.lng1) return null;
        let i = parseInt((lng - box.lng0) / box.dLng);
        let j = parseInt((lat - box.lat0) / box.dLat);
        if (i >= (nCols - 1) || j >= (nRows - 1)) return;
        let x0 = box.lng0 + box.dLng*i;
        let x = (lng - x0) / box.dLng;
        let y0 = box.lat0 + box.dLat*j;
        let y = (lat - y0) / box.dLat;
        let rx = 1 - x, ry = 1 - y;

        let u00 = rowsU[j][i], u10 = rowsU[j][i+1], u01 = rowsU[j+1][i], u11 = rowsU[j+1][i+1];
        if (u00 == null || u10 == null || u01 == null || u11 == null) return null;
        let u = u00*rx*ry + u10*x*ry + u01*rx*y + u11*x*y;

        let v00 = rowsV[j][i], v10 = rowsV[j][i+1], v01 = rowsV[j+1][i], v11 = rowsV[j+1][i+1];
        if (v00 == null || v10 == null || v01 == null || v11 == null) return null;
        let v = v00*rx*ry + v10*x*ry + v01*rx*y + v11*x*y;
        return {u, v};
    }
}

export default G5.instance;