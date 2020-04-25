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
	"libs/echarts/v4/echarts.min"
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
		echarts
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
			// 立即转移
			immediateTransfer: [],
			startup: function () {
				topic.subscribe("closeMountain", lang.hitch(this, this.closeMountainFlood));
				var self = this;
				this.inherited(arguments);
				$('.jimu-widget-MountainFloodWarning .btn').click(function () {
					if ($(".early-warning-main").is(":hidden")) {
						$('.jimu-widget-MountainFloodWarning .btn').removeClass('btright').addClass('btleft').text('收回');
						$(".early-warning-main").stop().show();    //如果元素为隐藏,则将它显现
						$(".jimu-widget-MountainFloodWarning").css({ "background-color": "rgba(21, 24, 82, .5)", "width": "360px" });


						// 展开的时候添加实体
						if ($($(".early-warning-echarts .big span").eq(0)).hasClass("toggle-btn") == true) {
							self.readyToTransfer = [];
							self.positions = [];
							if (self.mountainFloodData.length != 0) {
								var result = self.mountainFloodData;
								var text = null;
								for (var i = 0; i < result.length; i++) {
									if (result[i].Max == 0) {
										text = "正常";
									} else if (result[i].Max == 1) {
										text = "准备转移";
										self.addPoints(self.map, { //默认只绘制两个圆圈叠加 如遇绘制多个，请自行源码内添加。
											id: result[i].List.cenconding + result[i].List.dj,
											lon: result[i].List.dj,
											lat: result[i].List.bw,
											maxR: 10,
											minR: 0,//最好为0
											deviationR: 0.3,//差值 差值也大 速度越快
											cont: "黄"
										});
										self.readyToTransfer.push(result[i].List.cenconding + result[i].List.dj);
									} else if (result[i].Max == 2) {
										text = "立即转移";
										self.addPoints(self.map, { //默认只绘制两个圆圈叠加 如遇绘制多个，请自行源码内添加。
											id: result[i].List.cenconding + result[i].List.bw,
											lon: result[i].List.dj,
											lat: result[i].List.bw,
											maxR: 10,
											minR: 0,//最好为0
											deviationR: 0.3,//差值 差值也大 速度越快
											cont: "红"
										});
										self.readyToTransfer.push(result[i].List.cenconding + result[i].List.bw);
									}
									self.positions.push({ lgtd: result[i].List.dj, lttd: result[i].List.bw });
								}
							}
						} else if ($($(".early-warning-echarts .big span").eq(1)).hasClass("toggle-btn") == true) {
							self.foodPositions = [];
							self.waterLineId = [];
							var results = self.waterData;
							for (var i = 0; i < results.length; i++) {
								time = results[i].TM.substring(6, 16);
								if (!results[i].villagegroup) results[i].villagegroup = "";
								if (results[i].waterline > results[i].Z) {
									self.addPoints(self.map, { //默认只绘制两个圆圈叠加 如遇绘制多个，请自行源码内添加。
										id: results[i].stationcode + results[i].dj + results[i].waterline + results[i].bw,
										lon: results[i].dj,
										lat: results[i].bw,
										maxR: 10,
										minR: 0,//最好为0
										deviationR: 0.3,//差值 差值也大 速度越快
										cont: "红"
									});
									self.foodPositions.push({ lgtd: results[i].dj, lttd: results[i].bw });
									self.waterLineId.push(results[i].stationcode + results[i].dj + results[i].waterline + results[i].bw)
								}
							}
						}

					} else {
						self.readyToTransfer.forEach(function (item, index) {
							self.map.entities.removeById(item);
						})
						self.waterLineId.forEach(function (item, index) {
							self.map.entities.removeById(item);
						})
						$('.jimu-widget-MountainFloodWarning .btn').removeClass('btleft').addClass('btright').text('预警');
						$(".early-warning-main").stop().hide();     //如果元素为显现,则将其隐藏
						$(".jimu-widget-MountainFloodWarning").css({ "background-color": "transparent", "width": "0" });
					}

				})

				// 顶部tab切换的事件
				$('.early-warning-main .big span').click(function () {
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
									self.addPoints(self.map, { //默认只绘制两个圆圈叠加 如遇绘制多个，请自行源码内添加。
										id: result[i].List.cenconding + result[i].List.dj,
										lon: result[i].List.dj,
										lat: result[i].List.bw,
										maxR: 10,
										minR: 0,//最好为0
										deviationR: 0.3,//差值 差值也大 速度越快
										cont: "黄"
									});
									self.readyToTransfer.push(result[i].List.cenconding + result[i].List.dj);
								} else if (result[i].Max == 2) {
									text = "立即转移";
									self.addPoints(self.map, { //默认只绘制两个圆圈叠加 如遇绘制多个，请自行源码内添加。
										id: result[i].List.cenconding + result[i].List.bw,
										lon: result[i].List.dj,
										lat: result[i].List.bw,
										maxR: 10,
										minR: 0,//最好为0
										deviationR: 0.3,//差值 差值也大 速度越快
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
						if (self.readyToTransfer.length != 0) {
							self.readyToTransfer.forEach(function (item, index) {
								self.map.entities.removeById(item);
							})
						}
						var result = self.waterData;
						for (var i = 0; i < result.length; i++) {
							time = result[i].TM.substring(6, 16);
							if (!result[i].villagegroup) result[i].villagegroup = "";
							if (result[i].waterline > result[i].Z) {
								self.addPoints(self.map, { //默认只绘制两个圆圈叠加 如遇绘制多个，请自行源码内添加。
									id: result[i].stationcode + result[i].dj + result[i].waterline + result[i].bw,
									lon: result[i].dj,
									lat: result[i].bw,
									maxR: 10,
									minR: 0,//最好为0
									deviationR: 0.3,//差值 差值也大 速度越快
									cont: "红"
								});
								self.foodPositions.push({ lgtd: result[i].dj, lttd: result[i].bw });
								self.waterLineId.push(result[i].stationcode + result[i].dj + result[i].waterline + result[i].bw)
							}
						}
						$('.early-warning-main ul li').eq($(this).index()).stop().show().siblings().stop().hide();
						$('.early-warning-food-content').stop().show().siblings('.early-warning-content').stop().hide();
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
							ind = index;
						})
					}

					if (ind == self.waterLineId.length - 1) {
						self.foodPositions = [];
						self.waterLineId = [];
						$('.early-warning-food-table tbody').empty();
						if ($(this).index() == 0) {
							$.ajax({
								url: "http://www.sw797.com:82/blade-ycreal/floodinundation/selectAll?code=3",
								type: "GET",
								dataType: 'JSON',
								success: function (data) {
									self.waterData = data.data;
									var result = data.data;
									var time = null;
									for (var i = 0; i < result.length; i++) {
										time = result[i].TM.substring(6, 16);
										if (!result[i].villagegroup) result[i].villagegroup = "";
										if (result[i].waterline > result[i].Z) {
											$('.early-warning-food-table tbody').append($(`<tr>
												<td>${i + 1}</td>
												<td>${result[i].villagegroup}</td>
												<td>${result[i].rivername}</td>
												<td>${result[i].waterline}</td>
												<td>${result[i].Z}</td>
												<td>${time}</td>
											</tr>`));
											self.foodPositions.push({ lgtd: result[i].dj, lttd: result[i].bw });
											self.addPoints(self.map, { //默认只绘制两个圆圈叠加 如遇绘制多个，请自行源码内添加。
												id: result[i].stationcode + result[i].dj + result[i].waterline + result[i].bw + "qb",
												lon: result[i].dj,
												lat: result[i].bw,
												maxR: 10,
												minR: 0,//最好为0
												deviationR: 0.3,//差值 差值也大 速度越快
												cont: "红"
											});
											self.waterLineId.push(result[i].stationcode + result[i].dj + result[i].waterline + result[i].bw + "qb")
										}
									}
								}
							})
						} else if ($(this).index() == 1) {
							$.ajax({
								url: "http://www.sw797.com:82/blade-ycreal/floodinundation/selectAll?code=1",
								type: "GET",
								dataType: 'JSON',
								success: function (data) {
									self.waterData = data.data;
									var result = data.data;
									var time = null;
									for (var i = 0; i < result.length; i++) {
										time = result[i].TM.substring(6, 16);
										if (!result[i].villagegroup) result[i].villagegroup = "";
										if (result[i].waterline > result[i].Z) {
											$('.early-warning-food-table tbody').append($(`<tr>
												<td>${i + 1}</td>
												<td>${result[i].villagegroup}</td>
												<td>${result[i].rivername}</td>
												<td>${result[i].waterline}</td>
												<td>${result[i].Z}</td>
												<td>${time}</td>
											</tr>`));
											self.addPoints(self.map, { //默认只绘制两个圆圈叠加 如遇绘制多个，请自行源码内添加。
												id: result[i].stationcode + result[i].dj + result[i].waterline + result[i].bw + "zy",
												lon: result[i].dj,
												lat: result[i].bw,
												maxR: 10,
												minR: 0,//最好为0
												deviationR: 0.3,//差值 差值也大 速度越快
												cont: "红"
											});
											self.foodPositions.push({ lgtd: result[i].dj, lttd: result[i].bw });
											self.waterLineId.push(result[i].stationcode + result[i].dj + result[i].waterline + result[i].bw + "zy")
										}
									}
								}
							})
						} else if ($(this).index() == 2) {
							$.ajax({
								url: "http://www.sw797.com:82/blade-ycreal/floodinundation/selectAll?code=2",
								type: "GET",
								dataType: 'JSON',
								success: function (data) {
									self.waterData = data.data;
									var result = data.data;
									var time = null;
									for (var i = 0; i < result.length; i++) {
										time = result[i].TM.substring(6, 16);
										if (!result[i].villagegroup) result[i].villagegroup = "";
										if (result[i].waterline > result[i].Z) {
											$('.early-warning-food-table tbody').append($(`<tr>
											<td>${i + 1}</td>
											<td>${result[i].villagegroup}</td>
											<td>${result[i].rivername}</td>
											<td>${result[i].waterline}</td>
											<td>${result[i].Z}</td>
											<td>${time}</td>
											</tr>`));
											self.addPoints(self.map, { //默认只绘制两个圆圈叠加 如遇绘制多个，请自行源码内添加。
												id: result[i].stationcode + result[i].dj + result[i].waterline + result[i].bw + "zx",
												lon: result[i].dj,
												lat: result[i].bw,
												maxR: 10,
												minR: 0,//最好为0
												deviationR: 0.3,//差值 差值也大 速度越快
												cont: "红"
											});
											self.foodPositions.push({ lgtd: result[i].dj, lttd: result[i].bw });
											self.waterLineId.push(result[i].stationcode + result[i].dj + result[i].waterline + result[i].bw + "zx")
										}
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
						var ind = $(event.target).parent().index();
						self.map.camera.flyTo({
							destination: Cesium.Cartesian3.fromDegrees(Number(self.foodPositions[ind].lgtd), Number(self.foodPositions[ind].lttd), 5000.0),
							duration: 5
						});
					}
				})
			},

			closeMountainFlood: function (item) {
				if (item != this.name) {
					if (!$(".early-warning-main").is(":hidden")) {
						$(".jimu-widget-MountainFloodWarning .btn").trigger("click");
					}
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
					url: 'http://www.sw797.com:82/blade-ycreal/mountainrain/ss',
					type: 'get',
					dataType: 'json',
					success: function (data) {
						self.mountainFloodData = data.data;
						if (data.data.length == 0) {
							$(".jimu-widget-MountainFloodWarning").css({ "background-color": "rgba(21, 24, 82, .5)", "width": "0" });
							$('.jimu-widget-MountainFloodWarning .btn').removeClass('btleft').addClass('btright').text('预警').stop().show();
							$($(".early-warning-echarts div span").eq(0)).addClass('toggle-btn').siblings().removeClass('toggle-btn');
							$(".early-warning-content").stop().show().next().stop().hide();
							$($(".early-warning-echarts ul li").eq(0)).stop().show().siblings().hide();
							$(".early-warning-main").stop().hide();    //如果元素为隐藏,则将它显现
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
									self.addPoints(self.map, { //默认只绘制两个圆圈叠加 如遇绘制多个，请自行源码内添加。
										id: result[i].List.cenconding + result[i].List.dj,
										lon: result[i].List.dj,
										lat: result[i].List.bw,
										maxR: 10,
										minR: 0,//最好为0
										deviationR: 0.3,//差值 差值也大 速度越快
										cont: "黄"
									});
									self.readyToTransfer.push(result[i].List.cenconding + result[i].List.dj);
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
									self.addPoints(self.map, { //默认只绘制两个圆圈叠加 如遇绘制多个，请自行源码内添加。
										id: result[i].List.cenconding + result[i].List.bw,
										lon: result[i].List.dj,
										lat: result[i].List.bw,
										maxR: 10,
										minR: 0,//最好为0
										deviationR: 0.3,//差值 差值也大 速度越快
										cont: "红"
									});
									self.readyToTransfer.push(result[i].List.cenconding + result[i].List.bw);
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
												let tdHeads = '<td style="padding: 0 10px; height: 30px; line-height: 30px;">行政区</td>'; //表头
												let tdBodys = ''; //数据
												series.forEach(function (item) {
													//组装表头
													tdHeads += `<td style="padding: 0 10px; height: 30px; line-height: 30px;">${item.name}</td>`;
												});
												let table = `<table border="1" style="color: #fff;border-color: #fff;margin-left:30px;border-collapse:collapse;font-size:14px;text-align:center; width: 280px;"><tbody><tr>${tdHeads} </tr>`;
												for (let i = 0, l = axisData.length; i < l; i++) {
													for (let j = 0; j < series.length; j++) {
														//组装表数据
														tdBodys += `<td style="padding: 0 10px; height: 30px; line-height: 30px;">${series[j].data[i]}</td>`;
													}
													table += `<tr><td style="padding: 0 10px; height: 30px; line-height: 30px;">${axisData[i]}</td>${tdBodys}</tr>`;
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




							$(".jimu-widget-MountainFloodWarning").css({ "background-color": "rgba(21, 24, 82, .5)", "width": "360px" });
							$('.jimu-widget-MountainFloodWarning .btn').removeClass('btright').addClass('btleft').text('收回').stop().show();
							$(".early-warning-main").stop().show();    //如果元素为隐藏,则将它显现
							$($(".early-warning-echarts div span").eq(0)).addClass('toggle-btn').siblings().removeClass('toggle-btn');
							$(".early-warning-content").stop().show().next().stop().hide();
							$($(".early-warning-echarts ul li").eq(0)).stop().show().siblings().hide();
						}
					}
				})



				// 洪水添加表单
				$.ajax({
					url: "http://www.sw797.com:82/blade-ycreal/floodinundation/selectAll?code=3",
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
							time = result[i].TM.substring(6, 16);
							if (!result[i].villagegroup) result[i].villagegroup = "";
							if (result[i].waterline > result[i].Z) {
								$('.early-warning-food-table tbody').append($(`<tr>
									<td>${ind += 1}</td>
									<td>${result[i].villagegroup}</td>
									<td>${result[i].rivername}</td>
									<td>${result[i].waterline}</td>
									<td>${result[i].Z}</td>
									<td>${time}</td>
									</tr>`));
								self.foodPositions.push({ lgtd: result[i].dj, lttd: result[i].bw });
							} else {
								continue;
							}
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
							// title: {
							// 	// text: '同名数量统计',
							// 	// subtext: '纯属虚构',
							// 	left: '40%'
							// },
							tooltip: {
								// 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
								trigger: 'item',
								// 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
								// {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）,
								position: "right",
								formatter: '淹没站点数 <br/>{b} : {c}',
								extraCssText: 'width:160px;height:56px;background:rgb(5,93,170);'
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
												tdHeads += `<td style="padding: 0 10px; height: 30px; line-height: 30px;">${item.name}</td> <td style="padding: 0 10px; height: 30px; line-height: 30px;">隐患点数</td>`;
											});
											let table = `<table border="1" style="color: #fff;border-color: #fff;margin-left:30px;border-collapse:collapse;font-size:14px;text-align:center; width: 280px;"><tbody><tr style=" height: 30px; line-height: 30px;">${tdHeads} </tr>`;
											for (let i = 0, l = axisData.length; i < l; i++) {
												for (let j = 0; j < series.length; j++) {
													//组装表数据
													tdBodys += `<td style=" height: 30px; line-height: 30px;">${series[j].data[i].value}</td>`;
												}
												table += `<tr><td style="padding: 0 10px; height: 30px; line-height: 30px;">${axisData[i].name}</td>${tdBodys}</tr>`;
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
									name: '姓名',
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

				// if (!$(".early-warning-main").is(":hidden")) {
				this.movehandLer();
				// }
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

			addPoints: function (viewer, data) {
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
					id: data.id,
					position: Cesium.Cartesian3.fromDegrees(data.lon, data.lat),
					point: {
						pixelSize: 16,
						color: colors,
						outlineColor: outlineColors,
						outlineWidth: new Cesium.CallbackProperty(changeR1, false),
						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
						disableDepthTestDistance: Number.POSITIVE_INFINITY
					}
				});
			},

			movehandLer: function () {
				// 取消默认双击事件
				this.map.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
				// 获取鼠标事件
				var handler = new Cesium.ScreenSpaceEventHandler(this.map.scene.canvas);
				// 给鼠标左键添加事件函数
				handler.setInputAction(lang.hitch(this, this.clickHand), Cesium.ScreenSpaceEventType.LEFT_CLICK);
			},
			// 注册鼠标左键单击事件
			clickHand: function (movement) {
				var self = this;
				var pickedObjects = this.map.scene.drillPick(movement.position);
				if (Cesium.defined(pickedObjects)) {
					for (var i = 0; i < pickedObjects.length; ++i) {
						var obj = pickedObjects[i].id;
						var id = obj.id.split(this.id)[0];
						if (this.readyToTransfer.indexOf(id) != -1) {
							this.mountainFloodData.forEach(function (item, index) {
								if (item.List.cenconding + item.List.dj == id) {
									self.openMountainLayer(item.List);
								}
							})
							break;
						} else if (this.waterLineId.indexOf(id) != -1) {
							// this.openWindow(this.waterData[id.substring(0, 8)]);
							this.waterData.forEach(function (item, index) {
								if (item.stationcode + item.dj + item.waterline + item.bw == id) {
									self.openWaterLayer(item);
								}
							})
							break;
						}
					}
				}
			},

			openMountainLayer: function (item) {
				var url = "./widgets/MountainFloodWarning/popup/rain.html";
				parent.layer.open({
					title: item.village,
					type: 2,
					shadeClose: true,
					shade: false,
					maxmin: true, //开启最大化最小化按钮
					area: ['802px', '526px'],
					offset: 'auto',
					content: url + "?id=" + item.cenconding,
					id: "shanhongyinhuandian",
					closeBtn: 1,
				});
			},

			openWaterLayer: function (item) {
				var url = "./widgets/MountainFloodWarning/popup/river.html";
				parent.layer.open({
					title: item.villagegroup,
					type: 2,
					shadeClose: true,
					shade: false,
					maxmin: true, //开启最大化最小化按钮
					area: ['802px', '526px'],
					offset: 'auto',
					content: url + "?id=" + item.stationcode,
					id: "hongshuiyanmo",
					closeBtn: 1,
				});
			}
		});
	});