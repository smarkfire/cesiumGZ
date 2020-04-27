define(['dojo/_base/lang',
        'dojo/_base/array',
        "dojo/_base/declare",
        'dojo/topic',
        'jimu/dijit/Popup',
        './GeologicalDisasterPanel'
    ],
    function (lang,
              array,
              declare,
              topic,
              Popup,
              GeologicalDisasterPanel
    ) {

        return declare("practice.cesium.layers.CommonPointLayer3D", [], { // 三维点图层

            map: null,

            labelLayer: null,
            selected: null,
            defaultSymbolImage: "base/images/marker/marker_green.png",
            catalog: "",
            layerName: "",
            showName: "name",//title显示字段
            idField: "id",
            constructor: function () {
                this.billboards = null;
                this.labels = null;

                var tStr = 'layer/GeologicalDisaster/';
                //接收服务端的数据
                topic.subscribe(tStr + "data", lang.hitch(this, this.getData));
                //控制可见
                topic.subscribe(tStr + "visible", lang.hitch(this, this.setVis));
            },

            destroy: function () {
                for (var i = 0, max = this.labels.length; i < max; i++) {
                    var item = this.labels[i];
                    this.map.entities.remove(item);

                }
                for (var i = 0, max = this.billboards.length; i < max; i++) {
                    var item = this.billboards[i];
                    this.map.entities.remove(item);
                }

                this.labels = null;
                this.billboards = null;

                this.inherited(arguments);
            },

            setMap: function (map) {
                this.map = map;
            },
            firstLoad: true,
            billboards: null,
            labels: null,
            getData: function (list) {
                //判断下
                if (!lang.isArray(list)) {
                    var ls = list.data;
                    this.filterData = list.filterData;
                    list = ls;
                }

                if (this.firstLoad) {
                    this.labels = [];
                    this.billboards = [];

                    this.moveHandler();
                    this.firstLoad = false;
                } else {
                    //循环删除
                    for(var i=0;i<this.billboards.length;i++){

                        this.map.entities.remove(this.billboards[i]);
                        this.map.entities.remove(this.labels[i]);
                    }
                    this.labels = [];
                    this.billboards = [];
                }
                this.datas = {};

                for (var i = 0; i < list.length; i++) {
                    var lgtd = list[i].lgtd;
                    var lttd = list[i].lttd;
                    var label = this.map.entities.add({
                        position : Cesium.Cartesian3.fromDegrees(lgtd, lttd ),
                        label : {
                            text: list[i][this.showName],
                            font: '13px sans-serif',
                            fillColor : Cesium.Color.YELLOW,
                            outlineColor : Cesium.Color.BLACK,
                            outlineWidth : 2,
                            style : Cesium.LabelStyle.FILL_AND_OUTLINE,
                            horizontalOrigin: Cesium.HorizontalOrigin.TOP,
                            verticalOrigin :Cesium.VerticalOrigin.BOTTOM  ,
                            heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
                            pixelOffset: new Cesium.Cartesian2(0, 8),
                            pixelOffsetScaleByDistance: new Cesium.NearFarScalar(1.5e2, 3.0, 1.5e7, 0.5)
                        }
                    });
                    this.labels.push(label);
                    var bill = this.map.entities.add({
                        id: list[i][this.idField],
                        position : Cesium.Cartesian3.fromDegrees(lgtd, lttd ),
                        billboard : {
                            image : "images/marker_green.png",
                            pixelOffset: new Cesium.Cartesian2(0, 0),
                            heightReference : Cesium.HeightReference.CLAMP_TO_GROUND
                        }
                    });
                    this.billboards.push(bill);
                    this.datas[list[i][this.idField]] = list[i];
                }
                this.setVis(this.currentVis);
            },

            setVisible: function (vis) {//设置可见不可见
                if (this.billboards) {
                    var len = this.billboards.length;
                    for (var i = 0; i < len; ++i) {
                        var b = this.billboards[i];
                        b.show = vis;
                    }
                    var len = this.labels.length;
                    for (var i = 0; i < len; ++i) {
                        var b = this.labels[i];
                        b.show = vis;
                    }
                }
            },
            moveHandler: function () {
                var handler = new Cesium.ScreenSpaceEventHandler(this.map.scene.canvas);
                //handler.setInputAction(lang.hitch(this, this.clickHandler), Cesium.ScreenSpaceEventType.LEFT_CLICK);
            },
            clickHandler: function (movement) {
                var pickedObjects = this.map.scene.drillPick(movement.position);
                if (Cesium.defined(pickedObjects)) {
                    if (this.show3DSymbol) {
                        for (var i = 0; i < pickedObjects.length; ++i) {
                            var obj = pickedObjects[i].id;
                            if (this.datas.hasOwnProperty(obj._id)) {
                                this.openWindow(this.datas[obj._id]);
                                break;
                            }
                        }
                    } else {
                        for (var i = 0; i < pickedObjects.length; ++i) {
                            var obj = pickedObjects[i].id;
                            if (this.datas.hasOwnProperty(obj.id)) {
                                this.openWindow(this.datas[obj.id]);
                                break;
                            }
                        }
                    }

                }
            },
            openWindow: function (item) {
                //点击测站的弹出框的内容，面板，单独的widget 可传参数
                var panel = new GeologicalDisasterPanel({ data: item });

                new Popup({
                    content: panel,
                    titleLabel: item[this.showName],
                    width: 705,
                    height: 415 ,
                    buttons: []
                });
            },
            currentVis: true,
            labelVis: false,
            setVis: function (vis) {
                this.currentVis = vis;
                this.setVisible(vis);
            }
        });
    });