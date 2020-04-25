///////////////////////////////////////////////////////////////////////////
// Copyright © 2019 zhongsong. All Rights Reserved.
// 模块描述: 站网详情
///////////////////////////////////////////////////////////////////////////
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/html',
    'dojo/topic',
    'jimu/BaseWidget',
	'libs/layer/layer.js'
],
    function (declare,
        lang,
        array,
        html,
        topic,
        BaseWidget,
        layer
    ) {
        return declare([BaseWidget], {
            baseClass: 'jimu-widget-HydroNetWorkDetails',
            name: 'HydroNetWorkDetails',
            _waterPrimitive: null,
            _rowData: null,
            startup: function () {
                this.inherited(arguments);
                topic.subscribe("openDetails", lang.hitch(this, this.openDetails));
                $('.jimu-widget-HydroNetWorkDetails .net-work-close i').click(function () {
                    $('.jimu-widget-HydroNetWorkDetails .net-work-details').stop().hide();
                    $('.jimu-widget-HydroNetWorkDetails .net-work-details-btn').stop().show();
                })

                $(".jimu-widget-HydroNetWorkDetails .net-work-tab ul li").click(function () {
                    if ($(this).text() != "") {
                        $(this).addClass('on').siblings().removeClass('on');
                        if ($(this).index() == 0) {
                            $(".net-work-monitor").stop().show();
                            $(".ner-work-panorama").stop().hide();
                        } else if ($(this).index() == 2) {
                            $(".net-work-monitor").stop().hide();
                            $(".ner-work-panorama").stop().show();
                        }
                    }
                })

                $('.jimu-widget-HydroNetWorkDetails .net-work-details-btn').click(function () {
                    $('.jimu-widget-HydroNetWorkDetails .net-work-details').stop().show();
                    $('.jimu-widget-HydroNetWorkDetails .net-work-details-btn').stop().hide();
                    $('.jimu-widget-HydroNetWorkDetails .net-work-tab ul li:eq(0)').trigger('click');
                })

                $('.jimu-widget-HydroNetWorkDetails .ner-work-panorama'). on('click', 'i', function () {
                    var el = document.documentElement;
                    var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
                    if (typeof rfs != "undefined" && rfs) {
                        rfs.call($('.jimu-widget-HydroNetWorkDetails .ner-work-panorama iframe')[0]);
                    };
                    return;
                })

                $('.jimu-widget-HydroNetWorkDetails .net-work-monitor').on('click', 'img', function () {
                    var wid = $(window).width() + 'px';
					var hei = $(window).height() + 'px';
                    var url = $(this).attr('src');
					var title = $('.jimu-widget-HydroNetWorkDetails .net-work-title').text();
					layer.open({
                        id: 'net-work-bigmonitor',
						title: title,
						type: 1,
						shadeClose: true,
						shade: false,
						maxmin: true, //开启最大化最小化按钮
						area: [wid, hei],
						offset: ['0px', '0px'],
						content:  `<img src='${url}' width='100%' height='100%' style='vertical-align: middle;'>`,
						id: "ComprehensiveSupervise",
						closeBtn: 1,
						success: function(layero, index){
						  }
					});
                })
            },
            openDetails: function (item) {
                $('.net-work-img').empty();
                $('.net-work-monitor').empty();
                $('.ner-work-panorama').empty();


                if (item) {
                    $('.net-work-title').text(item.name);
                    if (item.image != "") {
                        $('.net-work-img').append(`<img src="${item.image}"></img>`);
                    }
                    if (item.introduce != "") {
                        $('.jimu-widget-HydroNetWorkDetails p').text(item.introduce);
                    }
                    if (item.monitor != "") {
                        $('.net-work-monitor').removeClass("on").append(`<img src="${item.monitor}"></img>`);
                    } else {
                        $('.net-work-monitor').addClass('on').text('暂无有效监控');
                    }
                    if (item.panorama != "") {
                        $('.ner-work-panorama').removeClass("on").append(`<i class='btn'><img src="./images/net-work-big.png"></img></i> <iframe src="${item.panorama}" scrolling="no"></iframe>`);
                    } else {
                        $('.ner-work-panorama').addClass('on').text('暂无有效体验');
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