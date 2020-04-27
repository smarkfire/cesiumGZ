///////////////////////////////////////////////////////////////////////////
// Copyright © 2018 NarutoGIS. All Rights Reserved.
// 模块描述:模拟站点列表加载，并且和地图联动，弹出框，查询
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
            baseClass: 'jimu-widget-ListDemo',
            name: 'ListDemo',
            layer: null,
            startup: function () {

                this.inherited(arguments);

                this.layer = new CommonPointLayer3D();
                this.layer.setMap(this.map);

                var self = this;
                dojo.xhrGet({
                    url: this.folderUrl + "/datas.json",
                    handleAs: "json",
                    preventCache: true,
                    load: function (json, ioargs) {
                        self.datas = json.data;
                        self.createList(json.data);
                    },
                    error: function (error, ioargs) {}
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
                this.layer ? this.layer.setVis(true) : '';
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
                        name: '名称',
                        tm: '时间'
                    },
                    selectionMode: 'single', // for Selection; only select a single row at a time
                    cellNavigation: false // for Keyboard; allow only row-level keyboard navigation
                }, 'grid');

                grid.startup();

                grid.on('dgrid-select', function (event) {
                    topic.publish("gis/map/setCenter", {
                        'lgtd': event.rows[0].data.lgtd,
                        'lttd': event.rows[0].data.lttd
                    }); //进行地图定位

                });
                grid.renderArray(dataList);

                //同时显示到layer
                this.layer.getData(dataList);

                this.grid = grid;

            }
        });
    });