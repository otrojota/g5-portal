import express from "express"
import http from "http";
import { ZServer } from "./lib/ZServer.js";
import fs from "fs";

async function createHTTPServer() {
    try {
        const app = express();
        app.use("/", express.static("www"));

        app.get("/version", async (req, res) => {
            let version = await getVersion();
            res.json({version});
        })

        app.use(express.json({extended: false}));
        app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, X-API-Key, Authorization");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            next();
        });

        let zServer = new ZServer(app, "/api/v1");
        //zServer.setAuthorizerClass(PerfilesAuthorizer);
        //zServer.registerModule(clientePerfiles);        

        const port = process.env.HTTP_PORT || 8550;
        const httpServer = http.createServer(app);
        let version = await getVersion();
        httpServer.listen(port, "::", async _ => {
            console.log("[G5 Portal - " + version + "]. HTTP Server Started at Port " + port);
        });        
    } catch(error) {
        console.error("Can't start server", error);
        console.error("Exit (-1)")
        process.exit(-1);
    }
}

async function getVersion() {
    let version = "?";
    try {
        let txt = fs.readFileSync("./build.sh").toString();
        txt = txt.split("\n")[0];
        let p = txt.indexOf("=");
        version = txt.substring(p+1);
    } catch(error) {
        console.error(error);
    }
    return version;
}


createHTTPServer();
