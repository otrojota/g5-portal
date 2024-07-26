/*!
* Copyright (c) 2021 WeatherLayers.com
*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@deck.gl/layers'), require('@luma.gl/core'), require('geodesy-fn/src/spherical.js')) :
  typeof define === 'function' && define.amd ? define(['exports', '@deck.gl/layers', '@luma.gl/core', 'geodesy-fn/src/spherical.js'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DeckGlParticle = {}, global.deck, global.luma, global.spherical_js));
})(this, (function (exports, layers, core, spherical_js) { 'use strict';

  function _classCallCheck(a, n) {
    if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
  }

  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }

  function toPrimitive(t, r) {
    if ("object" != _typeof(t) || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != _typeof(i)) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }

  function toPropertyKey(t) {
    var i = toPrimitive(t, "string");
    return "symbol" == _typeof(i) ? i : i + "";
  }

  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var o = r[t];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, toPropertyKey(o.key), o);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
      writable: !1
    }), e;
  }

  function _assertThisInitialized(e) {
    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return e;
  }

  function _possibleConstructorReturn(t, e) {
    if (e && ("object" == _typeof(e) || "function" == typeof e)) return e;
    if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
    return _assertThisInitialized(t);
  }

  function _getPrototypeOf(t) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
      return t.__proto__ || Object.getPrototypeOf(t);
    }, _getPrototypeOf(t);
  }

  function _superPropBase(t, o) {
    for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t)););
    return t;
  }

  function _get() {
    return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) {
      var p = _superPropBase(e, t);
      if (p) {
        var n = Object.getOwnPropertyDescriptor(p, t);
        return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value;
      }
    }, _get.apply(null, arguments);
  }

  function _setPrototypeOf(t, e) {
    return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
      return t.__proto__ = e, t;
    }, _setPrototypeOf(t, e);
  }

  function _inherits(t, e) {
    if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
    t.prototype = Object.create(e && e.prototype, {
      constructor: {
        value: t,
        writable: !0,
        configurable: !0
      }
    }), Object.defineProperty(t, "prototype", {
      writable: !1
    }), e && _setPrototypeOf(t, e);
  }

  function _defineProperty(e, r, t) {
    return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[r] = t, e;
  }

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }

  function _arrayWithoutHoles(r) {
    if (Array.isArray(r)) return _arrayLikeToArray(r);
  }

  function _iterableToArray(r) {
    if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
  }

  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _toConsumableArray(r) {
    return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
  }

  /*
   * Copyright (c) 2021-2023 WeatherLayers.com
   *
   * This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/.
   */

  // radius used by deck.gl, see https://github.com/visgl/deck.gl/blob/master/modules/core/src/viewports/globe-viewport.js#L10
  var DEFAULT_RADIUS = 6370972;
  function distance(start, destination) {
    return spherical_js.distance(start, destination, DEFAULT_RADIUS);
  }

  /*
   * Copyright (c) 2021-2023 WeatherLayers.com
   *
   * This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/.
   */
  /**
   * see https://stackoverflow.com/a/4467559/1823988
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  function mod(x, y) {
    return (x % y + y) % y;
  }

  /**
   * @param {number} lng
   * @param {number} [minLng]
   * @returns {number}
   */
  function wrapLongitude(lng) {
    var minLng = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    var wrappedLng = mod(lng + 180, 360) - 180;
    if (typeof minLng === 'number' && wrappedLng < minLng) {
      wrappedLng += 360;
    }
    return wrappedLng;
  }

  /**
   * @param {GeoJSON.BBox} bounds
   * @returns {GeoJSON.BBox}
   */
  function wrapBounds(bounds) {
    // wrap longitude
    var minLng = bounds[2] - bounds[0] < 360 ? wrapLongitude(bounds[0]) : -180;
    var maxLng = bounds[2] - bounds[0] < 360 ? wrapLongitude(bounds[2], minLng) : 180;
    // clip latitude
    var minLat = Math.max(bounds[1], -85.051129);
    var maxLat = Math.min(bounds[3], 85.051129);
    var mercatorBounds = /** @type {GeoJSON.BBox} */[minLng, minLat, maxLng, maxLat];
    return mercatorBounds;
  }

  /** @typedef {any} Viewport */

  /**
   * @param {Viewport} viewport 
   * @returns {boolean}
   */
  function isViewportGlobe(viewport) {
    return !!viewport.resolution;
  }

  /**
   * @param {Viewport} viewport 
   * @returns {GeoJSON.Position | null}
   */
  function getViewportGlobeCenter(viewport) {
    if (!isViewportGlobe(viewport)) {
      return null;
    }
    return [viewport.longitude, viewport.latitude];
  }

  /**
   * @param {Viewport} viewport 
   * @returns {number | null}
   */
  function getViewportGlobeRadius(viewport) {
    if (!isViewportGlobe(viewport)) {
      return null;
    }
    var viewportGlobeCenter = /** @type {GeoJSON.Position} */getViewportGlobeCenter(viewport);
    var viewportGlobeRadius = Math.max.apply(Math, [distance(viewportGlobeCenter, viewport.unproject([viewport.width / 2, 0])), distance(viewportGlobeCenter, viewport.unproject([0, viewport.height / 2]))].concat(_toConsumableArray(viewport.width > viewport.height ? [distance(viewportGlobeCenter, viewport.unproject([viewport.width / 2 - viewport.height / 4 * 1, viewport.height / 2])), distance(viewportGlobeCenter, viewport.unproject([viewport.width / 2 - viewport.height / 2 * 1, viewport.height / 2])), distance(viewportGlobeCenter, viewport.unproject([viewport.width / 2 - viewport.height / 4 * 3, viewport.height / 2])), distance(viewportGlobeCenter, viewport.unproject([viewport.width / 2 - viewport.height, viewport.height / 2]))] : [distance(viewportGlobeCenter, viewport.unproject([viewport.width / 2, viewport.height / 2 - viewport.width / 4 * 1])), distance(viewportGlobeCenter, viewport.unproject([viewport.width / 2, viewport.height / 2 - viewport.width / 2 * 1])), distance(viewportGlobeCenter, viewport.unproject([viewport.width / 2, viewport.height / 2 - viewport.width / 4 * 3])), distance(viewportGlobeCenter, viewport.unproject([viewport.width / 2, viewport.height / 2 - viewport.width]))])));
    return viewportGlobeRadius;
  }

  /**
   * @param {Viewport} viewport 
   * @returns {GeoJSON.BBox | null}
   */
  function getViewportBounds(viewport) {
    return !isViewportGlobe(viewport) ? wrapBounds(viewport.getBounds()) : null;
  }

  /*
   * Copyright (c) 2021-2023 WeatherLayers.com
   *
   * This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/.
   */
  var updateTransformVs = "#version 300 es\n#define SHADER_NAME particle-layer-update-transform-vertex-shader\n\nprecision highp float;\n\nin vec3 sourcePosition;\nout vec3 targetPosition;\n\nuniform bool viewportGlobe;\nuniform vec2 viewportGlobeCenter;\nuniform float viewportGlobeRadius;\nuniform vec4 viewportBounds;\nuniform float viewportZoomChangeFactor;\n\nuniform sampler2D bitmapTexture;\nuniform vec2 imageUnscale;\nuniform vec4 bounds;\n\nuniform float numParticles;\nuniform float maxAge;\nuniform float speedFactor;\n\nuniform float time;\nuniform float seed;\n\nconst vec2 DROP_POSITION = vec2(0);\n\nbool isNaN(float value) {\n  return !(value <= 0. || 0. <= value);\n}\n\n// see https://stackoverflow.com/a/27228836/1823988\nfloat atan2(float y, float x) {\n  return x == 0. ? sign(y) * PI / 2. : atan(y, x);\n}\n\n// see https://github.com/chrisveness/geodesy/blob/master/latlon-spherical.js#L187\nfloat distanceTo(vec2 from, vec2 point) {\n  float y1 = radians(from.y);\n  float x1 = radians(from.x);\n  float y2 = radians(point.y);\n  float x2 = radians(point.x);\n  float dy = y2 - y1;\n  float dx = x2 - x1;\n\n  float a = sin(dy / 2.) * sin(dy / 2.) + cos(y1) * cos(y2) * sin(dx / 2.) * sin(dx / 2.);\n  float c = 2. * atan2(sqrt(a), sqrt(1. - a));\n  float d = EARTH_RADIUS * c;\n\n  return d;\n}\n\n// see https://github.com/chrisveness/geodesy/blob/master/latlon-spherical.js#L360\nvec2 destinationPoint(vec2 from, float dist, float bearing) {\n  float d = dist / EARTH_RADIUS;\n  float r = radians(bearing);\n\n  float y1 = radians(from.y);\n  float x1 = radians(from.x);\n\n  float siny2 = sin(y1) * cos(d) + cos(y1) * sin(d) * cos(r);\n  float y2 = asin(siny2);\n  float y = sin(r) * sin(d) * cos(y1);\n  float x = cos(d) - sin(y1) * siny2;\n  float x2 = x1 + atan2(y, x);\n\n  float lat = degrees(y2);\n  float lon = degrees(x2);\n\n  return vec2(lon, lat);\n}\n\n// longitude wrapping allows rendering in a repeated MapView\nfloat wrapLongitude(float lng) {\n  float wrappedLng = mod(lng + 180., 360.) - 180.;\n  return wrappedLng;\n}\n\nfloat wrapLongitude(float lng, float minLng) {\n  float wrappedLng = wrapLongitude(lng);\n  if (wrappedLng < minLng) {\n    wrappedLng += 360.;\n  }\n  return wrappedLng;\n}\n\nfloat randFloat(vec2 seed) {\n  return fract(sin(dot(seed.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvec2 randPoint(vec2 seed) {\n  return vec2(randFloat(seed + 1.3), randFloat(seed + 2.1));\n}\n\nvec2 pointToPosition(vec2 point) {\n  if (viewportGlobe) {\n    point.x += 0.0001; // prevent generating point in the center\n    float dist = sqrt(point.x) * viewportGlobeRadius;\n    float bearing = point.y * 360.;\n    return destinationPoint(viewportGlobeCenter, dist, bearing);\n  } else {\n    vec2 viewportBoundsMin = viewportBounds.xy;\n    vec2 viewportBoundsMax = viewportBounds.zw;\n    return mix(viewportBoundsMin, viewportBoundsMax, point);\n  }\n}\n\nbool isPositionInBounds(vec2 position, vec4 bounds) {\n  vec2 boundsMin = bounds.xy;\n  vec2 boundsMax = bounds.zw;\n  float lng = wrapLongitude(position.x, boundsMin.x);\n  float lat = position.y;\n  return (\n    boundsMin.x <= lng && lng <= boundsMax.x &&\n    boundsMin.y <= lat && lat <= boundsMax.y\n  );\n}\n\nbool isPositionInViewport(vec2 position) {\n  if (viewportGlobe) {\n    return distanceTo(viewportGlobeCenter, position) <= viewportGlobeRadius;\n  } else {\n    return isPositionInBounds(position, viewportBounds);\n  }\n}\n\n// bitmapTexture is in COORDINATE_SYSTEM.LNGLAT\n// no coordinate conversion needed\nvec2 getUV(vec2 pos) {\n  return vec2(\n    (pos.x - bounds[0]) / (bounds[2] - bounds[0]),\n    (pos.y - bounds[3]) / (bounds[1] - bounds[3])\n  );\n}\n\nbool raster_has_values(vec4 values) {\n  if (imageUnscale[0] < imageUnscale[1]) {\n    return values.a == 1.;\n  } else {\n    return !isNaN(values.x);\n  }\n}\n\nvec2 raster_get_values(vec4 color) {\n  if (imageUnscale[0] < imageUnscale[1]) {\n    return mix(vec2(imageUnscale[0]), vec2(imageUnscale[1]), color.xy);\n  } else {\n    return color.xy;\n  }\n}\n\nvoid main() {\n  float particleIndex = mod(float(gl_VertexID), numParticles);\n  float particleAge = floor(float(gl_VertexID) / numParticles);\n\n  // update particles age0\n  // older particles age1-age(N-1) are copied with buffer.copyData\n  if (particleAge > 0.) {\n    return;\n  }\n\n  if (sourcePosition.xy == DROP_POSITION) {\n    // generate random position to prevent converging particles\n    vec2 particleSeed = vec2(particleIndex * seed / numParticles);\n    vec2 point = randPoint(particleSeed);\n    vec2 position = pointToPosition(point);\n    targetPosition.xy = position;\n    targetPosition.x = wrapLongitude(targetPosition.x);\n    return;\n  }\n\n  if (!isPositionInBounds(sourcePosition.xy, bounds)) {\n    // drop out of bounds\n    targetPosition.xy = DROP_POSITION;\n    return;\n  }\n\n  if (!isPositionInViewport(sourcePosition.xy)) {\n    // drop out of viewport\n    targetPosition.xy = DROP_POSITION;\n    return;\n  }\n\n  if (viewportZoomChangeFactor > 1. && mod(particleIndex, viewportZoomChangeFactor) >= 1.) {\n    // drop when zooming out\n    targetPosition.xy = DROP_POSITION;\n    return;\n  }\n\n  if (abs(mod(particleIndex, maxAge + 2.) - mod(time, maxAge + 2.)) < 1.) {\n    // drop by maxAge, +2 because only non-randomized pairs are rendered\n    targetPosition.xy = DROP_POSITION;\n    return;\n  }\n\n  vec2 uv = getUV(sourcePosition.xy);\n  vec4 bitmapColor = texture2D(bitmapTexture, uv);\n\n  if (!raster_has_values(bitmapColor)) {\n    // drop nodata\n    targetPosition.xy = DROP_POSITION;\n    return;\n  }\n\n  // update position\n  vec2 speed = raster_get_values(bitmapColor) * speedFactor;\n  // float dist = sqrt(speed.x * speed.x + speed.y + speed.y) * 10000.;\n  // float bearing = degrees(-atan2(speed.y, speed.x));\n  // targetPosition.xy = destinationPoint(sourcePosition.xy, dist, bearing);\n  float distortion = cos(radians(sourcePosition.y)); \n  vec2 offset = vec2(speed.x / distortion, speed.y);\n  targetPosition.xy = sourcePosition.xy + offset;\n  targetPosition.x = wrapLongitude(targetPosition.x);\n}\n";

  function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
  function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  var FPS = 30;
  var DEFAULT_COLOR = [255, 255, 255, 255];
  var defaultProps = _objectSpread(_objectSpread({}, layers.LineLayer.defaultProps), {}, {
    image: {
      type: 'image',
      value: null,
      async: true
    },
    imageUnscale: {
      type: 'array',
      value: null
    },
    numParticles: {
      type: 'number',
      min: 1,
      max: 1000000,
      value: 5000
    },
    maxAge: {
      type: 'number',
      min: 1,
      max: 255,
      value: 100
    },
    speedFactor: {
      type: 'number',
      min: 0,
      max: 1,
      value: 1
    },
    color: {
      type: 'color',
      value: DEFAULT_COLOR
    },
    width: {
      type: 'number',
      value: 1
    },
    animate: true,
    bounds: {
      type: 'array',
      value: [-180, -90, 180, 90],
      compare: true
    },
    wrapLongitude: true
  });
  var ParticleLayer = /*#__PURE__*/function (_LineLayer) {
    function ParticleLayer() {
      _classCallCheck(this, ParticleLayer);
      return _callSuper(this, ParticleLayer, arguments);
    }
    _inherits(ParticleLayer, _LineLayer);
    return _createClass(ParticleLayer, [{
      key: "getShaders",
      value: function getShaders() {
        return _objectSpread(_objectSpread({}, _get(_getPrototypeOf(ParticleLayer.prototype), "getShaders", this).call(this)), {}, {
          inject: {
            'vs:#decl': "\n          varying float drop;\n          const vec2 DROP_POSITION = vec2(0);\n        ",
            'vs:#main-start': "\n          drop = float(instanceSourcePositions.xy == DROP_POSITION || instanceTargetPositions.xy == DROP_POSITION);\n        ",
            'fs:#decl': "\n          varying float drop;\n        ",
            'fs:#main-start': "\n          if (drop > 0.5) discard;\n        "
          }
        });
      }
    }, {
      key: "initializeState",
      value: function initializeState() {
        var gl = this.context.gl;
        if (!core.isWebGL2(gl)) {
          throw new Error('WebGL 2 is required');
        }
        _get(_getPrototypeOf(ParticleLayer.prototype), "initializeState", this).call(this, {});
        this._setupTransformFeedback();
        var attributeManager = this.getAttributeManager();
        attributeManager.remove(['instanceSourcePositions', 'instanceTargetPositions', 'instanceColors', 'instanceWidths']);
      }
    }, {
      key: "updateState",
      value: function updateState(_ref) {
        var props = _ref.props,
          oldProps = _ref.oldProps,
          changeFlags = _ref.changeFlags;
        var numParticles = props.numParticles,
          maxAge = props.maxAge,
          color = props.color,
          width = props.width;
        _get(_getPrototypeOf(ParticleLayer.prototype), "updateState", this).call(this, {
          props: props,
          oldProps: oldProps,
          changeFlags: changeFlags
        });
        if (!numParticles || !maxAge || !width) {
          this._deleteTransformFeedback();
          return;
        }
        if (numParticles !== oldProps.numParticles || maxAge !== oldProps.maxAge || color[0] !== oldProps.color[0] || color[1] !== oldProps.color[1] || color[2] !== oldProps.color[2] || color[3] !== oldProps.color[3] || width !== oldProps.width) {
          this._setupTransformFeedback();
        }
      }
    }, {
      key: "finalizeState",
      value: function finalizeState() {
        this._deleteTransformFeedback();
        _get(_getPrototypeOf(ParticleLayer.prototype), "finalizeState", this).call(this);
      }
    }, {
      key: "draw",
      value: function draw(_ref2) {
        var uniforms = _ref2.uniforms;
        var gl = this.context.gl;
        if (!core.isWebGL2(gl)) {
          return;
        }
        var initialized = this.state.initialized;
        if (!initialized) {
          return;
        }
        var animate = this.props.animate;
        var _this$state = this.state,
          sourcePositions = _this$state.sourcePositions,
          targetPositions = _this$state.targetPositions,
          sourcePositions64Low = _this$state.sourcePositions64Low,
          targetPositions64Low = _this$state.targetPositions64Low,
          colors = _this$state.colors,
          widths = _this$state.widths,
          model = _this$state.model;
        model.setAttributes({
          instanceSourcePositions: sourcePositions,
          instanceTargetPositions: targetPositions,
          instanceSourcePositions64Low: sourcePositions64Low,
          instanceTargetPositions64Low: targetPositions64Low,
          instanceColors: colors,
          instanceWidths: widths
        });
        _get(_getPrototypeOf(ParticleLayer.prototype), "draw", this).call(this, {
          uniforms: uniforms
        });
        if (animate) {
          this.requestStep();
        }
      }
    }, {
      key: "_setupTransformFeedback",
      value: function _setupTransformFeedback() {
        var gl = this.context.gl;
        if (!core.isWebGL2(gl)) {
          return;
        }
        var initialized = this.state.initialized;
        if (initialized) {
          this._deleteTransformFeedback();
        }
        var _this$props = this.props,
          numParticles = _this$props.numParticles,
          maxAge = _this$props.maxAge,
          color = _this$props.color,
          width = _this$props.width;

        // sourcePositions/targetPositions buffer layout:
        // |          age0         |          age1         |          age2         |...|          ageN         |
        // |pos1,pos2,pos3,...,posN|pos1,pos2,pos3,...,posN|pos1,pos2,pos3,...,posN|...|pos1,pos2,pos3,...,posN|
        var numInstances = numParticles * maxAge;
        var numAgedInstances = numParticles * (maxAge - 1);
        var sourcePositions = new core.Buffer(gl, new Float32Array(numInstances * 3));
        var targetPositions = new core.Buffer(gl, new Float32Array(numInstances * 3));
        var sourcePositions64Low = new Float32Array([0, 0, 0]); // constant attribute
        var targetPositions64Low = new Float32Array([0, 0, 0]); // constant attribute
        var colors = new core.Buffer(gl, new Float32Array(new Array(numInstances).fill(undefined).map(function (_, i) {
          var _color$;
          var age = Math.floor(i / numParticles);
          return [color[0], color[1], color[2], ((_color$ = color[3]) !== null && _color$ !== void 0 ? _color$ : 255) * (1 - age / maxAge)].map(function (d) {
            return d / 255;
          });
        }).flat()));
        var widths = new Float32Array([width]); // constant attribute

        var transform = new core.Transform(gl, {
          sourceBuffers: {
            sourcePosition: sourcePositions
          },
          feedbackBuffers: {
            targetPosition: targetPositions
          },
          feedbackMap: {
            sourcePosition: 'targetPosition'
          },
          vs: updateTransformVs,
          elementCount: numParticles
        });
        this.setState({
          initialized: true,
          numInstances: numInstances,
          numAgedInstances: numAgedInstances,
          sourcePositions: sourcePositions,
          targetPositions: targetPositions,
          sourcePositions64Low: sourcePositions64Low,
          targetPositions64Low: targetPositions64Low,
          colors: colors,
          widths: widths,
          transform: transform
        });
      }
    }, {
      key: "_runTransformFeedback",
      value: function _runTransformFeedback() {
        var gl = this.context.gl;
        if (!core.isWebGL2(gl)) {
          return;
        }
        var initialized = this.state.initialized;
        if (!initialized) {
          return;
        }
        var _this$context = this.context,
          viewport = _this$context.viewport,
          timeline = _this$context.timeline;
        var _this$props2 = this.props,
          image = _this$props2.image,
          imageUnscale = _this$props2.imageUnscale,
          bounds = _this$props2.bounds,
          numParticles = _this$props2.numParticles,
          speedFactor = _this$props2.speedFactor,
          maxAge = _this$props2.maxAge;
        var _this$state2 = this.state,
          numAgedInstances = _this$state2.numAgedInstances,
          transform = _this$state2.transform,
          previousViewportZoom = _this$state2.previousViewportZoom,
          previousTime = _this$state2.previousTime;
        var time = timeline.getTime();
        if (!image || time === previousTime) {
          return;
        }

        // viewport
        var viewportGlobe = isViewportGlobe(viewport);
        var viewportGlobeCenter = getViewportGlobeCenter(viewport);
        var viewportGlobeRadius = getViewportGlobeRadius(viewport);
        var viewportBounds = getViewportBounds(viewport);
        var viewportZoomChangeFactor = Math.pow(2, (previousViewportZoom - viewport.zoom) * 4);

        // speed factor for current zoom level
        var currentSpeedFactor = speedFactor / Math.pow(2, viewport.zoom + 7);

        // update particles age0
        var uniforms = {
          viewportGlobe: viewportGlobe,
          viewportGlobeCenter: viewportGlobeCenter || [0, 0],
          viewportGlobeRadius: viewportGlobeRadius || 0,
          viewportBounds: viewportBounds || [0, 0, 0, 0],
          viewportZoomChangeFactor: viewportZoomChangeFactor || 0,
          bitmapTexture: image,
          imageUnscale: imageUnscale || [0, 0],
          bounds: bounds,
          numParticles: numParticles,
          maxAge: maxAge,
          speedFactor: currentSpeedFactor,
          time: time,
          seed: Math.random()
        };
        transform.run({
          uniforms: uniforms
        });

        // update particles age1-age(N-1)
        // copy age0-age(N-2) sourcePositions to age1-age(N-1) targetPositions
        var sourcePositions = transform.bufferTransform.bindings[transform.bufferTransform.currentIndex].sourceBuffers.sourcePosition;
        var targetPositions = transform.bufferTransform.bindings[transform.bufferTransform.currentIndex].feedbackBuffers.targetPosition;
        sourcePositions.copyData({
          sourceBuffer: targetPositions,
          readOffset: 0,
          writeOffset: numParticles * 4 * 3,
          size: numAgedInstances * 4 * 3
        });
        transform.swap();

        // const {sourcePositions, targetPositions} = this.state;
        // console.log(uniforms, sourcePositions.getData().slice(0, 6), targetPositions.getData().slice(0, 6));

        this.state.previousViewportZoom = viewport.zoom;
        this.state.previousTime = time;
      }
    }, {
      key: "_resetTransformFeedback",
      value: function _resetTransformFeedback() {
        var gl = this.context.gl;
        if (!core.isWebGL2(gl)) {
          return;
        }
        var initialized = this.state.initialized;
        if (!initialized) {
          return;
        }
        var _this$state3 = this.state,
          numInstances = _this$state3.numInstances,
          sourcePositions = _this$state3.sourcePositions,
          targetPositions = _this$state3.targetPositions;
        sourcePositions.subData({
          data: new Float32Array(numInstances * 3)
        });
        targetPositions.subData({
          data: new Float32Array(numInstances * 3)
        });
      }
    }, {
      key: "_deleteTransformFeedback",
      value: function _deleteTransformFeedback() {
        var gl = this.context.gl;
        if (!core.isWebGL2(gl)) {
          return;
        }
        var initialized = this.state.initialized;
        if (!initialized) {
          return;
        }
        var _this$state4 = this.state,
          sourcePositions = _this$state4.sourcePositions,
          targetPositions = _this$state4.targetPositions,
          colors = _this$state4.colors,
          transform = _this$state4.transform;
        sourcePositions["delete"]();
        targetPositions["delete"]();
        colors["delete"]();
        transform["delete"]();
        this.setState({
          initialized: false,
          sourcePositions: undefined,
          targetPositions: undefined,
          sourcePositions64Low: undefined,
          targetPositions64Low: undefined,
          colors: undefined,
          widths: undefined,
          transform: undefined
        });
      }
    }, {
      key: "requestStep",
      value: function requestStep() {
        var _this = this;
        var stepRequested = this.state.stepRequested;
        if (stepRequested) {
          return;
        }
        this.state.stepRequested = true;
        setTimeout(function () {
          _this.step();
          _this.state.stepRequested = false;
        }, 1000 / FPS);
      }
    }, {
      key: "step",
      value: function step() {
        this._runTransformFeedback();
        this.setNeedsRedraw();
      }
    }, {
      key: "clear",
      value: function clear() {
        this._resetTransformFeedback();
        this.setNeedsRedraw();
      }
    }]);
  }(layers.LineLayer);
  ParticleLayer.layerName = 'ParticleLayer';
  ParticleLayer.defaultProps = defaultProps;

  exports.ParticleLayer = ParticleLayer;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=deck.gl-particle.js.map
