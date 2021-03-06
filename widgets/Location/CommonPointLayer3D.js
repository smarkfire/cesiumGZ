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
            showName: "STNM", //title显示字段
            idField: "OBJECTID",  // 声明的类似变量，用来储存数据，或者布尔值
            firstLoad: true,
            billboards: null,
            currentVis: true,
            labelVis: false,
            constructor: function (option) {
                this.id = option.id;
                this.map = option.map;
                this.billboards = null;
            },

            destroy: function () {
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
                    this.billboards = [];

                    this.firstLoad = false;
                } else {
                    //循环删除
                    for (var i = 0; i < this.billboards.length; i++) {

                        this.map.entities.remove(this.billboards[i]);
                    }
                    this.billboards = [];
                }
                this.datas = {};
                for (var i = 0; i < list.length; i++) {
                    var lgtd = list[i].x;
                    var lttd = list[i].y ;
                    /**
                     * @billbo 对象，确定entities中billboard的值
                     * @labble 对象，确定entities中lable的值
                     * 
                     */
                    var billbo, labble, colorBill;

                    if (txt == "水文站") {
                        this.url = "./widgets/Location/popup/river.html"
                        // 与实体相关的图片
                        billbo = {
                            image: './images/hedao_sq.png',
                            pixelOffset: new Cesium.Cartesian2(0, 0),
                            color: Cesium.Color.fromBytes(128, 255, 255),
                            width: 16,
                            height: 16,
                            heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
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
                    } else if (txt == "水位站") {
                        this.url = "./widgets/Location/popup/river.html"
                        // 与实体相关的图片
                        billbo = {
                            image: "./images/swhdz.png",
                            pixelOffset: new Cesium.Cartesian2(0, 0),
                            color: Cesium.Color.fromBytes(128, 255, 255),
                            width: 16,
                            height: 16,
                            heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
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
                        this.url = "./widgets/Location/popup/rain.html"
                        // 与实体相关的图片
                        billbo = {
                            image: "./images/jiangshui_sq.png",
                            pixelOffset: new Cesium.Cartesian2(0, 0),
                            color: Cesium.Color.fromBytes(0, 255, 0),
                            width: 10,
                            height: 10,
                            heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
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
                            disableDepthTestDistance: Number.POSITIVE_INFINITY,
                            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(1, 160000),
                        };
                    } else if (txt == "水质站") {
                        // 与实体相关的图片
                        billbo = {
                            image: 'http://www.sw797.com:801/gzsw3D/v2/images/icon/szz.png',
                            pixelOffset: new Cesium.Cartesian2(0, 0),
                            width: 16,
                            height: 16,
                            heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }
                        // 与实体相关的文字
                        labble = {
                            show: true,
                            text: list[i][this.showName], // text 与实体相关的文字
                            font: "700 16px '黑体'",
                            fillColor: Cesium.Color.DEEPSKYBLUE,
                            // backgroundColor: Cesium.Color.DEEPSKYBLUE,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            outlineWidth: 3,
                            outlineColor: Cesium.Color.fromBytes(255, 255, 255), // 文字轮廓的颜色
                            verticalOrigin: Cesium.VerticalOrigin.CENTER,//垂直位置
                            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,//水平位置
                            pixelOffset: new Cesium.Cartesian2(10, -10), // 文字位置
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        };
                    } else if (txt == "中小河流站") {
                        // 与实体相关的图片
                        billbo = {
                            image: 'http://www.sw797.com:801/gzsw3D/v2/images/icon/zxhlz.png',
                            pixelOffset: new Cesium.Cartesian2(0, 0),
                            width: 16,
                            height: 16,
                            heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }
                        // 与实体相关的文字
                        labble = {
                            show: true,
                            text: list[i][this.showName], // text 与实体相关的文字
                            font: "700 16px '黑体'",
                            fillColor: Cesium.Color.DEEPSKYBLUE,
                            // backgroundColor: Cesium.Color.DEEPSKYBLUE,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            outlineWidth: 3,
                            outlineColor: Cesium.Color.fromBytes(255, 255, 255), // 文字轮廓的颜色
                            verticalOrigin: Cesium.VerticalOrigin.CENTER,//垂直位置
                            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,//水平位置
                            pixelOffset: new Cesium.Cartesian2(10, -10), // 文字位置
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        };
                    }
                    this.map.scene.globe.depthTestAgainstTerrain = false;
                    var bill = this.map.entities.add({
                        id: this.id + list[i][this.idField],
                        position: Cesium.Cartesian3.fromDegrees(lgtd, lttd, 100),
                        label: labble,
                        billboard: billbo
                    });
                    this.billboards.push(bill);
                    this.datas[list[i][this.idField]] = list[i];
                    this.movehandLerLocation();
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
                }

                for (var i = 0; i < this.billboards.length; i++) {
                    this.billboards[i].billboard.color._value=chusColor;
                }

                for (var i = 0; i < billboards.length; i++) {
                    viewer.entities.getById(this.id + billboards[i].OBJECTID).billboard.color._value=selectedColor;
                }
            },

            setVisible: function (vis) { //设置可见不可见
                if (this.billboards) {
                    var len = this.billboards.length;
                    for (var i = 0; i < len; ++i) {
                        var b = this.billboards[i];
                        b.show = vis;
                    }
                }
            },
            // 获取事件
            movehandLerLocation: function () {
                // 取消默认双击事件
                this.map.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
                // 获取鼠标事件
                var handler = new Cesium.ScreenSpaceEventHandler(this.map.scene.canvas);
                // 给鼠标左键添加事件函数
                handler.setInputAction(lang.hitch(this, this.clickHandLocation), Cesium.ScreenSpaceEventType.LEFT_CLICK);
            },
            // 注册鼠标左键单击事件
            clickHandLocation: function (movement) {
                var pickedObject = this.map.scene.drillPick(movement.position);
                if (Cesium.defined(pickedObject)) {
                    for (var i = 0; i < pickedObject.length; ++i) {
                        var arrObj = pickedObject[i].id;
                        var LocationId = arrObj.id.split(this.id)[1];
                        if (this.datas.hasOwnProperty(LocationId)) {
                            this.openWindow(this.datas[LocationId]);
                            break;
                        }
                    }
                }

            },
            // 点击弹出面板;
            openWindow: function (item) {
                var top = ($(window).height()-526)/2;
                var left = ($(window).width()-802-280)/2+280;
                layer.open({
                    title: item.STNM,
                    type: 2,
                    shadeClose: true,
                    shade: false,
                    maxmin: true, //开启最大化最小化按钮
                    area: ['802px', '526px'],
                    offset: [top,left],
                    content: this.url + "?id=" +item.STCD,
                    id: "Location",
                    closeBtn: 1,
                });
                $('#loc_openWin').val(item.STCD);
            },
            setVis: function (vis) {
                this.currentVis = vis;
                this.setVisible(vis);
            },
        });
    });