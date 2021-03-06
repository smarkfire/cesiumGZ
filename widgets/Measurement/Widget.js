///////////////////////////////////////////////////////////////////////////
// Copyright © 2020 zhongsong. All Rights Reserved.
// 模块描述:河流水面线分析
///////////////////////////////////////////////////////////////////////////
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/html',
    'dojo/topic',
    'jimu/BaseWidget',
    './mars3d-src'
],
    function (declare,
        lang,
        array,
        html,
        topic,
        BaseWidget
    ) {
        return declare([BaseWidget], {
            baseClass: 'jimu-widget-Measurement',   
            name: 'Measurement',
            type: '',
            startup: function () {
                var _type = this.type
                $('#measure_length_danwei').change(function () {
                   var  num = $('#measure_length_danwei .option:selected').val();
                   _type = num
                });
                $('.close-measurement').click(function () {
                    $('.jimu-widget-Measurement').hide();
                });
                var measureSurface = new mars3d.Measure({
                    viewer: viewer,
                    terrain: !1
                });
                $('#measuerLength').click(function () {
                    measureSurface.measuerLength({
                        terrain: !1,
                        unit: _type,
                    })
                })

                $('#measuerLength2').click(function () {
                    measureSurface.measuerLength({
                        terrain: !0,
                        unit: _type,
                    })
                })
                $('#measureArea').click(function () {
                    measureSurface.measureArea({
                        unit: _type
                    });
                })


                $('#measureHeight').click(function () {
                    measureSurface.measureHeight({
                        isSuper: !1,
                        unit: _type,
                    })
                })

                $('#measureHeight2').click(function () {
                    measureSurface.measureHeight({
                        isSuper: !0,
                        unit: _type,
                    })
                })

                $('#clearDraw').click(function () {
                    measureSurface.clearMeasure()
                })

                $('.xx').click(function () {
                    $('.jimu-widget-Measurement').hide()
                    measureSurface.clearMeasure()

                })
            }

        });
    });