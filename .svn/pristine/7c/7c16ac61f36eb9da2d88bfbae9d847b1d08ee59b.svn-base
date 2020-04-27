///////////////////////////////////////////////////////////////////////////
// Copyright © 2018 NarutoGIS. All Rights Reserved.
// 模块描述:鹰眼地图，和主地图进行联动
///////////////////////////////////////////////////////////////////////////
define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/_base/array',
        'dojo/_base/html',
        'dojo/topic',
        'jimu/BaseWidget'
    ],
    function (declare,
              lang,
              array,
              html,
              topic,
              BaseWidget
    ) {

        var CesiumViewTool = (function () {//http://blog.sina.com.cn/s/blog_15e866bbe0102y5no.html
            function _() {
            }

            _.GetViewExtent = function (viewer) {
                var extent = {};
                var scene = viewer.scene;
                var ellipsoid = scene.globe.ellipsoid;
                var canvas = scene.canvas;

                var car3_lt = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, 0), ellipsoid);// canvas左上角
                var car3_rb = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(canvas.width, canvas.height), ellipsoid); // canvas右下角

                // 当canvas左上角和右下角全部在椭球体上
                if (car3_lt && car3_rb) {
                    var carto_lt = ellipsoid.cartesianToCartographic(car3_lt);
                    var carto_rb = ellipsoid.cartesianToCartographic(car3_rb);
                    extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude);
                    extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude);
                    extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude);
                    extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude);
                } else if (!car3_lt && car3_rb) { // 当canvas左上角不在但右下角在椭球体上
                    return null;
                    var car3_lt2 = null;
                    var yIndex = 0;
                    var xIndex = 0;
                    do {
                        // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
                        yIndex <= canvas.height ? yIndex += 10 : canvas.height;
                        xIndex <= canvas.width ? xIndex += 10 : canvas.width;
                        car3_lt2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(xIndex, yIndex), ellipsoid);
                    } while (!car3_lt2);
                    var carto_lt2 = ellipsoid.cartesianToCartographic(car3_lt2);
                    var carto_rb2 = ellipsoid.cartesianToCartographic(car3_rb);
                    extent.xmin = Cesium.Math.toDegrees(carto_lt2.longitude);
                    extent.ymax = Cesium.Math.toDegrees(carto_lt2.latitude);
                    extent.xmax = Cesium.Math.toDegrees(carto_rb2.longitude);
                    extent.ymin = Cesium.Math.toDegrees(carto_rb2.latitude);
                }
                else if (car3_lt && !car3_rb) { // 当canvas左上角在但右下角不在椭球体上
                    return null;
                    var car3_rb2 = null;
                    var yIndex = canvas.height;
                    var xIndex = canvas.width;
                    do {
                        // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
                        yIndex >= 10 ? yIndex -= 10 : 10;
                        xIndex >= 10 ? xIndex -= 10 : 10;
                        car3_rb2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(yIndex, yIndex), ellipsoid);
                    } while (!car3_rb2);
                    var carto_lt2 = ellipsoid.cartesianToCartographic(car3_lt);
                    var carto_rb2 = ellipsoid.cartesianToCartographic(car3_rb2);
                    extent.xmin = Cesium.Math.toDegrees(carto_lt2.longitude);
                    extent.ymax = Cesium.Math.toDegrees(carto_lt2.latitude);
                    extent.xmax = Cesium.Math.toDegrees(carto_rb2.longitude);
                    extent.ymin = Cesium.Math.toDegrees(carto_rb2.latitude);
                } else if (!car3_lt && !car3_rb) {
                    return null;
                    var car3_lt2 = null;
                    var yIndex = 0;
                    var xIndex = 0;
                    do {
                        // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
                        yIndex <= canvas.height ? yIndex += 10 : canvas.height;
                        xIndex <= canvas.width ? xIndex += 10 : canvas.width;
                        car3_lt2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(xIndex, yIndex), ellipsoid);
                    } while (!car3_lt2);

                    var car3_rb2 = null;
                    var yIndex = canvas.height;
                    var xIndex = canvas.width;
                    do {
                        // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
                        yIndex >= 10 ? yIndex -= 10 : 10;
                        xIndex >= 10 ? xIndex -= 10 : 10;
                        car3_rb2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(yIndex, yIndex), ellipsoid);
                    } while (!car3_rb2);

                    var carto_lt2 = ellipsoid.cartesianToCartographic(car3_lt2);
                    var carto_rb2 = ellipsoid.cartesianToCartographic(car3_rb2);
                    extent.xmin = Cesium.Math.toDegrees(carto_lt2.longitude);
                    extent.ymax = Cesium.Math.toDegrees(carto_lt2.latitude);
                    extent.xmax = Cesium.Math.toDegrees(carto_rb2.longitude);
                    extent.ymin = Cesium.Math.toDegrees(carto_rb2.latitude);
                }

                // 获取高度
                extent.height = Math.ceil(viewer.camera.positionCartographic.height);
                return extent;
            }

            _.GetViewCenter = function (viewer) {
                var result = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(viewer.canvas.clientWidth / 2, viewer.canvas.clientHeight / 2));
                if (result) {
                } else {
                    return null;
                }
                var curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result);
                var lon = curPosition.longitude * 180 / Math.PI;
                var lat = curPosition.latitude * 180 / Math.PI;
                var height = viewer.camera.positionCartographic.height;
                return {
                    lgtd: lon,
                    lttd: lat,
                    height: height
                };
            }
            return _;
        })();

        return declare([BaseWidget], {
            baseClass: 'jimu-widget-EagleEye',

            layers:{},
            startup: function () {
                this.inherited(arguments);
                
                this.initEagleEye();

                var self = this;
                // // 定义当前场景的画布元素的事件处理
                // var handler = new Cesium.ScreenSpaceEventHandler(this.map.scene.canvas);
                // //设置鼠标移动事件的处理函数，这里负责监听x,y坐标值变化
                // handler.setInputAction(function(movement) {
                //     var extent = CesiumViewTool.GetViewExtent(window.viewer);
                //     self.createExtentPolygon([extent.xmin,extent.ymin],[extent.xmax,extent.ymax]);
                // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                // //设置鼠标滚动事件的处理函数，这里负责监听高度值变化
                // handler.setInputAction(function(wheelment) {
                //     var extent = CesiumViewTool.GetViewExtent(window.viewer);
                //     self.createExtentPolygon([extent.xmin,extent.ymin],[extent.xmax,extent.ymax]);
                // }, Cesium.ScreenSpaceEventType.WHEEL);

                var updateTimer;
                if (true) {
                    var camera = window.viewer.camera;
                    camera.moveStart.addEventListener(function() {
                        if (!Cesium.defined(updateTimer)) {
                            updateTimer = window.setInterval(self.extentChange, 1000);
                        }
                    });
                    camera.moveEnd.addEventListener(function() {
                        if (Cesium.defined(updateTimer)) {
                            window.clearInterval(updateTimer);
                            updateTimer = undefined;
                        }
                        self.extentChange();
                    });
                }
            },

            extentChange:function(){//改变之后
                var extent = CesiumViewTool.GetViewExtent(window.viewer);
                var center = CesiumViewTool.GetViewCenter(window.viewer);
                if(extent){
                    this.createExtentPolygon([extent.xmin,extent.ymin],[extent.xmax,extent.ymax],center);
                }else{
                    if(!center)return;
                    this.eagleEyemap.camera.setView({
                        destination : Cesium.Cartesian3.fromDegrees(center.lgtd, center.lttd, center.height*4)
                    });
                }

            },

            createExtentPolygon: function (pt1,pt2,center) {

                if(!center)return;
                var ringsArray = [];
                ringsArray.push(pt1[0], pt1[1]);
                ringsArray.push(pt2[0], pt1[1]);
                ringsArray.push(pt2[0], pt2[1]);
                ringsArray.push(pt1[0], pt2[1]);
                ringsArray.push(pt1[0], pt1[1]);
                if(this.bound){
                    this.bound.polygon.hierarchy = Cesium.Cartesian3.fromDegreesArray(ringsArray);
                    this.eagleEyemap.camera.setView({
                        destination : Cesium.Cartesian3.fromDegrees(center.lgtd, center.lttd, center.height*4)
                    });

                    // this.eagleEyemap.camera.flyTo({
                    //     destination: Cesium.Rectangle.fromDegrees(pt1[0],  pt1[1], pt2[0], pt2[1])
                    // });
                    return;
                }
                this.bound = this.eagleEyemap.entities.add({
                    name : 'polygon',
                    polygon : {
                        hierarchy : Cesium.Cartesian3.fromDegreesArray(ringsArray),
                        material : Cesium.Color.RED.withAlpha(0.5),
                        outline : true,
                        outlineColor : Cesium.Color.RED,
                        outlineWidth:2.0
                    }
                });
                this.eagleEyemap.camera.setView({
                    destination : Cesium.Cartesian3.fromDegrees(center.lgtd, center.lttd, center.height*4)
                });
                // this.eagleEyemap.camera.setView({
                //     destination : Cesium.Rectangle.fromDegrees(pt1[0],  pt1[1], pt2[0], pt2[1])
                // });

            },
            initEagleEye:function(){
                //添加鹰眼
                var layer = new Cesium.ArcGisMapServerImageryProvider({url:"http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer"});

                this.eagleEyemap = new Cesium.Viewer(this.eagleEye,{

                    "animation":false,
                    "baseLayerPicker":false,
                    "fullscreenButton":false,
                    "geocoder":false,
                    "homeButton":false,
                    "infoBox" : false,
                    "sceneModePicker":false,
                    "selectionIndicator" : false ,
                    "timeline":false,
                    "navigationHelpButton":false,
                    "scene3DOnly" : false,
                    "navigationInstructionsInitiallyVisible":false,
                    "terrainExaggeration":1,
                    "showRenderLoopErrors":false,
                    "sceneMode":Cesium.SceneMode.SCENE2D,
                    "imageryProvider":layer
                });
                //去掉版权
                this.eagleEyemap._cesiumWidget._creditContainer.style.display = "none";


                var extent = {
                    "xmin": 86.06689524994869,
                    "ymin": 22.108857182532834,
                    "xmax": 124.9584857499487,
                    "ymax": 48.08052948253283};

                var west = extent.xmin;
                var south = extent.ymin;
                var east =extent.xmax;
                var north =extent.ymax;

                this.eagleEyemap.camera.setView({
                    destination : Cesium.Rectangle.fromDegrees(west, south, east, north)
                });
            },
            onOpen: function () {
                //面板打开的时候触发 （when open this panel trigger）
            },

            onClose: function () {
                //面板关闭的时候触发 （when this panel is closed trigger）
            },

            onMinimize: function () {
                this.resize();
            },

            onMaximize: function () {
                this.resize();
            },

            resize: function () {

            },

            destroy: function () {
                //销毁的时候触发
                //todo
                //do something before this func
                this.inherited(arguments);
            },
            flag:true,
            vis:function(){
               if(this.flag){
                   $(this.eagleEye).hide();
                   this.visNode.innerHTML = "显示";

                   $(this.domNode).height(30);
                   $(this.domNode).width(50);
               }else{
                   $(this.eagleEye).show();
                   $(this.domNode).height(this.position.height);
                   $(this.domNode).width(this.position.width);
                   this.visNode.innerHTML = "隐藏";
               }

                this.flag = !this.flag;
            }

        });
    });