///////////////////////////////////////////////////////////////////////////
// Copyright © 2019 zhongsong. All Rights Reserved.
// 模块描述: 堰塞湖分析
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
	"libs/echarts/v4/echarts.min",
	'libs/layer/layer.js'
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
		echarts,
		layer
	) {
		return declare([BaseWidget], {
			baseClass: 'jimu-widget-AnalysisOfBarrierLake',
			name: 'AnalysisOfBarrierLake',

			startup: function () {
				// 数组用于存放添加点的Id删除实体点的时候会用到
				var pointId = [];

				// 鼠标事件
				var waterEntity;
				// 点击绘制按钮开始绘制
				var that = this;
				var yanmo;
				var flag = false;
				var flagScend = false;
				// 海拔
				var altitude = [];
				var drawingMode = 'polygon';
				var activeShape;
				var boildOne = null;
				var boildTwo = null;
				var boildThree = null;
				// 向三维场景中添加的点的集合
				var tempPoints = [];

				var positions = [];
				var handler = new Cesium.ScreenSpaceEventHandler(that.map.scene.canvas);

				var shape;

				$('#dong_draw').click(function () {
					that.deleteEntitys(that, pointId, shape, boildOne, boildTwo, boildThree, waterEntity);

					$('#dong_time').val(0.5)
					$('.dong-progress .container #progress_bar').width(0);
					$('.dong-progress').stop().hide();
					$('#dong_echarts').stop().hide();
					$('.jimu-widget-AnalysisOfBarrierLake p').stop().hide();
					//if (handler != null) handler.destroy();
					handler = new Cesium.ScreenSpaceEventHandler(that.map.scene.canvas)
					function drawShape(positionData) {
						if (drawingMode == 'polygon') {
							shape = that.map.entities.add({
								polygon: {
									hierarchy: positionData,
									material: Cesium.Color.fromBytes(252, 193, 10, 130)
								}
							})
						}
						that.fixedShape = shape;

						return shape
					}
					clearInterval(yanmo);
					yanmo = null;
					positions = [];
					var polygon = null;
					var cartesian = null;
					var floatingPoint; //浮动点
					var activeShapePoints = [];
					var active = null;
					tempPoints = [];
					altitude = [];
					that.map.scene.globe.depthTestAgainstTerrain = false;

					// handler = new Cesium.ScreenSpaceEventHandler(that.map.scene.canvas);
					// 取消双击事件-追踪该位置
					that.map.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

					// 鼠标左键点击事件
					handler.setInputAction(function (movement) {
						// 给鼠标点击增加的点添加随机的ID便于删除
						var randomId = (Math.random() * 100 + 8) + (Math.random() * 500 + 102);

						let ray = that.map.camera.getPickRay(movement.position);
						cartesian = that.map.scene.globe.pick(ray, that.map.scene);
						if (positions.length == 0) {
							positions.push(cartesian.clone());
							flagScend = true;
						}
						// positions.pop();
						positions.push(cartesian);
						// 向三维场景中添加点
						var cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
						var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
						var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
						var heightString = cartographic.height;
						tempPoints.push({
							lon: longitudeString,
							lat: latitudeString,
							hei: heightString
						});
						altitude.push(Math.round(cartographic.height));
						if (Cesium.defined(cartesian)) {
							if (activeShapePoints.length === 0) {
								floatingPoint = that.map.entities.add({
									// 给实体点添加ID
									id: '1a-2b-3c',
									name: '多边形面积',
									position: positions[positions.length - 1],
									point: {
										pixelSize: 6,
										color: Cesium.Color.RED,
										heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
									}
								});
								pointId.push('1a-2b-3c');

								activeShapePoints.push(cartesian);
								var dynamicPositions = new Cesium.CallbackProperty(function () {
									if (drawingMode === 'polygon') {
										return new Cesium.PolygonHierarchy(activeShapePoints);
									}
									return activeShapePoints;
								}, false);
								active = drawShape(dynamicPositions); //绘制动态图
							}
							activeShapePoints.push(cartesian);
							floatingPoint = that.map.entities.add({
								// 给实体点添加ID
								id: randomId,
								name: '多边形面积',
								position: positions[positions.length - 1],
								point: {
									pixelSize: 6,
									color: Cesium.Color.RED,
									heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
								}
							});

							pointId.push(randomId);
						}
					}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

					// 鼠标移动事件
					handler.setInputAction(function (event) {
						if (positions.length == 0) {
							that.map.entities.remove(boildOne);
							var pick1 = new Cesium.Cartesian2(event.endPosition.x, event.endPosition.y);
							var newPosition = that.map.scene.globe.pick(viewer.camera.getPickRay(pick1), that.map.scene);
							boildOne = that.map.entities.add({
								position: newPosition,
								label: {
									show: true,
									text: '单击开始绘制',
									font: '16px',
									pixelOffset: new Cesium.Cartesian2(80, 0),
									showBackground: true,
									backgroundColor: Cesium.Color.fromBytes(126, 126, 126, 210)
								},
							})
						}
						if (positions.length == 2) {
							that.map.entities.remove(boildOne);
							that.map.entities.remove(boildTwo);
							var pick1 = new Cesium.Cartesian2(event.endPosition.x, event.endPosition.y);
							var newPosition = that.map.scene.globe.pick(viewer.camera.getPickRay(pick1), that.map.scene);
							boildTwo = that.map.entities.add({
								position: newPosition,
								label: {
									show: true,
									text: '单击增加点',
									font: '16px',
									pixelOffset: new Cesium.Cartesian2(80, 0),
									showBackground: true,
									backgroundColor: Cesium.Color.fromBytes(126, 126, 126, 210)
								},
							})

						}
						if (positions.length > 2) {
							that.map.entities.remove(boildOne);
							that.map.entities.remove(boildTwo);
							that.map.entities.remove(boildThree);
							var pick1 = new Cesium.Cartesian2(event.endPosition.x, event.endPosition.y);
							var newPosition = that.map.scene.globe.pick(viewer.camera.getPickRay(pick1), that.map.scene);
							boildThree = that.map.entities.add({
								position: newPosition,
								label: {
									show: true,
									text: '单击增加点,右键点击完成绘制',
									font: '16px',
									pixelOffset: new Cesium.Cartesian2(120, 0),
									showBackground: true,
									backgroundColor: Cesium.Color.fromBytes(126, 126, 126, 210)
								},
							})
						}
						
						if (Cesium.defined(floatingPoint)) {
							var pick1 = new Cesium.Cartesian2(event.endPosition.x, event.endPosition.y);
							var newPosition = that.map.scene.globe.pick(viewer.camera.getPickRay(pick1), that.map.scene);
							if (Cesium.defined(newPosition)) {
								floatingPoint.position.setValue(newPosition);
								activeShapePoints.pop();
								activeShapePoints.push(newPosition);
							}
						}
					}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

					// 鼠标右键点击事件
					handler.setInputAction(function (movement) {
						var cartographic = Cesium.Cartographic.fromCartesian(that.map.scene.globe.pick(that.map.camera.getPickRay(movement.position), that.map.scene));
						// 向三维场景中添加点
						var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
						var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
						var heightString = cartographic.height;
						tempPoints.push({
							lon: longitudeString,
							lat: latitudeString,
							hei: heightString
						});

						positions.push(activeShapePoints[activeShapePoints.length - 1])
						if (positions.length >= 2) {
							if (!Cesium.defined(polygon)) {
								polygon = new PolygonPrimitive(positions);
							} else {
								positions.pop();
								positions.push(cartesian);
							}
						}
						if (activeShapePoints.length) {
							activeShape = drawShape(activeShapePoints); //绘制最终图
						}
						// that.map.entities.remove(floatingPoint);
						that.map.entities.remove(active);
						that.map.entities.remove(boildOne);
						that.map.entities.remove(boildTwo);
						that.map.entities.remove(boildThree);
						if (!flagScend) return;
						flagScend = false;
						altitude.push(Math.round(cartographic.height))
						altitude.sort((a, b) => {
							if (a > b) return 1;
							else if (a < b) return -1;
							else return 0;
						})
						$('#dong_max_height').val(altitude[altitude.length - 1])
						$('#dong_min_height').val(altitude[0])
						handler.destroy();
						flag = true;
						return;
					}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

					var PolygonPrimitive = (function () {
						function _(positions) {
							this.options = {
								name: '多边形',
								polygon: {
									hierarchy: [],
									material: Cesium.Color.WHITE.withAlpha(0),
								}
							};

							this.positions = positions;
							this._init();
						}
						_.prototype._init = function () {
							var _self = this;
							//实时更新polygon.hierarchy
							this.options.polygon.hierarchy = new Cesium.CallbackProperty(function () {
								return new Cesium.PolygonHierarchy(positions)
							}, false);
							waterEntity = that.map.entities.add(this.options);
							that.fixedWaterEntity = waterEntity;

						};
						return _;
					})();
				})

				// 点击开始分析按钮，开始分析
				$('#dong_start').click(function () {
					$('.dong-progress .container #progress_bar').width(0);
					$('.dong-progress').stop().hide();
					$('#dong_echarts').stop().hide();
					$('.jimu-widget-AnalysisOfBarrierLake p').stop().hide();
					if (flag != true) {
						if (yanmo != null) {
							layer.msg('请等待绘制完成', {

								time: 1000
							})
							return;
						}
						layer.msg('请先选择绘制区域', {

							time: 1000
						})
						return
					};
					// 提取坐标信息
					var list = waterEntity.polygon.hierarchy.getValue().positions;
					// 存放坐标信息，做请求数据使用
					var echartRings = [
						[]
					];

					// 处理坐标信息，将世界坐标转换成经纬度
					for (var i = 1; i < list.length; i++) {
						var cartographic = Cesium.Cartographic.fromCartesian(list[i]);
						var lat = Cesium.Math.toDegrees(cartographic.latitude);
						var lng = Cesium.Math.toDegrees(cartographic.longitude);
						echartRings[0].push([lng, lat])
					}
					// 发请求数据
					var enenen = {
						"displayFieldName": "",
						"geometryType": "esriGeometryPolygon",
						"spatialReference": {
							"wkid": 4490,
							"latestWkid": 4490
						},
						"fields": [{
							"name": "OBJECTID",
							"type": "esriFieldTypeOID",
							"alias": "OBJECTID"
						},
						{
							"name": "SHAPE_Length",
							"type": "esriFieldTypeDouble",
							"alias": "SHAPE_Length"
						},
						{
							"name": "SHAPE_Area",
							"type": "esriFieldTypeDouble",
							"alias": "SHAPE_Area"
						}
						],
						"features": [{
							"geometry": {
								"rings": echartRings,
								"spatialReference": {
									"wkid": 4490,
									"latestWkid": 4490
								}
							},
							"symbol": null,
							"attributes": {
								"OBJECTID": 1163
							}
						}],
						"exceededTransferLimit": false
					}
					// 数据转换格式
					enenen = JSON.stringify(enenen);
					that.map.entities.remove(activeShape);
					// 最高海拔
					var maxHet = Number($('#dong_max_height').val());
					// 最低海拔
					var minHet = Number($('#dong_min_height').val());
					// 每秒上升海拔
					var time = Number($('#dong_time').val());
					// 动态获取最低海拔
					$('#dong_min_height').change(function () {
						minHet = $(this).val()
					})

					// 总淹没体积
					var textArea = parseInt(getArea(tempPoints) * (maxHet - minHet) / 100000);
					var seriesData = [];
					var altitude = (maxHet - minHet) / 20;
					var altitudeHet = 0;

					// 二秒后开始进入淹没分析
					setTimeout(function () {
						flag = false;
						if (waterEntity) {
							that.map.scene.globe.depthTestAgainstTerrain = true;
							waterEntity.polygon.perPositionHeight = true,
								waterEntity.polygon.material = Cesium.Color.fromBytes(33, 122, 193, 220);
							var h = minHet - 50 || altitude[0] - 50;
							waterEntity.polygon.extrudedHeight = minHet - 50 || altitude[0] - 50; //需要提前设置 不然会全部出现
							yanmo = setInterval(function () {
								h = h + time || 1;
								if (h >= (maxHet || altitude[altitude.length - 1])) {
									h = (maxHet || altitude[altitude.length - 1]); //给个最大值
									waterEntity.polygon.extrudedHeight = h;
									clearTimeout(yanmo);
									flag = true;
									$('.dong-progress').stop().show();
									// 总长度
									var totalWidth = $('.dong-progress .container').width();
									// 过度长度
									var excessiveWidth = totalWidth / 100;
									var watchWidth = 0;
									// 进度条的定时器
									var proTime = setInterval(function () {
										watchWidth += excessiveWidth;
										if (watchWidth > totalWidth) {
											watchWidth = totalWidth;
										}
										$('.dong-progress .container #progress_bar').width(watchWidth)
									}, 22)
									$.ajax({
										url: `http://171.35.109.175:18080/arcgis/rest/services/GZSW/%E5%8F%A0%E5%8A%A0%E5%88%86%E6%9E%90/GPServer/%E5%8F%A0%E5%8A%A0%E5%88%86%E6%9E%90/submitJob`,
										type: 'post',
										dataType: 'json',
										data: {
											f: 'pjson',
											fxfw: enenen
										},
										success: function (result) {
											troubleshooting(0);

											function troubleshooting(i) {
												$.ajax({
													url: `http://171.35.109.175:18080/arcgis/rest/services/GZSW/%E5%8F%A0%E5%8A%A0%E5%88%86%E6%9E%90/GPServer/%E5%8F%A0%E5%8A%A0%E5%88%86%E6%9E%90/jobs/${result.jobId}?f=pjson`,
													type: 'get',
													dataType: 'json',
													data: {},
													success: function (data) {
														if (data.jobStatus == 'esriJobSucceeded') {
															var perurl = data.results.fxfw_Intersect_Statistics.paramUrl;
															$.ajax({
																url: `http://171.35.109.175:18080/arcgis/rest/services/GZSW/%E5%8F%A0%E5%8A%A0%E5%88%86%E6%9E%90/GPServer/%E5%8F%A0%E5%8A%A0%E5%88%86%E6%9E%90/jobs/${result.jobId}/${perurl}`,
																type: 'post',
																dataType: 'json',
																data: {
																	f: 'pjson'
																},
																success: function (message) {
																	if (watchWidth < totalWidth) {
																		watchWidth = totalWidth;
																	}
																	clearInterval(proTime);
																	// 在此处创建库容曲线
																	var storageLine = echarts.init(document.getElementById('storage_echarts'));
																	var storageOptions = {
																		title: {
																			text: '库容曲线'
																		},
																		tooltip: {
																			trigger: 'axis'
																		},
																		gird: {
																			top: '20px'
																		},
																		legend: {
																			data: ['最大淹没体积']
																		},
																		xAxis: {
																			type: 'value',
																			min: 0,
																			max: textArea,
																			splitNumber: 10
																		},
																		yAxis: {
																			name: '水位(m)',
																			nameTextStyle: {
																				color: 'rgba(40, 37, 161, 0.849)',
																			},
																			type: 'value',
																			min: 0,
																			max: maxHet,
																			splitNumber: 10,
																			axisLabel: {
																				formatter: '{value}'
																			}
																		},
																		series: [
																			{
																				name: '最大淹没体积',
																				type: 'line',
																				data: [],
																				smooth: true
																			}
																		]
																	};
																	storageOptions.series[0].data = seriesData;
																	storageLine.setOption(storageOptions);


																	var features = message.value.features;
																	if (features == false) {
																		layer.msg('此处不在可分析范围内', {

																			time: 1000
																		})
																		$('.dong-progress .container #progress_bar').width(0);
																		$('.dong-progress').stop().hide();
																		return
																	}
																	$('.dong-progress .container #progress_bar').width(totalWidth);
																	var echartsResult = [];
																	var subTitle = '';
																	// 淹没总面积
																	var shapeAreas = 0;
																	var echartsName = null;
																	var echartsColor = null;
																	for (var j = 0; j < features.length; j++) {
																		shapeAreas += features[j].attributes.SUM_Shape_Area;
																	}
																	for (var i = 0; i < features.length; i++) {
																		if (features[i].attributes.gridcode == 1) {
																			echartsName = '城镇';
																			echartsColor = '#B56DD1';
																		} else if (features[i].attributes.gridcode == 2) {
																			echartsName = '植被';
																			echartsColor = '#5F8812';
																		} else if (features[i].attributes.gridcode == 3) {
																			echartsName = '水域';
																			echartsColor = '#0B6FC5';
																		} else if (features[i].attributes.gridcode == 4) {
																			echartsName = '裸地';
																			echartsColor = '#CE8B44';
																		} else if (features[i].attributes.gridcode == 5) {
																			echartsName = '农业用地';
																			echartsColor = '#B5D874';
																		}
																		echartsResult.push({
																			value: (features[i].attributes.SUM_Shape_Area / 1000000).toFixed(2),
																			name: echartsName,
																			itemStyle: {
																				color: echartsColor
																			}
																		})
																		subTitle += echartsName + '淹没面积为' + (features[i].attributes.SUM_Shape_Area / 1000000).toFixed(2) + 'km²，占比为' + (features[i].attributes.SUM_Shape_Area / shapeAreas * 100).toFixed(2) + '%；';
																	}
																	var textSub = `淹没海拔高度为${maxHet}m，淹没总面积为${(shapeAreas / 1000000).toFixed(2)}km²。其中`;
																	textSub += subTitle;
																	$('.jimu-widget-AnalysisOfBarrierLake p').text(textSub)
																	var echartsData = echarts.init(document.getElementById('dong_echarts'));
																	var options = {
																		title: {
																			text: '淹没分析结果',
																			left: '41%',
																			textStyle: {
																				color: '#5DBFFF',
																				fontSize: 26,
																			},
																			top: 14
																		},
																		tooltip: {
																			trigger: 'item',
																			formatter: '{b} <br/>面积 : {c} km² ({d}%)',
																			position: 'right'
																		},
																		legend: {
																			orient: 'vertical',
																			// top: 'middle',
																			right: 4,
																			bottom: 2,
																			textStyle: { //图例文字的样式
																				color: '#fff',
																				fontSize: 14
																			},
																			data: ['城镇', '植被', '水域', '裸地', '农业用地']
																		},
																		series: [{
																			type: 'pie',
																			radius: '80%',
																			center: ['55%', '56%'],
																			selectedMode: 'single',
																			label: {
																				normal: {
																					position: 'inner',
																					show: false
																				}
																			},
																			data: echartsResult,
																			emphasis: {
																				itemStyle: {
																					shadowBlur: 10,
																					shadowOffsetX: 0,
																					shadowColor: 'rgba(0, 0, 0, 0.5)'
																				}
																			}
																		}]
																	};
																	echartsData.setOption(options);
																	$('.dong-progress .container #progress_bar').width(0);
																	$('.dong-progress').stop().hide();
																	$('#dong_echarts').stop().show();
																	$('.jimu-widget-AnalysisOfBarrierLake p').stop().show();
																}
															})
															return
														} else {
															troubleshooting(i + 1);
														}
													}
												})
											}
										}
									});
									return;
								}
								waterEntity.polygon.extrudedHeight = h;
							}, 100);
						}
					}, 1000);
				})

				$('#dong_delet').click(function () {
					that.deleteEntitys(that, pointId, shape, boildOne, boildTwo, boildThree, waterEntity);

					handler.destroy();
					$('.dong-progress .container #progress_bar').width(0);
					$('.dong-progress').stop().hide();
					$('#dong_echarts').stop().hide();
					$('.jimu-widget-AnalysisOfBarrierLake p').stop().hide();
					clearInterval(yanmo);
					yanmo = null;
				})


				var radiansPerDegree = Math.PI / 180.0; //角度转化为弧度(rad)
				var degreesPerRadian = 180.0 / Math.PI; //弧度转化为角度
				function getArea(points) {
					var res = 0;
					//拆分三角曲面
					for (var i = 0; i < points.length - 2; i++) {
						var j = (i + 1) % points.length;
						var k = (i + 2) % points.length;
						var totalAngle = Angle(points[i], points[j], points[k]);


						var dis_temp1 = distance(positions[i], positions[j]);
						var dis_temp2 = distance(positions[j], positions[k]);
						res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
					}


					return (res / 1000000.0).toFixed(4);
				}
				/*角度*/
				function Angle(p1, p2, p3) {
					var bearing21 = Bearing(p2, p1);
					var bearing23 = Bearing(p2, p3);
					var angle = bearing21 - bearing23;
					if (angle < 0) {
						angle += 360;
					}
					return angle;
				}
				/*方向*/
				function Bearing(from, to) {
					var lat1 = from.lat * radiansPerDegree;
					var lon1 = from.lon * radiansPerDegree;
					var lat2 = to.lat * radiansPerDegree;
					var lon2 = to.lon * radiansPerDegree;
					var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
					if (angle < 0) {
						angle += Math.PI * 2.0;
					}
					angle = angle * degreesPerRadian; //角度
					return angle;
				}
				//计算距离
				function distance(point1, point2) {
					var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
					var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
					/**根据经纬度计算出距离**/
					var geodesic = new Cesium.EllipsoidGeodesic();
					geodesic.setEndPoints(point1cartographic, point2cartographic);
					var s = geodesic.surfaceDistance;
					//返回两点之间的距离
					s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
					return s;
				}
				this.closeDeleteEntity = function () {
					handler.destroy();
					that.deleteEntitys(that, pointId, shape, boildOne, boildTwo, boildThree, waterEntity);
				}
			},

			onOpen: function () {
				//面板打开的时候触发 （when open this panel trigger）
			},

			onClose: function () {
				this.closeDeleteEntity();
				//面板关闭的时候触发 （when this panel is closed trigger）

				$('.dong-progress .container #progress_bar').width(0);
				$('.dong-progress').stop().hide();
				$('#dong_echarts').stop().hide();
				$('.jimu-widget-AnalysisOfBarrierLake p').stop().hide();
			},

			onMinimize: function () {
				this.resize();
			},

			onMaximize: function () {
				this.resize();
			},

			resize: function () { },

			destroy: function () {
				//销毁的时候触发
				//todo
				//do something before this func
				this.inherited(arguments);
			},

			deleteEntitys: function (that, pointId, shape, boildOne, boildTwo, boildThree, waterEntity) {
				if (pointId !== []) {
					for (var i = 0; i < pointId.length; i++) {
						that.map.entities.removeById(pointId[i]);
					}

						pointId = [];
				}
				that.map.entities.remove(shape)
				that.map.entities.remove(boildOne);
				that.map.entities.remove(boildTwo);
				that.map.entities.remove(boildThree);
				if (waterEntity != null) {
					that.map.entities.removeById(waterEntity._id);
				}
			}
		});
	});