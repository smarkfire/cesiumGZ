///////////////////////////////////////////////////////////////////////////
// Copyright © 2019 zhongsong. All Rights Reserved.
// 模块描述: 图层管理
///////////////////////////////////////////////////////////////////////////
define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/_base/html',
	'dojo/topic',
	'jimu/BaseWidget',
	'jimu/utils',
	'jimu/css!libs/zTree_v3/css/zTreeStyle/zTreeStyle.css',
	'libs/zTree_v3/js/jquery.ztree.all',
	'libs/layer/layer.js'
],
	function (declare,
		lang,
		array,
		html,
		topic,
		BaseWidget,
		aspect,
		string,
		utils,
		layer
	) {
		return declare([BaseWidget], {
			baseClass: 'jimu-widget-Layermanagement',
			name: 'Layermanagement',
			layers: {},
			LayerzNodes: [],
			entitys: {},
			// 存放id的数组
			layermanagementId: [],
			startup: function () {
				var that = this;
				// 暴露在外的接口
				topic.subscribe("closeZtree", lang.hitch(this, this.closeZtreeBox));
				this.inherited(arguments);

				$('#menu_switch span').click(function () {
					if ($('#ztree_container').is(":hidden")) {
						$('#ztree_container').stop().show();
					} else {
						$('#ztree_container').stop().hide();
					}
					topic.publish('closeMap', this.name);
					topic.publish('closeTool', this.name);
				})

				$('#close_tag_bar').click(function () {
					$('#ztree_container').stop().hide();
				})
			},

			closeZtreeBox: function (item) {
				if (item != this.name) {
					$('#ztree_container').stop().hide();
				}
			},

			onOpen: function () {
				var self = this;
				// this.map.scene.globe.depthTestAgainstTerrain = false; 
				$.ajax({
					url: 'http://www.sw797.com:82/blade-ycreal/layer/list',
					dataType: 'json',
					type: 'get',
					success: function (data) {
						setTimeout(function () {
							var parentOpen = null;
							var parentCheck = null;
							for (var i = 0; i < data.data.length; i++) {
								data.data[i].isOpen == 1 ? parentOpen = false : parentOpen = true;
								data.data[i].isCheck == 1 ? parentCheck = false : parentCheck = true;
								self.LayerzNodes.push({
									id: data.data[i].id,
									pId: data.data[i].parentId,
									name: data.data[i].name,
									url: data.data[i].url,
									open: parentOpen,
									nocheck: parentCheck,
								})
								// 存储数据得
								var result = null;
								// 存储url最后面数字的
								var layersNumber = null;
								// 存储 true， false 
								var layerShow = null;
								// 存储除数字外的URL
								var layersUrl = null;
								for (var j = 0; j < data.data[i].children.length; j++) {
									result = data.data[i].children[j];
									result.isCheck == 1 ? layerShow = false : layerShow = true;
									self.LayerzNodes.push({
										id: result.id,
										pId: result.parentId,
										name: result.name,
										checked: layerShow,
										type: result.type,
										icon: result.icon,
										rendering: result.rendering,
										url: result.url,
										showheight: result.showheight
									})
									// 从服务上 并且是服务端渲染的 的 就去添加图层
									if (result.type == 1 && result.rendering == 1) {
										layersNumber = result.url.substring(result.url.length - 1);
										layersUrl = result.url.substring(0, result.url.length - 2);
										var layersObject = {
											icon: result.icon,
											label: result.name,
											show: layerShow,
											type: result.type,
											url: result.url,
											showheight: result.showheight
										};
										if (!isNaN(layersNumber)) {
											layersObject.layers = layersNumber;
											layersObject.url = layersUrl;
										}
										self.createLayers(layersObject)
									} else if (result.type == 0 && result.rendering == 0) {  // 从 接口上读取的数据 并且是 本地渲染，就去添加entity实体
										layerShow && self.createEntity({ url: result.url, entityName: result.name, img: result.icon, delete: !layerShow, showheight: result.showheight })
									} else if (result.type == 1 && result.rendering == 0) {
										layerShow && self.serviceEntity({ url: result.url, oname: result.name, img: result.icon, delete: !layerShow, showheight: result.showheight })
									}
								}
							}

							// 获取现有图层
							var imageryLayers = self.map.scene.globe.imageryLayers;

							for (var i = 0; i < imageryLayers.length; i++) {
								var layer = imageryLayers.get(i);
								self.layers[layer.label] = layer;
								// self.layers[layer.label].show = true;
							}

							var setting = {
								view: {
									selectedMulti: false
								},
								check: {
									enable: true
								},
								data: {
									simpleData: {
										enable: true
									}
								},
								callback: {
									onCheck: onCheck,
								}
							};
							$.fn.zTree.init($("#treeDemo"), setting, self.LayerzNodes);
							$("#treeDemo li ").on('click', 'a', function () {
								return false
							})
							function onCheck(e, treeId, treeNode) {
								if (treeNode.isParent) {
									treeNode.children.forEach(function (item, index) {
										self.selectiveLoading(item);
									})
									return;
								}
								self.selectiveLoading(treeNode);
							}
						}, 2000)
					}
				})
				self.movehandLerLayer();

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
			},

			// 选中与否，判断后进行添加或者删除实体
			selectiveLoading: function (treeNodeItem) {
				var self = this;
				if (treeNodeItem.type == 1 && treeNodeItem.rendering == 1) {
					self.layers[treeNodeItem.name].show = treeNodeItem.checked;
				} else if (treeNodeItem.type == 0 && treeNodeItem.rendering == 0) {
					self.createEntity({ url: treeNodeItem.url, entityName: treeNodeItem.name, img: treeNodeItem.icon, delete: !treeNodeItem.checked, showheight: treeNodeItem.showheight })
				} else if (treeNodeItem.type == 1 && treeNodeItem.rendering == 0) {
					self.serviceEntity({ url: treeNodeItem.url, oname: treeNodeItem.name, img: treeNodeItem.icon, delete: !treeNodeItem.checked, showheight: treeNodeItem.showheight })
				}
			},

			// 读取服务，并且服务端加载，添加图层
			createLayers: function (layerConfig) {
				var layMap = {
					'1': 'ArcGisMapServerImageryProvider'
				};
				var layers;
				if (false) {
				} else {
					var layers = new Cesium[layMap[layerConfig.type]](layerConfig);
					var imageryLayers = this.map.imageryLayers;
					var olayer = imageryLayers.addImageryProvider(layers);
					olayer.show = layerConfig.show;
					olayer.label = layerConfig.label;
				}
			},

			// 获取事件
			movehandLerLayer: function () {
				// 取消默认双击事件
				this.map.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
				// 获取鼠标事件
				var handler = new Cesium.ScreenSpaceEventHandler(this.map.scene.canvas);
				// 给鼠标左键添加事件函数
				handler.setInputAction(lang.hitch(this, this.clickHandLayer), Cesium.ScreenSpaceEventType.LEFT_CLICK);
			},
			// 注册鼠标左键单击事件
			clickHandLayer: function (movement) {
				var self = this;
				var pickRay = this.map.camera.getPickRay(movement.position);
				var featuresPromise = this.map.imageryLayers.pickImageryLayerFeatures(pickRay, this.map.scene);
				if (!Cesium.defined(featuresPromise)) {
					console.log
					var pickedObjects = this.map.scene.drillPick(movement.position);
					if (Cesium.defined(pickedObjects)) {
						for (var i = 0; i < pickedObjects.length; ++i) {
							if (pickedObjects[i].id.id) {
								var id = pickedObjects[i].id.id;
								console.log(id)
								if (this.layermanagementId.indexOf(id) != -1) {
									if (id.indexOf("雨量站") != -1 && id.split("雨量站")[0].length == 8) {
										var swid = id.split("雨量站")[0];
										var swName = pickedObjects[i].id.name;
										self.openWinLayer("雨量站", swid, swName);
										break;
									} else if (id.indexOf("水质站") != -1) {
										break;
									}
								}
							}
						}
					}
					console.log('No features picked.');
				} else {
					Cesium.when(featuresPromise, function (features) {
						console.log(features)
						// This function is called asynchronously when the list if picked features is available.
						console.log('Number of features: ' + features.length);
						if (features.length > 0) {
							console.log('First feature name: ' + features[0].name);
						}
						if (features[0].imageryLayer.label == '水文站' && features[0].data.attributes.STCD.length == 8) {
							self.openWinLayer("水文站", features[0].data.attributes.STCD, features[0].data.attributes.STNM);
						} else if (features[0].imageryLayer.label == '水位站' && features[0].data.attributes.STCD.length == 8) {
							self.openWinLayer("水位站", features[0].data.attributes.STCD, features[0].data.attributes.STNM);
						} else if (features[0].imageryLayer.label == '中小河流站' && features[0].data.attributes.STCD.length == 8) {
							self.openWinLayer("中小河流站", features[0].data.attributes.STCD, features[0].data.attributes.STNM);
						}

					});
				}


			},

			openWinLayer: function (txt, id, name) {
				if (txt == "水文站" || txt == "水位站" || txt == "中小河流站") {
					var url = "./widgets/Layermanagement/popup/river.html";
				} else if (txt == "雨量站") {
					var url = "./widgets/Layermanagement/popup/rain.html";
				}

				layer.open({
					title: name,
					type: 2,
					shadeClose: true,
					shade: false,
					maxmin: true, //开启最大化最小化按钮
					area: ['802px', '526px'],
					offset: 'auto',
					content: url + "?id=" + id,
					id: "layermanagement",
					closeBtn: 1,
				});
			},

			// 创建entity实体
			createEntity: function (entityConfig) {
				var self = this;
				$.ajax({
					url: entityConfig.url,
					type: 'GET',
					dataType: 'JSON',
					success: function (data) {
						var labelHeight = null
						/*if (data.data.length < 100) {
							labelHeight = 260000;
						} else if (data.data.length >= 100 && data.data.length < 250) {
							labelHeight = 220000;
						} else if (data.data.length >= 250 && data.data.length < 500) {
							labelHeight = 180000;
						} else if (data.data.length >= 500) {
							labelHeight = 140000;
						}*/
						var site = "siteCode";
						if (entityConfig.entityName == "山洪隐患点") {
							var site = "siteId";
						}
						data.data.forEach(function (item, index) {
							var id = item[site] + entityConfig.entityName + item['lgtd'];
							var angle = "";
							if (typeof (item.angle) != "undefined") {
								angle = item.angle;
							}
							// 移除entity实体
							if (entityConfig.delete == true) {
								self.map.entities.removeById(id);
								if (self.layermanagementId.indexOf(id) != -1) {
									self.layermanagementId.splice(id, 1);
								}
								return
							}
							self.layermanagementId.push(id);
							console.log(id);
							// 添加entity实体
							self.map.entities.add({
								id: id, // 实体ID
								name: item.siteName, // 实体名称
								position: Cesium.Cartesian3.fromDegrees(Number(item.lgtd), Number(item.lttd)), // x,y 实体经纬度
								label: {
									show: true,
									text: item.siteName, // text 与实体相关的文字
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
									distanceDisplayCondition: new Cesium.DistanceDisplayCondition(1, entityConfig.showheight),
									disableDepthTestDistance: Number.POSITIVE_INFINITY
								},
								billboard: {
									show: true,
									image: entityConfig.img,
									// image: entityConfig.img,
									width: 20,
									height: 20,
									clampToGround: true,
									heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
									disableDepthTestDistance: Number.POSITIVE_INFINITY,
									rotation: Cesium.Math.toRadians(angle),
								}
							})
							/*self.map.entities.add({
								id: item[site] + entityConfig.entityName, // 实体ID
								name: item.siteName, // 实体名称
								position: Cesium.Cartesian3.fromDegrees(item.lgtd, item.lttd), // x,y 实体经纬度
								label: {
									show: true,
									text: item.siteName, // text 与实体相关的文字
									font: "700 16px '黑体'",
									fillColor: Cesium.Color.DEEPSKYBLUE,
									// backgroundColor: Cesium.Color.DEEPSKYBLUE,
									style: Cesium.LabelStyle.FILL_AND_OUTLINE,
									outlineWidth: 3,
									outlineColor: Cesium.Color.fromBytes(255, 255, 255), // 文字轮廓的颜色
									verticalOrigin: Cesium.VerticalOrigin.CENTER,//垂直位置
									horizontalOrigin: Cesium.HorizontalOrigin.LEFT,//水平位置
									pixelOffset: new Cesium.Cartesian2(10, -10), // 文字位置
									heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
									distanceDisplayCondition: new Cesium.DistanceDisplayCondition(1, entityConfig.showheight),
									disableDepthTestDistance: Number.POSITIVE_INFINITY
								},
								ellipse: {
									show: true,
									semiMajorAxis: 200,
									semiMinorAxis: 200,
									heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,

									rotation: Cesium.Math.toRadians(angle),
									material: new Cesium.ImageMaterialProperty({
									    image: entityConfig.img
									}),
								}
							})*/
						})
					}
				})
			},

			// 读取服务，并本地加载
			serviceEntity: function (entityConfig) {
				var self = this;
				$.ajax({
					url: entityConfig.url + "/query",
					type: 'get',
					data: {
						where: '1=1',
						returnGeometry: true,
						outFields: "*",
						f: "pjson"
					},
					dataType: 'JSON',
					success: function (data) {
						if (data.geometryType == "esriGeometryPoint") {
							self.geometryPoints({ data: data, img: entityConfig.img, delete: entityConfig.delete, showheight: entityConfig.showheight })
						} else if (data.geometryType == 'esriGeometryPolyline') {
							self.geometryPolylines({ data: data, img: entityConfig.img, delete: entityConfig.delete, showheight: entityConfig.showheight })
						} else if (data.geometryType == 'esriGeometryPolygon') {
							self.geometryPolygon({ data: data, img: entityConfig.img, delete: entityConfig.delete, showheight: entityConfig.showheight })
						}
					}
				})
			},

			// 读取服务，并且在本地渲染的，加载实体点方法
			geometryPoints: function (entityConfig) {
				var self = this;
				var labelHeight = null
				if (entityConfig.data.features.length < 100) {
					labelHeight = 260000;
				} else if (entityConfig.data.features.length >= 100 && entityConfig.data.features.length < 250) {
					labelHeight = 220000;
				} else if (entityConfig.data.features.length >= 250 && entityConfig.data.features.length < 500) {
					labelHeight = 180000;
				} else if (entityConfig.data.features.length >= 500) {
					labelHeight = 140000;
				}
				for (var o = 0; o < entityConfig.data.features.length; o++) {
					if (entityConfig.delete == true) {
						self.map.entities.removeById(JSON.stringify(entityConfig.data.features[o].attributes));
						if (self.layermanagementId.indexOf(JSON.stringify(entityConfig.data.features[o].attributes)) != -1) {
							self.layermanagementId.splice(self.layermanagementId.indexOf(JSON.stringify(entityConfig.data.features[o].attributes)), 1);
						}
						continue;
					}

					self.layermanagementId.push(JSON.stringify(entityConfig.data.features[o].attributes));

					self.map.entities.add({
						id: JSON.stringify(entityConfig.data.features[o].attributes), // 实体ID
						name: entityConfig.data.features[o].attributes[entityConfig.data.displayFieldName], // 实体名称
						position: Cesium.Cartesian3.fromDegrees(entityConfig.data.features[o].geometry.x, entityConfig.data.features[o].geometry.y), // x,y 实体经纬度
						show: true,
						//字体标签样式
						label: {
							show: true,
							text: entityConfig.data.features[o].attributes[entityConfig.data.displayFieldName], // text 与实体相关的文字
							font: "700 14px '黑体'",
							fillColor: Cesium.Color.DEEPSKYBLUE,
							style: Cesium.LabelStyle.FILL_AND_OUTLINE,
							outlineWidth: 2,
							outlineColor: Cesium.Color.fromBytes(255, 255, 255), // 文字轮廓的颜色
							verticalOrigin: Cesium.VerticalOrigin.CENTER,//垂直位置
							horizontalOrigin: Cesium.HorizontalOrigin.LEFT,//水平位置
							pixelOffset: new Cesium.Cartesian2(14, -10), // 文字位置
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
							distanceDisplayCondition: new Cesium.DistanceDisplayCondition(1, entityConfig.showheight),
							disableDepthTestDistance: Number.POSITIVE_INFINITY
						},
						billboard: {
							show: true,
							image: entityConfig.img,
							width: 20,
							height: 20,
							heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
							disableDepthTestDistance: Number.POSITIVE_INFINITY
						}
					})
				}
			},

			// 读取服务，并且在本地渲染的，加载实体线段方法
			geometryPolylines: function (entityConfig) {
				var self = this;
				var position = [];
				for (var o = 0; o < entityConfig.data.features.length; o++) {
					for (var i = 0; i < entityConfig.data.features[o].geometry.paths[0].length; i++) {
						position.push(entityConfig.data.features[o].geometry.paths[0][i][0], entityConfig.data.features[o].geometry.paths[0][i][1])
					}
					if (entityConfig.delete == true) {
						self.map.entities.removeById(JSON.stringify(entityConfig.data.features[o].attributes));
						if (self.layermanagementId.indexOf(JSON.stringify(entityConfig.data.features[o].attributes)) != -1) {
							self.layermanagementId.splice(self.layermanagementId.indexOf(JSON.stringify(entityConfig.data.features[o].attributes)), 1);
						}
						continue;
					}
					self.layermanagementId.push(JSON.stringify(entityConfig.data.features[o].attributes));
					// 绘制线段的
					self.map.entities.add({
						id: JSON.stringify(entityConfig.data.features[o].attributes),
						show: true,
						polyline: {
							positions: Cesium.Cartesian3.fromDegreesArray(position),
							width: 20,
							material: new Cesium.ImageMaterialProperty({

								// 明天需要修改，备注。。！！！！
								image: entityConfig.img,
								// image: 'images/1111.png',
								repeat: new Cesium.Cartesian2(position.length / 8, 1),
								// transparent: true,
							}),
							// granularity: Cesium.Math.RADIANS_PER_DEGREE,
							// arcType: Cesium.ArcType.RHUMB,
							// classificationType: Cesium.ClassificationType.TERRAIN,
							clampToGround: true,
						},
					})
					position = [];
				}

			},

			// 读取服务，并且在本地渲染的，加载实体多边形方法
			geometryPolygon: function (entityConfig) {
				var self = this;
				var position = [];
				for (var o = 0; o < entityConfig.data.features.length; o++) {
					for (var i = 0; i < entityConfig.data.features[o].geometry.rings[0].length; i++) {
						position.push(entityConfig.data.features[o].geometry.rings[0][i][0], entityConfig.data.features[o].geometry.rings[0][i][1])
					}
					if (entityConfig.delete == true) {
						self.map.entities.removeById(JSON.stringify(entityConfig.data.features[o].attributes));
						if (self.layermanagementId.indexOf(JSON.stringify(entityConfig.data.features[o].attributes)) != -1) {
							self.layermanagementId.splice(self.layermanagementId.indexOf(JSON.stringify(entityConfig.data.features[o].attributes)), 1);
						}
						continue;
					}
					self.layermanagementId.push(JSON.stringify(entityConfig.data.features[o].attributes));
					// 绘制多边形的
					self.map.entities.add({
						id: JSON.stringify(entityConfig.data.features[o].attributes),
						show: true,
						polygon: {
							hierarchy: { positions: Cesium.Cartesian3.fromDegreesArray(position) },
							material: new Cesium.ImageMaterialProperty({
								image: entityConfig.img
							}),
							clampToGround: true,
						},
					})
					position = [];
				}
			}
		});
	});