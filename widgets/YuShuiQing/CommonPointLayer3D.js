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
            idField: "xh",  // 声明的类似变量，用来储存数据，或者布尔值
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

                    this.movehandLer();
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
                    var lgtd = list[i].LGTD;
                    var lttd = list[i].LTTD ;
                    /**
                     * @billbo 对象，确定entities中billboard的值
                     * @labble 对象，确定entities中lable的值
                     * 
                     */

                    var billbo, labble, colorBill;

                    if (txt == "河道站") {
                        this.url = "./widgets/YuShuiQing/popup/river.html"
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
                    } else if (txt == "降水站") {
                        this.url = "./widgets/YuShuiQing/popup/rain.html"
                        billbo = {
                            image: "./images/jiangshui_sq.png",
                            pixelOffset: new Cesium.Cartesian2(0, 0),
                            color:Cesium.Color.fromBytes(0, 255, 0),
                            width: 10,
                            height: 10,
                            heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
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
                            disableDepthTestDistance: Number.POSITIVE_INFINITY,
                            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(1, 160000),
                        };

                    } else if (txt == "水库站") {
                        this.url = "./widgets/YuShuiQing/popup/weather.html"
                        billbo = {
                            image: "./images/shuiku_sq.png",
                            pixelOffset: new Cesium.Cartesian2(0, 0),
                            color:Cesium.Color.fromBytes(0 ,163 ,255),
                            width: 16,
                            height: 16,
                            heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
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
                            disableDepthTestDistance: Number.POSITIVE_INFINITY,
                            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(1, 160000),
                        };
                    }
                    this.map.scene.globe.depthTestAgainstTerrain = false;
                    var label = this.map.entities.add({
                        position: Cesium.Cartesian3.fromDegrees(lgtd, lttd, 100),
                        label: labble
                    });
                    this.labels.push(label);
                    var bill = this.map.entities.add({
                        id: this.id + list[i][this.idField],
                        position: Cesium.Cartesian3.fromDegrees(lgtd, lttd, 100),
                        billboard: billbo
                    });
                    this.billboards.push(bill);
                    this.datas[list[i][this.idField]] = list[i];
                }
                this.setVis(this.currentVis);
            },
            updateColor: function (billboards,txt){
                var chusColor;
                var selectedColor;
                if(txt == "河道站"){
                    chusColor =Cesium.Color.fromBytes(128, 255, 255);
                    selectedColor = new Cesium.Color(20, 20, 0, 1);
                }else if(txt =="降水站"){
                    chusColor =Cesium.Color.fromBytes(0, 255, 0);
                    selectedColor = new Cesium.Color(20, 20, 0, 1);
                }else if(txt =="水库站"){
                    chusColor =Cesium.Color.fromBytes(0 ,163 ,255);
                    selectedColor = Cesium.Color.fromBytes(255, 20, 0);
                }

                for (var i = 0; i < this.billboards.length; i++) {
                    this.billboards[i].billboard.color._value=chusColor;
                }
                for (var i = 0; i < billboards.length; i++) {
                    viewer.entities.getById(this.id + billboards[i].xh).billboard.color._value=selectedColor;
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
            movehandLer: function () {
                // 取消默认双击事件
                this.map.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
                // 获取鼠标事件
                var handler = new Cesium.ScreenSpaceEventHandler(this.map.scene.canvas);
                // 给鼠标左键添加事件函数
                handler.setInputAction(lang.hitch(this, this.clickHand), Cesium.ScreenSpaceEventType.LEFT_CLICK);
            },
            // 注册鼠标左键单击事件
            clickHand: function (movement) {
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
            // 点击弹出面板;
            openWindow: function (item) {
                var top = ($(window).height()-526)/2;
                var left = ($(window).width()-802-340)/2+340;
                layer.open({
                    title: item.STNM,
                    type: 2,
                    shadeClose: true,
                    shade: false,
                    maxmin: true, //开启最大化最小化按钮
                    area: ['802px', '526px'],
                    offset: [top,left],
                    content: this.url + "?id=" +item.id,
                    id: "YuShuiQing",
                    closeBtn: 1,
                });
            },
            setVis: function (vis) {
                this.currentVis = vis;
                this.setVisible(vis);
            },
        });
    });