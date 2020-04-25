///////////////////////////////////////////////////////////////////////////
// Copyright © 2019 zhongsong. All Rights Reserved.
// 模块描述:显示坐标
///////////////////////////////////////////////////////////////////////////
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/_base/html',
		'dojo/topic',
		'jimu/BaseWidget'
	],
	function(declare,
		lang,
		array,
		html,
		topic,
		BaseWidget
	) {
		return declare([BaseWidget], {
			baseClass: 'jimu-widget-ShowPosition',
			name: 'ShowPosition',
			startup: function() {
				this.inherited(arguments);
				//显示帧速(FPS)
				//this.map.scene.debugShowFramesPerSecond = true;
				
				// Mouse over the globe to see the cartographic position
				var handler = new Cesium.ScreenSpaceEventHandler(this.map.scene.canvas);
				handler.setInputAction(lang.hitch(this, function(movement) {
					/*if(this.map.scene.globe.depthTestAgainstTerrain==false){
						var ray=this.map.camera.getPickRay(movement.endPosition);  
						var cartesian=this.map.scene.globe.pick(ray,this.map.scene);  
						var cartographic=Cesium.Cartographic.fromCartesian(cartesian);  
						var lng=Cesium.Math.toDegrees(cartographic.longitude);//经度值  
						var lat=Cesium.Math.toDegrees(cartographic.latitude);//纬度值  //height结果与cartographic.height相差无几，注意：cartographic.height可以为0，也就是说，可以根据经纬度计算出高程。  
						var height=this.map.scene.globe.getHeight(cartographic);  //height的值为地形高度。  
						//鼠标位置经纬度
						$("#positionSpan").html("鼠标（经度："+lng.toFixed(6)+"°&nbsp;&nbsp;纬度："+lat.toFixed(6)+"°&nbsp;&nbsp;高度："+height.toFixed(2)+"m）；&nbsp;&nbsp;&nbsp;&nbsp;");
					}
					else{
						var cartesian = this.map.camera.pickEllipsoid(movement.position, this.map.scene.globe.ellipsoid);
						var posit = this.map.scene.pickPosition(movement.position);
						var cartographic = Cesium.Cartographic.fromCartesian(posit);
						var currentClickLon = Cesium.Math.toDegrees(cartographic.longitude);
						var currentClickLat = Cesium.Math.toDegrees(cartographic.latitude);
						var currentClickHei = cartographic.height;
						//鼠标位置经纬度
						$("#positionSpan").html("鼠标（经度："+lng.toFixed(6)+"°&nbsp;&nbsp;纬度："+lat.toFixed(6)+"°&nbsp;&nbsp;高度："+height.toFixed(2)+"m）；&nbsp;&nbsp;&nbsp;&nbsp;");
					}*/
					
					var ray=this.map.camera.getPickRay(movement.endPosition);  
					var cartesian=this.map.scene.globe.pick(ray,this.map.scene);  
					var cartographic=Cesium.Cartographic.fromCartesian(cartesian);  
					var lng=Cesium.Math.toDegrees(cartographic.longitude);//经度值  
					var lat=Cesium.Math.toDegrees(cartographic.latitude);//纬度值  //height结果与cartographic.height相差无几，注意：cartographic.height可以为0，也就是说，可以根据经纬度计算出高程。  
					var height=this.map.scene.globe.getHeight(cartographic);  //height的值为地形高度。  
					//鼠标位置经纬度
					$("#positionSpan").html("经度："+lng.toFixed(6)+"&nbsp;&nbsp;纬度："+lat.toFixed(6)+"&nbsp;&nbsp;高程："+height.toFixed(2)+"m&nbsp;&nbsp;&nbsp;&nbsp;");
					
				}), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
				
				
				 //相机改变事件 
			    this.map.camera.changed.addEventListener(lang.hitch(this, function() {
					var cartographic=Cesium.Cartographic.fromCartesian(this.map.camera._positionWC);//使用this.map.camera.position获取相机坐标，在飞行时候会导致实时显示坐标不对
					var lat=Cesium.Math.toDegrees(cartographic.latitude);
					var lng=Cesium.Math.toDegrees(cartographic.longitude);
					var height=cartographic.height;
					//var cartographic=Cesium.Cartographic.fromCartesian(this.map.camera.position);
					//相机位置经纬度
					$("#jd").html(lng.toFixed(6));
					$("#wd").html(lat.toFixed(6));
					$("#gd").html(height.toFixed(2));
					$("#phj").html(Cesium.Math.toDegrees(this.map.camera.heading).toFixed(2));
					$("#fyj").html(Cesium.Math.toDegrees(this.map.camera.pitch).toFixed(2));
					$("#fgj").html(Cesium.Math.toDegrees(this.map.camera.roll).toFixed(2));
				}));				
				
//				handler.setInputAction(lang.hitch(this, function(movement) {
//					
//					var ray=this.map.camera.getPickRay(movement.position);  
//					var cartesian=this.map.scene.globe.pick(ray,this.map.scene);  
//					var cartographic=Cesium.Cartographic.fromCartesian(cartesian);  
//					var lng=Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);;//经度值  
//					var lat=Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);;//纬度值  //height结果与cartographic.height相差无几，注意：cartographic.height可以为0，也就是说，可以根据经纬度计算出高程。  
//					
//					$("#positionDiv").append("["+lng+","+lat+"],");
//				}), Cesium.ScreenSpaceEventType.LEFT_CLICK);
				
			},

			onOpen: function() {
				//面板打开的时候触发 （when open this panel trigger）
			},

			onClose: function() {
				//面板关闭的时候触发 （when this panel is closed trigger）
			},

			onMinimize: function() {
				this.resize();
			},

			onMaximize: function() {
				this.resize();
			},

			resize: function() {

			},

			destroy: function() {
				//销毁的时候触发
				//todo
				//do something before this func
				this.inherited(arguments);
			}

		});
	});