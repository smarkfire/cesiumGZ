define(['dojo/_base/lang',
        'dojo/_base/array',
        "dojo/_base/declare",
        'dojo/topic',
        'jimu/dijit/Popup',
        './Win/GeologicalDisasterPanel',
        './Win/hsymqPanel',
    ],
    function (lang,
        array,
        declare,
        topic,
        Popup,
        GeologicalDisasterPanel,
        hsymqPanel
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
                    var lgtd = Number(list[i].dj);
                    var lttd = Number(list[i].bw);
                    /**
                     * @billbo 对象，确定entities中billboard的值
                     * @labble 对象，确定entities中lable的值
                     * 
                     */

                    var billbo, labble, colorBill;

                    if (txt == "山洪风险区") {
                        this.url = "./widgets/YuShuiQing/popup/rain.html"
                        billbo = {
                            image: "./images/jiangshui_sq.png",
                            pixelOffset: new Cesium.Cartesian2(0, 0),
                            color: Cesium.Color.fromBytes(0, 255, 0),
                        width: 10,
                            height: 10,
                            heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }
                        labble = {
                            show: true,
                            text: list[i]["village_group"], // text 与实体相关的文字
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
                    } else if (txt == "洪水淹没区") {
                        this.url = "./widgets/YuShuiQing/popup/rain.html"
                        billbo = {
                            image: "./images/jiangshui_sq.png",
                            pixelOffset: new Cesium.Cartesian2(0, 0),
                            color: Cesium.Color.fromBytes(0, 255, 0),
                            width: 10,
                            height: 10,
                            heightReference : Cesium.HeightReference.CLAMP_TO_GROUND,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }
                        labble = {
                            show: true,
                            text: list[i]["villagegroup"].split("、")[0], // text 与实体相关的文字
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

            delEntity: function (){
                //循环删除
                for (var i = 0; i < this.billboards.length; i++) {
                    this.map.entities.remove(this.billboards[i]);
                    this.map.entities.remove(this.labels[i]);
                }
                this.labels = [];
                this.billboards = [];
            },
            updateColor: function (billboards){
                var chusColor =Cesium.Color.fromBytes(0, 255, 0);
                for (var i = 0; i < this.billboards.length; i++) {
                    this.billboards[i].billboard.color._value=chusColor;
                }
                var selectedColor = new Cesium.Color(20, 20, 0, 1);  //这里也可以自定义别的蓝色啦
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
                //点击测站的弹出框的内容，面板，单独的widget 可传参数
                
                if(this.txt == "山洪风险区"){
                    var shpanel = new GeologicalDisasterPanel({ data: item });
                    new Popup({
                        content: shpanel,
                        titleLabel: item.township,
                        titleNode: 'title',
                        width: 720,
                        height: 360,
                        buttons: []
                    });
                }else if("洪水淹没区"){
                    var shpanel = new hsymqPanel({ data: item });
                    new Popup({
                        content: shpanel,
                        titleLabel: item.township,
                        titleNode: 'title',
                        width: 760,
                        height: 400,
                        buttons: []
                    });
                }

            },
            setVis: function (vis) {
                this.currentVis = vis;
                this.setVisible(vis);
            },
        });
    });