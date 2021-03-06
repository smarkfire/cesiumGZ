define(['dojo/_base/lang',
    'dojo/_base/array',
    "dojo/_base/declare",
    'dojo/topic',
    'jimu/dijit/Popup',
    './GeologicalDisasterPanel',
    'libs/layer/layer.js'
],
    function (lang,
        array,
        declare,
        topic,
        Popup,
        GeologicalDisasterPanel,
        layer
    ) {

        return declare("practice.cesium.layers.CommonPointLayer3D", [], { // 三维点图层
            id: null,
            map: null,
            showName: "siteName", //title显示字段
            idField: "siteCode",  // 声明的类似变量，用来储存数据，或者布尔值
            ind: 'ind',
            firstLoad: true,
            billboards: null,
            labels: null,
            currentVis: true,
            labelVis: false,
            swzwEntityID: [],
            constructor: function (option) {
                this.id = option.id;
                this.map = option.map;
                this.billboards = null;
                this.labels = null;
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
            getData: function (list, txt) {
                //判断下
                this.txt = txt;
                if (!lang.isArray(list)) {
                    var ls = list.data;
                    this.filterData = list.filterData;
                    list = ls;
                }
                if (this.firstLoad) {
                    this.labels = [];
                    this.billboards = [];

                    this.movehandLerNetWork();
                    this.firstLoad = false;
                } else {
                    //循环删除
                    for (var i = 0; i < this.billboards.length; i++) {

                        this.map.entities.remove(this.billboards[i]);
                        this.map.entities.remove(this.labels[i]);
                    }
                    this.labels = [];
                    this.billboards = [];
                }
                this.datas = {};
                for (var i = 0; i < list.length; i++) {
                    var lgtd = Number(list[i].lgtd);
                    var lttd = Number(list[i].lttd);
                    /**
                     * @billbo 对象，确定entities中billboard的值
                     * @labble 对象，确定entities中lable的值
                     * 
                     */

                    var billbo, labble, colorBill;

                    if (txt == "水位站") {
                        // 与实体相关的图片
                        billbo = {
                            image: './images/swhdz.png',
                            pixelOffset: new Cesium.Cartesian2(0, 0),
                            color: Cesium.Color.fromBytes(128, 255, 255),
                            width: 20,
                            height: 20,
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }
                        // 与实体相关的文字
                        labble = {
                            show: true,
                            text: list[i][this.showName], // text 与实体相关的文字
                            font: "700 14px '黑体'",
                            fillColor: Cesium.Color.DEEPSKYBLUE,
                            // backgroundColor: Cesium.Color.DEEPSKYBLUE,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            outlineWidth: 2,
                            outlineColor: Cesium.Color.fromBytes(255, 255, 255), // 文字轮廓的颜色
                            verticalOrigin: Cesium.VerticalOrigin.CENTER,//垂直位置
                            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,//水平位置
                            pixelOffset: new Cesium.Cartesian2(10, -10), // 文字位置
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        };
                    } else if (txt == "水文站") {
                        billbo = {
                            image: "./images/hedaoz.png",
                            pixelOffset: new Cesium.Cartesian2(0, 0),
                            color: Cesium.Color.fromBytes(128, 255, 255),
                            width: 20,
                            height: 20,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }
                        // 与实体相关的文字
                        labble = {
                            show: true,
                            text: list[i][this.showName], // text 与实体相关的文字
                            font: "700 14px '黑体'",
                            fillColor: Cesium.Color.DEEPSKYBLUE,
                            // backgroundColor: Cesium.Color.DEEPSKYBLUE,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            outlineWidth: 2,
                            outlineColor: Cesium.Color.fromBytes(255, 255, 255), // 文字轮廓的颜色
                            verticalOrigin: Cesium.VerticalOrigin.CENTER,//垂直位置
                            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,//水平位置
                            pixelOffset: new Cesium.Cartesian2(10, -10), // 文字位置
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        };

                    } else if (txt == "雨量站") {
                        billbo = {
                            image: "./images/jiangshui_sq.png",
                            pixelOffset: new Cesium.Cartesian2(0, 0),
                            color:Cesium.Color.fromBytes(0, 255, 0),
                            width: 10,
                            height: 10,
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }
                        labble = {
                            show: true,
                            text: list[i][this.showName], // text 与实体相关的文字
                            font: "700 14px '黑体'",
                            fillColor: Cesium.Color.DEEPSKYBLUE,
                            // backgroundColor: Cesium.Color.DEEPSKYBLUE,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            outlineWidth: 2,
                            outlineColor: Cesium.Color.fromBytes(255, 255, 255), // 文字轮廓的颜色
                            verticalOrigin: Cesium.VerticalOrigin.CENTER,//垂直位置
                            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,//水平位置
                            pixelOffset: new Cesium.Cartesian2(10, -10), // 文字位置
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        };
                    } else if (txt == "中小河流站") {
                        billbo = {
                            image: "./images/hedaoz.png",
                            pixelOffset: new Cesium.Cartesian2(0, 0),
                            color:Cesium.Color.fromBytes(42 ,99 ,175),
                            width: 20,
                            height: 20,
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }
                        labble = {
                            show: true,
                            text: list[i][this.showName], // text 与实体相关的文字
                            font: "700 14px '黑体'",
                            fillColor: Cesium.Color.DEEPSKYBLUE,
                            // backgroundColor: Cesium.Color.DEEPSKYBLUE,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            outlineWidth: 2,
                            outlineColor: Cesium.Color.fromBytes(255, 255, 255), // 文字轮廓的颜色
                            verticalOrigin: Cesium.VerticalOrigin.CENTER,//垂直位置
                            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,//水平位置
                            pixelOffset: new Cesium.Cartesian2(10, -10), // 文字位置
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        };
                    }
                    this.map.scene.globe.depthTestAgainstTerrain = false;
                    var label = this.map.entities.add({
                        position: Cesium.Cartesian3.fromDegrees(lgtd, lttd, 100),
                        label: labble
                    });
                    this.labels.push(label);
                    var bill = this.map.entities.add({
                        id: list[i][this.ind] + this.id + txt + list[i][this.idField],
                        name: list[i][this.showName],
                        position: Cesium.Cartesian3.fromDegrees(lgtd, lttd, 100),
                        billboard: billbo
                    });
                    this.billboards.push(bill);
                    this.datas[list[i][this.idField]] = list[i];
                    this.swzwEntityID.push(list[i][this.ind] + this.id + txt + list[i][this.idField]);
                }
                this.setVis(this.currentVis);
            },
            updateColor: function (billboards,txt){
                var chusColor;
                var selectedColor;
                if(txt == "水文站"){
                    chusColor =Cesium.Color.fromBytes(128, 255, 255);
                    selectedColor = new Cesium.Color(20, 20, 0, 1);
                }else if(txt =="水位站"){
                    chusColor =Cesium.Color.fromBytes(128, 255, 255);
                    selectedColor = new Cesium.Color(20, 20, 0, 1);
                }else if(txt =="雨量站"){
                    chusColor =Cesium.Color.fromBytes(0, 255, 0);
                    selectedColor = new Cesium.Color(20, 20, 0, 1);
                }else if(txt =="中小河流站"){
                    chusColor =Cesium.Color.fromBytes(42, 99 ,175);
                    selectedColor = new Cesium.Color(20, 20, 0, 1);

                }

                for (var i = 0; i < this.billboards.length; i++) {
                    this.billboards[i].billboard.color._value=chusColor;
                }
                for (var i = 0; i < billboards.length; i++) {
                    viewer.entities.getById(billboards[i][this.ind] + this.id + txt + billboards[i][this.idField]).billboard.color._value=selectedColor;
                }
            },
            setVisible: function (vis) { //设置可见不可见
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
            // 获取事件
            movehandLerNetWork: function () {
                // 取消默认双击事件
                this.map.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
                // 获取鼠标事件
                var handler = new Cesium.ScreenSpaceEventHandler(this.map.scene.canvas);
                // 给鼠标左键添加事件函数
                handler.setInputAction(lang.hitch(this, this.clickHand), Cesium.ScreenSpaceEventType.LEFT_CLICK);
            },
            // 注册鼠标左键单击事件
            clickHand: function (movement) {
                var self = this;
                var pickedObjects = this.map.scene.drillPick(movement.position);
                if (Cesium.defined(pickedObjects)) {
                    for (var i = 0; i < pickedObjects.length; ++i) {
                        if (pickedObjects[i].id.id) {
                            var id = pickedObjects[i].id.id;
                            if (this.swzwEntityID.indexOf(id) != -1) {
                                if (id.indexOf("水文站") != -1 && id.split("水文站")[1].substring(0, 8).length == 8) {
                                    var swid = id.split("水文站")[1].substring(0, 8);
                                    var swName = pickedObjects[i].id.name;
                                    self.openWinLayer("水文站", swid, swName);
                                    break;
                                } else if (id.indexOf("水位站") != -1 && id.split("水位站")[1].substring(0, 8).length == 8) {
                                    var swid = id.split("水位站")[1].substring(0, 8);
                                    var swName = pickedObjects[i].id.name;
                                    self.openWinLayer("水位站", swid, swName);
                                    break;
                                } else if (id.indexOf("雨量站") != -1 && id.split("雨量站")[1].substring(0, 8).length == 8) {
                                    var swid = id.split("雨量站")[1].substring(0, 8);
                                    var swName = pickedObjects[i].id.name;
                                    self.openWinLayer("雨量站", swid, swName);
                                    break;
                                } else if (id.indexOf("中小河流站") != -1 && id.split("中小河流站")[1].substring(0, 8).length == 8) {
                                    var swid = id.split("中小河流站")[1].substring(0, 8);
                                    var swName = pickedObjects[i].id.name;
                                    self.openWinLayer("中小河流站", swid, swName);
                                    break;
                                }
                            }
                        }
                    }
                }
            },
            // 点击弹出面板;
            openWinLayer: function (txt, id, name) {
                if (txt == "水文站" || txt == "水位站" || txt == "中小河流站") {
                    var url = "./widgets/Layermanagement/popup/river.html";
                } else if (txt == "雨量站") {
                    var url = "./widgets/Layermanagement/popup/rain.html";
                }

                var top = ($(window).height()-526)/2;
                var left = ($(window).width()-802-340)/2+340;
                layer.open({
                    title: name,
                    type: 2,
                    shadeClose: true,
                    shade: false,
                    maxmin: true, //开启最大化最小化按钮
                    area: ['802px', '526px'],
                    offset: [top,left],
                    content: url + "?id=" + id,
                    id: "layermanagement",
                    closeBtn: 1,
                });
            },
            setVis: function (vis) {
                this.currentVis = vis;
                this.setVisible(vis);
            },
        });
    });