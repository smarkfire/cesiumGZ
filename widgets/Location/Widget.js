///////////////////////////////////////////////////////////////////////////
// Copyright © 2019 zhongsong. All Rights Reserved.
// 模块描述: 查询定位
///////////////////////////////////////////////////////////////////////////
define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/_base/array',
        'dojo/_base/html',
        "dojo/topic",
        'jimu/BaseWidget',
        'dojo/on',
        'dstore/Memory',
        'dstore/Trackable',
        'dgrid/Grid',
        'dgrid/Keyboard',
        'dgrid/Selection',
        'dstore/RequestMemory',
        'dgrid/test/data/createSyncStore',
        './CommonPointLayer3D',
        "libs/jquery.pagination"
    ],
    function (declare,
              lang,
              array,
              html,
              topic,
              BaseWidget,
              on,
              Memory,
              Trackable,
              Grid,
              Keyboard,
              Selection,
              RequestMemory,
              createSyncStore,
              CommonPointLayer3D
    ) {
        return declare([BaseWidget], {
            baseClass: 'jimu-widget-Location',
            name: 'Location',
            layer: null,
            mapsId : [],
            graph : [],
            shape: null,
            DWindex: 0,
            startup: function () {
                // 数组用于存放添加点的Id删除实体点的时候会用到
                var pointId = [];

                // 鼠标事件
                var waterEntity;
                // 点击绘制按钮开始绘制
                var that = this;
                var yanmo;
                var flag = false;
                var flagScend = false;
                // 海拔
                var altitude = [];
                var drawingMode = 'polygon';
                var activeShape;
                var boildOne = null;
                var boildTwo = null;
                var boildThree = null;
                // 向三维场景中添加的点的集合
                var tempPoints = [];

                var positions = [];
                var handler = new Cesium.ScreenSpaceEventHandler(that.map.scene.canvas);
                var maps = "";

                this.layer = new CommonPointLayer3D({
                    id: 'location',
                    map: this.map
                });

                var self = this;
                var flag = true;

                // 暴露在外的接口
                topic.subscribe("Re/graph", lang.hitch(this, this.drawShape));

                var patterning;
                $('.dongDraw').click(function () {

                    //矩形
                    if ($(this)[0].id == "rectangle"){
                        patterning = "rectangle";
                    //圆形
                    }else if($(this)[0].id == "circle"){
                        patterning = "circle";
                    //多边形
                    }else if($(this)[0].id == "polygon"){
                        patterning = "polygon";
                    }

                    $(".location-m-style").hide();
                    self.DWindex = 0;

                    maps = "";
                    $("#loc-tab1-grid").html("");
                    $("#loc-tab2-grid").html("");
                    $("#loc-tab3-grid").html("");
                    that.deleteEntitys(that, pointId, that.shape, boildOne, boildTwo, boildThree, waterEntity,that.mapsId);

                    $('#dong_time').val(0.5)
                    $('.dong-progress .container #progress_bar').width(0);
                    $('.dong-progress').stop().hide();
                    $('#dong_echarts').stop().hide();
                    $('.jimu-widget-AnalysisOfBarrierLake p').stop().hide();
                    //if (handler != null) handler.destroy();
                    handler = new Cesium.ScreenSpaceEventHandler(that.map.scene.canvas)

                    clearInterval(yanmo);
                    yanmo = null;
                    positions = [];
                    var polygon = null;
                    var cartesian = null;
                    var floatingPoint; //浮动点
                    var activeShapePoints = [];
                    var active = null;
                    tempPoints = [];
                    altitude = [];
                    that.map.scene.globe.depthTestAgainstTerrain = false;

                    // handler = new Cesium.ScreenSpaceEventHandler(that.map.scene.canvas);
                    // 取消双击事件-追踪该位置
                    that.map.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

                    // 鼠标左键点击事件
                    handler.setInputAction(function (movement) {// 给鼠标点击增加的点添加随机的ID便于删除
                        var randomId = (Math.random() * 100 + 8) + (Math.random() * 500 + 102);

                        let ray = that.map.camera.getPickRay(movement.position);
                        cartesian = that.map.scene.globe.pick(ray, that.map.scene);
                        if (positions.length == 0) {
                            positions.push(cartesian.clone());
                            flagScend = true;
                        }
                        // positions.pop();
                        positions.push(cartesian);
                        // 向三维场景中添加点
                        var cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
                        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                        var heightString = cartographic.height;
                        tempPoints.push({
                            lon: longitudeString,
                            lat: latitudeString,
                            hei: heightString
                        });
                        altitude.push(Math.round(cartographic.height));
                        if (Cesium.defined(cartesian)) {
                            if (activeShapePoints.length === 0) {
                                floatingPoint = that.map.entities.add({
                                    // 给实体点添加ID
                                    id: '1a-2b-3c',
                                    name: '多边形面积',
                                    position: positions[positions.length - 1],
                                    point: {
                                        pixelSize: 6,
                                        color: Cesium.Color.RED,
                                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                                    }
                                });
                                pointId.push('1a-2b-3c');

                                activeShapePoints.push(cartesian);
                                var dynamicPositions = new Cesium.CallbackProperty(function () {
                                    if (drawingMode === 'polygon') {
                                        return new Cesium.PolygonHierarchy(activeShapePoints);
                                    }
                                    return activeShapePoints;
                                }, false);
                                that.graph = dynamicPositions;
                                active = that.drawShape(patterning); //绘制动态图
                            }
                            activeShapePoints.push(cartesian);
                            floatingPoint = that.map.entities.add({
                                // 给实体点添加ID
                                id: randomId,
                                name: '多边形面积',
                                position: positions[positions.length - 1],
                                point: {
                                    pixelSize: 6,
                                    color: Cesium.Color.RED,
                                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                                }
                            });

                            pointId.push(randomId);
                        }
                    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

                    // 鼠标移动事件
                    handler.setInputAction(function (event) {
                        if (positions.length == 0) {
                            that.map.entities.remove(boildOne);
                            var pick1 = new Cesium.Cartesian2(event.endPosition.x, event.endPosition.y);
                            var newPosition = that.map.scene.globe.pick(viewer.camera.getPickRay(pick1), that.map.scene);
                            boildOne = that.map.entities.add({
                                position: newPosition,
                                label: {
                                    show: true,
                                    text: '单击开始绘制',
                                    font: '16px',
                                    pixelOffset: new Cesium.Cartesian2(80, 0),
                                    showBackground: true,
                                    backgroundColor: Cesium.Color.fromBytes(126, 126, 126, 210)
                                },
                            })
                        }
                        if (positions.length == 2) {
                            that.map.entities.remove(boildOne);
                            that.map.entities.remove(boildTwo);
                            var pick1 = new Cesium.Cartesian2(event.endPosition.x, event.endPosition.y);
                            var newPosition = that.map.scene.globe.pick(viewer.camera.getPickRay(pick1), that.map.scene);
                            boildTwo = that.map.entities.add({
                                position: newPosition,
                                label: {
                                    show: true,
                                    text: '单击增加点',
                                    font: '16px',
                                    pixelOffset: new Cesium.Cartesian2(80, 0),
                                    showBackground: true,
                                    backgroundColor: Cesium.Color.fromBytes(126, 126, 126, 210)
                                },
                            })

                        }
                        if (positions.length > 2) {
                            that.map.entities.remove(boildOne);
                            that.map.entities.remove(boildTwo);
                            that.map.entities.remove(boildThree);
                            var pick1 = new Cesium.Cartesian2(event.endPosition.x, event.endPosition.y);
                            var newPosition = that.map.scene.globe.pick(viewer.camera.getPickRay(pick1), that.map.scene);
                            boildThree = that.map.entities.add({
                                position: newPosition,
                                label: {
                                    show: true,
                                    text: '单击增加点,右键点击完成绘制',
                                    font: '16px',
                                    pixelOffset: new Cesium.Cartesian2(120, 0),
                                    showBackground: true,
                                    backgroundColor: Cesium.Color.fromBytes(126, 126, 126, 210)
                                },
                            })
                        }

                        if (Cesium.defined(floatingPoint)) {
                            var pick1 = new Cesium.Cartesian2(event.endPosition.x, event.endPosition.y);
                            var newPosition = that.map.scene.globe.pick(viewer.camera.getPickRay(pick1), that.map.scene);
                            if (Cesium.defined(newPosition)) {
                                floatingPoint.position.setValue(newPosition);
                                activeShapePoints.pop();
                                activeShapePoints.push(newPosition);
                            }
                        }
                    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

                    // 鼠标右键点击事件
                    handler.setInputAction(function (movement) {
                        var cartographic = Cesium.Cartographic.fromCartesian(that.map.scene.globe.pick(that.map.camera.getPickRay(movement.position), that.map.scene));
                        // 向三维场景中添加点
                        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
                        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
                        var heightString = cartographic.height;
                        tempPoints.push({
                            lon: longitudeString,
                            lat: latitudeString,
                            hei: heightString
                        });

                        positions.push(activeShapePoints[activeShapePoints.length - 1])
                        if (positions.length >= 2) {
                            if (!Cesium.defined(polygon)) {
                                polygon = new PolygonPrimitive(positions);
                            } else {
                                positions.pop();
                                positions.push(cartesian);
                            }
                        }
                        if (activeShapePoints.length) {
                            that.graph = activeShapePoints;
                            activeShape = that.drawShape(patterning); //绘制最终图
                        }
                        // that.map.entities.remove(floatingPoint);
                        that.map.entities.remove(active);
                        that.map.entities.remove(boildOne);
                        that.map.entities.remove(boildTwo);
                        that.map.entities.remove(boildThree);
                        if (!flagScend) return;
                        flagScend = false;
                        altitude.push(Math.round(cartographic.height))
                        altitude.sort((a, b) => {
                            if (a > b) return 1;
                            else if (a < b) return -1;
                            else return 0;
                        })
                        $('#dong_max_height').val(altitude[altitude.length - 1])
                        $('#dong_min_height').val(altitude[0])
                        handler.destroy();
                        flag = true;

                        // 提取坐标信息
                        var list = waterEntity.polygon.hierarchy.getValue().positions;
                        // 存放坐标信息，做请求数据使用
                        var echartRings = [
                            []
                        ];

                        // 处理坐标信息，将世界坐标转换成经纬度
                        for (var i = 1; i < list.length; i++) {
                            var cartographic = Cesium.Cartographic.fromCartesian(list[i]);
                            var lat = Cesium.Math.toDegrees(cartographic.latitude);
                            var lng = Cesium.Math.toDegrees(cartographic.longitude);
                            echartRings[0].push(["[" + lng, lat + "]"])
                        }
                        // 发请求数据
                        maps = '{"rings":[[' + echartRings + ']],"spatialReference": {"wkid": 4490}}';

                        return;
                    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

                    var PolygonPrimitive = (function () {
                        function _(positions) {
                            this.options = {
                                name: '多边形',
                                polygon: {
                                    hierarchy: [],
                                    material: Cesium.Color.WHITE.withAlpha(0),
                                }
                            };

                            this.positions = positions;
                            this._init();
                        }
                        _.prototype._init = function () {
                            var _self = this;
                            //实时更新polygon.hierarchy
                            this.options.polygon.hierarchy = new Cesium.CallbackProperty(function () {
                                return new Cesium.PolygonHierarchy(positions)
                            }, false);
                            waterEntity = that.map.entities.add(this.options);
                            that.fixedWaterEntity = waterEntity;

                        };
                        return _;
                    })();

                });

                $('#loc_delet').click(function () {
                    //隐藏分页栏，清除分页下标
                    $(".location-m-style").hide();
                    self.DWindex = 0;

                    maps = "";
                    that.deleteEntitys(that, pointId, that.shape, boildOne, boildTwo, boildThree, waterEntity,that.mapsId);
					$("#loc-tab1-grid").html("");
					$("#loc-tab2-grid").html("");
					$("#loc-tab3-grid").html("");
					$('#loc_input').val("");
                });

                $('#loc_query').click(function () {

                    // 获取当前选中的文本
                    var target = document.getElementsByClassName("loc_click on");
                    var txt = target[0].innerText;
                    var input = $('#loc_input').val();
                    var where = "";
                    self.DWindex = 0;

                    if (txt == '水文站') {
                        url = "http://171.35.109.175:18080/arcgis/rest/services/GZSW/swzwzt/MapServer/0/query";
                             where = "STNM like '%" + input + "%'";
                    } else if (txt == '水位站') {
                        url = "http://171.35.109.175:18080/arcgis/rest/services/GZSW/swzwzt/MapServer/1/query";
                             where = "STNM like '%" + input + "%'";
                    } else if (txt == '雨量站') {
                        url = "http://171.35.109.175:18080/arcgis/rest/services/GZSW/swzwzt/MapServer/2/query";
                             where = "STNM like '%" + input + "%'";
                    } else if (txt == '水质站') {
                        url = "http://171.35.109.175:18080/arcgis/rest/services/GZSW/swzwzt/MapServer/3/query";
                             where = "zhswStationName like '%" + input + "%'";
                    } else if (txt == '中小河流站') {
                        url = "http://171.35.109.175:18080/arcgis/rest/services/GZSW/swzwzt/MapServer/4/query";
                             where = "STNM like '%" + input + "%'";
                    }

                    if (input != "" || maps !="") {
                        self.getLocData(url, self, txt, maps, where);
                    }else if (input == ""){
                        self.getLocData(url, self, txt, maps, "1=1");
                    }

                });

                $('.loc_click').on('click', function () {
                    // 当前选中添加类名，兄弟移除类名
                    $(this).removeClass("off").addClass("on").siblings().removeClass("on").addClass("off");

                    $('#loc_query').click();

                    // 获取当前选中的文本
                    var txt = $(this).text();
                    // 调方法，将文本传进去，做判断，是否显示或者隐藏
                    self.tab(txt);
                });

                //地图定位
                $('.location-box-list').on('click', '.location-lb', function (event) {
                    var index = $(this).index() + self.DWindex;
					topic.publish("gis/map/setCenter", {
						'lgtd': datas[index].x,
						'lttd': datas[index].y,
					}); //进行地图定位
                });
                //打开水面线工具
                $('#loc_openWin').click(function () {
                    that.deleteEntitys(that, pointId, that.shape, boildOne, boildTwo, boildThree, waterEntity,[]);
                    $('.jimu-widget-DynamicRiver').show();
                    topic.publish("openWin", {});
                });

                this.closeDeleteEntity = function () {
                    that.deleteEntitys(that, pointId, that.shape, boildOne, boildTwo, boildThree, waterEntity,that.mapsId);
                }

            },

            // 控制显示隐藏
            tab: function (pid) {
                if (pid == "水文站") {
                    document.getElementById('SWZD').style.display = "block";
                    document.getElementById('SWZ').style.display = "none";
                    document.getElementById('YLZ').style.display = "none";
                    document.getElementById('SZZ').style.display = "none";
                    document.getElementById('ZXHLZ').style.display = "none";
                } else if (pid == "水位站") {
                    document.getElementById('SWZD').style.display = "none";
                    document.getElementById('SWZ').style.display = "block";
                    document.getElementById('YLZ').style.display = "none";
                    document.getElementById('SZZ').style.display = "none";
                    document.getElementById('ZXHLZ').style.display = "none";
                } else if (pid == "雨量站") {
                    document.getElementById('SWZD').style.display = "none";
                    document.getElementById('SWZ').style.display = "none";
                    document.getElementById('YLZ').style.display = "block";
                    document.getElementById('SZZ').style.display = "none";
                    document.getElementById('ZXHLZ').style.display = "none";
                } else if (pid == "水质站") {
                    document.getElementById('SWZD').style.display = "none";
                    document.getElementById('SWZ').style.display = "none";
                    document.getElementById('YLZ').style.display = "none";
                    document.getElementById('SZZ').style.display = "block";
                    document.getElementById('ZXHLZ').style.display = "none";
                } else if (pid == "中小河流站") {
                    document.getElementById('SWZD').style.display = "none";
                    document.getElementById('SWZ').style.display = "none";
                    document.getElementById('YLZ').style.display = "none";
                    document.getElementById('SZZ').style.display = "none";
                    document.getElementById('ZXHLZ').style.display = "block";
                }
            },
            getLocData: function (url, self, txt, maps, where) {
                $.ajax({
                    url: url,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        f: 'pjson',
                        Where: where,
                        outFields: "*",
                        geometry: maps,
                        geometryType: "esriGeometryPolygon",
                    },
                    success: function (result) {
                        datas = [];
                        if (result.features.length > 0) {
                            for (var i = 0; i < result.features.length; i++) {
                            	if (result.features[i].attributes.STCD!=0 && result.features[i].attributes.STCD!=null){
                            		datas.push($.extend(result.features[i].attributes, result.features[i].geometry));
                                    self.mapsId.push("location"+result.features[i].attributes.OBJECTID);
								}
                            };
                        }

                        //同时显示到layer
                        self.layer.getData(datas, txt, this);

                        var cont = Math.ceil(datas.length/5);
                        $('.Pagination').pagination({
                            mode: 'fixed',
                            jump: true,
                            coping: false,
                            pageCount: cont,
                            count: 3,
                            callback: function (index) {
                                var listdata= [];
                                //显示页数
                                self.DWindex = (index.getCurrent()-1)*5;
                                var index = self.DWindex;
                                for (var i =index;i<index+5;i++ ){
                                    listdata.push(datas[i]);
                                    if (i == datas.length-1){
                                        break;
                                    }
                                }
                                self.createTable(listdata, txt);
                                self.layer.updateColor(listdata,txt);
                            }
                        });

                        //首次加载前5条数据
                        var data= [];
                        if (datas.length > 5){
                            for (var i = 0;i<5;i++){
                                data.push(datas[i]);
                            }
                        }else{
                            for (var i = 0;i<datas.length;i++){
                                data.push(datas[i]);
                            }
                        }
                        self.createTable(data, txt);
                        self.layer.updateColor(data,txt);
                    }
                });

            },
            createTable: function (data, txt) {
                var column, tab;
                $('#location-tab .location-box-list').empty();
                var CustomGrid = declare([Grid, Keyboard, Selection]);
                if (txt == '水文站') {
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            var div = "<div class='location-lb'>" +
                                //'<img style="width: 20px;height: 20px" src=http://www.sw797.com:801/gzsw3D/v2/images/icon/swenz.png>'+
                                '<a>' + (i + 1 + this.DWindex) + '、' + data[i].STNM + '</a>' + '&ensp;(' + data[i].STCD + ')' +
                                '<div class=location-zb><lable>流域：</lable>' + data[i]['流域'] + '</div>' +
                                '<div class=location-zb><lable>所在乡镇：</lable>' + data[i]['所在乡镇、'] + '</div>' +
                                "</div>";
                            $("#loc-tab1-grid").append(div);
                        }
                    } else {
                        var div = "<div class='location-lb'><a>无数据</a></div>"
                        $("#loc-tab1-grid").append(div);
                    }
                } else if (txt == '水位站') {
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            var div = "<div id='location-lb' class='location-lb'>" +
                                //'<img style="width: 20px;height: 20px" src=http://www.sw797.com:801/gzsw3D/v2/images/icon/swenz.png>'+
                                '<a>' + (i + 1 + this.DWindex) + '、' + data[i].STNM + '</a>' + '&ensp;(' + data[i].STCD + ')' +
                                '<div class=location-zb><lable>流域：</lable>' + data[i]['流域'] + '</div>' +
                                '<div class=location-zb><lable>所在乡镇：</lable>' + data[i]['所在乡镇、'] + '</div>' +
                                "</div>";
                            $("#loc-tab2-grid").append(div);

                        }
                    } else {
                        var div = "<div class='location-lb'><a>无数据</a></div>"
                        $("#loc-tab2-grid").append(div);
                    }
                } else if (txt == '雨量站') {
                    if (data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            var div = "<div id='location-lb' class='location-lb'>" +
                                //'<img style="width: 20px;height: 20px" src=http://www.sw797.com:801/gzsw3D/v2/images/icon/swenz.png>'+
                                '<a>' + (i + 1 + this.DWindex) + '、' + data[i].STNM + '</a>' + '&ensp;(' + data[i].STCD + ')' +
                                '<div class=location-zb><lable>流域：</lable>' + data[i]['流域'] + '</div>' +
                                '<div class=location-zb><lable>所在乡镇：</lable>' + data[i]['所在乡镇、村'] + '</div>' +
                                "</div>";
                            $("#loc-tab3-grid").append(div);
                        }
                    } else {
                        var div = "<div class='location-lb'><a>无数据</a></div>"
                        $("#loc-tab3-grid").append(div);
                    }
                } else if (txt == '水质站') {
                    tab = 'loc-tab4-grid'
                } else if (txt == '中小河流站') {
                    tab = 'loc-tab5-grid'
                }

            },
        drawShape: function (patterning) {
            var that = this;
            //当positionData为数组时绘制最终图，如果为function则绘制动态图
            var arr = typeof that.graph.getValue === 'function' ? that.graph.getValue(0).positions : that.graph;

            //矩形
            if (patterning == "rectangle"){
                that.shape = that.map.entities.add({
                    rectangle: {
                        coordinates: new Cesium.CallbackProperty(function () {
                            var obj = Cesium.Rectangle.fromCartesianArray(arr);
                            //if(obj.west==obj.east){ obj.east+=0.000001};
                            //if(obj.south==obj.north){obj.north+=0.000001};
                            return obj;
                        }, false),
                        material: Cesium.Color.RED.withAlpha(0.5)
                    }
                });
                that.fixedShape = that.shape;
                //圆形
            }else if(patterning == "circle"){
                that.shape = that.map.entities.add({
                    position: arr[0],
                    name: 'Blue translucent, rotated, and extruded ellipse with outline',
                    type: 'Selection tool',
                    ellipse: {
                        semiMinorAxis: new Cesium.CallbackProperty(function () {
                            //半径 两点间距离
                            var r = Math.sqrt(Math.pow(arr[0].x - arr[arr.length - 1].x, 2) + Math
                                .pow(arr[0].y - arr[arr.length - 1].y, 2));
                            return r ? r : r + 1;
                        }, false),
                        semiMajorAxis: new Cesium.CallbackProperty(function () {
                            var r = Math.sqrt(Math.pow(arr[0].x - arr[arr.length - 1].x, 2) + Math
                                .pow(arr[0].y - arr[arr.length - 1].y, 2));
                            return r ? r : r + 1;
                        }, false),
                        material: Cesium.Color.BLUE.withAlpha(0.5),
                        outline: true
                    }
                });
                that.fixedShape = that.shape;
                //多边形
            }else if(patterning == "polygon"){
                that.shape = that.map.entities.add({
                    polygon: {
                        hierarchy: that.graph,
                        material: Cesium.Color.fromBytes(252, 193, 10, 130)
                    }
                });
                that.fixedShape = that.shape;
            }




                return that.shape
            },

            onOpen: function () {
                $('.location-m-style').hide();
                this.layer ? this.layer.setVis(true) : '';
            },

            onClose: function () {
                $('.location-m-style').hide();
                //面板关闭的时候触发 （when this panel is closed trigger）
				$("#loc-tab1-grid").html("");
				$("#loc-tab2-grid").html("");
				$("#loc-tab3-grid").html("");
				$('#loc_input').val("");
                this.closeDeleteEntity();
                this.layer ? this.layer.setVis(false) : '';
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

            deleteEntitys: function (that, pointId, shape, boildOne, boildTwo, boildThree, waterEntity,mapsId) {

                if (pointId.length>0) {
                    for (var i = 0; i < pointId.length; i++) {
                        that.map.entities.removeById(pointId[i]);
                    }

                    pointId = [];
                }

                if (mapsId.length>0){
                    for (var i = 0; i < mapsId.length; i++) {
                        that.map.entities.removeById(mapsId[i]);
                    }
                    that.mapsId = [];
                }
                that.map.entities.remove(shape);
                that.map.entities.remove(boildOne);
                that.map.entities.remove(boildTwo);
                that.map.entities.remove(boildThree);
                if (waterEntity != null) {
                    that.map.entities.removeById(waterEntity._id);
                }
            }
        });
    });