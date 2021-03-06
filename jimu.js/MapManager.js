define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/html',
    'dojo/query',
    'dojo/topic',
    'dojo/on',
    'dojo/aspect',
    'dojo/keys',
    'dojo/i18n',
    'dojo/_base/config',
    'require',
    './utils',
    'jimu/dijit/Message'
], function (declare, lang, array, html, query, topic, on, aspect, keys, i18n, dojoConfig,
    require, jimuUtils,
    Message) {
    var instance = null,
        clazz = declare(null, {
            appConfig: null,
            mapDivId: '',
            map: null,

            constructor: function ( /*Object*/ options, mapDivId) {
                this.appConfig = options.appConfig;
                this.urlParams = options.urlParams;
                this.mapDivId = mapDivId;
                this.id = mapDivId;
                this.nls = window.jimuNls;
                topic.subscribe("appConfigChanged", lang.hitch(this, this.onAppConfigChanged));
                topic.subscribe("mapContentModified", lang.hitch(this, this.onMapContentModified));

                on(window, 'resize', lang.hitch(this, this.onWindowResize));
                on(window, 'beforeunload', lang.hitch(this, this.onBeforeUnload));
            },

            showMap: function () {
                // console.timeEnd('before map');
                this._showMap(this.appConfig);
            },

            _showMap: function (appConfig) {
                //for now, we can't create both 2d and 3d map
                var mode = Cesium.SceneMode.SCENE3D; //默认是3D，
                if (appConfig.map['3D']) {
                    mode = Cesium.SceneMode.SCENE3D;
                } else if (appConfig.map['2D']) {
                    mode = Cesium.SceneMode.SCENE2D;
                } else {
                    mode = Cesium.SceneMode.COLUMBUS_VIEW;
                }

                this._createMap(mode, appConfig);
            },
            _visitConfigMapLayers: function (appConfig, cb) {
                array.forEach(appConfig.map.basemaps, function (layerConfig, i) {
                    cb(layerConfig, i);
                }, this);

                array.forEach(appConfig.map.swzwLayers, function (layerConfig, i) {
                    cb(layerConfig, i);
                }, this);

                array.forEach(appConfig.map.shLayers, function (layerConfig, i) {
                    cb(layerConfig, i);
                }, this);

                array.forEach(appConfig.map.djyLayers, function (layerConfig, i) {
                    cb(layerConfig, i);
                }, this);

            },





            _createMap: function (mode, appConfig) {
                // define(["../libs/Cesium1.68/CesiumNavigation.umd "], function () { });

                Cesium.Ion.defaultAccessToken = appConfig.cesiumToken;
                //加载底图和地形配置
                appConfig.map.mapOptions["imageryProviderViewModels"] = this._getImageryProviderArr(appConfig);
                appConfig.map.mapOptions["terrainProviderViewModels"] = this._getTerrainProviderViewModelsArr(appConfig);
                //创建地图
                this.map = new Cesium.Viewer(this.mapDivId, appConfig.map.mapOptions);
                // this.map.extend(Cesium.viewerDragDropMixin);
                this.map.scene.globe.depthTestAgainstTerrain = false;
                this.map.scene.logarithmicDepthBuffer = false;
                this.map.scene.globe.baseColor = Cesium.Color.BLACK;
                window.viewer = this.map;
                var imageryLayers = this.map.imageryLayers;
                imageryLayers.removeAll();

                // // 罗盘
                // this.map.extend(Cesium.viewerCesiumNavigationMixin);
                // //当然也可以使用默认的
                // // this.map.extend(Cesium.viewerCesiumNavigationMixin, {});
                // //获取对象
                // // var cesiumNavigation = this.map.cesiumNavigation;
                // debugger
                // CesiumNavigation.umd(this.map);


                // // 加载图层，由于更换，所以注释掉
                // // this._visitConfigMapLayers(appConfig, lang.hitch(this, function (layerConfig) {
                // //     this.createLayer(map, '3D', layerConfig);
                // // }));


                //设置地形
                /*if (appConfig.map.terrain && appConfig.map.terrain.show) {
                    var globe = this.map.scene.globe;
                    var terrainProvider = new Cesium.CesiumTerrainProvider(appConfig.map.terrain);
                    globe.terrainProvider = terrainProvider;
                    globe.enableLighting = false; //默认关闭灯光
                }*/


                //设置离线地图默认显示
                this.map.baseLayerPicker.viewModel.selectedImagery = this.map.baseLayerPicker.viewModel.imageryProviderViewModels[1];
                this.map.baseLayerPicker.viewModel.selectedTerrain = this.map.baseLayerPicker.viewModel.terrainProviderViewModels[2];
                $(".cesium-baseLayerPicker-sectionTitle").eq(0).html("底图");
                $(".cesium-baseLayerPicker-sectionTitle").eq(1).html("地形");


                //对外暴露的公共接口
                topic.subscribe("gis/map/setCenter", lang.hitch(this, this.centerAt));
                //对外暴露的公共接口
                topic.subscribe("gis/map/flyTo", lang.hitch(this, this.flyTo));

                this._processMapOptions(appConfig.map.mapOptions);
                this._publishMapEvent(this.map);
            },




            _getImageryProviderArr: function (mapconfig) {
                var imageryProviderArr = [];
                var imageryProviderViewModels = mapconfig.map.imageryProviderViewModels;
                for (var i = 0; i < imageryProviderViewModels.length; i++) {

                    let layerArr = [];
                    for (var j = 0; j < imageryProviderViewModels[i].layers.length; j++) {
                        let layerConfig = imageryProviderViewModels[i].layers[j];
                        let layer;
                        if (layerConfig.type == "url") {
                            layer = new Cesium.UrlTemplateImageryProvider(layerConfig);
                        }
                        else if (layerConfig.type == "wmts") {
                            layer = new Cesium.WebMapTileServiceImageryProvider(layerConfig);
                        }
                        layerArr.push(layer);
                    }

                    var pvm = new Cesium.ProviderViewModel({
                        name: imageryProviderViewModels[i].name,
                        tooltip: imageryProviderViewModels[i].tooltip,
                        iconUrl: imageryProviderViewModels[i].iconUrl,
                        creationFunction: function () {
                            return layerArr;
                        }
                    });
                    imageryProviderArr.push(pvm);
                }
                return imageryProviderArr;
            },




            _getTerrainProviderViewModelsArr: function (mapconfig) {
                var terrainProviderViewModelsArr = [new Cesium.ProviderViewModel({
                    name: "无地形",
                    tooltip: "WGS84标准球体",
                    iconUrl: "images/basemaps/TerrainEllipsoid.png",
                    creationFunction: function () {
                        return new Cesium.EllipsoidTerrainProvider({
                            ellipsoid: Cesium.Ellipsoid.WGS84
                        })
                    }
                }), new Cesium.ProviderViewModel({
                    name: "全球地形",
                    tooltip: "由 Cesium官方 提供的高分辨率全球地形",
                    iconUrl: "images/basemaps/TerrainSTK.png",
                    creationFunction: function () {
                        return new Cesium.CesiumTerrainProvider({
                            url: Cesium.IonResource.fromAssetId(1),
                            requestWaterMask: !0,
                            requestVertexNormals: !0
                        })
                    }
                }), new Cesium.ProviderViewModel({
                    name: "赣州地形",
                    tooltip: "由 普适科技 提供的赣州地区地形",
                    iconUrl: "images/basemaps/TerrainSTK.png",
                    creationFunction: function () {
                        return new Cesium.CesiumTerrainProvider({
                            url: "http://www.sw797.com:801/gzsw3D/v2/data/gzdx",
                            requestWaterMask: !0,
                            requestVertexNormals: !0
                        })
                    }
                })];
                //          	var terrainProviderViewModels = mapconfig.map.terrainProviderViewModels;
                //              for (var i = 0; i < terrainProviderViewModels.length; i++) {
                //              	var tp = null;
                //              	if(terrainProviderViewModels[i].url==""){
                //						tp = new Cesium.EllipsoidTerrainProvider({
                //							ellipsoid: Cesium.Ellipsoid.WGS84
                //						})
                //					}
                //					else{
                //						tp = new Cesium.CesiumTerrainProvider({url:terrainProviderViewModels[i].url,requestVertexNormals:true});
                //					}
                //              	var pvm = new Cesium.ProviderViewModel({
                //						name: terrainProviderViewModels[i].name,
                //						tooltip: terrainProviderViewModels[i].tooltip,
                //						iconUrl: terrainProviderViewModels[i].iconUrl,
                //						creationFunction: function() {
                //							return tp;
                //						}
                //					});
                //					terrainProviderViewModelsArr.push(pvm);
                //              }

                return terrainProviderViewModelsArr;
            },

            flyTo: function (item) {
                window.viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(Number(item.longitude), Number(item.latitude), Number(item.height)),
                    orientation: {
                        heading: Cesium.Math.toRadians(Number(item.heading)),
                        pitch: Cesium.Math.toRadians(Number(item.pitch)),
                        roll: Cesium.Math.toRadians(Number(item.roll))
                    },
                    duration: 5,
                    pitchAdjustHeight: 10000
                });
            },
            centerAt: function (item) {
                if (item.lgtd) {
                    window.viewer.camera.flyTo({
                        destination: Cesium.Cartesian3.fromDegrees(Number(item.lgtd), Number(item.lttd), 800.0),
                        duration: 5
                    });
                }

            },
            createLayer: function (map, maptype, layerConfig) {
                var layMap = {
                    'arcgis': 'ArcGisMapServerImageryProvider',
                    'wmts': 'WebMapTileServiceImageryProvider',
                    'ctms': 'SingleTileImageryProvider',
                    'wms': 'WebMapServiceImageryProvider',
                    'url': 'UrlTemplateImageryProvider',
                    'mapbox': 'MapboxImageryProvider'
                };

                var layer;
                if (false) {

                } else {
                    var layer = new Cesium[layMap[layerConfig.type]](layerConfig);
                    var imageryLayers = this.map.imageryLayers;
                    var olayer = imageryLayers.addImageryProvider(layer);
                    olayer.show = layerConfig.show;
                    olayer.label = layerConfig.label;
                }

            },
            _publishMapEvent: function (map) {
                //add this property for debug purpose
                window._viewerMap = map;
                if (this.loading) {
                    this.loading.destroy();
                }

                if (this.map) {
                    this.map = map;
                    topic.publish('mapChanged', this.map);
                } else {
                    this.map = map;
                    topic.publish('mapLoaded', this.map);
                }

                //this.resetInfoWindow();
            },
            _processMapOptions: function (mapOptions) {
                if (!mapOptions) {
                    return;
                }
                if (mapOptions.positionInfo) {
                    var west = mapOptions.positionInfo.xmin;
                    var south = mapOptions.positionInfo.ymin;
                    var east = mapOptions.positionInfo.xmax
                    var north = mapOptions.positionInfo.ymax;
                    var heading = mapOptions.positionInfo.heading;
                    var pitch = mapOptions.positionInfo.pitch;
                    var roll = mapOptions.positionInfo.roll;

                    //有bug，如果不延迟一下平面模式报错

                    //有动画效果的
                    setTimeout(lang.hitch(this, function () {
                        this.map.camera.flyTo({
                            destination: Cesium.Rectangle.fromDegrees(west, south, east, north)
                        });
                    }), 100);
                    //无动画的
                    //                    setTimeout(lang.hitch(this,function(){
                    //                        this.map.camera.setView({destination:Cesium.Rectangle.fromDegrees(west, south, east, north)});
                    //                    }),100);

                    //修改全局的homebutton定位
                    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(west, south, east, north);
                    Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;
                }
            },

            onBeforeUnload: function () {

            },

            onWindowResize: function () {
                if (this.map && this.map.resize) {
                    this.map.resize();
                }
            },


            onAppConfigChanged: function (appConfig, reason, changedJson) {

            },

            onMapContentModified: function () {
                this._recreateMap(this.appConfig);
            },

            _recreateMap: function (appConfig) {
                if (this.map) {
                    topic.publish('beforeMapDestory', this.map);
                    this.map.destroy();
                }
                this._showMap(appConfig);
            },

        });



    clazz.getInstance = function (options, mapDivId) {
        if (instance === null) {
            instance = new clazz(options, mapDivId);
        }
        return instance;
    };

    return clazz;
});