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
            id: null,
            map: null,
            showName: "name", //title显示字段
            smId: "siteId",
            firstLoad: true,
            billboards: null,
            labels: null,
            currentVis: true,
            labelVis: false,
            constructor: function (option) {
                this.id = option.id;
                this.map = option.map;
                this.billboards = null;
                this.labels = null;
                this.billboards = null;
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
                /**
                 *  @lgtd , @lttd 经纬度
                 *  @label ,与实体相关的点
                 * 
                 */
                for (var i = 0; i < list.length; i++) {
                    var lgtd = list[i].lgtd;
                    var lttd = list[i].lttd;
                    // var label = this.map.entities.add({
                    //     position : Cesium.Cartesian3.fromDegrees(lgtd, lttd, 100),
                    //     label : {
                    //         text: list[i][this.showName],
                    //         font: '13px sans-serif',
                    //         fillColor : Cesium.Color.YELLOW,
                    //         outlineColor : Cesium.Color.BLACK,
                    //         outlineWidth : 2,
                    //         style : Cesium.LabelStyle.FILL_AND_OUTLINE,
                    //         horizontalOrigin: Cesium.HorizontalOrigin.TOP,
                    //         verticalOrigin :Cesium.VerticalOrigin.BOTTOM  ,
                    //         heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
                    //         pixelOffset: new Cesium.Cartesian2(0, 8),
                    //         pixelOffsetScaleByDistance: new Cesium.NearFarScalar(1.5e2, 3.0, 1.5e7, 0.5),
                    //         disableDepthTestDistance: Number.POSITIVE_INFINITY
                    //     }
                    // });
                    // this.labels.push(label);
                    var bill = this.map.entities.add({
                        id: this.id + list[i][this.smId],
                        position : Cesium.Cartesian3.fromDegrees(lgtd, lttd, 100),
                        billboard : {
                            image : "images/shanhong.png",
                            width: 16,
                            height: 16,
                            pixelOffset: new Cesium.Cartesian2(0, 0),
                            heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }
                    });
                    this.billboards.push(bill);
                    this.datas[list[i][this.smId]] = list[i];
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
                handler.setInputAction(lang.hitch(this, this.clickHandler), Cesium.ScreenSpaceEventType.LEFT_CLICK);
            },
            clickHandler: function (movement) {
                var pickedObjects = this.map.scene.drillPick(movement.position);
                if (Cesium.defined(pickedObjects)) {
                    for (var i = 0; i < pickedObjects.length; ++i) {
                        var obj = pickedObjects[i].id;
                        var id = obj.id.split(this.id)[1];
                        if (this.datas.hasOwnProperty(id)) {
                            this.openWindow(this.datas[id]);
                            break;
                        }
                    }
                }
            },
            openWindow: function (item) {
                //点击测站的弹出框的内容，面板，单独的widget 可传参数
                var shpanel = new GeologicalDisasterPanel({ data: item });

                new Popup({
                    content: shpanel,
                    titleLabel: item.name,
                    titleNode: 'title',
                    width: 380,
                    height: 280,
                    buttons: []
                });
            },
            setVis: function (vis) {
                this.currentVis = vis;
                this.setVisible(vis);
            }
        });
    });