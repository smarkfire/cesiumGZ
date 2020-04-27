///////////////////////////////////////////////////////////////////////////
// Copyright © 2018 NarutoGIS. All Rights Reserved.
// 模块描述:控制地图底图配置的控制
///////////////////////////////////////////////////////////////////////////
define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/_base/array',
        'dojo/_base/html',
        'jimu/BaseWidget',
        'dojo/on',
        'dojo/aspect',
        'dojo/string',
        'jimu/utils',
        'jimu/css!libs/zTree_v3/css/metroStyle/metroStyle.css',
        'libs/zTree_v3/js/jquery.ztree.all'
    ],
    function (declare,
              lang,
              array,
              html,
              BaseWidget,
              on,
              aspect,
              string,
              utils
    ) {
        return declare([BaseWidget], {
            baseClass: 'jimu-widget-LayerControl',
            name: 'LayerControl',

            layers:{},
            startup: function () {
                this.inherited(arguments);

                //获取现有图层
                var imageryLayers = this.map.scene.globe.imageryLayers;
                for (var i = 0; i < imageryLayers.length; i++) {
                    var layer = imageryLayers.get(i);
                    this.layers[layer.label] = layer;
                }

                this.createPanel();
            },

            createPanel:function(){
                var that = this;
                function showIconForTree(treeId, treeNode) {
                    if(treeNode.hasOwnProperty("showIcon")){
                        return treeNode.showIcon;
                    }
                    return !treeNode.isParent;
                }

                var setting = {
                    check: {
                        enable: true
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    view:{
                        // showLine:false
                        // showIcon:false
                        showIcon: showIconForTree
                    },
                    callback: {
                        onCheck: lang.hitch(this,this.onCheck)
                    }
                };

                var zNodes =[
                    // { id:1, pId:0, name:"地图底图", open:true,nocheck:true},
                    // { id:11, pId:1, name:"随意勾选 1-1",checked:true,icon2:"images/basemaps/tiandituimage.png"},
                    // { id:12, pId:1, name:"随意勾选 1-1",icon2:"images/basemaps/tianditumap.png"},
                    // { id:2, pId:0, name:"业务图层",  open:true,nocheck:true},
                    // { id:21, pId:2, name:"随意勾选 2-1", checked:true},
                    // { id:22, pId:2, name:"随意勾选 2-2"},
                    // { id:44, pId:0, name:"地形",isTerrain:true ,icon2:"images/basemaps/tianditudem.png"}
                ];

                zNodes.push({ id:1, pId:0, name:"基础图层", open:true,nocheck:true});
                array.forEach(this.appConfig.map.basemaps, function (layerConfig, i) {
                    zNodes.push({ id:10+i, pId:1, name:layerConfig.label,checked:layerConfig.show});
                }, this);
                zNodes.push({ id:2, pId:0, name:"水文站网", open:true,nocheck:true});
                array.forEach(this.appConfig.map.swzwLayers, function (layerConfig, i) {
                    zNodes.push({ id:20+i, pId:2, name:layerConfig.label,checked:layerConfig.show});
                }, this);



                zNodes.push({ id:3, pId:0, name:"山洪水库专题", open:true,nocheck:true});
                array.forEach(this.appConfig.map.shLayers, function (layerConfig, i) {
                    zNodes.push({ id:30+i, pId:3, name:layerConfig.label,checked:layerConfig.show});
                }, this);
                zNodes.push({ id:4, pId:0, name:"东江源规划专题", open:true,nocheck:true});
                array.forEach(this.appConfig.map.djyLayers, function (layerConfig, i) {
                    zNodes.push({ id:40+i, pId:4, name:layerConfig.label,checked:layerConfig.show});
                }, this);
                //设置地形
//              if(this.appConfig.map.terrain){
//                  zNodes.push({ id:4, pId:0, name:this.appConfig.map.terrain.label,isTerrain:true,checked:this.appConfig.map.terrain.show});
//              }
                $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            },

            onCheck:function(e, treeId, treeNode){
                /*if(treeNode.isTerrain){
                    if( treeNode.checked){
                        var globe = this.map.scene.globe;
                        var terrainProvider = new Cesium.CesiumTerrainProvider(this.appConfig.map.terrain);
                        globe.terrainProvider = terrainProvider;
                    }else{
                        var globe = this.map.scene.globe;
                        var terrainProvider = new Cesium.EllipsoidTerrainProvider();
                        globe.terrainProvider = terrainProvider;
                    }
                }else{
                    this.layers[treeNode.name].show = treeNode.checked;
                }*/
                
                this.layers[treeNode.name].show = treeNode.checked;
                return true;
            },

            onOpen: function () {
                //面板打开的时候触发 （when open this panel trigger）
            },

            onClose: function () {
                //面板关闭的时候触发 （when this panel is closed trigger）
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
            }

        });
    });