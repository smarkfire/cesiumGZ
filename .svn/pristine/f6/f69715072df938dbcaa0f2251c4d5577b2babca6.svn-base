///////////////////////////////////////////////////////////////////////////
// Copyright © 2019 zhongsong. All Rights Reserved.
// 模块描述:漫游浏览，水位模拟
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
	function(declare,
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
			baseClass: 'jimu-widget-RoamBrowse',
			name: 'RoamBrowse',
			layer: null,
			selectedMode: null,
			startup: function() {
				this.inherited(arguments);

				var self = this;
				dojo.xhrGet({
					url: this.folderUrl + "/datas.json",
					handleAs: "json",
					preventCache: true,
					load: function(json, ioargs) {
						self.datas = json.data;
						self.createList(json.data);
					},
					error: function(error, ioargs) {}
				});
			},

			onMinimize: function() {
				this.resize();
			},

			onMaximize: function() {
				this.resize();
			},
			onOpen: function() {
				$('.roaming-tool').css('display','block');
				topic.publish('deleteEntity', {
					name: '漫游浏览'
				});
				topic.publish('deletePrima', {
                    name: '漫游浏览',
                });
			},

			onClose: function() {
				$('.roaming-tool').css('display','none');
			},

			resize: function() {

			},

			destroy: function() {
				this.inherited(arguments);
			},

			//关键字过滤
			query: function() {
				var text = this.keyNode.value;
				if(text != "" && text.length > 0) {
					var list = array.filter(this.datas, function(g) {
						if(g.name.indexOf(text) > -1) {
							return true;
						} else {
							return false;
						}
					}, this);
					this.grid.refresh();
					this.grid.renderArray(list);
				} else {
					this.grid.refresh();
					this.grid.renderArray(this.datas);
				}
			},

			//http://dgrid.io/tutorials/1.0/hello_dgrid/
			createList: function(dataList) {

				var CustomGrid = declare([Grid, Keyboard, Selection]);

				var grid = new CustomGrid({
					columns: {
						name: '名称',
						sitecode: '编码'
					},
					selectionMode: 'single', // for Selection; only select a single row at a time
					cellNavigation: false // for Keyboard; allow only row-level keyboard navigation
				}, 'grid');

				grid.startup();

				grid.renderArray(dataList);
				grid.on('dgrid-select', lang.hitch(this, function(event) {
	
						
					if(this.selectedMode) {
						this.map.scene.primitives.remove(this.selectedMode);
					}
					
					this.selectedMode = new Cesium.Cesium3DTileset({
						//"url": this.folderUrl + "data/" + event.rows[0].data.folderName + "/tileset.json",
						"url": "http://www.sw797.com:801/gzsw3D/v2/data/mx/" + event.rows[0].data.folderName + "/tileset.json",
						"maximumScreenSpaceError": 0.1,
						"maximumNumberOfLoadedTiles": 5000,
						"luminanceAtZenith": 0.8
					});

					var tileset = this.map.scene.primitives.add(this.selectedMode);
					topic.publish("loadWater", event.rows[0].data); //绘制水面
					function zoomToTileset(tileset) {
						var cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);

						//console.log('经度: '+Cesium.Math.toDegrees(cartographic.longitude)+"---------纬度："+Cesium.Math.toDegrees(cartographic.latitude));
						var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
						var height = cartographic.height + event.rows[0].data.offsetModelHeight;
						var offset = Cesium.Cartesian3.fromRadians(Cesium.Math.toRadians(event.rows[0].data.x), Cesium.Math.toRadians(event.rows[0].data.y), height);
						var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
						tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
						
						setTimeout(function(){ 
							topic.publish("gis/map/flyTo", {
								'longitude': event.rows[0].data.locationInfo.lgtd,
								'latitude': event.rows[0].data.locationInfo.lttd,
								"height":event.rows[0].data.locationInfo.height,
								"heading":event.rows[0].data.locationInfo.heading,
								"pitch":event.rows[0].data.locationInfo.pitch,
								"roll":event.rows[0].data.locationInfo.roll
							}); //进行地图定位
						}, 300);

					}
					// tileset数据加载好后，便缩放相机视角
					tileset.readyPromise.then(zoomToTileset);

				}));

				this.grid = grid;

			}

		});
	});