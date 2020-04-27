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
            baseClass: 'jimu-widget-Test',
            name: 'Test',

            layers:{},
            startup: function () {
                this.inherited(arguments);
				var handler = new Cesium.ScreenSpaceEventHandler(this.map.scene.canvas);
				handler.setInputAction(lang.hitch(this, function(movement) {
					
					var ray=this.map.camera.getPickRay(movement.position);  
					var cartesian=this.map.scene.globe.pick(ray,this.map.scene);  
					var cartographic=Cesium.Cartographic.fromCartesian(cartesian);  
					var lng=Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);;//经度值  
					var lat=Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);;//纬度值  //height结果与cartographic.height相差无几，注意：cartographic.height可以为0，也就是说，可以根据经纬度计算出高程。  
					//var height=this.map.scene.globe.getHeight(cartographic).toFixed(2);  //height的值为地形高度。  
					
					$("#test").append("["+lng+","+lat+"],");
					
				}), Cesium.ScreenSpaceEventType.LEFT_CLICK);
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