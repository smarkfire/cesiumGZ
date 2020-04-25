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
            baseClass: 'jimu-widget-Rolling',
            name: 'Rolling',
            startup: function () {
                // 点击卷帘关闭面板
                $('.rollinng-table-hezi-xx').click(function () {
                    $('.jimu-widget-Rolling').hide();
                })

                // Sync the position of the slider with the split position 将滑块的位置与拆分位置同步
                var slider = document.getElementById('slider');
                viewer.scene.imagerySplitPosition = (slider.offsetLeft) / slider.parentElement.offsetWidth;

                var handler = new Cesium.ScreenSpaceEventHandler(slider);

                var moveActive = false;

                function move(movement) {
                    if (!moveActive) {
                        return;
                    }
                    var relativeOffset = movement.endPosition.x;
                    var splitPosition = (slider.offsetLeft + relativeOffset) / slider.parentElement.offsetWidth;
                    slider.style.left = 100.0 * splitPosition + '%';
                    viewer.scene.imagerySplitPosition = splitPosition;
                }


                handler.setInputAction(function () {
                    moveActive = true;
                }, Cesium.ScreenSpaceEventType.LEFT_DOWN);//左键按下事件
                handler.setInputAction(function () {
                    moveActive = true;
                }, Cesium.ScreenSpaceEventType.PINCH_START);//触摸表面上双指事件的开始

                handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);//鼠标移动事件
                handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);//触摸表面上双指移动事件

                handler.setInputAction(function () {
                    moveActive = false;
                }, Cesium.ScreenSpaceEventType.LEFT_UP);//鼠标左键抬起事件
                handler.setInputAction(function () {
                    moveActive = false;
                }, Cesium.ScreenSpaceEventType.PINCH_END);//触摸表面上的双指事件的结束
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