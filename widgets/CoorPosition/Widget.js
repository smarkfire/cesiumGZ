define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/html',
    'dojo/topic',
    'jimu/BaseWidget',
],
    function (declare,
        lang,
        array,
        html,
        topic,
        BaseWidget
    ) {
        return declare([BaseWidget], {
            baseClass: 'jimu-widget-CoorPosition',
            name: 'CoorPosition',
            startup: function () {
                var that = this;
                // 点击x隐藏面板
                $('.CoorPosition-zbdw-x').click(function () {
                    $('.jimu-widget-CoorPosition').hide();
                })

                // 鼠标移入显示箭头
                $('.mouseenterJD').mouseenter(function () {
                    $('.jiantou.jinddu').css('display', 'block');
                })
                $('.mouseenterJD').mouseleave(function () {
                    $('.jiantou.jinddu').css('display', 'none');
                })

                $('.mouseenterED').mouseenter(function () {
                    $('.jiantou.weidu').css('display', 'block');
                })
                $('.mouseenterED').mouseleave(function () {
                    $('.jiantou.weidu').css('display', 'none');
                })

                $('.mouseenterGD').mouseenter(function () {
                    $('.jiantou.gaodu').css('display', 'block');
                })
                $('.mouseenterGD').mouseleave(function () {
                    $('.jiantou.gaodu').css('display', 'none');
                })

                // 点击箭头增加或减少数字
                $('#jingdu-th').click(function () {
                    $('#jingdu-val').val(parseInt($('#jingdu-val').val()) + 1);
                })
                $('#jingdu-td').click(function () {
                    $('#jingdu-val').val(parseInt($('#jingdu-val').val()) - 1);
                })

                $('#weidu-th').click(function () {
                    $('#weidu-val').val(parseInt($('#weidu-val').val()) + 1);
                })
                $('#weidu-td').click(function () {
                    $('#weidu-val').val(parseInt($('#weidu-val').val()) - 1);
                })
                $('#gaodu-th').click(function () {
                    $('#gaodu-val').val(parseInt($('#gaodu-val').val()) + 1);
                })
                $('#gaodu-td').click(function () {
                    $('#gaodu-val').val(parseInt($('#gaodu-val').val()) - 1);
                })

                // 拖拽盒子
                $('.CoorPosition-zbdw').mousedown(function (e) {
                    var positionDiv = $(this).offset();
                    var distenceX = e.pageX - positionDiv.left;
                    var distenceY = e.pageY - positionDiv.top;

                    $(document).mousemove(function (e) {
                        var x = e.pageX - distenceX;
                        var y = e.pageY - distenceY;
                        if (x < 0) {
                            x = 0;
                        } else if (x > $(document).width() - $('.CoorPosition-zbdw').outerWidth(true)) {
                            x = $(document).width() - $('.CoorPosition-zbdw').outerWidth(true);
                        }
                        if (y < 0) {
                            y = 0;
                        } else if (y > $(document).height() - $('.CoorPosition-zbdw').outerHeight(true)) {
                            y = $(document).height() - $('.jimu-widget-CoorPosition').outerHeight(true);
                        }
                        $('.jimu-widget-CoorPosition').css({
                            'left': x + 'px',
                            'top': y + 'px'
                        });
                    });
                    $(document).mouseup(function () {
                        $(document).off('mousemove');
                    });
                });

                // 点击确定flyTo
                $('.queDing').click(function () {
                    console.log($('#jingdu-val').val());
                    var lng = $('#jingdu-val').val();
                    var lat = $('#weidu-val').val();
                    var gaodu = $('#gaodu-val').val();
                    that.map.camera.flyTo({
                        destination: Cesium.Cartesian3.fromDegrees(lng, lat, gaodu)
                    });
                })

            },

            onOpen: function () {

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