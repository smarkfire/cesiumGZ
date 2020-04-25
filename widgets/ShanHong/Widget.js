///////////////////////////////////////////////////////////////////////////
// Copyright © 2018 NarutoGIS. All Rights Reserved.
// 模块描述: 山洪信息
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
    './CommonPointLayer3D'
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
            baseClass: 'jimu-widget-ShanHong',
            name: 'ShanHong',
            layer: null,
            startup: function () {
                // 山洪的config配置

                // {
                //     "name": "山洪信息",
                //         "uri": "widgets/ShanHong/Widget"
                // },



                this.inherited(arguments);
                var self = this;
                // select 选择，下拉选择，地图重置
                $('.shselect').change(function () {
                    // 表格清空
                    $("#shgrid")[0].innerHTML = '';
                    // 城市名称
                    var county = $(this).val();
                    // 不同的区域，相机飞的位置不同
                    if (county == "赣州市") {
                        self.map.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(115.257787, 25.885506, 549263.35)
                        });
                        self.createList(self.datas);
                        return
                    }
                    var dateJson = [];
                    self.datas.forEach((item, index) => {
                        if (item.cnnm == county) {
                            dateJson.push(item);
                        }
                    })
                    if (county == "信丰县") {
                        self.map.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(114.93, 25.28, 110000),
                            easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT
                        });
                    } else if (county == "大余县") {
                        self.map.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(114.35, 25.40, 100000),
                            easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT
                        });
                    } else if (county == "上犹县") {
                        self.map.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(114.22, 25.90, 100000),
                            easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT
                        });
                    } else if (county == "崇义县") {
                        self.map.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(114.14, 25.65, 100100),
                            easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT
                        });
                    } else if (county == "安远县") {
                        self.map.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(115.38, 25.26, 150305),
                            easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT
                        });
                    } else if (county == "龙南县") {
                        self.map.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(114.68, 24.74, 100505),
                            easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT
                        });
                    } else if (county == "定南县") {
                        self.map.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(115.03, 24.84, 100050),
                            easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT
                        });
                    } else if (county == "全南县") {
                        self.map.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(114.52, 24.90, 140030),
                            easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT
                        });
                    } else if (county == "宁都县") {
                        self.map.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(116.02, 26.54, 160900),
                            easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT
                        });
                    } else if (county == "于都县") {
                        self.map.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(115.42, 25.99, 133055),
                            easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT
                        });
                    } else if (county == "兴国县") {
                        self.map.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(115.35, 26.38, 140106),
                            easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT
                        });
                    } else if (county == "会昌县") {
                        self.map.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(115.78, 25.47, 155200),
                            easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT
                        });
                    } else if (county == "寻乌县") {
                        self.map.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(115.65, 24.91, 124060),
                            easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT
                        });
                    } else if (county == "南康市") {
                        self.map.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(114.75, 25.90, 159050),
                            easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT
                        });
                    }
                    self.createList(dateJson);
                })
                this.layer = new CommonPointLayer3D({
                    id: 'shLayer',
                    map: this.map
                });



            },

            onMinimize: function () {
                this.resize();
            },

            onMaximize: function () {
                this.resize();
            },
            onOpen: function () {
                //面板打开的时候触发 （when open this panel trigger）
                $('.load-box-list').show();
                this.layer ? this.layer.setVis(true) : '';
                // 面板打开时，相机的经纬度为赣州中心的经纬度，高度，自定
                this.map.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(115.257787, 25.885506, 549263.35)
                });
                var self = this;
                $('.shselect').val("赣州市");
                $.ajax({
                    url: 'http://www.sw797.com:82/blade-ycreal/torrent/query?',
                    type: 'get',
                    dataType: 'JSON',
                    success: function (result) {
                        self.datas = result.data;
                        $('.load-box-list').hide();
                        // 添加表格
                        self.createList(result.data);
                    }
                });
                /*dojo.xhrGet({
                    url: this.folderUrl + "/dates.json",
                    handleAs: "json",
                    preventCache: true,
                    load: function (json, ioargs) {
                        var aa = [];
                        // 对数据做处理
                        for (var i = 0; i < json.data.length; i++) {
                            var obj = json.data[i];
                            var newobj = {};
                            for (var j = 0; j < obj.fieldNames.length; j++) {
                                newobj[obj.fieldNames[j]] = obj.fieldValues[j];
                            }
                            json.data[i] = newobj;
                            json.data[i].NUM = i+1;
                        }
                        debugger
                        self.datas = json.data;
                        // 添加表格
                        self.createList(json.data);
                    },
                    error: function (error, ioargs) {}
                });*/


                // 发送请求

            },

            onClose: function () {
                //面板关闭的时候触发 （when this panel is closed trigger）
                this.layer ? this.layer.setVis(false) : '';
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

            //http://dgrid.io/tutorials/1.0/hello_dgrid/
            createList: function (dataList) {

                var CustomGrid = declare([Grid, Keyboard, Selection]);
                var grid = new CustomGrid({
                    columns: {
                        siteId: '序号',
                        name: '流域名称',
                        sectcd: '控制断面代码'
                    },
                    selectionMode: 'single', // for Selection; only select a single row at a time
                    cellNavigation: false // for Keyboard; allow only row-level keyboard navigation
                }, 'shgrid');
                grid.startup();
                grid.on('dgrid-select', lang.hitch(this, function (event) {
                    setTimeout(function () {
                        topic.publish("gis/map/setCenter", {
                            'lgtd': event.rows[0].data.lgtd,
                            'lttd': event.rows[0].data.lttd
                        }); //进行地图定位
                    }, 300);
                }));
                grid.renderArray(dataList);
                //同时显示到layer
                this.layer.getData(dataList);
                this.grid = grid;
            }
        });
    });