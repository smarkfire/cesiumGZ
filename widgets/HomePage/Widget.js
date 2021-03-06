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
			baseClass: 'jimu-widget-HomePage',
			name: 'HomePage',
			startup: function () {
				this.inherited(arguments);
				var that = this;
			},

			onOpen: function () {
				//面板打开的时候触发 （when open this panel trigger）
				this.map.camera.flyTo({
					destination: Cesium.Cartesian3.fromDegrees(115.257787, 25.885506, 549263.35),
					easingFunction: Cesium.EasingFunction.QUADRACTIC_IN_OUT
				});
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
			}
		});
	});