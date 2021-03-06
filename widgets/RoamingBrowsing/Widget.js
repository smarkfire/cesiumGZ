///////////////////////////////////////////////////////////////////////////
// Copyright © 2019 zhongsong. All Rights Reserved.
// 模块描述: 漫游浏览
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
		'dgrid/test/data/createSyncStore'
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
		createSyncStore
	) {
		return declare([BaseWidget], {
			baseClass: 'jimu-widget-RoamingBrowsing',
			name: 'RoamingBrowsing',

			startup: function () {
				dataList = [];
				listLeno = 17;
				listDown = 44;
				var self = this;
				$.ajax({
					url: './widgets/RoamingBrowsing/datas.json',
					type: "get",
					dataType: 'json',
					async: false,
					success: function (data) {
						listDown = data.data.length;
						self.data = data.data;
						data.data.forEach(function (item, index) {
							dataList.push(item)
							$('#roaming_con').children('.romm').children('.list')[0].innerHTML += "<li><div class='roam_div'><a><div class='roaming-zan'><img src='./images/diqiu.png'><span>" + item.name + "</span></div></a></div></li>"
							if (index >= 16) return
						})
					}
				})

				$("#next_btn").click(function () {
					self.listUp(self.data).forEach(function (item, index) {
						$('#roaming_con').children('.romm').children('.list')[0].innerHTML += "<li><div class='roam_div'><a><div class='roaming-zan'><img src='./images/diqiu.png'><span>" + item.name + "</span></div></a></div></li>"
					})

				})
				$("#prev_btn").click(function () {
					self.prelistUp(self.data).forEach(function (item, index) {
						$('#roaming_con').children('.romm').children('.list')[0].innerHTML += "<li><div class='roam_div'><a><div class='roaming-zan'><img src='./images/diqiu.png'><span>" + item.name + "</span></div></a></div></li>"
					})
				})
				$('#roaming_con').children('.romm').children('.list').on('click', '.roam_div', function (event) {
					var ind = $(this).parent().index();
					if (self.selectedMode) {
						self.map.scene.primitives.remove(self.selectedMode);
					}	
					
					self.selectedMode = new Cesium.Cesium3DTileset({
						"url": self.appConfig.modeUrl + dataList[ind].folderName + "/tileset.json",
						"maximumScreenSpaceError": 0.1,
						"maximumNumberOfLoadedTiles": 5000,
						"luminanceAtZenith": 0.8
					});
					var tileset = self.map.scene.primitives.add(self.selectedMode);
					topic.publish("loadWater", dataList[ind]); //绘制水面
					function zoomToTileset(tileset) {
						// 贴地显示
						var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
						//console.log('经度: '+Cesium.Math.toDegrees(cartographic.longitude)+"---------纬度："+Cesium.Math.toDegrees(cartographic.latitude));
						var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
						var height = cartographic.height + dataList[ind].offsetModelHeight;

						var offset = Cesium.Cartesian3.fromRadians(Cesium.Math.toRadians(dataList[ind].x), Cesium.Math.toRadians(dataList[ind].y), height);
						var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
						tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);

						setTimeout(function () {
							topic.publish("gis/map/flyTo", {
								'longitude': dataList[ind].locationInfo.lgtd,
								'latitude': dataList[ind].locationInfo.lttd,
								"height": dataList[ind].locationInfo.height,
								"heading": dataList[ind].locationInfo.heading,
								"pitch": dataList[ind].locationInfo.pitch,
								"roll": dataList[ind].locationInfo.roll
							}); //进行地图定位
						}, 300);

					}
					// tileset数据加载好后，便缩放相机视角
					tileset.readyPromise.then(zoomToTileset);
				})
			},

			onOpen: function () {
				//面板打开的时候触发 （when open this panel trigger）
				$('.roaming-tool').css('display','block');
			},

			onClose: function () {
				//面板关闭的时候触发 （when this panel is closed trigger）
				$('.roaming-tool').css('display','none');
				this.map.scene.primitives.remove(this.selectedMode);
				topic.publish("loadWater", null)
			},

			onMinimize: function () {
				this.resize();
			},

			onMaximize: function () {
				this.resize();
			},

			resize: function () {},

			listUp: function (data) {
				$('#roaming_con').children('.romm').children('.list')[0].innerHTML = '';
				dataList = [];
				for (var i = listLeno; i < data.length; i++) {
					dataList.push(data[i])
					if (dataList.length >= 17) {
						listDown = listLeno
						listLeno = i + 1;
						return dataList
					}
				}
				if (dataList.length <= 17) {
					for (var j = 0; j < data.length; j++) {
						dataList.push(data[j]);
						if (dataList.length >= 17) {
							listDown = listLeno;
							listLeno = j + 1;
							return dataList
						}
					}
				}
			},

			prelistUp: function (data) {
				$('#roaming_con').children('.romm').children('.list')[0].innerHTML = '';
				dataList = [];
				for (var i = listDown - 1; i >= 0; i--) {
					dataList.unshift(data[i])
					if (dataList.length >= 17) {
						listLeno = listDown;
						listDown = i;
						if (i = 0) listDown = 44;
						return dataList

					}

				}
				if (dataList.length <= 17) {
					for (var j = data.length - 1; j >= 0; j--) {
						dataList.unshift(data[j]);
						if (dataList.length >= 17) {
							listLeno = listDown;
							listDown = j;
							// listLeno = listDown + 17;
							return dataList
						}
					}
				}
			},
			
			destroy: function () {
				//销毁的时候触发
				//todo
				//do something before this func
				this.inherited(arguments);
			}
		});
	});