import g5 from "lib/g5.js";

class ShaderLayer extends deck.Layer {
    initializeState() {        
        luma.log.level = 0;
    }

    getShaders() {
        const vertexShader = `#version 300 es
        #define SHADER_NAME shader-layer-vertex
        in vec3 positions;
        in vec2 texCoords;

        out vec2 vTexCoords;

        void main(void) {
            vec3 position64Low = vec3(0.0, 0.0, 0.0);
            vec3 offset = vec3(0.0, 0.0, 0.0);
            gl_Position = project_position_to_clipspace(positions, position64Low, offset);
            vTexCoords = texCoords;
        }
        `;

        const fragmentShader = `#version 300 es
        #define SHADER_NAME shader-layer-fragment
        in vec2 vTexCoords;
        uniform sampler2D uTexture;
        out vec4 fragColor;

        void main(void) {
            fragColor = texture(uTexture, vTexCoords);
        }
        `;
        return super.getShaders({
            vs: vertexShader, fs: fragmentShader,
            modules: [deck.project32, deck.picking]
        })
    }

    updateState() {
        const { gl, device } = this.context;
        const { vertexPositions, indexes, texCoords } = this.createBuffers();
        const { width, height, texColors} = this.createTextureImage();
        const texture = device.createTexture({
            width, height,
            format: "rgba8unorm",
            data: new Uint8Array(texColors),
            parameters: {
                [gl.TEXTURE_MAG_FILTER]: gl.LINEAR,
                [gl.TEXTURE_MIN_FILTER]: gl.LINEAR,
                [gl.TEXTURE_WRAP_S]: gl.CLAMP_TO_EDGE,
                [gl.TEXTURE_WRAP_T]: gl.CLAMP_TO_EDGE
            },
            mipmaps: false
        });

        const positionBuffer = new Float32Array(vertexPositions);
        const texCoordsBuffer = new Float32Array(texCoords);
        const indexBuffer = new Uint16Array(indexes);
        const geometry = new luma.Geometry({
            id: this.props.id,
            attributes: {
                positions: { size: 3, value: positionBuffer },
                texCoords: { size: 2, value: texCoordsBuffer },
                indices: { value: indexBuffer }
            },            
            topology: 'triangle-list',
        });
        const model = new luma.Model(device, {
            ...this.getShaders(),
            id: this.props.id,            
            geometry,
            isInstanced: false,
            bufferLayout: this.getAttributeManager().getBufferLayouts(),
            bindings: {
                uTexture: texture
            }
        });
        this.setState({model});
    }

    finalizeState() {
        super.finalizeState();
        if (this.state.model) this.state.model.delete();
    }

    createBuffers() {
        const { data, getElevation } = this.props;
        let {nrows, ncols, rows} = data;
        let box = data.foundBox;
        let vertexPositions = [], indexes = [], texCoords = [];
        let pointIndex = {};  // {iRow-iCol:int}
        let tdx = (box.lng1 - box.lng0);
        let tdy = (box.lat1 - box.lat0);

        for (let iRow=nrows-1, lat=box.lat1 - box.dLat; iRow>=0; iRow--, lat -= box.dLat) {
            for(let iCol=0,lng = box.lng0; iCol<ncols; iCol++, lng += box.dLng) {
                let key = iRow + "-" + iCol;
                let v = rows[iRow][iCol];
                if (v !== null) {
                    const z = getElevation(v, lat, lng);
                    pointIndex[key] = vertexPositions.length / 3;
                    vertexPositions.push(lng, lat, z);
                    let tx = (lng - box.lng0) / tdx;
                    let ty = (lat - box.lat0) / tdy;
                    texCoords.push(tx, ty);         
                }
                if (iRow < (nrows - 1) && iCol > 0) {
                    let keySE = key, idxSE = pointIndex[keySE], existeSE = idxSE !== undefined;
                    let keySW = iRow + "-" + (iCol - 1), idxSW = pointIndex[keySW], existeSW = idxSW !== undefined;
                    let keyNW = (iRow + 1) + "-" + (iCol - 1), idxNW = pointIndex[keyNW], existeNW = idxNW !== undefined;
                    let keyNE = (iRow + 1) + "-" + iCol, idxNE = pointIndex[keyNE], existeNE = idxNE !== undefined;
                    if (existeSE) {
                        if (existeSW) {
                            if (existeNW) {
                                indexes.push(idxSE, idxSW, idxNW);
                                if (existeNE) {
                                    indexes.push(idxSE, idxNW, idxNE);
                                }
                            } else { // !existeNW
                                if (existeNE) {
                                    indexes.push(idxSE, idxSW, idxNE);
                                }
                            }
                        } else {  // !existeSW
                            if (existeNW) {
                                if (existeNE) {
                                    indexes.push(idxSE, idxNW, idxNE);
                                }
                            }
                        }
                    } else {  // !existeSE
                        if (existeSW) {
                            if (existeNW) {
                                if (existeNE) {
                                    indexes.push(idxSW, idxNW, idxNE);
                                }
                            }
                        }
                    }
                }
            }
        }
        return {vertexPositions, indexes, texCoords}
    }

    createTextureImage() {
        const { data, getColor, opacity} = this.props;
        let {nrows, ncols, rows} = data;
        let box = data.foundBox;
        let dLat = box.dLat;
        let dLng = box.dLng;
        let sourceBox = box, sourceNcols = ncols, sourceNrows = nrows;
        let {interpolate, interpolateMinCols, interpolateMinRows} = this.props;
        let interpolating = false;       
        if (interpolate && (ncols < interpolateMinCols || nrows < interpolateMinRows)) {
            interpolating = true;
            nrows = interpolateMinRows;
            ncols = interpolateMinCols;
            dLat = (box.lat1 - box.lat0) / nrows;
            dLng = (box.lng1 - box.lng0) / ncols;
        }

        let image = [];
        for (let iRow=0, lat=box.lat0; iRow < nrows; iRow++, lat += dLat) {
            for(let iCol=0,lng = box.lng0; iCol<ncols; iCol++, lng += dLng) {
                let v;
                if (!interpolating) {
                    //v = rows[iRow]?rows[iRow][iCol]:null;
                    v = rows[iRow][iCol];
                } else {
                    v = g5.interpolate(lat, lng, sourceBox, rows, sourceNcols, sourceNrows);
                }                
                if (!v) {
                    image.push(255,0,0,0);
                } else {
                    let colors = getColor(v, lat, lng);
                    const pixel = [colors[0], colors[1], colors[2], colors[3] * opacity]; 
                    image.push(...pixel);
                }                
            }
        }
        return {width:ncols, height:nrows, texColors:image}
    }

    draw({ uniforms }) {        
        const { model } = this.state;    
        model.draw({
            uniforms: Object.assign({}, uniforms)
        });
    }
}

ShaderLayer.layerName = "shader-layer";
ShaderLayer.defaultProps = {
    id: "shader-layer",    
    data:{rows:[], foundBox:{}, nrows:0, ncols:0},
    getColor: (v, lat, lng) => [0,255,0,255],
    opacity: 1,
    interpolate: true,
    interpolateMinCols: 350,
    interpolateMinRows: 500,
    getElevation: (v, lat, lng) => (0)
}

export default ShaderLayer