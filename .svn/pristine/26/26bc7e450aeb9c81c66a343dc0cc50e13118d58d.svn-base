///////////////////////////////////////////////////////////////////////////
// Copyright © 2019 zhongsong. All Rights Reserved.
// 模块描述: 底图
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
			baseClass: 'jimu-widget-Basemap',
			name: 'Basemap',
			layers:{},
			startup: function () {
				// 暴露在外的接口
				topic.subscribe("closeMap", lang.hitch(this, this.closeBaseMap));
				this.inherited(arguments);
				$('.jimu-widget-Basemap span').click(function () {
					topic.publish('closeTool', this.name);
					topic.publish('closeZtree', this.name);
					if ($('.cesium-baseLayerPicker-dropDown').hasClass('cesium-baseLayerPicker-dropDown-visible') == true) {
						$('.cesium-baseLayerPicker-dropDown').removeClass('cesium-baseLayerPicker-dropDown-visible')
					} else {
						$('.cesium-baseLayerPicker-dropDown').addClass('cesium-baseLayerPicker-dropDown-visible')
					}
				})
			},

			closeBaseMap: function (item) {
				if (item != this.name) {
					if ($('.cesium-baseLayerPicker-dropDown').hasClass('cesium-baseLayerPicker-dropDown-visible') == true) {
						$('.cesium-baseLayerPicker-dropDown').removeClass('cesium-baseLayerPicker-dropDown-visible')
					}
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