/**
 * Rest accelerator, includes bearer token. Uses fetch API for requests
 */

class ZClient {
    static get instance() {
        if (ZClient._singleton) return ZClient._singleton;
        ZClient._singleton = new ZClient();
        return ZClient._singleton;
    }

    constructor() {
        this._authToken = null;
        this._pathPrefix = "";
    }

    /**
     * Bearer token to include in "Authorization" header
     * @param {string} token 
     */
    set authToken(token) {this._authToken = token}
    get authToken() {return this._authToken}

    /**
     * Prefix appended to paths for all requests
     * @param {*} prefix
     */
    set pathPrefix(prefix) {this._pathPrefix = prefix}
    get pathPrefix() {return this._pathPrefix}

    setErrorInterceptor(statusCode, interceptor) {
        if (!this.errorInterceptors) this.errorInterceptors = {};
        this.errorInterceptors[statusCode] = interceptor;
    }

    async _parseResponse(ret) {
        if (ret.status == 200) return await ret.json();
        let text = await ret.text();
        if (this.errorInterceptors && this.errorInterceptors[ret.status]) {
            this.errorInterceptors[ret.status](text, ret.status);
        }
        if (text && text.startsWith("{")) {
            let json = null;
            try {
                json = JSON.parse(text);
            } catch (error) {                
            }
            if (json && json.error) throw json.error;
        }
        throw "[" + ret.status + "] " + text;
    }

    /**
     * 
     * @param {string} path Path (after prefix) 
     * @param {Object} args Objects to include as query arguments
     * @returns 
     */
    async get(path, args) {
        let query = Object.keys(args || {}).reduce((st, a) => {
            if (st) st += "&";
            let v = args[a];
            if (typeof v == "object" || Array.isArray(v)) v = JSON.stringify(v);
            return st + a + "=" + encodeURIComponent(v);
        }, "");
        let headers = {"Content-Type": "application/json"};
        if (this.authToken) headers.Authorization = "Bearer " + this.authToken;

        let fullPath = this.pathPrefix + path + (query?"?" + query:"");
        let ret = await fetch(fullPath, {headers, mode:"cors"});  
        return await this._parseResponse(ret);
    }

    async post(path, body) {
        let headers = {"Content-Type": "application/json"};
        if (this.authToken) headers.Authorization = "Bearer " + this.authToken;

        let fullPath = this.pathPrefix + path;
        let ret = await fetch(fullPath, {headers, mode:"cors", method:"POST", body:JSON.stringify(body || {})});
        
        return await this._parseResponse(ret);
    }

    async put(path, body) {
        let headers = {"Content-Type": "application/json"};
        if (this.authToken) headers.Authorization = "Bearer " + this.authToken;

        let fullPath = this.pathPrefix + path;
        let ret = await fetch(fullPath, {headers, mode:"cors", method:"PUT", body:JSON.stringify(body || {})});
        
        return await this._parseResponse(ret);
    }

    async delete(path, args) {
        let query = Object.keys(args || {}).reduce((st, a) => {
            if (st) st += "&";
            let v = args[a];
            if (typeof v == "object" || Array.isArray(v)) v = JSON.stringify(v);
            return st + a + "=" + encodeURIComponent(v);
        }, "");
        let headers = {"Content-Type": "application/json"};
        if (this.authToken) headers.Authorization = "Bearer " + this.authToken;

        let fullPath = this.pathPrefix + path + (query?"?" + query:"");
        let ret = await fetch(fullPath, {headers, mode:"cors", method:"DELETE"});
        
        return await this._parseResponse(ret);
    }
}

export default ZClient.instance;
export {ZClient}