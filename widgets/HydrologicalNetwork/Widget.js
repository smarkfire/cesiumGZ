///////////////////////////////////////////////////////////////////////////
// Copyright © 2018 NarutoGIS. All Rights Reserved.
// 模块描述: 水文站网
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
    'libs/laydate/laydate.js',
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
        CommonPointLayer3D,
        laydate
    ) {

        return declare([BaseWidget], {
            baseClass: 'jimu-widget-HydrologicalNetwork',
            name: 'HydrologicalNetwork',
            layer: null,
            netWorkSelectedMode: null,
            netWorkSite: [],
            netWorkSiteNew: [],
            netWorkImportant: [],
            netWorkEasy: [],
            startup: function () {
                var self = this;
                this.inherited(arguments);
                /**
                 * this 指向重新赋值
                 */
                // 定义请求地址

                this.layer = new CommonPointLayer3D({
                    id: 'swzwLayer',
                    map: this.map
                });

                $('.jimu-widget-HydrologicalNetwork .hydroworktab ul li').on('click', function () {
                    $('.jimu-widget-HydrologicalNetwork .net-work-loadbox').stop().show();
                    $(this).addClass("on").siblings().removeClass("on");
                    // 获取当前选中的文本
                    var txt = $(this).text();
                    // 调方法，将文本传进去，做判断，是否显示或者隐藏
                    $($('.hydroworklist > div').eq($(this).index())).stop().show().siblings().stop().hide();
                    // 做判断，定义请求地址，和请求参数
                    $('.jimu-widget-HydroNetWorkDetails').css('display', 'none');
                    topic.publish("loadWater", null);
                    if (self.netWorkSelectedMode) {
                        self.map.scene.primitives.remove(self.netWorkSelectedMode);
                    }
                    $('.roaming-tool').css('display', 'none');
                    if (txt == '重要水文站' || txt == "易淹没区") {
                        if (self.layer.billboards && self.layer.billboards.length > 0) {
                            for (var i = 0; i < self.layer.billboards.length; i++) {
                                self.map.entities.remove(self.layer.billboards[i]);
                                self.map.entities.remove(self.layer.labels[i]);
                            }
                            self.layer.labels = [];
                            self.layer.billboards = [];
                        }

                        url = "./widgets/HydrologicalNetwork/datas.json";
                        self.getJsonUrl(url, txt);
                       
                        
                    } else {
                        if (txt == "水位站") {
                            url = "http://www.sw797.com:82/blade-ycreal/site/selectList?sttp=ZZ";
                            self.getHttpUrl(url, txt);
                        } else if (txt == "水文站") {
                            url = "http://www.sw797.com:82/blade-ycreal/site/selectList?sttp=ZQ";
                            self.getHttpUrl(url, txt);
                        } else if (txt == "雨量站") {
                            url = "http://www.sw797.com:82/blade-ycreal/site/selectList?sttp=PP";
                            self.getHttpUrl(url, txt);
                        } else if (txt == "中小河流站") {
                            url = "http://www.sw797.com:82/blade-ycreal/site/selectList?sttp=ZX";
                            self.getHttpUrl(url, txt);
                        }
                    }
                    // 调用方法，发送请求
                });

                $("#hydroWorkOne .net-work-query .net-work-search").click(function () {
                    var str = $(this).prev().val();
                    self.importantEasyQuery(str, "重要水文站", this);
                });

                $("#hydroWorkTwo .net-work-query .net-work-search").click(function () {
                    var str = $(this).prev().val();
                    self.importantEasyQuery(str, "易淹没区", this)
                });

                $("#hydroWorkThree .net-work-query .net-work-search").click(function () {
                    var str = $(this).prev().val();
                    self.siteFuzzyQuery(str, "水位站", this)
                });

                $("#hydroWorkFour .net-work-query .net-work-search").click(function () {
                    var str = $(this).prev().val();
                    self.siteFuzzyQuery(str, "水文站", this)
                });

                $("#hydroWorkFive .net-work-query .net-work-search").click(function () {
                    var str = $(this).prev().val();
                    self.siteFuzzyQuery(str, "雨量站", this)
                });

                $("#hydroWorkSix .net-work-query .net-work-search").click(function () {
                    var str = $(this).prev().val();
                    self.siteFuzzyQuery(str, "中小河流站", this)
                });


            },

            siteFuzzyQuery: function (str, txt, that) {
                this.netWorkSiteNew = [];
                var ind = 0;
                if (this.netWorkSite.length != 0) {
                    this.netWorkSite.forEach((item, index) => {
                        if (item.siteName.indexOf(str) != -1 || item.siteCode.indexOf(str) != -1) {
                            item.ind = ind += 1;
                            this.netWorkSiteNew.push(item);
                        }
                    })
                }
                //this.createList(this.netWorkSiteNew, txt);
                this.pageColor(this.netWorkSiteNew,txt);
                //$(that).prev().val('');
            },

            importantEasyQuery: function (str, txt, that) {
                this.netWorkSiteNew = [];
                var ind = 0;
                if (txt == "重要水文站") {
                    if (this.netWorkImportant.length != 0) {
                        this.netWorkImportant.forEach((item, index) => {
                            if (item.name.indexOf(str) != -1 || item.sitecode.indexOf(str) != -1) {
                                item.ind = ind += 1;
                                this.netWorkSiteNew.push(item);
                            }
                        })
                    }
                    this.createList(this.netWorkSiteNew, txt);
                } else {
                    if (this.netWorkEasy.length != 0) {
                        this.netWorkEasy.forEach((item, index) => {
                            if (item.name.indexOf(str) != -1 || item.sitecode.indexOf(str) != -1) {
                                item.ind = ind += 1;
                                this.netWorkSiteNew.push(item);
                            }
                        })
                    }
                    this.createList(this.netWorkSiteNew, txt);
                }
                //$(that).prev().val('');
            },

            onMinimize: function () {
                this.resize();
            },

            onMaximize: function () {
                this.resize();
            },

            onOpen: function () {
                //面板打开的时候触发 （when open this panel trigger）
                this.layer ? this.layer.setVis(true) : '';
               
                $('.hydroworktab ul li:eq(0)').trigger('click');
            },

            onClose: function () {
                //面板关闭的时候触发 （when this panel is closed trigger）
                this.layer ? this.layer.setVis(false) : '';
                $('.jimu-widget-HydroNetWorkDetails').css('display', 'none');
                $('.jimu-widget-HydroNetWorkDetails .net-work-details').stop().hide();
                $('.jimu-widget-HydrologicalNetwork .net-work-loadbox').stop().hide();
                $('.roaming-tool').css('display', 'none');
                topic.publish("loadWater", null);
                if (this.netWorkSelectedMode) {
                    this.map.scene.primitives.remove(this.netWorkSelectedMode);
                }
                var handler = new Cesium.ScreenSpaceEventHandler(this.map.scene.canvas);
                handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            },

            resize: function () {

            },

            destroy: function () {
                this.inherited(arguments);
            },

            //关键字过滤
            query: function () {
                var text = this.keyNode.value;
                if (text != "" && text.length > 0) {
                    var list = array.filter(this.datas, function (g) {
                        if (g.name.indexOf(text) > -1) {
                            return true;
                        } else {
                            return false;
                        }
                    }, this);
                    this.grid.refresh();
                    this.grid.renderArray(list);
                    //同时显示到layer
                    this.layer.getData(list);
                } else {
                    this.grid.refresh();
                    this.grid.renderArray(this.datas);
                    //同时显示到layer
                    this.layer.getData(this.datas);
                }
            },

            //http://dgrid.io/tutorials/1.0/hello_dgrid/    创建表格，给表格项添加点击事件，在地图上添加实体
            createList: function (dataList, txt) {
                $('.hydroworklist .location-box-list').empty();
                var CustomGrid = declare([Grid, Keyboard, Selection]);
                var grid = null;
                var locaBox = null;
                if (txt == "重要水文站" || txt == "易淹没区") {

                    if (txt == "重要水文站") {
                        locaBox = "swzw-tab1-grid";
                    } else {
                        locaBox = "swzw-tab2-grid";
                    }
                    grid = new CustomGrid({
                        columns: {
                            ind: "序号",
                            name: '名称',
                            sitecode: '编码'
                        },
                        selectionMode: 'single', // for Selection; only select a single row at a time
                        cellNavigation: false // for Keyboard; allow only row-level keyboard navigation
                    }, locaBox);
                    
                    grid.startup();

                    grid.renderArray(dataList);
                    $('.jimu-widget-HydrologicalNetwork .net-work-loadbox').stop().hide();
                    grid.on('dgrid-select', lang.hitch(this, function (event) {
                        topic.publish("openDetails", event.rows[0].data); //显示详情
                        $('.jimu-widget-HydroNetWorkDetails').css('display', 'block');
                        $('.jimu-widget-HydroNetWorkDetails .net-work-details').stop().hide();
                        $('.jimu-widget-HydroNetWorkDetails .net-work-details-btn').stop().show();
                        $('.roaming-tool').css('display', 'block');
                        
                        //console.log('Row selected: ', event.rows[0].data);
                        if (this.netWorkSelectedMode) {
                            this.map.scene.primitives.remove(this.netWorkSelectedMode);
                        }

                        this.netWorkSelectedMode = new Cesium.Cesium3DTileset({
                            //"url": this.folderUrl + "data/" + event.rows[0].data.folderName + "/tileset.json",
                            "url": "http://www.sw797.com:801/gzsw3D/v2/data/mx/" + event.rows[0].data.folderName + "/tileset.json",
                            "maximumScreenSpaceError": 0.1,
                            "maximumNumberOfLoadedTiles": 5000,
                            "luminanceAtZenith": 0.8
                        });

                        var tileset = this.map.scene.primitives.add(this.netWorkSelectedMode);
                        topic.publish("loadWater", event.rows[0].data); //绘制水面
                        function zoomToTileset(tileset) {
                            var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);

                            //console.log('经度: '+Cesium.Math.toDegrees(cartographic.longitude)+"---------纬度："+Cesium.Math.toDegrees(cartographic.latitude));
                            var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
                            var height = cartographic.height + event.rows[0].data.offsetModelHeight;
                            var offset = Cesium.Cartesian3.fromRadians(Cesium.Math.toRadians(event.rows[0].data.x), Cesium.Math.toRadians(event.rows[0].data.y), height);
                            var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
                            tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

                            setTimeout(function () {
                                topic.publish("gis/map/flyTo", {
                                    'longitude': event.rows[0].data.locationInfo.lgtd,
                                    'latitude': event.rows[0].data.locationInfo.lttd,
                                    "height": event.rows[0].data.locationInfo.height,
                                    "heading": event.rows[0].data.locationInfo.heading,
                                    "pitch": event.rows[0].data.locationInfo.pitch,
                                    "roll": event.rows[0].data.locationInfo.roll
                                }); //进行地图定位
                            }, 300);

                        }
                        // tileset数据加载好后，便缩放相机视角
                        tileset.readyPromise.then(zoomToTileset);

                    }));


                    this.grid = grid;
                } else {

                    var column = null;
                    if (txt == "水位站") {
                        locaBox = 'swzw-tab3-grid';
                    } else if (txt == "水文站") {
                        locaBox = 'swzw-tab4-grid';

                    } else if (txt == "雨量站") {
                        locaBox = 'swzw-tab5-grid';

                    } else if (txt == "中小河流站") {
                        locaBox = 'swzw-tab6-grid';
                    }
                    column = {
                        ind: '序号',
                        siteName: '名称',
                        siteCode: '编码'
                    };
                    grid = new CustomGrid({
                        columns: column,
                        selectionMode: 'single', // for Selection; only select a single row at a time
                        cellNavigation: false // for Keyboard; allow only row-level keyboard navigation
                    }, locaBox);
                    grid.startup();

                    grid.on('dgrid-select', function (event) {
                        topic.publish("gis/map/setCenter", {
                            'lgtd': event.rows[0].data.lgtd,
                            'lttd': event.rows[0].data.lttd
                        }); //进行地图定位
                    });
                    //同时显示到layer
                    grid.renderArray(dataList);
                    $('.jimu-widget-HydrologicalNetwork .net-work-loadbox').stop().hide();
                    this.grid = grid;
                }
            },


            // 发送请求，获取数据
            postUrl: function (url, data, self, txt) {
                $.ajax({
                    url: url,
                    data: {},
                    dataType: "json",
                    type: "get",
                    success: function (message) {

                    },
                });
            },

            getJsonUrl: function (url, txt) {
                var self = this;
                $.ajax({
                    url: url,
                    dataType: 'json',
                    type: 'get',
                    success: function (data) {
                        var importantArr = [];
                        var easyArr = [];
                        var i = 0;
                        var j = 0;
                        data.data.forEach((item, index) => {
                            if (item.type == "1") {
                                item.ind = i += 1;
                                importantArr.push(item)
                            } else if (item.type == "2") {
                                item.ind = j += 1;
                                easyArr.push(item)
                            }
                        })
                        if (txt == "重要水文站") {
                            self.createList(importantArr, txt);
                        } else {
                            self.createList(easyArr, txt);
                        }
                        self.netWorkImportant = importantArr;
                        self.netWorkEasy = easyArr;
                    }
                })
            },

            pageColor: function(message,txt){
                var self = this;
                self.layer.getData(message, txt, this);
                var cont = Math.ceil(message.length/20);
                $('.Pagination').pagination({
                    mode: 'fixed',
                    jump: true,
                    coping: false,
                    pageCount: cont,
                    callback: function (index) {
                        var listdata= [];
                        //显示页数
                        var index = (index.getCurrent()-1)*20;
                        for (var i =index;i<index+20;i++ ){
                            listdata.push(message[i]);
                            if (i == message.length-1){
                                break;
                            }
                        }
                        self.createList(listdata, txt);
                        self.layer.updateColor(listdata,txt);
                    }
                });

                //首次加载前25条数据
                var datas= [];
                if (message.length > 20){
                    for (var i = 0;i<20;i++){
                        datas.push(message[i]);
                    }
                }else{
                    for (var i = 0;i<message.length;i++){
                        datas.push(message[i]);
                    }
                }

                self.createList(datas, txt);
                self.layer.updateColor(datas,txt);
            },

            getHttpUrl: function (url, txt) {
                var self = this;
                $.ajax({
                    url: url,
                    dataType: 'JSON',
                    type: 'get',
                    success: function (data) {
                        self.netWorkSite = data.data;
                        data.data.forEach((item, index) => {
                            item.ind = index + 1;
                        });
                        self.pageColor(data.data,txt);
                    }
                })
            }
        });
    });