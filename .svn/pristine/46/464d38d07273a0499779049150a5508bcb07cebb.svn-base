///////////////////////////////////////////////////////////////////////////
// Copyright © 2019 zhongsong. All Rights Reserved.
// 模块描述: 水文风险区
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
		'./CommonPointLayer3D',
		'libs/laydate/laydate.js',
		"./CesiumHeatmap",
		"libs/jquery.pagination"
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
			  CommonPointLayer3D,
			  laydate
	) {

		return declare([BaseWidget], {
			baseClass: 'jimu-widget-HydrologicalRiskArea',
			name: 'HydrologicalRiskArea',
			fxq_layer: null,
			heatdata : [],
			heatMap : null,
			dataList:[],
			colorList:[],
			startup: function () {
				var self = this;
				var flag = true;

				// 降水开始与结束时间
				laydate.render({
					elem: '#inpstart', //指定元素
					type: "datetime",
					format: 'yyyy-MM-dd HH:mm',
					btns: ['confirm'],
					done: function (value) {
						$($(this)[0].elem[0]).val(value)
					}
				});
				laydate.render({
					elem: '#inpend', //指定元素
					type: "datetime",
					format: 'yyyy-MM-dd HH:mm',
					btns: ['confirm'],
					done: function (value) {
						$($(this)[0].elem[0]).val(value)
					}
				});

				this.inherited(arguments);
				/**
				 * this 指向重新赋值
				 */
				// 定义请求地址

				this.fxq_layer = new CommonPointLayer3D({
					id: 'shfxq',
					map: this.map
				});


				$('.liclick').on('click', function () {
					document.getElementById('sh_rlt').checked =false;
					document.getElementById('hs_rlt').checked =false;
					if(self.heatMap){
						self.heatMap.show(false);
					}
					if (flag == false) return;
					flag = false;
					$('.load-box-list').show();
					// 当前选中添加类名，兄弟移除类名
					$(this).addClass("on").siblings().removeClass("on").addClass("offs");
					// 获取当前选中的文本
					var txt = $(this).text();
					// 调方法，将文本传进去，做判断，是否显示或者隐藏
					self.tab(txt);
					// 做判断，定义请求地址，和请求参数
					if (txt == '山洪风险区') {
						url = "http://www.sw797.com:82/blade-ycreal/mountainrain/listss";
						data = {
						};
					} else if (txt == '洪水淹没区') {
						url = "http://www.sw797.com:82/blade-ycreal/floodinundation/listss";
						data = {
						};
					} else if (txt == '流域风险区') {
						url = "http://www.sw797.com:82/blade-ycreal/rsvrr/selectRsvrAllList";
						data = {};
					}
					// 调用方法，发送请求
					self.postUrl(url, data, self, txt);
					flag = true;
				});
				$("#mountainPage .zd_quy").click(function () {
					// 当为山洪风险区的时候的查询点击事件
					$('.load-box-list').show();
					// 调方法
					self.shQuery();
				});
				// 当为洪水淹没区的时候的查询点击事件
				$("#floodPage .zd_quy").click(function () {
					$('.load-box-list').show();
					// 调方法
					self.hsQuery();
				});

				//山洪热力图勾选事件
				$("#sh_rlt").on("change", function () {
					if ($(this)[0].checked) {
						self.fxq_layer.delEntity();
						self.addHeatmap();
					}else{
						self.heatMap.show(false);
						self.fxq_layer.getData(self.dataList, "山洪风险区", this);
						self.fxq_layer.updateColor(self.colorList);
					}

				});

				//洪水热力图勾选事件
				$("#hs_rlt").on("change", function () {
					if ($(this)[0].checked) {
						self.fxq_layer.delEntity();
						self.addHeatmap();
					}else{
						self.heatMap.show(false);
						self.fxq_layer.getData(self.dataList, "洪水淹没区", this);
						self.fxq_layer.updateColor(self.colorList);
					}

				});
			},

			onMinimize: function () {
				this.resize();
			},

			onMaximize: function () {
				this.resize();
			},

			onOpen: function () {
				//面板打开的时候触发 （when open this panel trigger）
				this.fxq_layer ? this.fxq_layer.setVis(true) : '';
				var url = "http://www.sw797.com:82/blade-ycreal/mountainrain/listss";
				var data = {};
				$('.load-box-list').show();
				this.postUrl(url, data, this, "山洪风险区");
			},

			onClose: function () {
				$("#sh_csy").addClass("on").siblings().removeClass("on").addClass("offs");
				document.getElementById('floodPage').style.display = "none";
				document.getElementById('mountainPage').style.display = "block";
				document.getElementById('sh_rlt').checked =false;
				document.getElementById('hs_rlt').checked =false;
				if(this.heatMap){
					this.heatMap.show(false);
				}
				//面板关闭的时候触发 （when this panel is closed trigger）
				this.fxq_layer ? this.fxq_layer.setVis(false) : '';
			},

			resize: function () {

			},

			destroy: function () {
				this.inherited(arguments);
			},

			//http://dgrid.io/tutorials/1.0/hello_dgrid/    创建表格，给表格项添加点击事件，在地图上添加实体
			createList: function (dataList, txt) {

				$('#Hyd_list .fxq-box-list').empty();
				var column, tab;
				var CustomGrid = declare([Grid, Keyboard, Selection]);
				if (txt == "山洪风险区") {
					column = {
						xh:'序号',
						township :'乡镇',
						village :'行政村',
						village_group: '村小组',
					}
					tab = 'swfx-tab1-grid'
				} else if (txt == "洪水淹没区") {
					column = {
						xh:'序号',
						township: '乡镇',
						village: '行政村',
						villagegroup: '村小组',
					}
					tab = 'swfx-tab2-grid'
				} else if (txt == "流域风险区") {
					column = {

					}
					tab = 'swfx-tab3-grid'
				}
				var grid = new CustomGrid({
					columns: column,
					selectionMode: 'single', // for Selection; only select a single row at a time
					cellNavigation: false // for Keyboard; allow only row-level keyboard navigation
				}, tab);

				grid.on('dgrid-select', function (event) {
					topic.publish("gis/map/setCenter", {
						'lgtd': event.rows[0].data.dj,
						'lttd': event.rows[0].data.bw
					}); //进行地图定位
				});
				//同时显示到fxq_layer
				grid.renderArray(dataList);
				$('.load-box-list').hide();
			},

			// 控制显示隐藏
			tab: function (pid) {
				if (pid == "山洪风险区") {
					document.getElementById('floodPage').style.display = "none";
					document.getElementById('mountainPage').style.display = "block";
				} else if (pid == "洪水淹没区") {
					document.getElementById('mountainPage').style.display = "none";
					document.getElementById('floodPage').style.display = "block";
				} else if (pid == "流域风险区") {

				}
			},

			// 发送请求，获取数据
			postUrl: function (url, data, self, txt) {
				$.ajax({
					url: url,
					data: data,
					dataType: "json",
					type: "get",
					success: function (message) {
						self.heatdata = [];
						message.data.forEach(function (item,index) {
							item.xh = index + 1;
							self.heatdata.push({x:item.dj,y:item.bw,value : 23});
						});
						self.pageColor(message,txt);
					},
				});
			},

			//前端分页变色
			pageColor: function(message,txt){
				var self = this;

				self.dataList = message.data;

				//地图生成实体点
				self.fxq_layer.getData(message.data, txt, this);

				var cont = Math.ceil(message.data.length/25);
				$('.Pagination').pagination({
					mode: 'fixed',
					jump: true,
					coping: false,
					pageCount: cont,
					callback: function (index) {
						var listdata= [];
						//显示页数
						var index = (index.getCurrent()-1)*25;
						for (var i =index;i<index+25;i++ ){
							listdata.push(message.data[i]);
							if (i == message.data.length-1){
								break;
							}
						}
						self.createList(listdata, txt);
						self.fxq_layer.updateColor(listdata);
						self.colorList = listdata;
					}
				});

				//首次加载前25条数据
				var data= [];
				if (message.data.length > 25){
					for (var i = 0;i<25;i++){
						data.push(message.data[i]);
					}
				}else{
					for (var i = 0;i<message.data.length;i++){
						data.push(message.data[i]);
					}
				}

				self.createList(data, txt);
				self.fxq_layer.updateColor(data);
				self.colorList = data;
			},

			// 山洪风险区的查询方法
			shQuery: function () {
				// 将表格内容清空
				$(".fxq-box-list")[0].innerHTML = '';
				// 将地图上的实体清空
				var self = this;
				// 定义访问地址
				var url_sq;
				// 获取文本框输入的字
				var inp_text = $("#sh_zd").val();

				$.ajax({
					url: "http://www.sw797.com:82/blade-ycreal/mountainrain/listss",
					data: {
						query :inp_text,
					},
					dataType: "json",
					type: "get",
					success: function (message) {
						self.heatdata = [];
						message.data.forEach(function (item,index) {
							item.xh = index + 1;
							self.heatdata.push({x:item.dj,y:item.bw,value : 23});
						});
						self.pageColor(message,"山洪风险区")

					},
				});
				// 同步
			},

			// 和上一个类似，洪水淹没区的查询方法
			hsQuery: function () {
				var self = this;
				var inp_text = $('#hs_zd').val();
				$.ajax({
					url: "http://www.sw797.com:82/blade-ycreal/floodinundation/listss",
					data: {
						query :inp_text,
					},
					dataType: "json",
					type: "get",
					success: function (message) {
						self.heatdata = [];
						message.data.forEach(function (item,index) {
							item.xh = index + 1;
							self.heatdata.push({x:item.dj,y:item.bw,value : 23});
						});
						self.pageColor(message,"洪水淹没区")
					},
				});
			},
			addHeatmap: function() {
				var bounds = {
					west: 113.91360696000004, south: 24.48625203200004, east: 116.63821188000009, north: 27.143656022000073
				};
				//初始化cesiumheatmap对象，传入相应的参数
				var heatMap = CesiumHeatmap.create(
					window.viewer, // 视图层
					bounds, // 矩形坐标
					{
						backgroundColor: "rgba(0,0,0,0)",
						radius: 50,
						maxOpacity: .5,
						minOpacity: 0,
						blur: .75
					}
				);
				var valueMin = 0;
				var valueMax = 100;
				// add data to heatmap
				//获取动态数据
				heatMap.setWGS84Data(valueMin, valueMax, this.heatdata);
				this.heatMap = heatMap;
			}
		});
	});