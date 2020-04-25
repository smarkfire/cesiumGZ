///////////////////////////////////////////////////////////////////////////
// Copyright © 2019 zhongsong. All Rights Reserved.
// 模块描述: 水文水环境分析
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
			baseClass: 'jimu-widget-ThematicAnalysisOfHydrology',
			name: 'ThematicAnalysisOfHydrology',

			startup: function () {
				this.inherited(arguments);
				
			},

			onOpen: function () {
				//面板打开的时候触发 （when open this panel trigger）
			},

			onClose: function () {
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