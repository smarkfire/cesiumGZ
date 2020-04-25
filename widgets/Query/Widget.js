///////////////////////////////////////////////////////////////////////////
// Copyright © 2019 zhongsong. All Rights Reserved.
// 模块描述:河长制
///////////////////////////////////////////////////////////////////////////
define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'dojo/_base/html',
		'dojo/topic',
		'jimu/BaseWidget'
	],
	function(declare,
		lang,
		array,
		html,
		topic,
		BaseWidget
	) {
		return declare([BaseWidget], {
			baseClass: 'jimu-widget-Query',
			name: 'Query',
			startup: function() {
				this.inherited(arguments);
			},

			onOpen: function() {
				//面板打开的时候触发 （when open this panel trigger）
				parent.open('http://www.sw797.com:801/gzapp/#monitorduty')
			},

			onClose: function() {
				//面板关闭的时候触发 （when this panel is closed trigger）
			},

			onMinimize: function() {
				this.resize();
			},

			onMaximize: function() {
				this.resize();
			},

			resize: function() {

			},

			destroy: function() {
				//销毁的时候触发
				//todo
				//do something before this func
				this.inherited(arguments);
			}

		});
	});