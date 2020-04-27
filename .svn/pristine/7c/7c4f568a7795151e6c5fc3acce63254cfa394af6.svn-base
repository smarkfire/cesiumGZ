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
			baseClass: 'jimu-widget-RiverChiefSystem',
			name: 'RiverChiefSystem',
			startup: function() {
				this.inherited(arguments);
			},

			onOpen: function() {
				//面板打开的时候触发 （when open this panel trigger）
				layer.open({
					type: 2,
					title: ['一键找河长', 'font-size:18px;'],
					shadeClose: true,
					shade: false,
					offset: '45px',
					maxmin: true, //开启最大化最小化按钮
					area: ['100%', 'calc(100% - 45px)'],
					content: 'http://www.sw797.com:801/gzsw3D/views/water/River_Len.html',
					end: function () {
						$('.container-section').children().eq(2).removeClass('jimu-state-selected')
					}
				});
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