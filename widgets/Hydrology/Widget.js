///////////////////////////////////////////////////////////////////////////
// Copyright © 2019 zhongsong. All Rights Reserved.
// 模块描述:水文要素
///////////////////////////////////////////////////////////////////////////
define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/_base/html',
	'dojo/topic',
	'jimu/BaseWidget'
],
	function (declare,
		lang,
		array,
		html,
		topic,
		BaseWidget
	) {
		return declare([BaseWidget], {
			baseClass: 'jimu-widget-Hydrology',
			name: 'Hydrology',
			// 保存鼠标点击事件
			hydroHandler3D: null,
			dataListEntity: [],
			flag: true,
			flagyl: false,
			flagsw: false,
			flagll: false,
			flagdxs: false,
			flagzf: false,
			flagsq: false,
			flagswen: false,
			flagaw: false,
			flagsz: false,
			flagns: false,
			hydroWellTabel: { lgtd: [], lttd: [], tabletm: [], tablename: [], tabledata: [], num: null, str: [], comparisonValue: [] },
			hydrofaultTabel: { lgtd: [], lttd: [], tabletm: [], tablename: [], tabledata: [], num: null, str: [], comparisonValue: [] },
			hydroQueryTabel: { lgtd: [], lttd: [], tabletm: [], tablename: [], tabledata: [], num: null, str: [], comparisonValue: [] },
			startup: function () {
				this.inherited(arguments);
				// 暴露在外的接口
				topic.subscribe("closehydrology", lang.hitch(this, this.closeHydro));
				var that = this;
				// 注册点击事件
				$(".jimu-widget-Hydrology .hydro-list-mean li a").click(function () {
					that.hydroWellTabel = { lgtd: [], lttd: [], tabletm: [], tablename: [], tabledata: [], num: null, str: [], comparisonValue: [] };
					that.hydrofaultTabel = { lgtd: [], lttd: [], tabletm: [], tablename: [], tabledata: [], num: null, str: [], comparisonValue: [] };
					that.hydroQueryTabel = { lgtd: [], lttd: [], tabletm: [], tablename: [], tabledata: [], num: null, str: [], comparisonValue: [] };
					// 存放表格数据
					that.flag = true;
					var tableObj = { tableTM: [], tableName: [], tableData: [], lgtd: [], lttd: [], num: null, comparisonValue: [] };
					// 检测当前点击的A标签是否已经拥有类名ON，如已经如有，则删除地图上的实体，并且移除类名
					if ($(this).hasClass('on')) {
						that.flag = false;
						// 并且删除实体
						that.entityDelete();
						$(this).removeClass('on');
						return;
					}


					// 删除实体
					that.entityDelete();


					// 当前点击的a标签添加类名，兄弟移除类名
					$(this).addClass('on').parent().siblings().children('a').removeClass('on');
					// ind 记录当前点击的下标
					var ind = $(this).parent().index();
					that.flagyl = false;
					that.flagsw = false;
					that.flagll = false;
					that.flagdxs = false;
					that.flagzf = false;
					that.flagsq = false;
					that.flagswen = false;
					that.flagaw = false;
					that.flagsz = false;
					that.flagns = false;

					if (ind == 0) {
						
						that.flagyl = true;
						$.ajax({
							url: `http://www.sw797.com:82/blade-ycreal/pptnr/drpOne?parttype=yl`,
							type: "get",
							dataType: 'json',
							success: function (data) {
								if (that.flagyl == true && that.flag != false) {
									tableObj.num = ind;
									data.data.forEach(function (item, index) {
										if (item.SiteList != '') {
											if (item.list && item.list != {} && Date.parse(new Date()) - Date.parse(new Date(item.list.TM)) < 86400000) {
												that.entitys({
													id: item.SiteList.site_code + "yl",
													name: item.SiteList.site_name,
													x: Number(item.SiteList.lgtd),
													y: Number(item.SiteList.lttd),
													img: './images/js.png',
													text: item.list.DRP + " mm" + '\n' + item.SiteList.site_name,
													labOutColor: Cesium.Color.fromBytes(103, 188, 214),
													het: 20
												})
											} else {
												that.whiteEntities({
													id: item.SiteList.site_code + "yl",
													name: item.SiteList.site_name,
													x: Number(item.SiteList.lgtd),
													y: Number(item.SiteList.lttd),
													img: './images/hy0.png',
													text: item.SiteList.site_name,
													het: 20
												})
											}
											that.dataListEntity.push(item.SiteList.site_code + "yl")
											tableObj.tableTM.push(item.list.TM);
											tableObj.tableName.push(item.SiteList.site_name);
											tableObj.tableData.push(item.list.DRP + '');
											tableObj.lgtd.push(item.SiteList.lgtd);
											tableObj.lttd.push(item.SiteList.lttd);
										}

									})

									that.hydroTableSort(tableObj);
								}
							}
						})
					} else if (ind == 1) {
						that.flagsw = true;

						$.ajax({
							url: `http://www.sw797.com:82/blade-ycreal/riverr/rthyinfo?parttype=sw`,
							type: 'post',
							dataType: "json",
							success: function (data) {
								if (that.flagsw == true && that.flag != false) {
									that.flag = true;
									tableObj.num = ind;
									var colorSl;
									data.data.forEach(function (item, index) {
										if (item.SiteList != '') {
											if (item.list && item.list != {} && Date.parse(new Date()) - Date.parse(new Date(item.list.TM)) < 86400000) {
												if (item.list.Z > item.list.yjsw) {
													colorSl = Cesium.Color.RED
												} else {
													colorSl = Cesium.Color.SKYBLUE
												}
												that.entitys({
													id: item.SiteList.site_code + "sw",
													name: item.SiteList.site_name,
													x: Number(item.SiteList.lgtd),
													y: Number(item.SiteList.lttd),
													img: './images/swei.png',
													text: item.list.Z + " M" + '\n' + item.SiteList.site_name,
													labOutColor: colorSl,
													het: 20
												})
											} else {
												that.whiteEntities({
													id: item.SiteList.site_code + "sw",
													name: item.SiteList.site_name,
													x: Number(item.SiteList.lgtd),
													y: Number(item.SiteList.lttd),
													img: './images/hy1.png',
													text: item.SiteList.site_name,
													het: 20
												})
											}
											that.dataListEntity.push(item.SiteList.site_code + "sw")
											tableObj.tableTM.push(item.list ? item.list.TM : '');
											tableObj.tableName.push(item.SiteList.site_name);
											tableObj.tableData.push(item.list ? item.list.Z + "" : '');
											tableObj.comparisonValue.push(item.list ? item.list.yjsw + "" : '');
											tableObj.lgtd.push(item.SiteList.lgtd);
											tableObj.lttd.push(item.SiteList.lttd);
										}

									})

									that.hydroTableSort(tableObj);
								}

							}
						})
					} else if (ind == 2) {

						that.flagll = true;
						$.ajax({
							url: `http://www.sw797.com:82/blade-ycreal/riverr/rthyinfo?parttype=ll`,
							type: 'post',
							dataType: "json",
							success: function (data) {
								if (that.flagll == true && that.flag != false) {
									that.flag = true;
									tableObj.num = ind;
									var colorSl;
									data.data.forEach(function (item, index) {
										if (item.SiteList != '') {
											if (item.list && item.list != {} && Date.parse(new Date()) - Date.parse(new Date(item.list.TM)) < 86400000) {
												if (item.list.Q > item.list.yjll) {
													colorSl = Cesium.Color.RED
												} else {
													colorSl = Cesium.Color.SKYBLUE
												}
												that.entitys({
													id: item.SiteList.site_code + "ll",
													name: item.SiteList.site_name,
													x: Number(item.SiteList.lgtd),
													y: Number(item.SiteList.lttd),
													img: './images/ll.png',
													text: item.list.Q + "m3/s" + '\n' + item.SiteList.site_name,
													labOutColor: colorSl,
													het: 20
												})
											} else {
												that.whiteEntities({
													id: item.SiteList.site_code + "ll",
													name: item.SiteList.site_name,
													x: Number(item.SiteList.lgtd),
													y: Number(item.SiteList.lttd),
													img: './images/hy2.png',
													text: item.SiteList.site_name,
													het: 20
												})
											}
											that.dataListEntity.push(item.SiteList.site_code + "ll")
											tableObj.tableTM.push(item.list ? item.list.TM : '');
											tableObj.tableName.push(item.SiteList.site_name);
											tableObj.tableData.push(item.list ? item.list.Q + "" : '');
											tableObj.comparisonValue.push(item.list ? item.list.yjll + "" : '');
											tableObj.lgtd.push(item.SiteList.lgtd);
											tableObj.lttd.push(item.SiteList.lttd);
										}

									})

									that.hydroTableSort(tableObj);
								}
							}
						})
					} else if (ind == 4) {

						that.flagzf = true;

						$.ajax({
							url: `http://www.sw797.com:82/blade-ycreal/history/selectRealTimeByEv?parttype=zf`,
							type: "post",
							dataType: 'json',
							success: function (data) {
								if (that.flagzf == true && that.flag != false) {
									that.flag = true;
									tableObj.num = ind;
									data.data.forEach(function (item, index) {
										if (item.SiteList != '') {
											if (item.list && item.list.sum_ev == undefined) {
												item.list.sum_ev = '0';
											}
											if (item.list && item.list != {} && Date.parse(new Date()) - Date.parse(new Date(item.list.tm)) < 86400000) {
												that.entitys({
													id: item.SiteList.site_code + "zf",
													name: item.SiteList.site_name,
													x: Number(item.SiteList.lgtd),
													y: Number(item.SiteList.lttd),
													img: './images/zf.png',
													text: item.list.sum_ev + "％" + '\n' + item.SiteList.site_name,
													labOutColor: Cesium.Color.SKYBLUE,
													het: 20
												})
											} else {
												that.whiteEntities({
													id: item.SiteList.site_code + "zf",
													name: item.SiteList.site_name,
													x: Number(item.SiteList.lgtd),
													y: Number(item.SiteList.lttd),
													img: './images/hy4.png',
													text: item.SiteList.site_name,
													het: 20
												})
											}
											that.dataListEntity.push(item.SiteList.site_code + "zf")
											tableObj.tableTM.push(item.list ? item.list.tm : '');
											tableObj.tableName.push(item.SiteList.site_name);
											tableObj.tableData.push(item.list ? item.list.sum_ev + "" : '');
											tableObj.lgtd.push(item.SiteList.lgtd);
											tableObj.lttd.push(item.SiteList.lttd);
										}

									})

									that.hydroTableSort(tableObj);
								}

							}
						})
					} else if (ind == 5) {

						that.flagsq = true;

						$.ajax({
							url: `http://www.sw797.com:82/blade-ycreal/soilr/selectRealTimeBySoil?parttype=sq`,
							type: "post",
							dataType: 'json',
							success: function (data) {
								if (that.flagsq == true && that.flag != false) {
									that.flag = true;
									tableObj.num = ind;

									data.data.forEach(function (item, index) {
										if (item.SiteList != '') {
											if (item.list && item.list != {} && Date.parse(new Date()) - Date.parse(new Date(item.list.tm)) < 86400000) {
												that.entitys({
													id: item.SiteList.site_code + "zf",
													name: item.SiteList.site_name,
													x: Number(item.SiteList.lgtd),
													y: Number(item.SiteList.lttd),
													img: './images/sq.png',
													text: item.list.srlslm + "％" + '\n' + item.SiteList.site_name,
													labOutColor: Cesium.Color.SKYBLUE,
													het: 20
												})
											} else {
												that.whiteEntities({
													id: item.SiteList.site_code + "zf",
													name: item.SiteList.site_name,
													x: Number(item.SiteList.lgtd),
													y: Number(item.SiteList.lttd),
													img: './images/hy5.png',
													text: item.SiteList.site_name,
													het: 20
												})
											}
											that.dataListEntity.push(item.SiteList.site_code + "zf")
											tableObj.tableTM.push(item.list ? item.list.tm : '');
											tableObj.tableName.push(item.SiteList.site_name);
											tableObj.tableData.push(item.list ? item.list.srlslm + "" : '');
											tableObj.lgtd.push(item.SiteList.lgtd);
											tableObj.lttd.push(item.SiteList.lttd);
										}

									})

									that.hydroTableSort(tableObj);
								}

							}
						})

					} else if (ind == 6) {

						that.flagswen = true;

						$.ajax({
							url: `http://www.sw797.com:82/blade-ycreal/tmpr/selectRealTimeByTmp?parttype=sw`,
							type: "GET",
							dataType: 'json',
							success: function (data) {
								if (that.flagswen == true && that.flag != false) {
									that.flag = true;
									tableObj.num = ind;
									data.data.forEach(function (item, index) {
										if (item.SiteList != '') {
											if (item.list && item.list != {} && Date.parse(new Date()) - Date.parse(new Date(item.list.TM)) < 86400000) {
												that.entitys({
													id: item.SiteList.site_code + "sw",
													name: item.SiteList.site_name,
													x: Number(item.SiteList.lgtd),
													y: Number(item.SiteList.lttd),
													img: './images/sw.png',
													text: item.list.WTMP + "℃" + '\n' + item.SiteList.site_name,
													labOutColor: Cesium.Color.SKYBLUE,
													het: 20
												})
											} else {
												that.whiteEntities({
													id: item.SiteList.site_code + "sw",
													name: item.SiteList.site_name,
													x: Number(item.SiteList.lgtd),
													y: Number(item.SiteList.lttd),
													img: './images/hy6.png',
													text: item.SiteList.site_name,
													het: 20
												})
											}
											that.dataListEntity.push(item.SiteList.site_code + "sw")
											tableObj.tableTM.push(item.list ? item.list.TM : '');
											tableObj.tableName.push(item.SiteList.site_name);
											tableObj.tableData.push(item.list ? item.list.WTMP + "" : '');
											tableObj.lgtd.push(item.SiteList.lgtd);
											tableObj.lttd.push(item.SiteList.lttd);
										}
										console.log(tableObj)

									})

									that.hydroTableSort(tableObj);
								}

							}
						})
					} else if (ind == 7) {

						that.flagaw = true;

						$.ajax({
							url: `http://www.sw797.com:82/blade-ycreal/tmpr/selectRealTimeByTmp?parttype=qw`,
							type: "GET",
							dataType: 'json',
							success: function (data) {
								if (that.flagaw == true && that.flag != false) {
									that.flag = true;
									tableObj.num = ind;

									data.data.forEach(function (item, index) {
										if (item.SiteList != '') {
											if (item.list && item.list != {} && Date.parse(new Date()) - Date.parse(new Date(item.list.TM)) < 86400000) {
												that.entitys({
													id: item.SiteList.site_code + "sw",
													name: item.SiteList.site_name,
													x: Number(item.SiteList.lgtd),
													y: Number(item.SiteList.lttd),
													img: './images/jw.png',
													text: item.list.ATMP + "℃" + '\n' + item.SiteList.site_name,
													labOutColor: Cesium.Color.SKYBLUE,
													het: 20
												})
											} else {
												that.whiteEntities({
													id: item.SiteList.site_code + "sw",
													name: item.SiteList.site_name,
													x: Number(item.SiteList.lgtd),
													y: Number(item.SiteList.lttd),
													img: './images/hy7.png',
													text: item.SiteList.site_name,
													het: 20
												})
											}
											that.dataListEntity.push(item.SiteList.site_code + "sw")
											tableObj.tableTM.push(item.list ? item.list.TM : '');
											tableObj.tableName.push(item.SiteList.site_name);
											tableObj.tableData.push(item.list ? item.list.ATMP + "" : '');
											tableObj.lgtd.push(item.SiteList.lgtd);
											tableObj.lttd.push(item.SiteList.lttd);
										}

									})

									that.hydroTableSort(tableObj);
								}

							}
						})
					} else if (ind == 8) {

						that.flagsz = true;

						$.ajax({
							url: `http://www.sw797.com:82/blade-ycreal/wq/selectWqRPage?parttype=sz`,
							type: "post",
							dataType: 'json',
							success: function (data) {
								if (that.flagsz == true && that.flag != false) {
									that.flag = true;
									tableObj.num = ind;

									data.data.forEach(function (item, index) {
										if (item.SiteList != '') {
											that.entitys({
												id: item.SiteList.site_code + "sw",
												name: item.SiteList.site_name,
												x: Number(item.SiteList.lgtd),
												y: Number(item.SiteList.lttd),
												img: './images/sz.png',
												text: item.list.WCHRCD + "类" + '\n' + item.SiteList.site_name,
												labOutColor: Cesium.Color.SKYBLUE,
												het: 20
											})
											that.dataListEntity.push(item.SiteList.site_code + "sw")
											tableObj.tableTM.push(item.list ? item.list.TM : '');
											tableObj.tableName.push(item.SiteList.site_name);
											tableObj.tableData.push(item.list ? item.list.WCHRCD + "" : '');
											tableObj.lgtd.push(item.SiteList.lgtd);
											tableObj.lttd.push(item.SiteList.lttd);
										}

									})
									that.hydroTableSort(tableObj);
								}

							}
						})
					} else if (ind == 9) {

						that.flagns = true;
						$.ajax({
							url: `http://www.sw797.com:82/blade-ycreal/sedr/selectRealTimeBySed?parttype=ns`,
							type: "GET",
							dataType: 'json',
							success: function (data) {
								if (that.flagns == true && that.flag != false) {
									that.flag = true;
									tableObj.num = ind;
									data.data.forEach(function (item, index) {
										if (item.SiteList != '') {
											if (item.List && item.List != {} && Date.parse(new Date()) - Date.parse(new Date(item.List.TM)) < 86400000) {
												that.entitys({
													id: item.SiteList.site_code + "sw",
													name: item.SiteList.site_name,
													x: Number(item.SiteList.lgtd),
													y: Number(item.SiteList.lttd),
													img: './images/ns.png',
													text: item.List.S + "kg" + '\n' + + item.SiteList.site_name,
													labOutColor: Cesium.Color.SKYBLUE,
													het: 20
												})
											} else {
												that.whiteEntities({
													id: item.SiteList.site_code + "sw",
													name: item.SiteList.site_name,
													x: Number(item.SiteList.lgtd),
													y: Number(item.SiteList.lttd),
													img: './images/hy9.png',
													text: item.SiteList.site_name,
													het: 20
												})
											}
											that.dataListEntity.push(item.SiteList.site_code + "sw")
											tableObj.tableTM.push(item.List ? item.List.TM : '');
											tableObj.tableName.push(item.SiteList.site_name);
											tableObj.tableData.push(item.List ? item.List.S + "" : '');
											tableObj.lgtd.push(item.SiteList.lgtd);
											tableObj.lttd.push(item.SiteList.lttd);
										}

									})

									that.hydroTableSort(tableObj);
								}

							}
						})
					} else if (ind == 3) {

						that.flagdxs = true;

						$.ajax({
							url: "widgets/Hydrology/riverInformation.json",
							type: "GET",
							dataType: "json",
							success: function (data) {
								if (that.flagdxs == true && that.flag != false) {
									var data = eval(data); // eval() 计算字符串
									var enId, cnx, cny, fieldName;
									that.createHydroTable({ data: data.features, num: ind });
									data.features.forEach(function (item, index) {
										// cnx, cny 定义经纬度，获取json文件里面定义好的
										cnx = item.geometry.center.x;
										cny = item.geometry.center.y;
										// 获取ID
										enId = item.ID;
										var dataTry = data.features.length;
										if (dataTry == 0) {
											return;
										}
										fieldName = item.fieldValues[8];
										if (fieldName == 'undefined' || fieldName == null || fieldName == 0) return;
										// 添加图层
										that.map.entities.add({
											id: enId,
											name: fieldName,
											position: Cesium.Cartesian3.fromDegrees(Number(cnx), Number(cny), 100),
											// 与实体相关的点
											point: {
												show: true,
												pixelSize: 8,
												color: Cesium.Color.fromBytes(13, 80, 143),
												outlineColor: Cesium.Color.fromBytes(13, 80, 143),
												outlineWidth: 2,
												disableDepthTestDistance: Number.POSITIVE_INFINITY
											},
											label: {
												show: true,
												text: fieldName,
												font: "700 16px '黑体'",
												color: Cesium.Color.fromBytes(13, 80, 143),
												backgroundColor: Cesium.Color.DEEPSKYBLUE,
												style: Cesium.LabelStyle.FILL_AND_OUTLINE,
												outlineWidth: 2,
												outlineColor: Cesium.Color.SKYBLUE,
												pixelOffset: new Cesium.Cartesian2(30, 0),
												scale: 0.8,
												disableDepthTestDistance: Number.POSITIVE_INFINITY
											}
										});
										// 将ID追加到存放ID值得数组里面
										that.dataListEntity.push(enId);
										// 取消默认双击事件
										that.map.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
									})
									/**
									 * 动态添加气泡窗口
									 */
									that.hydroHandler3D = new Cesium.ScreenSpaceEventHandler(that.map.scene.canvas);
									var scene = that.map.scene;
									//绑定鼠标单击
									that.hydroHandler3D.setInputAction(function (movement) {
										var ray = that.map.camera.getPickRay(movement.position);
										var cartesian = scene.globe.pick(ray, scene);
										var pick = scene.pick(movement.position);
										if (pick && pick.id) {
											var inv = pick.id._id;
											// 获取属性
											var feat = data.features[inv - 1].fieldValues;
											// 内容
											var content = '<ul>' +
												'<li>' +
												'<p>测站位置</p><input type="text" name="" id="" value=' + feat[13] + ' readonly="readonly" />' +
												'</li>' +
												'<li>' +
												'<p>建站类型</p><input type="text" name="" id="" value=' + feat[14] + ' readonly="readonly" />' +
												'</li>' +
												'<li>' +
												'<p>站点类型</p><input type="text" name="" id="" value=' + feat[15] + ' readonly="readonly" />' +
												'</li>' +
												'<li>' +
												'<p>水文地质单元</p><input type="text" name="" id="" value=' + feat[19] + ' readonly="readonly" />' +
												'</li>' +
												'<li>' +
												'<p>地貌类型</p><input type="text" name="" id="" value=' + feat[20] + ' readonly="readonly" />' +
												'</li>' +
												'<li>' +
												'<p>地下水类型</p><input type="text" name="" id="" value=' + feat[21] + ' readonly="readonly" />' +
												'</li>' +
												'<li>' +
												'<p>监测层位</p><input type="text" name="" id="" value=' + feat[22] + ' readonly="readonly" />' +
												'</li>' +
												'<li>' +
												'<p>井管管材</p><input type="text" name="" id="" value=' + feat[23] + ' readonly="readonly" />' +
												'</li>' +
												'<li>' +
												'<p>管材标准(口径)MM</p><input type="text" name="" id="" value=' + feat[24] + ' readonly="readonly" />' +
												'</li>' +
												'</ul>';
											var obj = {
												position: movement.position,
												content: content
											};
											infoWindow(obj);

											function infoWindow(obj) {
												var picked = scene.pick(obj.position);
												if (Cesium.defined(picked)) {
													var id = Cesium.defaultValue(picked.id, picked.primitive.id);
													if (id instanceof Cesium.Entity) {
														$('#trackPopUpLink').empty();
														$('#trackPopUpLink').append(obj.content);
														var c = new Cesium.Cartesian2(obj.position.x, obj.position.y);
														$('#trackPopUp').show();
														$('.leaflet-popup-close-button').click(function () {
															$('#trackPopUp').hide();
															$('#trackPopUpLink').empty();
															return false;
														});
														return id;
													}
												}
											}
											

											that.map.scene.postRender.addEventListener(function () {
												if (cartesian) {
													updataPopupPosition(cartesian);
												}
											})

											function updataPopupPosition(cartesian) {
												if (!cartesian) return;
												var px_position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, cartesian);
												var trackPopUpContent = window.document.getElementById("trackPopUpContent");
												var popw = document.getElementById("trackPopUpContent").offsetWidth;
												var poph = document.getElementById("trackPopUpContent").offsetHeight;
												trackPopUpContent.style.left = px_position.x - (popw / 2 + 70) + "px";
												trackPopUpContent.style.top = px_position.y - (poph + 60) + "px";
											}
										} else {
											$('#trackPopUp').hide();
										}

									}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
									// //绑定地图移动
									// that.hydroHandler3D.setInputAction(function (movement) {
									// 	$('#trackPopUp').hide();
									// }, Cesium.ScreenSpaceEventType.LEFT_UP);
									//绑定地图缩放
									that.hydroHandler3D.setInputAction(function (movement) {
										$('#trackPopUp').hide();
									}, Cesium.ScreenSpaceEventType.WHEEL);
									//绑定滚轮点击事件
									that.hydroHandler3D.setInputAction(function (movement) {
										$('#trackPopUp').hide();
									}, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);

								}
								// var height = Math.ceil(viewer.camera.positionCartographic.height);   //获取相机高度
								// viewer.scene.screenSpaceCameraController.minimumZoomDistance = -1000;//设置相机最小缩放距离,距离地表-1000米
							}
						})
						return;
					}
				})

				$('.jimu-widget-Hydrology .hydro-status-hint input').click(function () {
					that.entityDelete();
					if ($(this).prop("checked")) {
						$(this).siblings('input').prop('checked', false)
					}
					var entities = null;
					var img = null;
					var whiteimg = null;

					var ind = $(this).index();
					if (ind == 0) {
						that.createHydroTable(that.hydroQueryTabel);
						entities = that.hydroQueryTabel;
					} else if (ind == 2) {
						that.createHydroTable(that.hydroWellTabel);
						entities = that.hydroWellTabel;

					} else if (ind == 5) {
						that.createHydroTable(that.hydrofaultTabel);
						entities = that.hydrofaultTabel;

					}

					if (entities.num == 0) {
						img = './images/js.png';
						whiteimg = './images/hy0.png';
					} else if (entities.num == 1) {
						img = './images/swei.png';
						whiteimg = './images/hy1.png';
					} else if (entities.num == 2) {
						img = './images/ll.png';
						whiteimg = './images/hy2.png';
					} else if (entities.num == 4) {
						img = './images/zf.png';
						whiteimg = './images/hy4.png';
					} else if (entities.num == 5) {
						img = './images/sq.png';
						whiteimg = './images/hy5.png';
					} else if (entities.num == 6) {
						img = './images/sw.png';
						whiteimg = './images/hy6.png';
					} else if (entities.num == 7) {
						img = './images/jw.png';
						whiteimg = './images/hy7.png';
					} else if (entities.num == 9) {
						img = './images/ns.png';
						whiteimg = './images/hy9.png';
					}
					that.tableEntitys(entities, ind, img, whiteimg)
				})

				$('.jimu-widget-Hydrology .hydro-content .tbody').on('click', 'tr', function () {
					that.map.camera.flyTo({
						destination: Cesium.Cartesian3.fromDegrees(Number($(this).attr('lgtd')), Number($(this).attr('lttd')), 10000),
						easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT
					});
				})
			},

			onOpen: function () {
				//面板打开的时候触发 （when open this panel trigger）
				// $('.jimu-widget-Hydrology .num a').trigger('click');

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

			resize: function () { },

			destroy: function () {
				//销毁的时候触发
				//todo
				//do something before this func
				this.inherited(arguments);
			},

			// 添加实体的方法
			entitys: function (object) {
				if (this.flag == false) return;


				this.map.entities.add({
					id: object.id, // 实体ID
					name: object.name, // 实体名称
					position: Cesium.Cartesian3.fromDegrees(Number(object.x), Number(object.y), 100), // x,y 实体经纬度
					billboard: {
						image: object.img, // img 与实体相关的图片
						show: true,
						width: 20,
						height: 20,
						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
						disableDepthTestDistance: Number.POSITIVE_INFINITY
					},
					//字体标签样式
					label: {
						show: true,
						text: object.text, // text 与实体相关的文字
						font: "700 16px '黑体'",
						color: new Cesium.Color(0, 0, 0, 1),
						backgroundColor: Cesium.Color.DEEPSKYBLUE,
						style: Cesium.LabelStyle.FILL_AND_OUTLINE,
						outlineWidth: 2,
						outlineColor: object.labOutColor, // 文字轮廓的颜色
						verticalOrigin: Cesium.VerticalOrigin.CENTER,//垂直位置
						horizontalOrigin: Cesium.HorizontalOrigin.LEFT,//水平位置
						pixelOffset: new Cesium.Cartesian2(object.het, 0), // 文字位置
						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
						disableDepthTestDistance: Number.POSITIVE_INFINITY
					}
				});
			},

			whiteEntities: function (object) {
				if (this.flag == false) return;

				this.map.entities.add({
					id: object.id, // 实体ID
					name: object.name, // 实体名称
					position: Cesium.Cartesian3.fromDegrees(Number(object.x), Number(object.y), 100), // x,y 实体经纬度
					billboard: {
						image: object.img, // img 与实体相关的图片
						show: true,
						color: Cesium.Color.fromBytes(147, 147, 147),
						width: 20,
						height: 20,
						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
						disableDepthTestDistance: Number.POSITIVE_INFINITY
					},
					//字体标签样式
					label: {
						show: true,
						text: object.text, // text 与实体相关的文字
						font: "700 16px '黑体'",
						color: Cesium.Color.fromBytes(147, 147, 147),
						backgroundColor: Cesium.Color.WHITE,
						style: Cesium.LabelStyle.FILL_AND_OUTLINE,
						outlineWidth: 2,
						outlineColor: Cesium.Color.fromBytes(147, 147, 147), // 文字轮廓的颜色
						verticalOrigin: Cesium.VerticalOrigin.CENTER,//垂直位置
						horizontalOrigin: Cesium.HorizontalOrigin.LEFT,//水平位置
						pixelOffset: new Cesium.Cartesian2(object.het, 0), // 文字位置
						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
						disableDepthTestDistance: Number.POSITIVE_INFINITY
					}
				});
			},

			entityDelete: function () {
				var that = this;
				if (this.dataListEntity.length != 0) {
					this.dataListEntity.forEach(function (item, index) {
						that.map.entities.removeById(item);
					})
					this.dataListEntity = [];
				}
			},

			tableEntitys: function (entities, ind, img, whiteimg) {
				var colorSl = Cesium.Color.fromBytes(103, 188, 214);
				entities.str.forEach((item, index) => {
					if (entities.comparisonValue.length > 0) {
						if (entities.tabledata[index] > entities.comparisonValue[index]) {
							colorSl = Cesium.Color.RED;
						} else {
							colorSl = Cesium.Color.fromBytes(103, 188, 214);
						}
					}
					if (ind == 0) {
						if (item == '正常') {
							this.entitys({
								id: entities.tablename[index] + entities.num + "yl" + index,
								name: entities.tablename[index],
								x: Number(entities.lgtd[index]),
								y: Number(entities.lttd[index]),
								img: img,
								text: entities.tabledata[index] + " mm" + '\n' + entities.tablename[index],
								labOutColor: colorSl,
								het: 20
							})
						} else {
							this.whiteEntities({
								id: entities.tablename[index] + entities.num + "yl" + index,
								name: entities.tablename[index],
								x: Number(entities.lgtd[index]),
								y: Number(entities.lttd[index]),
								img: whiteimg,
								text: entities.tablename[index],
								het: 20
							})
						}
					} else if (ind == 2) {
						this.entitys({
							id: entities.tablename[index] + entities.num + "yl" + index,
							name: entities.tablename[index],
							x: Number(entities.lgtd[index]),
							y: Number(entities.lttd[index]),
							img: img,
							text: entities.tabledata[index] + " mm" + '\n' + entities.tablename[index],
							labOutColor: colorSl,
							het: 20
						})
					} else if (ind == 5) {
						this.whiteEntities({
							id: entities.tablename[index] + entities.num + "yl" + index,
							name: entities.tablename[index],
							x: Number(entities.lgtd[index]),
							y: Number(entities.lttd[index]),
							img: whiteimg,
							text: entities.tablename[index],
							het: 20
						})
					}
					this.dataListEntity.push(entities.tablename[index] + entities.num + "yl" + index)
				})
			},

			createHydroTable: function (data) {

				$('.jimu-widget-Hydrology .hydro-content table').empty();
				var tbody = $('<tbody></tbody>');
				var time = null;
				if (data.num == 3) {
					$('.jimu-widget-Hydrology .hydro-content .thead table').append($('<thead></thead>').html('<tr> <th>序号</th> <th>站点名称</th> <th>地貌类型</th> <th style="width: 70px;">地下水类型</th> </tr>'));
					data.data.forEach(function (item, index) {
						tbody.append($(`<tr lgtd='${item.fieldValues[1]}' lttd='${item.fieldValues[2]}'></tr>`).html(`<td>${index + 1}</td> <td>${item.fieldValues[8]}</td> <td>${item.fieldValues[20]}</td> <td style="width: 70px;">${item.fieldValues[21]}</td>`))
					})
					$('.jimu-widget-Hydrology .hydro-content').css('bottom', 0);
					$('.hydro-status-hint').stop().hide();
				} else {
					if (data.num == 0) {
						$('.jimu-widget-Hydrology .hydro-content .thead table').append($('<thead></thead>').html('<tr><th>序号</th><th>站点名称</th><th>降雨量(mm)</th><th>时间</th><th>状态</th></tr>'));
					} else if (data.num == 1) {
						$('.jimu-widget-Hydrology .hydro-content .thead table').append($('<thead></thead>').html('<tr><th>序号</th><th>站点名称</th><th>水位(M)</th><th>时间</th><th>状态</th></tr>'));
					} else if (data.num == 2) {
						$('.jimu-widget-Hydrology .hydro-content .thead table').append($('<thead></thead>').html('<tr><th>序号</th><th>站点名称</th><th>流量(m³/s)</th><th>时间</th><th>状态</th></tr>'));

					} else if (data.num == 4) {
						$('.jimu-widget-Hydrology .hydro-content .thead table').append($('<thead></thead>').html('<tr><th>序号</th><th>站点名称</th><th>蒸发(%)</th><th>时间</th><th>状态</th></tr>'));

					} else if (data.num == 5) {
						$('.jimu-widget-Hydrology .hydro-content .thead table').append($('<thead></thead>').html('<tr><th>序号</th><th>站点名称</th><th>墒情(%)</th><th>时间</th><th>状态</th></tr>'));

					} else if (data.num == 6) {
						$('.jimu-widget-Hydrology .hydro-content .thead table').append($('<thead></thead>').html('<tr><th>序号</th><th>站点名称</th><th>水温(℃)</th><th>时间</th><th>状态</th></tr>'));

					} else if (data.num == 7) {
						$('.jimu-widget-Hydrology .hydro-content .thead table').append($('<thead></thead>').html('<tr><th>序号</th><th>站点名称</th><th>岸温(℃)</th><th>时间</th><th>状态</th></tr>'));

					} else if (data.num == 8) {
						$('.jimu-widget-Hydrology .hydro-content .thead table').append($('<thead></thead>').html('<tr><th>序号</th><th>站点名称</th><th>水质(类)</th><th>时间</th></tr>'));

					} else if (data.num == 9) {
						$('.jimu-widget-Hydrology .hydro-content .thead table').append($('<thead></thead>').html('<tr><th>序号</th><th>站点名称</th><th>泥沙(kg)</th><th>时间</th><th>状态</th></tr>'));

					}
					data.tablename.forEach(function (item, index) {
						time = data.tabletm[index].substring(0, 16);
						if (data.num == 8) {
							$('.jimu-widget-Hydrology .hydro-content').css('bottom', 0);
							$('.hydro-status-hint').stop().hide();
							tbody.append($(`<tr lgtd='${data.lgtd[index]}' lttd='${data.lttd[index]}'></tr>`).html(`<td>${index + 1}</td> <td>${item}</td> <td>${data.tabledata[index]}</td> <td> <a href='javascript:;' title='${time}'>${time.substring(5, 16)}</a></td>`))
						} else {
							if (data.str.length == 0) {
								$('.jimu-widget-Hydrology .hydro-content table').empty();
								return
							}
							$('.jimu-widget-Hydrology .hydro-content').css('bottom', '24px');
							$('.hydro-status-hint').stop().show();
							if (data.str[index] == '正常') {
								tbody.append($(`<tr lgtd='${data.lgtd[index]}' lttd='${data.lttd[index]}'></tr>`).html(`<td>${index + 1}</td> <td>${item}</td> <td>${data.tabledata[index]}</td> <td> <a href='javascript:;' title='${time}'>${time.substring(5, 16)}</a></td> <td> <img src="./images/hydro-normal.png"> </td>`))

							} else {
								tbody.append($(`<tr lgtd='${data.lgtd[index]}' lttd='${data.lttd[index]}'></tr>`).html(`<td>${index + 1}</td> <td>${item}</td> <td>${data.tabledata[index]}</td> <td> <a href='javascript:;' title='${time}'>${time.substring(5, 16)}</a></td> <td> <img src="./images/hydro-fault.png"> </td>`))

							}
						}

					})
				}
				$('.jimu-widget-Hydrology .hydro-content .tbody table').append(tbody);
				$('.jimu-widget-Hydrology .hydro-content .tbody').scrollTop(0);

			},

			closeHydro: function (item) {
				if (item == this.name) {
					this.flag = false;
					$('.jimu-widget-Hydrology').stop().hide();
					this.entityDelete();
					if ($('ul li a').hasClass('on')) {
						$('ul li a').removeClass('on');
					}
					if (this.hydroHandler3D != null)
						this.hydroHandler3D.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
				}
			},

			hydroTableSort: function (data) {
				var that = this;
				var oject = { tm: [], name: [], val: [], num: data.num, str: [], lgtd: [], lttd: [], comparisonValue: [] }
				
				data.tableTM.forEach(function (item, index) {
					if (item == '') {
						oject.tm.push(item);
						oject.name.push(data.tableName[index]);
						oject.val.push(data.tableData[index]);
						oject.lgtd.push(data.lgtd[index]);
						oject.lttd.push(data.lttd[index]);
						oject.str.push("故障");
						if (data.comparisonValue.length > 0) {
							oject.comparisonValue.push(data.comparisonValue[index]);
						}
					} else {
						if (Date.parse(new Date()) - Date.parse(new Date(item)) > 86400000) {
							oject.tm.push(item);
							oject.name.push(data.tableName[index]);
							oject.val.push(data.tableData[index]);
							oject.lgtd.push(data.lgtd[index]);
							oject.lttd.push(data.lttd[index]);
							oject.str.push("故障");
							if (data.comparisonValue.length > 0) {
								oject.comparisonValue.push(data.comparisonValue[index]);
							}
						} else {
							oject.tm.unshift(item);
							oject.name.unshift(data.tableName[index]);
							oject.val.unshift(data.tableData[index]);
							oject.lgtd.unshift(data.lgtd[index]);
							oject.lttd.unshift(data.lttd[index]);
							oject.str.unshift("正常");
							if (data.comparisonValue.length > 0) {
								oject.comparisonValue.unshift(data.comparisonValue[index]);
							}
						}
					}
				})

				var tableOject = { tabletm: [], tablename: [], tabledata: [], num: data.num, str: [], lgtd: [], lttd: [], comparisonValue: [] }
				oject.name.forEach(function (item, index) {
					if (oject.tm[index] != '' || oject.val[index] != '') {
						tableOject.tabletm.unshift(oject.tm[index]);
						tableOject.tablename.unshift(item);
						tableOject.tabledata.unshift(oject.val[index]);
						tableOject.str.unshift(oject.str[index]);
						tableOject.lgtd.unshift(oject.lgtd[index]);
						tableOject.lttd.unshift(oject.lttd[index]);
						if (oject.comparisonValue.length > 0) {
							tableOject.comparisonValue.unshift(oject.comparisonValue[index]);
						}
					} else {
						tableOject.tabletm.push(oject.tm[index]);
						tableOject.tablename.push(item);
						tableOject.tabledata.push(oject.val[index]);
						tableOject.str.push(oject.str[index]);
						tableOject.lgtd.push(oject.lgtd[index]);
						tableOject.lttd.push(oject.lttd[index]);
						if (oject.comparisonValue.length > 0) {
							tableOject.comparisonValue.push(oject.comparisonValue[index]);
						}
					}
				})


				this.createHydroTable(tableOject);
				if (data.num != 3 || data.num != 8) {
					$('.jimu-widget-Hydrology .hydro-status-hint input:eq(0)').prop('checked', true).siblings('input').prop('checked', false);
					that.hydroQueryTabel.num = data.num;
					that.hydroWellTabel.num = data.num;
					that.hydrofaultTabel.num = data.num;
					tableOject.str.forEach(function (item, index) {
						that.hydroQueryTabel.tabletm.push(tableOject.tabletm[index]);
						that.hydroQueryTabel.tablename.push(tableOject.tablename[index]);
						that.hydroQueryTabel.tabledata.push(tableOject.tabledata[index]);
						that.hydroQueryTabel.lgtd.push(tableOject.lgtd[index]);
						that.hydroQueryTabel.lttd.push(tableOject.lttd[index]);
						that.hydroQueryTabel.str.push(item);
						if (tableOject.comparisonValue.length > 0) {
							that.hydroQueryTabel.comparisonValue.push(tableOject.comparisonValue[index]);
						}
						if (item == '正常') {
							that.hydroWellTabel.tabletm.push(tableOject.tabletm[index]);
							that.hydroWellTabel.tablename.push(tableOject.tablename[index]);
							that.hydroWellTabel.tabledata.push(tableOject.tabledata[index]);
							that.hydroWellTabel.lgtd.push(tableOject.lgtd[index]);
							that.hydroWellTabel.lttd.push(tableOject.lttd[index]);
							that.hydroWellTabel.str.push(item);
							if (tableOject.comparisonValue.length > 0) {
								that.hydroWellTabel.comparisonValue.push(tableOject.comparisonValue[index]);
							}
						} else if (item == '故障') {
							that.hydrofaultTabel.tabletm.push(tableOject.tabletm[index]);
							that.hydrofaultTabel.tablename.push(tableOject.tablename[index]);
							that.hydrofaultTabel.tabledata.push(tableOject.tabledata[index]);
							that.hydrofaultTabel.lgtd.push(tableOject.lgtd[index]);
							that.hydrofaultTabel.lttd.push(tableOject.lttd[index]);
							that.hydrofaultTabel.str.push(item);
							if (tableOject.comparisonValue.length > 0) {
								that.hydrofaultTabel.comparisonValue.push(tableOject.comparisonValue[index]);
							}
						}

					})
				}
			}
		});
	});