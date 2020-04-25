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
		'jimu/BaseWidget',
		'jimu/utils',
		'jimu/css!libs/zTree_v3/css/zTreeStyle/zTreeStyle.css',
		'libs/zTree_v3/js/jquery.ztree.all'
	],
	function (declare,
		lang,
		array,
		html,
		topic,
		BaseWidget,
		aspect,
		string,
		utils
	) {
		return declare([BaseWidget], {
			baseClass: 'jimu-widget-Tool',
			name: 'Tool',
			layers:{},
			startup: function () {
				// 暴露在外的接口
				topic.subscribe("closeTool", lang.hitch(this, this.closeToolBox));
				this.inherited(arguments);
				$('.tool-bar .tool-btn span').click(function () {
					topic.publish('closeMap', this.name);
					topic.publish('closeZtree', this.name);
					$('.tool-y-box').toggle();
				})

				// 飞行路线
				$('.fly-tool').click(function () {
					$('.jimu-widget-FlyRoute').show();
					$('.jimu-widget-Sign').hide();
					$('.jimu-widget-DynamicRiver').hide();
					$('.jimu-widget-Measurement').hide();
					$('.tool-y-box').toggle()
				})
				
				// 图上量算
				$('.measure-tool').click(function () {
					$('.jimu-widget-Measurement').show();
					$('.jimu-widget-Sign').hide();
					$('.jimu-widget-FlyRoute').hide();
					$('.jimu-widget-DynamicRiver').hide();
					$('.tool-y-box').toggle()
				})

				// 我的标记
				$('.sign-tool').click(function () {
					topic.publish('openSign', 'Sign');
					$('.jimu-widget-Sign').show();
					$('.jimu-widget-Measurement').hide();
					$('.jimu-widget-FlyRoute').hide();
					$('.jimu-widget-DynamicRiver').hide();
					$('.tool-y-box').toggle()
				})

				// 卷帘对比
				$('.rolling-tool').click(function () {
					$('.jimu-widget-Rolling').show();
					$('.jimu-widget-Measurement').hide();
					$('.jimu-widget-FlyRoute').hide();
					$('.jimu-widget-DynamicRiver').hide();
					$('.tool-y-box').toggle()
				})

			},

			closeToolBox: function (item) {
				if (item != this.name) {
					$('.tool-y-box').hide();
				}
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