///////////////////////////////////////////////////////////////////////////
// Copyright © 2019 zhongsong. All Rights Reserved.
// 模块描述: 山洪灾害预警 与 洪水淹没预警
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
			baseClass: 'jimu-widget-MountainFloodWarning',
			name: 'MountainFloodWarning',
			// 山洪的ID
			readyToTransfer: [],
			// 河流的位置
			foodPositions: [],
			// 河流的ID
			waterLineId: [],
			// 河流的数据
			waterData: [],
			// 山洪隐患点的数据
			mountainFloodData: [],
			// 山洪隐患点的位置
			positions: [],
			mainBtn: null,
			warningFoodTar: null,
			// 保存鼠标事件变量
			mountainHandler: null,
			// 立即转移
			immediateTransfer: [],
			// 存储水面线
			// earlyWarningFood: null,
			mountainRiverWidth: 20,
			mountainRiverHeight: 0.001,
			mountainSpeed: 10,
			mountainPositions: [],
			mountainSideRes: null,
			mountainRiverPrimitive: null,
			mountainMaterial: null,
			// 洪水选中的td对应的数据
			mountainTdData: null,
			startup: function () {
				topic.subscribe("closeMountain", lang.hitch(this, this.closeMountainFlood));
				topic.subscribe("openMountain", lang.hitch(this, this.openMountainFlood));
				var self = this;
				this.inherited(arguments);

				// 顶部tab切换的事件
				$('.early-warning-main .big span').click(function () {
					// 关闭洪水详情面板以及清除水面线
					self.removeWaterPrimitive();
					if (!$('.jimu-widget-MountainFloodWarning .early-warning-food-details').is(':hidden')) {
						$('.jimu-widget-MountainFloodWarning .early-warning-food-details').stop().hide();
					}


					if ($(this).index() == self.mainBtn) return;
					$(this).addClass('toggle-btn').siblings().removeClass('toggle-btn');
					if ($(this).index() == 0) {
						// 存储山洪隐患点ID
						self.readyToTransfer = [];
						// 存储山洪隐患点坐标
						self.positions = [];
						$('.early-warning-main ul li').eq($(this).index()).stop().show().siblings().stop().hide();
						$('.early-warning-content').stop().show().siblings('.early-warning-food-content').stop().hide();
						// 如果河流的ID数组不为空的话，则先清除
						if (self.waterLineId.length != 0) {
							self.waterLineId.forEach(function (item, index) {
								self.map.entities.removeById(item);
								self.map.entities.removeById(item + 'two');
							})
						}
						if (self.mountainFloodData.length != 0) {
							var result = self.mountainFloodData;
							var text = null;
							for (var i = 0; i < result.length; i++) {
								if (result[i].Max == 0) {
									text = "正常";
								} else if (result[i].Max == 1) {
									text = "准备转移";
									self.mountainPointEntity(self.map, {
										id: result[i].List.cenconding + result[i].List.dj,
										lon: Number(result[i].List.dj),
										lat: Number(result[i].List.bw),
										maxR: 20,
										minR: 0,//最好为0
										deviationR:  0.15,//差值 差值也大 速度越快
										cont: "黄"
									});
									self.readyToTransfer.push(result[i].List.cenconding + result[i].List.dj);
								} else if (result[i].Max == 2) {
									text = "立即转移";
									self.mountainPointEntity(self.map, {
										id: result[i].List.cenconding + result[i].List.bw,
										lon: Number(result[i].List.dj),
										lat: Number(result[i].List.bw),
										maxR: 20,
										minR: 0,//最好为0
										deviationR:  0.15,//差值 差值也大 速度越快
										cont: "红"
									});
									self.readyToTransfer.push(result[i].List.cenconding + result[i].List.bw);
								}
								self.positions.push({ lgtd: result[i].List.dj, lttd: result[i].List.bw });
							}
						}
					} else if ($(this).index() == 1) {
						
						// 如果山洪的ID数组不为空的话，则先清除
						self.foodPositions = [];
						self.waterLineId = [];
						$('.early-warning-main ul li').eq($(this).index()).stop().show().siblings().stop().hide();
						$('.early-warning-food-content').stop().show().siblings('.early-warning-content').stop().hide();
						if (self.readyToTransfer.length != 0) {
							self.readyToTransfer.forEach(function (item, index) {
								self.map.entities.removeById(item);
								self.map.entities.removeById(item + 'two');
							})
						}

						if (self.waterData.length != 0) {
							var result = self.waterData;

							for (var i = 0; i < result.length; i++) {
								// if (result[i].List.waterline > result[i].List.Z) {
									self.mountainPointEntity(self.map, {
										id: result[i].List.stationcode + result[i].List.dj + result[i].List.waterline + result[i].List.bw,
										lon: Number(result[i].List.dj),
										lat: Number(result[i].List.bw),
										maxR: 20,
										minR: 0,//最好为0
										deviationR:  0.15,//差值 差值也大 速度越快
										cont: "红"
									});
									self.foodPositions.push({ lgtd: result[i].List.dj, lttd: result[i].List.bw });
									self.waterLineId.push(result[i].List.stationcode + result[i].List.dj + result[i].List.waterline + result[i].List.bw)
								// }
							}
							$('.early-warning-main ul li').eq($(this).index()).stop().show().siblings().stop().hide();
							$('.early-warning-food-content').stop().show().siblings('.early-warning-content').stop().hide();
						} 
					}
					self.mainBtn = $(this).index();
				})

				// 洪水淹没中河流切换
				$('.early-warning-food-tar span').click(function () {
					if ($(this).index() == self.warningFoodTar) return;
					$(this).addClass('selection-btn').siblings().removeClass('selection-btn');
					var ind = null;
					if (self.waterLineId.length != 0) {
						self.waterLineId.forEach(function (item, index) {
							self.map.entities.removeById(item);
							self.map.entities.removeById(item + 'two');
							ind = index;
						})
					}


					if (ind == self.waterLineId.length - 1 || self.waterLineId.length == 0) {
						self.foodPositions = [];
						self.waterLineId = [];
						$('.early-warning-food-table tbody').empty();
						if ($(this).index() == 0) {
							$.ajax({
								url: "./widgets/MountainFloodWarning/data.json",
								type: "GET",
								dataType: 'JSON',
								success: function (data) {
									self.waterData = data.data;
									var result = data.data;
									var time = null;
									for (var i = 0; i < result.length; i++) {
										time = result[i].List.TM.substring(6, 16);
										if (!result[i].List.villagegroup) result[i].List.villagegroup = "";
										// if (result[i].List.waterline > result[i].List.Z) {
											$('.early-warning-food-table tbody').append($(`<tr>
												<td>${i + 1}</td>
												<td>${result[i].List.villagegroup}</td>
												<td>${result[i].List.rivername ? result[i].List.rivername : ' '}</td>
												<td>${result[i].List.waterline}</td>
												<td>${result[i].List.Z}</td>
												<td>${time}</td>
											</tr>`));
											self.foodPositions.push({ lgtd: result[i].List.dj, lttd: result[i].List.bw });
											self.mountainPointEntity(self.map, {
												id: result[i].List.stationcode + result[i].List.dj + result[i].List.waterline + result[i].List.bw + "qb",
												lon: Number(result[i].List.dj),
												lat: Number(result[i].List.bw),
												maxR: 20,
												minR: 0,//最好为0
												deviationR:  0.15,//差值 差值也大 速度越快
												cont: "红"
											});
											self.waterLineId.push(result[i].List.stationcode + result[i].List.dj + result[i].List.waterline + result[i].List.bw + "qb")
										// }
									}
								}
							})
						} else if ($(this).index() == 1) {
							$.ajax({
								url: "./widgets/MountainFloodWarning/data.json",
								type: "GET",
								dataType: 'JSON',
								success: function (data) {
									self.waterData = data.data;
									var result = data.data;
									var time = null;
									for (var i = 0; i < result.length; i++) {
										time = result[i].List.TM.substring(6, 16);
										if (!result[i].List.villagegroup) result[i].List.villagegroup = "";
										// if (result[i].List.waterline > result[i].List.Z) {
											$('.early-warning-food-table tbody').append($(`<tr>
												<td>${i + 1}</td>
												<td>${result[i].List.villagegroup}</td>
												<td>${result[i].List.rivername ? result[i].List.rivername : ' '}</td>
												<td>${result[i].List.waterline}</td>
												<td>${result[i].List.Z}</td>
												<td>${time}</td>
											</tr>`));
											self.mountainPointEntity(self.map, {
												id: result[i].List.stationcode + result[i].List.dj + result[i].List.waterline + result[i].List.bw + "zy",
												lon: Number(result[i].List.dj),
												lat: Number(result[i].List.bw),
												maxR: 20,
												minR: 0,//最好为0
												deviationR:  0.15,//差值 差值也大 速度越快
												cont: "红"
											});
											self.foodPositions.push({ lgtd: result[i].List.dj, lttd: result[i].List.bw });
											self.waterLineId.push(result[i].List.stationcode + result[i].List.dj + result[i].List.waterline + result[i].List.bw + "zy")
										// }
									}
								}
							})
						} else if ($(this).index() == 2) {
							$.ajax({
								url: "./widgets/MountainFloodWarning/data.json",
								type: "GET",
								dataType: 'JSON',
								success: function (data) {
									self.waterData = data.data;
									var result = data.data;
									var time = null;
									for (var i = 0; i < result.length; i++) {
										time = result[i].List.TM.substring(6, 16);
										if (!result[i].List.villagegroup) result[i].List.villagegroup = "";
										// if (result[i].List.waterline > result[i].List.Z) {
											$('.early-warning-food-table tbody').append($(`<tr>
											<td>${i + 1}</td>
											<td>${result[i].List.villagegroup}</td>
											<td>${result[i].List.rivername ? result[i].List.rivername : ' '}</td>
											<td>${result[i].List.waterline}</td>
											<td>${result[i].List.Z}</td>
											<td>${time}</td>
											</tr>`));
											self.mountainPointEntity(self.map, {
												id: result[i].List.stationcode + result[i].List.dj + result[i].List.waterline + result[i].List.bw + "zx",
												lon: Number(result[i].List.dj),
												lat: Number(result[i].List.bw),
												maxR: 20,
												minR: 0,//最好为0
												deviationR:  0.15,//差值 差值也大 速度越快
												cont: "红"
											});
											self.foodPositions.push({ lgtd: result[i].List.dj, lttd: result[i].List.bw });
											self.waterLineId.push(result[i].List.stationcode + result[i].List.dj + result[i].List.waterline + result[i].List.bw + "zx")
										// }
									}
								}
							})
						}
					}

					self.warningFoodTar = $(this).index();
				})

				// 山洪定位
				$(".early-warning-content tbody").on("click", "td", function (event) {
					if (event.target.localName == 'td') {
						var ind = $(event.target).parent().index();
						self.map.camera.flyTo({
							destination: Cesium.Cartesian3.fromDegrees(Number(self.positions[ind].lgtd), Number(self.positions[ind].lttd), 5000.0),
							duration: 5
						});
					}
				})

				// 洪水定位
				$(".early-warning-food-content tbody").on("click", "td", function (event) {

					if (event.target.localName == 'td') {
						self.mountainRiverWidth = 20;
						$('.early-warning-food-details input').text(' ');
						$('.early-warning-food-details select').empty();
						$('.early-warning-food-details .warning-food-smx li:eq(0) select').append("<option value='' disabled selected style='display:none;'>水面线选择</option>")
						// 水面线数据数组
						var cartesians = [];

						var ind = $(event.target).parent().index();
						self.map.camera.flyTo({
							destination: Cesium.Cartesian3.fromDegrees(Number(self.foodPositions[ind].lgtd), Number(self.foodPositions[ind].lttd), 5000.0),
							duration: 5
						});
						$('.early-warning-food-details').stop().show();

						var list = $('.early-warning-food-details .warning-food-content .warning-xq ul li');
						var val = self.waterData[ind].List;
						console.log(val);
						self.mountainTdData = val;
						$(list[0]).find('input:eq(0)').val(val.rivername);
						$(list[0]).find('input:eq(1)').val(val.district);
						$(list[1]).find('input:eq(0)').val(val.station);
						$(list[1]).find('input:eq(1)').val(val.stationcode);
						$(list[2]).find('input:eq(0)').val(val.township);
						$(list[2]).find('input:eq(1)').val(val.village);

						$(list[3]).find('input:eq(0)').val(val.dj);
						$(list[3]).find('input:eq(1)').val(val.bw);

						$(list[4]).find('input:eq(0)').val(val.villagegroup);
						$(list[4]).find('input:eq(1)').val(val.elevation + 'm');

						// $(list[5]).find('input:eq(0)').val(val.waterline + 'm');
						$(list[5]).find('input:eq(0)').val(val.TM.substring(6, 16));


						$('.early-warning-food-details .warning-food-smx li:eq(1) input').val(val.Z);
						$('.early-warning-food-details .warning-food-smx li:eq(2) input').val(val.elevation);
						$('.early-warning-food-details .warning-food-smx li:eq(3) input').val(self.waterData[ind].yjsw);
						$('.early-warning-food-details .warning-food-smx li:eq(4) input').val(self.mountainRiverWidth);

						$.ajax({
							url: 'http://www.sw797.com:82/blade-ycreal/waterline/parent-list',
							
							type: 'get',
							dataType: 'json',
							success: function (data) {
								data.data.records.forEach(function (item, index) {
									if (index < 1) {
										$('.early-warning-food-details .warning-food-smx li:eq(0) select').append($(`<option waterid='${item.id}' selected='selected' value='${item.waterline}' >${item.waterline}</option>`));

									} else {
										$('.early-warning-food-details .warning-food-smx li:eq(0) select').append($(`<option waterid='${item.id}' value='${item.waterline}' >${item.waterline}</option>`));

									}
								})
							}
						})

						$.ajax({
							url: `http://www.sw797.com:82/blade-ycreal/floodinundation/change?code=${val.stationcode}&Z=${val.Z}`,
							type: 'get',
							dataType: 'json',
							success: function (data) {
								console.log(data)
								data.data.forEach(function (item, index) {
									if (item.ListInfo.dj == val.dj && item.ListInfo.bw == val.bw && item.ListInfo.elevation == val.elevation && item.ListInfo.waterline == val.waterline) {
										
										item.List[0].WatersList.forEach(function (listitem, i) {
											cartesians.push(Cesium.Cartesian3.fromDegrees(listitem.lng, listitem.lat, listitem.water))
										})

										if (self.mountainRiverPrimitive != undefined) {
											self.removeWaterPrimitive();
										}
										cartesians.splice(cartesians.length - 1, cartesians.length);
										self.drawLines(cartesians);
									}
								})
							}
						})

					}
				})

				// 洪水定位后显示详情的面板
				$('.early-warning-food-details .warning-food-header span').click(function () {
					if (!$(this).hasClass('seleclick')) {
						$(this).addClass('seleclick').siblings().removeClass('seleclick');
					}
					$($('.warning-food-content').children('div').eq($(this).index())).stop().show().siblings().stop().hide();
				})

				// 关闭 洪水定位后显示的详情面板
				$('.early-warning-food-details .warning-food-header i').click(function () {
					self.removeWaterPrimitive();
					$('.early-warning-food-details').stop().hide();
				})

				// 实时水位改变触发事件
				$('.early-warning-food-details .warning-food-smx li:eq(1) input').change(function (event) {
					var cartesians = [];
					$.ajax({
						url: `http://www.sw797.com:82/blade-ycreal/floodinundation/change?code=${self.mountainTdData.stationcode}&Z=${$(this).val()}`,
						type: 'get',
						dataType: 'json',
						success: function (data) {
							data.data.forEach(function (item, index) {
								if (item.ListInfo.dj == self.mountainTdData.dj && item.ListInfo.bw == self.mountainTdData.bw && item.ListInfo.elevation == self.mountainTdData.elevation && item.ListInfo.waterline == self.mountainTdData.waterline) {
									
									$('.early-warning-food-details .warning-food-smx li:eq(3) input').val(item.List[0].waternumber);

									
									item.List[0].WatersList.forEach(function (listitem, i) {
										cartesians.push(Cesium.Cartesian3.fromDegrees(listitem.lng, listitem.lat, listitem.water))
									})

									if (self.mountainRiverPrimitive != undefined) {
										self.removeWaterPrimitive();
									}
									cartesians.splice(cartesians.length - 1, cartesians.length);
									self.drawLines(cartesians);

								}
							})
						}
					})
				});

				// 河流宽度改变触发事件
				$('.early-warning-food-details .warning-food-smx li:eq(4) input').change(function (event) {
					self.mountainRiverWidth = Number($(this).val());
					self.resetPos();
				});

				// 水面线选取事件
				$('.early-warning-food-details .warning-food-smx li:eq(0) select').change(function (event) {
					var opsitions=$('.early-warning-food-details .warning-food-smx li:eq(0) select option:selected');
					var cartesians = [];
					var waterid = Number(opsitions.attr('waterid'))
					$.ajax({
						url: `http://www.sw797.com:82/blade-ycreal/floodinundation/change?code=${self.mountainTdData.stationcode}&Z=${$('.early-warning-food-details .warning-food-smx li:eq(1) input').val()}&waterids=${waterid}`,
						type: 'get',
						dataType: 'json',
						success: function (data) {
							data.data.forEach(function (item, index) {
								
								if (item.ListInfo.dj == self.mountainTdData.dj && item.ListInfo.bw == self.mountainTdData.bw && item.ListInfo.elevation == self.mountainTdData.elevation && item.ListInfo.waterline == self.mountainTdData.waterline) {
									// $('.early-warning-food-details .warning-food-smx li:eq(1) input').val();
									$('.early-warning-food-details .warning-food-smx li:eq(3) input').val(item.List[0].waternumber);
									self.mountainRiverWidth = 20;
									$('.early-warning-food-details .warning-food-smx li:eq(4) input').val(self.mountainRiverWidth);
									item.List[0].WatersList.forEach(function (listitem, i) {
										cartesians.push(Cesium.Cartesian3.fromDegrees(listitem.lng, listitem.lat, listitem.water))
									})

									self.removeWaterPrimitive();
									cartesians.splice(cartesians.length - 1, cartesians.length);
									self.drawLines(cartesians);
								}
							})
						}
					})

				});
			},

			// 清除水面线
			removeWaterPrimitive: function () {
				if (this.mountainRiverPrimitive != undefined) {
					// this.map.entities.remove(this.earlyWarningFood);
					this.map.scene.primitives.remove(this.mountainRiverPrimitive);
				}
			},
			
			onOpen: function () {
				var self = this;
				this.mountainFloodData = [];
				this.waterData = [];
				this.foodPositions = [];
				this.waterLineId = [];
				// 存储山洪隐患点ID
				this.readyToTransfer = [];
				// 存储山洪隐患点坐标
				this.positions = [];
				self.mainBtn = null;
				self.warningFoodTar = null;
				// 面板打开的时候触发 （when open this panel trigger）
				// 山洪添加表单
				$.ajax({
					url: './widgets/MountainFloodWarning/result.json',
					type: 'get',
					dataType: 'json',
					success: function (data) {
						self.mountainFloodData = data.data;
						if (data.data.length == 0) {
							$($(".early-warning-echarts div span").eq(0)).addClass('toggle-btn').siblings().removeClass('toggle-btn');
							$(".early-warning-content").stop().show().next().stop().hide();
							$($(".early-warning-echarts ul li").eq(0)).stop().show().siblings().hide();
							$($(".jimu-widget-MountainFloodWarning .early-warning-main .early-warning-echarts ul li").eq(0)).addClass("nodata").text("暂无有效预警");
							var messageTxt = $("<div class='early-warning-message-box'> 暂无有效预警 <div/>");
							$(".jimu-widget-MountainFloodWarning .early-warning-content").append(messageTxt);
						}
						if (data.data.length != 0) {
							var result = data.data;
							var text = null;
							$('.early-warning-content tbody').empty();
							// 对应的行政区数据
							var legendData = [];
							// 准备转移数据
							var readyData = [];
							// 立即转移数据
							var immediatelyData = [];
							var ind = 0;
							for (var i = 0; i < result.length; i++) {
								if (result[i].Max == 0) {
									text = "正常";
									continue;
								} else if (result[i].Max == 1) {
									if (legendData.length == 0) {
										legendData.push(result[i].List.county);
										readyData.push(1);
										immediatelyData.push(0);
									} else {
										if (legendData.indexOf(result[i].List.county) == -1) {
											legendData.push(result[i].List.county);
											readyData.push(1);
											immediatelyData.push(0);
										} else if (legendData.indexOf(result[i].List.county) != -1) {
											if (readyData[legendData.indexOf(result[i].List.county)] == 0) {
												readyData[legendData.indexOf(result[i].List.county)] = 1;
											} else {
												readyData[(legendData.indexOf(result[i].List.county))] += 1;
											}
										}
									}
									text = "准备转移";
									// self.mountainPointEntity(self.map, {
									// 	id: result[i].List.cenconding + result[i].List.dj,
									// 	lon: result[i].List.dj,
									// 	lat: result[i].List.bw,
									// 	maxR: 10,
									// 	minR: 0,//最好为0
									// 	deviationR:  0.15,//差值 差值也大 速度越快
									// 	cont: "黄"
									// });
									// self.readyToTransfer.push(result[i].List.cenconding + result[i].List.dj);
								} else if (result[i].Max == 2) {
									if (legendData.length == 0) {
										legendData.push(result[i].List.county);
										immediatelyData.push(1);
										readyData.push(0);
									} else {
										if (legendData.indexOf(result[i].List.county) == -1) {
											legendData.push(result[i].List.county);
											immediatelyData.push(1);
											readyData.push(0);
										} else if (legendData.indexOf(result[i].List.county) != -1) {
											if (immediatelyData[legendData.indexOf(result[i].List.county)] == 0) {
												immediatelyData[legendData.indexOf(result[i].List.county)] = 1;
											} else {
												immediatelyData[(legendData.indexOf(result[i].List.county))] += 1;
											}
										}
									}
									text = "立即转移";
									// self.mountainPointEntity(self.map, {
									// 	id: result[i].List.cenconding + result[i].List.bw,
									// 	lon: result[i].List.dj,
									// 	lat: result[i].List.bw,
									// 	maxR: 10,
									// 	minR: 0,//最好为0
									// 	deviationR:  0.15,//差值 差值也大 速度越快
									// 	cont: "红"
									// });
									// self.readyToTransfer.push(result[i].List.cenconding + result[i].List.bw);
								}
								if (result[i].List.dj == "" || result[i].bw == "") continue;
								$('.early-warning-content tbody').append($(`<tr>
								<td>${ind += 1}</td>
								<td>${result[i].List.county}</td>
								<td>${result[i].List.village}</td>
								<td>${result[i].List.village_group}</td>
								<td>${text}</td>
							</tr>`))
								self.positions.push({ lgtd: result[i].List.dj, lttd: result[i].List.bw });
							}
							for (var i = 0; i < $('.early-warning-content tbody tr').length; i++) {
								var content = $('.early-warning-content tbody tr').eq(i).children().last().text();
								if (content == "准备转移") {
									$($('.early-warning-content tbody tr').eq(i)).children().css("color", "rgb(255,106,0)");
								}
								if (content == "立即转移") {
									$($('.early-warning-content tbody tr').eq(i)).children().css("color", "rgb(242, 10, 10)")
								}
							}

							var echartsData = echarts.init(document.getElementById('warning_content_echarts'));

							var options = {
								backgroundColor: '#23243a',
								tooltip: { //提示框组件
									trigger: 'axis',
									formatter: '{b}<br />{a0}: {c0}<br />{a1}: {c1}',
									axisPointer: {
										type: 'shadow',
										label: {
											backgroundColor: '#6a7985'
										}
									},
									textStyle: {
										color: '#fff',
										fontStyle: 'normal',
										fontFamily: '微软雅黑',
										fontSize: 12,
									}
								},
								grid: {
									left: '1%',
									right: '4%',
									bottom: '6%',
									top: 30,
									padding: '0 0 10 0',
									containLabel: true,
								},
								legend: {//图例组件，颜色和名字
									right: 4,
									top: 2,
									itemGap: 16,
									itemWidth: 18,
									itemHeight: 10,
									// orient: 'vertical',
									data: [{
										name: '准备转移',
										//icon:'image://../wwwroot/js/url2.png', //路径
									},
									{
										name: '立即转移',
									}],
									textStyle: {
										color: '#a8aab0',
										fontStyle: 'normal',
										fontFamily: '微软雅黑',
										fontSize: 12,
									}
								},
								toolbox: {
									show: true,
									z: 10,
									top: 20,
									right: 20,
									feature: {
										mark: { show: true },
										dataView: {
											show: true,
											readOnly: false,
											backgroundColor: "#23243a",
											textColor: "#fff",
											optionToContent: function (opt) {
												let axisData = opt.xAxis[0].data; //坐标数据
												let series = opt.series; //折线图数据
												let tdHeads = '<td style="padding: 0 10px; height: 26px; line-height: 26px;">行政区</td>'; //表头
												let tdBodys = ''; //数据
												series.forEach(function (item) {
													//组装表头
													tdHeads += `<td style="padding: 0 10px; height: 26px; line-height: 26px;">${item.name}</td>`;
												});
												let table = `<table border="1" style="color: #fff;border-color: #fff;margin-left:26px;border-collapse:collapse;font-size:12px;text-align:center; width: 230px;"><tbody><tr>${tdHeads} </tr>`;
												for (let i = 0, l = axisData.length; i < l; i++) {
													for (let j = 0; j < series.length; j++) {
														//组装表数据
														tdBodys += `<td style="padding: 0 10px; height: 26px; line-height: 26px;">${series[j].data[i]}</td>`;
													}
													table += `<tr><td style="padding: 0 10px; height: 26px; line-height: 26px;">${axisData[i]}</td>${tdBodys}</tr>`;
													tdBodys = '';
												}
												table += '</tbody></table>';
												return table;
											}
										},
										magicType: {
											show: true,
											type: ['pie', 'funnel']
										},
										restore: { show: true },
										saveAsImage: { show: true }
									}
								},
								xAxis: [
									{
										type: 'category',
										boundaryGap: true,//坐标轴两边留白
										data: legendData,
										axisLabel: { //坐标轴刻度标签的相关设置。
											interval: 0,//设置为 1，表示『隔一个标签显示一个标签』
											margin: 15,
											textStyle: {
												color: 'rgb(3,234,255)',
												fontStyle: 'normal',
												fontFamily: '微软雅黑',
												fontSize: 14,
											}
										},
										axisTick: {//坐标轴刻度相关设置。
											show: false,
										},
										axisLine: {//坐标轴轴线相关设置
											lineStyle: {
												color: '#fff',
												opacity: 0.2
											}
										},
										splitLine: { //坐标轴在 grid 区域中的分隔线。
											show: false,
										}
									}
								],
								yAxis: [
									{
										type: 'value',
										splitNumber: 5,
										axisLabel: {
											textStyle: {
												color: '#a8aab0',
												fontStyle: 'normal',
												fontFamily: '微软雅黑',
												fontSize: 12,
											}
										},
										axisLine: {
											show: false
										},
										axisTick: {
											show: false
										},
										splitLine: {
											show: true,
											lineStyle: {
												color: ['#fff'],
												opacity: 0.06
											}
										}

									}
								],
								series: [
									{
										name: '准备转移',
										type: 'bar',
										data: readyData,
										barWidth: 10,
										barGap: 0,//柱间距离
										label: {//图形上的文本标签
											normal: {
												show: true,
												position: 'top',
												textStyle: {
													color: '#a8aab0',
													fontStyle: 'normal',
													fontFamily: '微软雅黑',
													fontSize: 12,
												},
											},
										},
										itemStyle: {//图形样式
											normal: {
												barBorderRadius: [5, 5, 0, 0],
												color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
													offset: 1, color: 'rgba(127, 128, 225, 0.7)'
												}, {
													offset: 0.9, color: 'rgba(72, 73, 181, 0.7)'
												}, {
													offset: 0.31, color: 'rgba(0, 208, 208, 0.7)'
												}, {
													offset: 0.15, color: 'rgba(0, 208, 208, 0.7)'
												}, {
													offset: 0, color: 'rgba(104, 253, 255, 0.7)'
												}], false),
											},
										},
									},
									{
										name: '立即转移',
										type: 'bar',
										data: immediatelyData,
										barWidth: 10,
										barGap: 0.2,//柱间距离
										label: {//图形上的文本标签
											normal: {
												show: true,
												position: 'top',
												textStyle: {
													color: '#a8aab0',
													fontStyle: 'normal',
													fontFamily: '微软雅黑',
													fontSize: 12,
												},
											},
										},
										itemStyle: {//图形样式
											normal: {
												barBorderRadius: [5, 5, 0, 0],
												color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
													offset: 1, color: 'rgba(127, 128, 225, 0.7)'
												}, {
													offset: 0.9, color: 'rgba(72, 73, 181, 0.7)'
												}, {
													offset: 0.25, color: 'rgba(226, 99, 74, 0.7)'
												}, {
													offset: 0, color: 'rgba(253, 200, 106, 0.7)'
												}], false),
											},
										},
									}
								]
							};

							echartsData.setOption(options);

							$($(".early-warning-echarts div span").eq(0)).addClass('toggle-btn').siblings().removeClass('toggle-btn');
							$(".early-warning-content").stop().show().next().stop().hide();
							$($(".early-warning-echarts ul li").eq(0)).stop().show().siblings().hide();
						}
					}
				})

				// 洪水添加表单
				$.ajax({
					url: "./widgets/MountainFloodWarning/data.json",
					type: "GET",
					dataType: 'JSON',
					success: function (data) {
						if (data.data.length == 0) {
							$($(".jimu-widget-MountainFloodWarning .early-warning-main .early-warning-echarts ul li").eq(1)).addClass("nodata").text("暂无有效预警");
							var messageTxt = $("<div class='early-warning-message-box'> 暂无有效预警 <div/>");
							$(".jimu-widget-MountainFloodWarning .early-warning-food-content").append(messageTxt);
						}
						self.waterData = data.data;
						var result = data.data;
						var time = null;
						var ind = 0;
						$('.early-warning-food-table tbody').empty();
						$($(".early-warning-food-content .early-warning-food-tar span").eq(0)).addClass('selection-btn').siblings().removeClass('selection-btn');
						for (var i = 0; i < result.length; i++) {
							time = result[i].List.TM.substring(6, 16);
							if (!result[i].List.villagegroup) result[i].List.villagegroup = "";
							// if (result[i].List.waterline > result[i].List.Z) {
								$('.early-warning-food-table tbody').append($(`<tr>
									<td>${ind += 1}</td>
									<td>${result[i].List.villagegroup}</td>
									<td>${result[i].List.rivername ? result[i].List.rivername : ' '}</td>
									<td>${result[i].List.waterline}</td>
									<td>${result[i].List.Z}</td>
									<td>${time}</td>
									</tr>`));
								self.foodPositions.push({ lgtd: result[i].List.dj, lttd: result[i].List.bw });
							// } else {
							// 	continue;
							// }
						}
					}
				})

				// 洪水淹没图表
				$.ajax({
					url: 'http://www.sw797.com:82/blade-ycreal/floodinundation/selectCount',
					type: 'get',
					dataType: 'json',
					success: function (result) {
						// return
						var echartsData = echarts.init(document.getElementById('warning_food_echarts'));
						var data = getData(result.data);
						var options = {
							tooltip: {
								// 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
								trigger: 'item',
								// 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
								// {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）,
								position: "right",
								formatter: '淹没站点数 <br/>{b} : {c}',
								extraCssText: 'width:140px;height:56px;background:rgb(5,93,170);'
							},
							legend: {
								// 图例得类型
								type: 'scroll',
								// 图例得布局朝向
								orient: 'vertical',
								// 图例组件离右侧得距离
								right: 20,
								top: 40,
								bottom: 20,
								// 图例的数据数组。数组项通常为一个字符串，
								// 每一项代表一个系列的 name（如果是饼图，
								// 也可以是饼图单个数据的 name）。图例组件
								// 会自动根据对应系列的图形标记（symbol）来绘制
								// 自己的颜色和标记，特殊字符串 ''（空字符串）或
								// 者 '\n'（换行字符串）用于图例的换行。
								data: data.legendData,
								// 图例选中状态表
								selected: data.selected,
								textStyle: {
									color: "#fff"
								},
								pageTextStyle: {
									color: '#fff'
								}
							},
							toolbox: {
								show: true,
								right: 20,
								z: 10,
								feature: {
									mark: { show: true },
									dataView: {
										show: true,
										readOnly: false,
										backgroundColor: "#23243a",
										textColor: "#fff",
										optionToContent: function (opt) {
											let axisData = opt.series[0].data; //坐标数据

											let series = opt.series; //折线图数据

											let tdHeads = ''; //表头

											let tdBodys = ''; //数据
											series.forEach(function (item) {
												//组装表头
												tdHeads += `<td style="padding: 0 10px; height: 26px; line-height: 26px;">${item.name}</td> <td style="padding: 0 10px; height: 26px; line-height: 26px;">预警数量</td>`;
											});
											let table = `<table border="1" style="color: #fff;border-color: #fff;margin-left:26px;border-collapse:collapse;font-size:14px;text-align:center; width: 230px;"><tbody><tr style=" height: 26px; line-height: 26px;">${tdHeads} </tr>`;
											for (let i = 0, l = axisData.length; i < l; i++) {
												for (let j = 0; j < series.length; j++) {
													//组装表数据
													tdBodys += `<td style=" height: 26px; line-height: 26px;">${series[j].data[i].value}</td>`;
												}
												table += `<tr><td style="padding: 0 10px; height: 26px; line-height: 26px;">${axisData[i].name}</td>${tdBodys}</tr>`;
												tdBodys = '';
											}
											table += '</tbody></table>';
											return table;
										}
									},
									magicType: {
										show: true,
										type: ['pie', 'funnel']
									},
									restore: { show: true },
									saveAsImage: { show: true }
								}
							},
							series: [
								{
									name: '行政区',
									// 类型 饼图
									type: 'pie',
									// 饼图的半径。
									radius: '84%',
									// 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。
									center: ['38%', '50%'],
									// 系列中的数据内容数组。数组项可以为单个数值，如：
									label: {
										normal: {
											position: 'inner',
											show: false
										}
									},
									data: data.seriesData,
									emphasis: {
										itemStyle: {
											shadowBlur: 10,
											shadowOffsetX: 0,
											shadowColor: 'rgba(0, 0, 0, 0.5)'
										}
									}
								}
							]
						};
						function getData(count) {
							var legendData = [];
							var seriesData = [];
							var selected = {};
							for (var i = 0; i < count.length; i++) {
								legendData.push(count[i].district);
								seriesData.push({ name: count[i].district, value: count[i].b });
								selected[count[i].district] = count[i].b > 0;
							}
							return {
								legendData: legendData,
								seriesData: seriesData,
								selected: selected
							};
						}
						echartsData.setOption(options);
					}
				})

				this.movehandLer({ isRegister: true });

			},

			openMountainFlood: function (item) {
				var self = this;
				if (item == this.name) {

					if ($('.early-warning-main .big span:eq(0)').hasClass('toggle-btn')) {
						if (self.mountainFloodData.length != 0) {
							var result = self.mountainFloodData;
							var text = null;
							for (var i = 0; i < result.length; i++) {
								if (result[i].Max == 0) {
									text = "正常";
								} else if (result[i].Max == 1) {
									text = "准备转移";
									self.mountainPointEntity(self.map, {
										id: result[i].List.cenconding + result[i].List.dj,
										lon: Number(result[i].List.dj),
										lat: Number(result[i].List.bw),
										maxR: 20,
										minR: 0,//最好为0
										deviationR:  0.15,//差值 差值也大 速度越快
										cont: "黄"
									});
									self.readyToTransfer.push(result[i].List.cenconding + result[i].List.dj);
								} else if (result[i].Max == 2) {
									text = "立即转移";
									self.mountainPointEntity(self.map, {
										id: result[i].List.cenconding + result[i].List.bw,
										lon: Number(result[i].List.dj),
										lat: Number(result[i].List.bw),
										maxR: 20,
										minR: 0,//最好为0
										deviationR:  0.15,//差值 差值也大 速度越快
										cont: "红"
									});
									self.readyToTransfer.push(result[i].List.cenconding + result[i].List.bw);
								}
								self.positions.push({ lgtd: result[i].List.dj, lttd: result[i].List.bw });
							}
						}


					} else if ($('.early-warning-main .big span:eq(1)').hasClass('toggle-btn')) {
						if (self.waterData.length != 0) {
							var result = self.waterData;

							for (var i = 0; i < result.length; i++) {

								// if (result[i].List.waterline > result[i].List.Z) {
									self.mountainPointEntity(self.map, {
										id: result[i].List.stationcode + result[i].List.dj + result[i].List.waterline + result[i].List.bw,
										lon: Number(result[i].List.dj),
										lat: Number(result[i].List.bw),
										maxR: 20,
										minR: 0,//最好为0
										deviationR:  0.15,//差值 差值也大 速度越快
										cont: "红"
									});
									self.foodPositions.push({ lgtd: result[i].List.dj, lttd: result[i].List.bw });
									self.waterLineId.push(result[i].List.stationcode + result[i].List.dj + result[i].List.waterline + result[i].List.bw)
								// }
							}
							$('.early-warning-main ul li').eq($(this).index()).stop().show().siblings().stop().hide();
							$('.early-warning-food-content').stop().show().siblings('.early-warning-content').stop().hide();
						}

					}

					this.movehandLer({ isRegister: true });

				}
			},

			closeMountainFlood: function (item) {
				var self = this;
				if (item == this.name) {
					this.removeWaterPrimitive();
					$('.jimu-widget-MountainFloodWarning .early-warning-food-details').stop().hide();
					$(".jimu-widget-MountainFloodWarning").stop().hide();
					if (self.waterLineId.length != 0) {
						self.waterLineId.forEach(function (item, index) {
							self.map.entities.removeById(item);
							self.map.entities.removeById(item + 'two');
						})
					}
					if (self.readyToTransfer.length != 0) {
						self.readyToTransfer.forEach(function (item, index) {
							self.map.entities.removeById(item);
							self.map.entities.removeById(item + 'two');
						})
					}

					this.movehandLer({ isRegister: false });
				}
			},

			onClose: function () {
				//面板关闭的时候触发 （when this panel is closed trigger）;
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

			mountainPointEntity: function (viewer, data) {
				var r1 = data.minR;
				var colors = null;
				var outlineColors = null;
				if (data.cont == "黄") {
					colors = Cesium.Color.fromBytes(255, 106, 0);
					outlineColors = Cesium.Color.fromBytes(255, 106, 0, 100);
				} else if (data.cont == "红") {
					colors = Cesium.Color.fromBytes(242, 10, 10);
					outlineColors = Cesium.Color.fromBytes(242, 0, 0, 100);
				}
				function changeR1() { //这是callback，参数不能内传
					r1 = r1 + data.deviationR;
					if (r1 >= data.maxR) {
						r1 = data.minR;
					}
					return r1;
				}
				
				viewer.entities.add({
					id: data.id + 'two',
					position: Cesium.Cartesian3.fromDegrees(data.lon, data.lat, 0.11),
					billboard: {
						image: './images/mountain-on.png', // img 与实体相关的图片
						show: true,
						width: new Cesium.CallbackProperty(changeR1, false),
						height: new Cesium.CallbackProperty(changeR1, false),
						color: outlineColors,
						heightReference:  Cesium.HeightReference.RELATIVE_TO_GROUND,
						disableDepthTestDistance: Number.POSITIVE_INFINITY
					}
				})

				viewer.entities.add({
					id: data.id,
					position: Cesium.Cartesian3.fromDegrees(data.lon, data.lat, 0.1),
					billboard: {
						image: './images/mountain-in.png', // img 与实体相关的图片
						show: true,
						width: 10,
						height: 10,
						color: colors,
						heightReference:  Cesium.HeightReference.RELATIVE_TO_GROUND,
						disableDepthTestDistance: Number.POSITIVE_INFINITY
					}
				})

			},

			// 获取鼠标事件
			movehandLer: function (config) {
				if (config.isRegister == true) {
					// 取消默认双击事件
					this.map.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
					// 获取鼠标事件
					this.mountainHandler = new Cesium.ScreenSpaceEventHandler(this.map.scene.canvas);
					// 给鼠标左键添加事件函数
					this.mountainHandler.setInputAction(lang.hitch(this, this.clickHand), Cesium.ScreenSpaceEventType.LEFT_CLICK);
				} else {
					this.mountainHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
				}

			},

			// 注册鼠标左键单击事件
			clickHand: function (movement) {
				var self = this;
				var pickedObjects = this.map.scene.drillPick(movement.position);
				if (Cesium.defined(pickedObjects)) {
					for (var i = 0; i < pickedObjects.length; ++i) {
						var obj = pickedObjects[i].id;
						var id = obj.id;
						if (self.readyToTransfer.indexOf(id) != -1) {
							self.mountainFloodData.forEach(function (item, index) {
								if (item.List.cenconding + item.List.dj == id) {
									self.openMountainLayer(item.List);
								} else if (item.List.cenconding + item.List.bw == id) {
									self.openMountainLayer(item.List);
								}
							})
							break;
						} else if (self.waterLineId.indexOf(id) != -1) {
							self.waterData.forEach(function (item, index) {
								if (item.List.stationcode + item.List.dj + item.List.waterline + item.List.bw == id) {
									self.openWaterLayer(item);
								}
							})
							break;
						}
					}
				}
			},

			// 山洪实体点击，弹框
			openMountainLayer: function (item) {
				var url = "./widgets/MountainFloodWarning/popup/rain.html";

				var top = ($(window).height()-526)/2;
				var left = ($(window).width()-802-440)/2+440;
				layer.open({
					title: item.village,
					type: 2,
					shadeClose: true,
					shade: false,
					maxmin: true, //开启最大化最小化按钮
					area: ['802px', '526px'],
					offset: [top,left],
					content: url + "?id=" + item.cenconding,
					id: "shanhongyinhuandian",
					closeBtn: 1,
				});
			},

			// 洪水淹没实体点击，弹框
			openWaterLayer: function (item) {
				var top = ($(window).height()-526)/2;
				var left = ($(window).width()-802-440)/2+440;
				var url = "./widgets/MountainFloodWarning/popup/river.html";
				layer.open({
					title: item.List.villagegroup,
					type: 2,
					shadeClose: true,
					shade: false,
					maxmin: true, //开启最大化最小化按钮
					area: ['802px', '526px'],
					offset: [top,left],
					content: url + "?id=" + item.List.stationcode,
					id: "hongshuiyanmo",
					closeBtn: 1,
				});
			},



			// 绘制实时水面线
			init: function () {
				this.prepareVertex();
				if (this.mountainSideRes) {
					this.mountainMaterial = this.prepareMaterial();
					this.mountainRiverPrimitive && this.map.scene.primitives.remove(this.mountainRiverPrimitive);
					this.mountainRiverPrimitive = this.createPrimitive();
					this.map.scene.primitives.add(this.mountainRiverPrimitive);
				}
			},
			prepareVertex: function () {
				if (this.mountainPositions.length > 0) {
					this.mountainSideRes = this._lines2Plane(this.mountainPositions, this.mountainRiverWidth, this.mountainRiverHeight);
				}
			},
			setPositions: function (e) {
				this.mountainPositions = e;
				this.init();
			},
			resetPos: function () {
				this.mountainSideRes = this._lines2Plane(this.mountainPositions, this.mountainRiverWidth, this.mountainRiverHeight);
				if (this.mountainSideRes) {
					this.mountainMaterial = this.prepareMaterial();
					this.mountainRiverPrimitive && this.map.scene.primitives.remove(this.mountainRiverPrimitive);
					this.mountainRiverPrimitive = this.createPrimitive();
					this.map.scene.primitives.add(this.mountainRiverPrimitive);
				}
			},

			drawLines: function (r) {
				this.setPositions(r);
			},
			prepareMaterial: function () {
				var e = new Cesium.Material({
					// fabric: {
					// 	uniforms: {
					// 		image: "widgets/DynamicRiver/images/movingRiver.png",
					// 		alpha: 0.5,
					// 		moveVar: new Cesium.Cartesian3(50, 1, 100),
					// 		reflux: -1,
					// 		speed: this.mountainSpeed,
					// 		move: true,
					// 		flipY: false
					// 	},
					// 	source: "czm_material czm_getMaterial(czm_materialInput materialInput) { \n                        czm_material material = czm_getDefaultMaterial(materialInput); \n                        vec2 st = materialInput.st;\n                        if(move){\n                            float r = sqrt((st.x-0.8)*(st.x-0.8) + (st.y-0.8)*(st.y-0.8));\n                            float r2 = sqrt((st.x-0.2)*(st.x-0.2) + (st.y-0.2)*(st.y-0.2));\n                            float z = cos(moveVar.x*r + czm_frameNumber/100.0*moveVar.y)/moveVar.z;\n                            float z2 = cos(moveVar.x*r2 + czm_frameNumber/100.0*moveVar.y)/moveVar.z;\n                            st += sqrt(z*z+z2*z2);\n                            st.s += reflux * czm_frameNumber/1000.0 * speed;\n                            st.s = mod(st.s,1.0);\n                        }\n                        if(flipY){\n                            st = vec2(st.t,st.s);\n                        }\n                        vec4 colorImage = texture2D(image, st);\n                        material.alpha = alpha;\n                        material.diffuse = colorImage.rgb; \n                        return material; \n                    }"
					// }
					fabric : {
						type : 'Color',
						uniforms : {
						  color : Cesium.Color.fromBytes(37, 149, 233, 145)
						}
					  }
				});
				return e
			},

			createPrimitive: function () {
				var t = new Float64Array(this.mountainSideRes.vertexs),
					i = new Cesium.GeometryAttributes;
				i.position = new Cesium.GeometryAttribute({
					componentDatatype: Cesium.ComponentDatatype.DOUBLE,
					componentsPerAttribute: 3,
					values: t
				}),
					i.st = new Cesium.GeometryAttribute({
						componentDatatype: Cesium.ComponentDatatype.FLOAT,
						componentsPerAttribute: 2,
						values: this.mountainSideRes.uvs
					});
				var r = new Cesium.Geometry({
					attributes: i,
					indices: this.mountainSideRes.indexs,
					primitiveType: Cesium.PrimitiveType.TRIANGLES,
					boundingSphere: Cesium.BoundingSphere.fromVertices(t)
				}),
					n = new Cesium.GeometryInstance({
						geometry: r
					}),
					o = new Cesium.RenderState;
				return o.depthTest.enabled = !0, new Cesium.Primitive({
					geometryInstances: n,
					appearance: new Cesium.Appearance({
						material: this.mountainMaterial,
						renderState: o,
						vertexShaderSource: "attribute vec3 position3DHigh;\n                attribute vec3 position3DLow;\n                attribute vec2 st;\n                attribute float batchId;\n                \n                varying vec3 v_positionMC;\n                varying vec3 v_positionEC;\n                varying vec2 v_st;\n                \n                void main()\n                {\n                    vec4 p = czm_computePosition();\n                \n                    v_positionMC = position3DHigh + position3DLow;           // position in model coordinates\n                    v_positionEC = (czm_modelViewRelativeToEye * p).xyz;     // position in eye coordinates\n                    v_st = st;\n                \n                    gl_Position = czm_modelViewProjectionRelativeToEye * p;\n                }\n                ",
						fragmentShaderSource: "varying vec3 v_positionMC;\n                varying vec3 v_positionEC;\n                varying vec2 v_st;\n                \n                void main()\n                {\n                    czm_materialInput materialInput;\n                \n                    vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n                #ifdef FACE_FORWARD\n                    normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n                #endif\n                \n                    materialInput.s = v_st.s;\n                    materialInput.st = v_st;\n                    materialInput.str = vec3(v_st, 0.0);\n                \n                    // Convert tangent space material normal to eye space\n                    materialInput.normalEC = normalEC;\n                    materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n                \n                    // Convert view vector to world space\n                    vec3 positionToEyeEC = -v_positionEC;\n                    materialInput.positionToEyeEC = positionToEyeEC;\n                \n                    czm_material material = czm_getMaterial(materialInput);\n                \n                #ifdef FLAT\n                    gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n                #else\n                    gl_FragColor = czm_phong(normalize(positionToEyeEC), material,czm_lightDirectionEC);\n                #endif\n                }\n                "
					})
				})
			},

			offsetHeight: function (height, time) {
				this.startDH(height, time)
			},

			startDH: function (height, time) {
				if (height && time && this.mountainRiverPrimitive) {
					for (var i = this, r = 0, n = height / (20 * time), o = this.mountainSideRes.self, s = new Cesium.Cartesian3, l = 0, u = o.length; l < u; l++) {
						var c = Cesium.Cartesian3.normalize(o[l], new Cesium.Cartesian3);
						Cesium.Cartesian3.add(s, c, s)
					}
					Cesium.Cartesian3.normalize(s, s);
					var h = Cesium.clone(this.mountainRiverPrimitive.modelMatrix);
					this.dhEvent = function () {
						if (Math.abs(r) <= Math.abs(height)) {
							var t = Cesium.Cartesian3.multiplyByScalar(s, r, new Cesium.Cartesian3);
							i.mountainRiverPrimitive.modelMatrix = Cesium.Matrix4.multiplyByTranslation(h, t, new Cesium.Matrix4)
						} else i.map.clock.onTick.removeEventListener(i.dhEvent);
						r += n
					}, this.map.clock.onTick.addEventListener(this.dhEvent)
				}
			},
			//水面线转成水面
			_lines2Plane: function (positions, width, height) {
				function n(point, height) {
					if (!(point instanceof Cesium.Cartesian3)) return void console.log("请确认点是Cartesian3类型！");
					if (!height || 0 == height) return void console.log("请确认高度是非零数值！");
					var i = Cesium.Cartesian3.normalize(point, new Cesium.Cartesian3),
						r = new Cesium.Ray(point, i);//射线
					return Cesium.Ray.getPoint(r, height)
				}

				function o(point, point1, height) {
					var r = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(point1, point, new Cesium.Cartesian3), new Cesium.Cartesian3),
						n = Cesium.Cartesian3.normalize(point, new Cesium.Cartesian3),
						o = Cesium.Cartesian3.cross(n, r, new Cesium.Cartesian3),
						a = Cesium.Cartesian3.cross(r, n, new Cesium.Cartesian3),
						l = new Cesium.Ray(point, o),
						u = new Cesium.Ray(point, a);
					return {
						left: Cesium.Ray.getPoint(l, height),
						right: Cesium.Ray.getPoint(u, height)
					}
				}

				if (!positions || positions.length <= 1 || !width || 0 == width) return void console.log("请确认参数符合规则：数组长度大于1，宽高不能为0！");
				for (var r = positions.length, a = [], l = [], u = width / 2, c = 0; c < r; c++) {
					var h = void 0,
						d = void 0,
						f = void 0,
						p = void 0,
						m = void 0;
					if (0 == c ? (h = positions[c], d = positions[c], f = positions[c + 1]) : c == r - 1 ? (h = positions[c - 1], d = positions[c], f = positions[c - 1]) : (h = positions[c - 1], d = positions[c], f = positions[c + 1]), 0 != height && (h = n(h, height), d = n(d, height), f = n(f, height)), h && d && f) {
						var g = o(d, f, u);
						if (p = g.left, m = g.right, 0 == c) {
							a.push(p), l.push(m), a.push(p), l.push(m);
							continue
						}
						if (!(c < r - 1)) {
							a.push(m), l.push(p), a.push(m), l.push(p);
							continue
						}
						a.push(p), l.push(m), g = o(d, h, u), p = g.left, m = g.right, a.push(m), l.push(p)
					}
				}

				var v = [],
					y = [];
				if (a.length != 2 * r) return void console.log("计算左右侧点出问题！");
				for (var _ = 0; _ < r; _++) {
					var w = positions[_],
						b = a[2 * _ + 0],
						C = a[2 * _ + 1],
						x = Cesium.Cartesian3.subtract(b, w, new Cesium.Cartesian3),
						P = Cesium.Cartesian3.subtract(C, w, new Cesium.Cartesian3),
						M = Cesium.Cartesian3.add(x, P, new Cesium.Cartesian3),
						E = Cesium.Cartesian3.add(w, M, new Cesium.Cartesian3);
					v.push(Cesium.clone(E));
					var T = l[2 * _ + 0],
						S = l[2 * _ + 1];
					x = Cesium.Cartesian3.subtract(T, w, new Cesium.Cartesian3), P = Cesium.Cartesian3.subtract(S, w, new Cesium.Cartesian3), M = Cesium.Cartesian3.add(x, P, new Cesium.Cartesian3), E = Cesium.Cartesian3.add(w, M, new Cesium.Cartesian3), y.push(Cesium.clone(E))
				}

				for (var O = [], D = [], k = [], A = [], R = [], F = 0; F < r; F++) {
					var L = Cesium.EncodedCartesian3.fromCartesian(y[F]);
					D.push(y[F].x), D.push(y[F].y), D.push(y[F].z), k.push(L.high.x), k.push(L.high.y), k.push(L.high.z), A.push(L.low.x), A.push(L.low.y), A.push(L.low.z), O.push(1, 1), F < r - 1 && (R.push(F + 2 * r), R.push(F + 1), R.push(F + 1 + r), R.push(F + 2 * r), R.push(F + 1 + r), R.push(r + F + 2 * r))
				}

				for (var I = 0; I < r; I++) {
					var N = Cesium.EncodedCartesian3.fromCartesian(v[I]);
					D.push(v[I].x), D.push(v[I].y), D.push(v[I].z), k.push(N.high.x), k.push(N.high.y), k.push(N.high.z), A.push(N.low.x), A.push(N.low.y), A.push(N.low.z), O.push(1, 0)
				}

				for (var V = 0; V < r; V++) {
					var z = Cesium.EncodedCartesian3.fromCartesian(y[V]);
					D.push(y[V].x), D.push(y[V].y), D.push(y[V].z), k.push(z.high.x), k.push(z.high.y), k.push(z.high.z), A.push(z.low.x), A.push(z.low.y), A.push(z.low.z), O.push(0, 1)
				}

				for (var H = 0; H < r; H++) {
					var B = Cesium.EncodedCartesian3.fromCartesian(v[H]);
					D.push(v[H].x), D.push(v[H].y), D.push(v[H].z), k.push(B.high.x), k.push(B.high.y), k.push(B.high.z), A.push(B.low.x), A.push(B.low.y), A.push(B.low.z), O.push(0, 0)
				}

				return {
					left: v,
					right: y,
					self: positions,
					vertexs: new Float32Array(D),
					vertexsH: new Float32Array(k),
					vertexsL: new Float32Array(A),
					indexs: new Uint16Array(R),
					uvs: new Float32Array(O)
				}
			}
		});
	});